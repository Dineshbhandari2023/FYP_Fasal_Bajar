const createError = require("http-errors");
const {
  User,
  Product,
  Order,
  OrderItem,
  Notification,
} = require("../Models/index");
const PaymentTransaction = require("../Models/paymentTransaction");
const { initiatePayment } = require("./paymentController");
const { Op } = require("sequelize");
const sequelize = require("../config/dbConfig");
const nodemailer = require("nodemailer");
require("dotenv").config();
const ErrorResponse = require("../Util/errorResponse");

// Global Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Helper function to send emails using the transporter
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Helper function to generate a unique order number
const generateOrderNumber = async () => {
  const prefix = "ORD";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  const orderNumber = `${prefix}${timestamp}${random}`;

  const existingOrder = await Order.findOne({ where: { orderNumber } });
  if (existingOrder) {
    return generateOrderNumber();
  }

  return orderNumber;
};

const createOrder = async (req, res) => {
  const { items, shippingAddress, city, state, pinCode, paymentMethod, notes } =
    req.body;
  const buyerId = req.user.id;

  let transaction;

  try {
    transaction = await sequelize.transaction();
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Items are required");
    }
    if (!shippingAddress || !city || !state || !pinCode) {
      throw new Error("Shipping details are required");
    }

    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction });
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      if (product.quantity < item.quantity) {
        throw new Error(
          `Insufficient stock for product ${product.productName}`
        );
      }
      const productUser = await User.findByPk(product.userId, { transaction });
      if (!productUser) {
        throw new Error(
          `User with ID ${product.userId} not found for product ${product.productName}`
        );
      }
      if (productUser.role !== "Farmer") {
        throw new Error(
          `Product ${product.productName} (ID: ${item.productId}) is not associated with a farmer`
        );
      }
      totalAmount += product.price * item.quantity;
      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        subtotal: product.price * item.quantity,
        userId: product.userId,
      });
    }

    const deliveryFee = 100;
    totalAmount += deliveryFee;
    const orderNumber = await generateOrderNumber();
    const order = await Order.create(
      {
        orderNumber,
        totalAmount,
        status: "Processing",
        paymentMethod,
        paymentStatus: paymentMethod === "Online Payment" ? "Pending" : "N/A",
        shippingAddress,
        city,
        state,
        pinCode,
        buyerId,
        notes,
      },
      { transaction }
    );

    for (const itemData of orderItemsData) {
      await OrderItem.create(
        {
          orderId: order.id,
          productId: itemData.productId,
          quantity: itemData.quantity,
          price: itemData.price,
          subtotal: itemData.subtotal,
          userId: itemData.userId,
          status: "Pending",
        },
        { transaction }
      );

      await Product.update(
        { quantity: sequelize.literal(`quantity - ${itemData.quantity}`) },
        { where: { id: itemData.productId }, transaction }
      );
    }
    const buyer = await User.findByPk(buyerId, { transaction });
    const userIds = [...new Set(orderItemsData.map((item) => item.userId))];

    await Notification.create(
      {
        userId: buyerId,
        message: `Your order ${orderNumber} has been placed successfully!`,
        type: "Order",
      },
      { transaction }
    );
    const io = req.app.get("io");
    io.to(`user_${buyerId}`).emit("notification", {
      message: `Your order ${orderNumber} has been placed successfully!`,
      type: "Order",
    });

    for (const userId of userIds) {
      await Notification.create(
        {
          userId: userId,
          message: `New order item for your product in order ${orderNumber}. Please review and accept/decline.`,
          type: "Order",
        },
        { transaction }
      );
      io.to(`user_${userId}`).emit("notification", {
        message: `New order item for your product in order ${orderNumber}. Please review and accept/decline.`,
        type: "Order",
      });
    }

    await sendEmail(
      buyer.email,
      "Order Confirmation",
      `Your order ${orderNumber} has been placed successfully!`
    );
    for (const userId of userIds) {
      const farmer = await User.findByPk(userId, { transaction });
      await sendEmail(
        farmer.email,
        "New Order Item",
        `You have a new order item for your product in order ${orderNumber}. Please review and accept/decline.`
      );
    }

    await transaction.commit();

    return res.status(201).json({
      Success: true,
      Result: { order },
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Order creation error:", error);
    return res.status(500).json({
      Success: false,
      ErrorMessage: error.message || "Failed to create order",
    });
  }
};

// Farmer accepts or declines an order item
const updateOrderItemStatus = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { status, farmerNotes } = req.body;
    const userId = req.user.id;

    if (!status || !["Accepted", "Declined"].includes(status)) {
      return next(
        createError(400, "Status must be either 'Accepted' or 'Declined'")
      );
    }

    const user = await User.findByPk(userId);
    if (!user || user.role !== "Farmer") {
      return next(
        createError(403, "Only farmers can update order item status")
      );
    }

    const orderItem = await OrderItem.findOne({
      where: {
        id: itemId,
        userId: userId,
      },
      include: [
        {
          model: Order,
          include: [
            {
              model: User,
              as: "buyer",
              attributes: ["id", "username", "email"],
            },
          ],
        },
        {
          model: Product,
          attributes: ["id", "productName", "quantity", "unit"],
        },
      ],
    });

    if (!orderItem) {
      return next(
        createError(404, "Order item not found or you don't have permission")
      );
    }

    if (orderItem.status !== "Pending") {
      return next(
        createError(
          400,
          `This item has already been ${orderItem.status.toLowerCase()}`
        )
      );
    }

    await orderItem.update({
      status,
      statusUpdatedAt: new Date(),
      farmerNotes: farmerNotes || null,
    });

    if (status === "Declined") {
      const product = await Product.findByPk(orderItem.productId);
      if (product) {
        await product.update({
          quantity: product.quantity + orderItem.quantity,
          status: "active",
          isAvailable: true,
        });
      }
    }

    const allOrderItems = await OrderItem.findAll({
      where: { orderId: orderItem.orderId },
    });

    const allAccepted = allOrderItems.every(
      (item) => item.status === "Accepted"
    );
    const anyDeclined = allOrderItems.some(
      (item) => item.status === "Declined"
    );

    if (allAccepted) {
      await orderItem.Order.update({
        status: "Confirmed",
        isConfirmed: true,
        confirmedAt: new Date(),
      });
    } else if (
      anyDeclined &&
      allOrderItems.every((item) => item.status !== "Pending")
    ) {
      await orderItem.Order.update({
        status: "Partially Confirmed",
      });
    }
    const io = req.app.get("io");

    const buyerId = orderItem.Order.buyerId;
    const orderNumber = orderItem.Order.orderNumber;
    const productName = orderItem.Product.productName;

    io.to(`user_${buyerId}`).emit("order:updated", {
      orderId: orderItem.orderId,
      orderItemId: orderItem.id,
      orderNumber: orderNumber,
      status: status,
      productName: productName,
      message: `Your order item ${productName} has been ${status.toLowerCase()} by the farmer.`,
    });

    const buyer = orderItem.Order.buyer;
    if (buyer && buyer.email) {
      const buyerMailOptions = {
        to: buyer.email,
        from: process.env.EMAIL_USER,
        subject: `Order Update - ${orderNumber}`,
        html: `
          <html>
            <body style="font-family: Arial, sans-serif;">
              <h1>Order Update</h1>
              <p>Hello ${buyer.username},</p>
              <p>There's an update to your order #${orderNumber}.</p>
              <p>The farmer has <strong>${status.toLowerCase()}</strong> your order for ${
          orderItem.quantity
        } ${orderItem.Product.unit} of ${productName}.</p>
              ${
                status === "Declined"
                  ? `
                <p><strong>Reason:</strong> ${
                  farmerNotes || "No reason provided"
                }</p>
                <p>Don't worry, you won't be charged for this item.</p>
              `
                  : `
                <p>Your order is being prepared for shipping!</p>
                ${
                  orderItem.Order.paymentMethod === "Online Payment"
                    ? `<p>Please complete your payment to proceed with the order.</p>`
                    : ""
                }
              `
              }
              <p>You can check the full details of your order in your account dashboard.</p>
            </body>
          </html>
        `,
      };

      await transporter.sendMail(buyerMailOptions);
    }

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        message: `Order item ${status.toLowerCase()} successfully`,
        orderItem: orderItem,
      },
    });
  } catch (error) {
    console.error(error);
    next(
      createError(
        500,
        `Server error while updating order item: ${error.message}`
      )
    );
  }
};

// Get all orders for the current user (buyer or farmer)
const getMyOrders = async (req, res) => {
  try {
    const buyerId = req.user.id;
    const orders = await Order.findAll({
      where: { buyerId },
      include: [
        {
          model: OrderItem,
          include: [{ model: Product }],
        },
      ],
    });
    console.log("Fetched orders for buyer:", buyerId, orders);
    return res.status(200).json({
      Success: true,
      Result: { orders },
    });
  } catch (error) {
    console.error("Get my orders error:", error);
    return res.status(500).json({
      Success: false,
      ErrorMessage: error.message || "Failed to fetch orders",
    });
  }
};

// Get pending order items for a farmer
const getPendingOrderItems = async (req, res, next) => {
  try {
    const farmerId = req.user.id;

    // Verify the user is a Farmer
    const farmer = await User.findByPk(farmerId);
    if (!farmer || farmer.role !== "Farmer") {
      return next(createError(403, "Only farmers can access this endpoint"));
    }

    // Get pending order items
    const pendingItems = await OrderItem.findAll({
      where: {
        userId: farmerId,
        status: "Pending",
      },
      include: [
        {
          model: Order,
          include: [
            {
              model: User,
              as: "buyer",
              attributes: ["username", "contact_number"],
            },
          ],
        },
        {
          model: Product,
          attributes: ["productName", "image", "unit", "price"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        pendingItems,
      },
    });
  } catch (error) {
    console.error(error);
    next(
      createError(
        500,
        `Server error while fetching pending orders: ${error.message}`
      )
    );
  }
};

// Get a specific order by ID
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return next(createError(404, "User not found"));
    }

    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["productName", "image", "productType", "unit"],
            },
            {
              model: User,
              as: "farmer",
              attributes: ["username", "email", "contact_number", "location"],
            },
          ],
        },
        {
          model: User,
          as: "buyer",
          attributes: ["username", "email", "contact_number", "location"],
        },
      ],
    });

    if (!order) {
      return next(createError(404, "Order not found"));
    }

    // Check if the user has permission to view this order
    if (user.role === "Buyer" && order.buyerId !== userId) {
      return next(
        createError(403, "You don't have permission to view this order")
      );
    }

    if (user.role === "Farmer") {
      const hasPermission = order.OrderItems.some(
        (item) => item.userId === userId
      );
      if (!hasPermission) {
        return next(
          createError(403, "You don't have permission to view this order")
        );
      }
    }

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        order,
      },
    });
  } catch (error) {
    console.error(error);
    next(
      createError(500, `Server error while fetching order: ${error.message}`)
    );
  }
};

// Update order status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Validate status
    const validStatuses = [
      "Processing",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];
    if (!status || !validStatuses.includes(status)) {
      return next(createError(400, "Invalid status"));
    }

    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
            },
          ],
        },
        {
          model: User,
          as: "buyer",
          attributes: ["username", "email"],
        },
      ],
    });

    if (!order) {
      return next(createError(404, "Order not found"));
    }

    // Only allow farmers to update status to Shipped
    // Only allow buyers to update status to Cancelled (if not already shipped)
    const user = await User.findByPk(userId);

    if (user.role === "Farmer") {
      const hasPermission = order.OrderItems.some(
        (item) => item.userId === userId
      );
      if (!hasPermission) {
        return next(
          createError(403, "You don't have permission to update this order")
        );
      }

      if (status !== "Shipped") {
        return next(
          createError(403, "Farmers can only update order status to Shipped")
        );
      }
    } else if (user.role === "Buyer") {
      if (order.buyerId !== userId) {
        return next(
          createError(403, "You don't have permission to update this order")
        );
      }

      if (status === "Cancelled") {
        if (order.status === "Shipped" || order.status === "Delivered") {
          return next(
            createError(
              400,
              "Cannot cancel an order that has been shipped or delivered"
            )
          );
        }
      } else {
        return next(createError(403, "Buyers can only cancel orders"));
      }
    }

    // Update the order status
    await order.update({ status });

    // If the order is cancelled, restore the product quantities
    if (status === "Cancelled") {
      for (const item of order.OrderItems) {
        const product = await Product.findByPk(item.productId);
        if (product) {
          await product.update({
            quantity: product.quantity + item.quantity,
            status: "active",
            isAvailable: true,
          });
        }
      }
    }

    // If the order is delivered, update payment status for COD orders
    if (status === "Delivered" && order.paymentMethod === "Cash on Delivery") {
      await order.update({ paymentStatus: "Completed" });
    }

    // Get Socket.IO instance
    const io = req.app.get("io");

    // Send real-time notification to relevant users
    if (user.role === "Farmer" && status === "Shipped") {
      io.to(`user_${order.buyerId}`).emit("order:shipped", {
        orderId: order.id,
        orderNumber: order.orderNumber,
        message: `Your order #${order.orderNumber} has been shipped!`,
      });
    } else if (user.role === "Buyer" && status === "Cancelled") {
      const farmerIds = [
        ...new Set(order.OrderItems.map((item) => item.userId)),
      ];
      for (const farmerId of farmerIds) {
        io.to(`user_${farmerId}`).emit("order:cancelled", {
          orderId: order.id,
          orderNumber: order.orderNumber,
          message: `Order #${order.orderNumber} has been cancelled by the buyer.`,
        });
      }
    }

    // Send notification email
    const buyer = order.buyer;
    if (buyer && buyer.email) {
      const mailOptions = {
        to: buyer.email,
        from: process.env.EMAIL_USER,
        subject: `Order ${order.orderNumber} Status Update`,
        html: `
          <html>
            <body style="font-family: Arial, sans-serif;">
              <h1>Order Status Update</h1>
              <p>Hello ${buyer.username},</p>
              <p>Your order #${
                order.orderNumber
              } has been updated to: <strong>${status}</strong></p>
              ${
                status === "Shipped"
                  ? `<p>Your order is on its way! You should receive it within 2-3 business days.</p>`
                  : status === "Delivered"
                  ? `<p>Your order has been delivered. Thank you for shopping with FasalBajar!</p>`
                  : status === "Cancelled"
                  ? `<p>Your order has been cancelled. If you have questions, contact support.</p>`
                  : ``
              }
            </body>
          </html>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        message: "Order status updated successfully",
        order: await Order.findByPk(id, {
          include: [
            {
              model: OrderItem,
              include: [
                {
                  model: Product,
                  attributes: ["productName", "image"],
                },
              ],
            },
          ],
        }),
      },
    });
  } catch (error) {
    console.error(error);
    next(
      createError(500, `Server error while updating order: ${error.message}`)
    );
  }
};

// Process payment for an order
const processPayment = async (req, res) => {
  console.log("req.params:", req.params);
  const { orderId } = req.params;
  const buyerId = req.user.id;

  let transaction;

  try {
    if (!orderId) {
      throw new Error("Order ID or Order Number is required");
    }

    transaction = await sequelize.transaction();

    let order;
    const parsedOrderId = parseInt(orderId, 10);
    console.log("Parsed Order ID:", parsedOrderId);
    if (!isNaN(parsedOrderId)) {
      order = await Order.findByPk(parsedOrderId, {
        include: [{ model: OrderItem, as: "OrderItems" }],
        transaction,
      });
      console.log("Order found by ID:", order);
    } else {
      order = await Order.findOne({
        where: { orderNumber: orderId },
        include: [{ model: OrderItem, as: "OrderItems" }],
        transaction,
      });
      console.log("Order found by orderNumber:", order);
    }

    if (!order) {
      throw new Error("Order not found");
    }
    if (order.buyerId !== buyerId) {
      throw new Error("Unauthorized");
    }
    if (order.paymentMethod !== "Online Payment") {
      throw new Error("This order does not require online payment");
    }
    if (order.paymentStatus !== "Pending") {
      throw new Error("Payment is not pending for this order");
    }

    const allItemsProcessed = order.OrderItems.every(
      (item) => item.status === "Accepted" || item.status === "Declined"
    );
    if (!allItemsProcessed) {
      throw new Error("Some order items are still pending farmer confirmation");
    }

    const hasAcceptedItems = order.OrderItems.some(
      (item) => item.status === "Accepted"
    );
    if (!hasAcceptedItems) {
      throw new Error("No items have been accepted by farmers yet");
    }

    // Use the order's totalAmount to ensure consistency
    const amount = order.totalAmount;
    console.log("Initiating payment with totalAmount:", amount);

    // Mock req and res objects for initiatePayment
    const mockReq = {
      params: { orderId: order.id.toString() },
      user: req.user,
    };
    let paymentResult = null;
    const mockRes = {
      status: (code) => ({
        json: (data) => {
          paymentResult = { code, data };
        },
      }),
    };

    await initiatePayment(mockReq, mockRes);

    if (!paymentResult || paymentResult.code !== 200) {
      throw new Error(
        paymentResult?.data?.ErrorMessage || "Failed to initiate payment"
      );
    }

    const { paymentData, paymentUrl } = paymentResult.data.Result;

    await transaction.commit();

    return res.status(200).json({
      Success: true,
      Result: { paymentData, paymentUrl },
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Payment processing error:", error);
    return res.status(500).json({
      Success: false,
      ErrorMessage: error.message || "Failed to process payment",
    });
  }
};

// Get order statistics for farmer dashboard
const getOrderStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user || user.role !== "Farmer") {
      return next(createError(403, "Only farmers can access order statistics"));
    }

    const totalSales = await OrderItem.sum("subtotal", {
      where: {
        userId: userId,
        status: "Accepted",
      },
    });

    const pendingCount = await OrderItem.count({
      where: {
        userId: userId,
        status: "Pending",
      },
    });

    const acceptedCount = await OrderItem.count({
      where: {
        userId: userId,
        status: "Accepted",
      },
    });

    const declinedCount = await OrderItem.count({
      where: {
        userId: userId,
        status: "Declined",
      },
    });

    const recentOrders = await OrderItem.findAll({
      where: { userId: userId },
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Order,
          include: [
            {
              model: User,
              as: "buyer",
              attributes: ["username"],
            },
          ],
        },
        {
          model: Product,
          attributes: ["productName", "unit"],
        },
      ],
    });

    const currentDate = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

    const monthlySales = await OrderItem.findAll({
      attributes: [
        [
          sequelize.fn("date_trunc", "month", sequelize.col("createdAt")),
          "month",
        ],
        [sequelize.fn("sum", sequelize.col("subtotal")), "total"],
      ],
      where: {
        userId: userId,
        status: "Accepted",
        createdAt: {
          [Op.gte]: sixMonthsAgo,
        },
      },
      group: [sequelize.fn("date_trunc", "month", sequelize.col("createdAt"))],
      order: [sequelize.fn("date_trunc", "month", sequelize.col("createdAt"))],
    });

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        totalSales: totalSales || 0,
        orderCounts: {
          pending: pendingCount,
          accepted: acceptedCount,
          declined: declinedCount,
          total: pendingCount + acceptedCount + declinedCount,
        },
        recentOrders,
        monthlySales,
      },
    });
  } catch (error) {
    console.error(error);
    next(
      createError(
        500,
        `Server error while fetching order statistics: ${error.message}`
      )
    );
  }
};

const handlePaymentSuccess = async (req, res) => {
  const buyerId = req.user.id;
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { productId } = req.query;

    const paymentTransaction = await PaymentTransaction.findOne(
      {
        where: { productId, buyerId },
      },
      { transaction }
    );

    if (!paymentTransaction) {
      throw new Error("Payment transaction not found");
    }

    paymentTransaction.status = "Completed";
    await paymentTransaction.save({ transaction });

    const order = await Order.findOne(
      { where: { id: paymentTransaction.orderId } },
      { transaction }
    );

    if (order) {
      order.paymentStatus = "Completed";
      order.status = "Confirmed";
      await order.save({ transaction });
    }

    const buyer = await User.findByPk(buyerId, { transaction });
    await sendEmail(
      buyer.email,
      "Payment Successful",
      `Your payment for order ${order.orderNumber} was successful!`
    );
    const io = req.app.get("io");
    io.to(`user_${buyerId}`).emit("notification", {
      message: `Payment for order ${order.orderNumber} was successful!`,
      type: "Payment",
    });

    await transaction.commit();

    res.redirect(
      `/orders?status=success&message=Payment completed successfully`
    );
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Payment success handling error:", error);
    res.redirect(`/orders?status=error&message=Payment processing failed`);
  }
};

const handlePaymentFailure = async (req, res) => {
  const buyerId = req.user.id;
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { productId } = req.query;

    const paymentTransaction = await PaymentTransaction.findOne(
      {
        where: { productId, buyerId },
      },
      { transaction }
    );

    if (!paymentTransaction) {
      throw new Error("Payment transaction not found");
    }

    paymentTransaction.status = "Failed";
    await paymentTransaction.save({ transaction });

    const order = await Order.findOne(
      { where: { id: paymentTransaction.orderId } },
      { transaction }
    );

    const buyer = await User.findByPk(buyerId, { transaction });
    await sendEmail(
      buyer.email,
      "Payment Failed",
      `Your payment for order ${order.orderNumber} failed. Please try again.`
    );
    const io = req.app.get("io");
    io.to(`user_${buyerId}`).emit("notification", {
      message: `Payment for order ${order.orderNumber} failed. Please try again.`,
      type: "Payment",
    });

    await transaction.commit();

    res.redirect(`/orders?status=error&message=Payment failed`);
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Payment failure handling error:", error);
    res.redirect(`/orders?status=error&message=Payment processing failed`);
  }
};

const getFarmerOrders = async (req, res, next) => {
  try {
    const userId = req.user.id; // From JWT
    console.log("getFarmerOrders: userId:", userId); // Debug
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          include: [{ model: Product, where: { userId } }],
        },
        { model: User, as: "buyer" },
      ],
    });
    console.log("getFarmerOrders: orders:", orders); // Debug

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: { orders: orders || [] },
    });
  } catch (error) {
    console.error("getFarmerOrders error:", error);
    next(
      new ErrorResponse(`Failed to fetch farmer orders: ${error.message}`, 500)
    );
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
  updateOrderItemStatus,
  getPendingOrderItems,
  processPayment,
  handlePaymentSuccess,
  handlePaymentFailure,
  getFarmerOrders,
};
