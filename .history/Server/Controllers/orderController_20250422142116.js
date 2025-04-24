// const createError = require("http-errors");
// const { User, Product, Order, OrderItem } = require("../Models/index");
// const PaymentTransaction = require("../Models/paymentTransaction");

// const { Op } = require("sequelize");
// const sequelize = require("../config/dbConfig");
// const nodemailer = require("nodemailer");
// require("dotenv").config();
// const axios = require("axios");

// // Global Nodemailer transporter configuration
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// // Helper function to generate a unique order number
// const generateOrderNumber = async () => {
//   const prefix = "ORD";
//   const timestamp = Date.now().toString().slice(-6);
//   const random = Math.floor(Math.random() * 1000)
//     .toString()
//     .padStart(3, "0");
//   const orderNumber = `${prefix}${timestamp}${random}`;

//   // Check if this order number already exists
//   const existingOrder = await Order.findOne({ where: { orderNumber } });
//   if (existingOrder) {
//     // If it exists (very unlikely), generate a new one recursively
//     return generateOrderNumber();
//   }

//   return orderNumber;
// };

// const createOrder = async (req, res, next) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const {
//       items,
//       shippingAddress,
//       city,
//       state,
//       pinCode,
//       paymentMethod,
//       notes,
//     } = req.body;

//     if (
//       !items ||
//       !items.length ||
//       !shippingAddress ||
//       !city ||
//       !state ||
//       !pinCode
//     ) {
//       return next(
//         createError(
//           400,
//           "Items, shipping address, city, state, and PIN code are required"
//         )
//       );
//     }

//     const buyerId = req.user.id;
//     const buyer = await User.findByPk(buyerId);

//     if (!buyer || buyer.role !== "Buyer") {
//       return next(createError(403, "Only buyers can create orders"));
//     }

//     let totalAmount = 0;
//     const validatedItems = [];
//     const farmerIds = new Set();

//     for (const item of items) {
//       const { productId, quantity } = item;

//       if (!productId || !quantity || quantity <= 0) {
//         await transaction.rollback();
//         return next(createError(400, "Invalid product or quantity"));
//       }

//       const product = await Product.findByPk(productId);
//       if (!product || !product.isAvailable || product.status !== "active") {
//         await transaction.rollback();
//         return next(createError(400, `Product ${productId} not available`));
//       }

//       if (product.quantity < quantity) {
//         await transaction.rollback();
//         return next(
//           createError(400, `Not enough stock for ${product.productName}`)
//         );
//       }

//       const farmerId = product.userId;
//       farmerIds.add(farmerId);

//       const price = product.price;
//       const subtotal = price * quantity;
//       totalAmount += subtotal;

//       validatedItems.push({
//         productId,
//         quantity,
//         price,
//         subtotal,
//         farmerId,
//         productName: product.productName,
//         productImage: product.image,
//         unit: product.unit,
//       });
//     }

//     if (paymentMethod === "Online Payment") {
//       // const transaction_uuid = await generateOrderNumber();
//       const orderNumber = await generateOrderNumber();

//       // console.log("Generated Order Number:", transaction_uuid);

//       // Create a pending order first
//       const pendingOrder = await Order.create(
//         {
//           orderNumber,
//           totalAmount,
//           status: "Processing",
//           paymentMethod,
//           paymentStatus: "Pending",
//           shippingAddress,
//           city,
//           state,
//           pinCode,
//           buyerId,
//           notes,
//         },
//         { transaction }
//       );
//       console.log("Order created:", pendingOrder);

//       await PaymentTransaction.create(
//         {
//           productId: orderNumber,
//           amount: totalAmount,
//           status: "Pending",
//           paymentMethod: "Online Payment",
//         },
//         { transaction }
//       );
//       console.log("PaymentTransaction created for order:", orderNumber);

//       await transaction.commit();
//       console.log("Transaction committed successfully.");

//       const paymentInitiation = await axios.post(
//         `${process.env.SERVER_URL}/initiate-payment`,
//         {
//           amount: totalAmount,
//           productId: orderNumber, // note: pass this as productId
//         }
//       );

//       return res.status(200).json({
//         StatusCode: 200,
//         IsSuccess: true,
//         ErrorMessage: [],
//         Result: {
//           message: "Redirecting to payment gateway...",
//           paymentData: paymentInitiation.data,
//         },
//       });
//     }

//     // For Cash on Delivery
//     const orderNumber = await generateOrderNumber();
//     const estimatedDelivery = new Date();
//     estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

//     const newOrder = await Order.create(
//       {
//         orderNumber,
//         totalAmount,
//         status: "Processing",
//         paymentMethod,
//         paymentStatus: "Pending",
//         shippingAddress,
//         city,
//         state,
//         pinCode,
//         buyerId,
//         notes,
//         estimatedDelivery,
//       },
//       { transaction }
//     );

//     for (const item of validatedItems) {
//       await OrderItem.create(
//         {
//           quantity: item.quantity,
//           price: item.price,
//           subtotal: item.subtotal,
//           productId: item.productId,
//           orderId: newOrder.id,
//           farmerId: item.farmerId,
//           status: "Pending",
//         },
//         { transaction }
//       );
//     }

//     await transaction.commit();

//     // Get Socket.IO instance
//     const io = req.app.get("io");

//     // Send real-time notification to buyer
//     io.to(`user:${buyerId}`).emit("order:created", {
//       orderId: newOrder.id,
//       orderNumber: newOrder.orderNumber,
//       status: newOrder.status,
//       shippingAddress: newOrder.shippingAddress,
//       totalAmount: newOrder.totalAmount,
//       message: `Your order #${newOrder.orderNumber} has been placed successfully!`,
//     });

//     // Send real-time notifications to farmers
//     for (const farmerId of farmerIds) {
//       const farmerItems = validatedItems.filter(
//         (item) => item.farmerId === farmerId
//       );

//       io.to(`user:${farmerId}`).emit("order:received", {
//         orderId: newOrder.id,
//         orderNumber: newOrder.orderNumber,
//         buyerId,
//         buyerName: buyer.username,
//         items: farmerItems,
//         status: newOrder.status,
//         shippingAddress: newOrder.shippingAddress,
//         totalAmount: newOrder.totalAmount,
//         estimatedDelivery: newOrder.estimatedDelivery,
//         message: `You have received a new order ${newOrder.orderNumber}!,<br/>`,
//       });
//     }

//     // Send order confirmation email to buyer
//     const buyerMailOptions = {
//       to: buyer.email,
//       from: process.env.EMAIL_USER,
//       subject: `Order Confirmation - ${orderNumber}`,
//       html: `
//         <html>
//           <body style="font-family: Arial, sans-serif;">
//             <h1>Order Confirmation</h1>
//             <p>Hello ${buyer.username},</p>
//             <p>Your order has been placed successfully.</p>
//             <p><strong>Order Number:</strong> ${orderNumber}</p>
//             <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
//             <p><strong>Shipping Address:</strong> ${shippingAddress}, ${city}, ${state} - ${pinCode}</p>
//             <p><strong>Payment Method:</strong> ${newOrder.paymentMethod}</p>
//             <h2>Order Items:</h2>
//             <ul>
//               ${validatedItems
//                 .map(
//                   (item) =>
//                     `<li>${item.quantity} ${item.unit} x ${item.productName} - ₹${item.subtotal}</li>`
//                 )
//                 .join("")}
//             </ul>
//             <p>Thank you for shopping with FasalBajar!</p>
//           </body>
//         </html>
//       `,
//     };

//     await transporter.sendMail(buyerMailOptions);

//     // Notify farmers about the new order
//     for (const farmerId of farmerIds) {
//       const farmer = await User.findByPk(farmerId);
//       if (farmer && farmer.email) {
//         const farmerItems = validatedItems.filter(
//           (item) => item.farmerId === farmerId
//         );

//         const farmerMailOptions = {
//           to: farmer.email,
//           from: process.env.EMAIL_USER,
//           subject: `New Order Received - ${orderNumber}`,
//           html: `
//             <html>
//               <body style="font-family: Arial, sans-serif;">
//                 <h1>New Order Received</h1>
//                 <p>Hello ${farmer.username},</p>
//                 <p>You have received a new order.</p>
//                 <p><strong>Order Number:</strong> ${orderNumber}</p>
//                 <h2>Order Items:</h2>
//                 <ul>
//                   ${farmerItems
//                     .map(
//                       (item) =>
//                         `<li>${item.quantity} ${item.unit} x ${item.productName} - ₹${item.subtotal}</li>`
//                     )
//                     .join("")}
//                 </ul>
//                 <p>Please accept or decline this order within 24 hours.</p>
//                 <p>You can manage this order from your dashboard.</p>
//               </body>
//             </html>
//           `,
//         };

//         await transporter.sendMail(farmerMailOptions);
//       }
//     }

//     //     res.status(201).json({
//     //       StatusCode: 201,
//     //       IsSuccess: true,
//     //       ErrorMessage: [],
//     //       Result: {
//     //         message: "Order created successfully",
//     //         order: {
//     //           ...newOrder.toJSON(),
//     //           items: validatedItems,
//     //         },
//     //       },
//     //     });
//     //   } catch (error) {
//     //     // Rollback the transaction in case of error
//     //     await transaction.rollback();
//     //     console.error(error);
//     //     next(
//     //       createError(500, `Server error while creating order: ${error.message}`)
//     //     );
//     //   }
//     // };

//     res.status(201).json({
//       StatusCode: 201,
//       IsSuccess: true,
//       ErrorMessage: [],
//       Result: {
//         message: "Order created successfully",
//         order: newOrder,
//       },
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error(error);
//     next(createError(500, `Server error: ${error.message}`));
//   }
// };

// // Farmer accepts or declines an order item
// const updateOrderItemStatus = async (req, res, next) => {
//   try {
//     const { itemId } = req.params;
//     const { status, farmerNotes } = req.body;
//     const farmerId = req.user.id;

//     // Validate status
//     if (!status || !["Accepted", "Declined"].includes(status)) {
//       return next(
//         createError(400, "Status must be either 'Accepted' or 'Declined'")
//       );
//     }

//     // Verify the user is a Farmer
//     const farmer = await User.findByPk(farmerId);
//     if (!farmer || farmer.role !== "Farmer") {
//       return next(
//         createError(403, "Only farmers can update order item status")
//       );
//     }

//     // Find the order item
//     const orderItem = await OrderItem.findOne({
//       where: {
//         id: itemId,
//         farmerId: farmerId,
//       },
//       include: [
//         {
//           model: Order,
//           include: [
//             {
//               model: User,
//               as: "buyer",
//               attributes: ["id", "username", "email"],
//             },
//           ],
//         },
//         {
//           model: Product,
//           attributes: ["id", "productName", "quantity", "unit"],
//         },
//       ],
//     });

//     if (!orderItem) {
//       return next(
//         createError(404, "Order item not found or you don't have permission")
//       );
//     }

//     // Check if the item is already processed
//     if (orderItem.status !== "Pending") {
//       return next(
//         createError(
//           400,
//           `This item has already been ${orderItem.status.toLowerCase()}`
//         )
//       );
//     }

//     // Update the order item status
//     await orderItem.update({
//       status,
//       statusUpdatedAt: new Date(),
//       farmerNotes: farmerNotes || null,
//     });

//     // If declined, restore the product quantity
//     if (status === "Declined") {
//       const product = await Product.findByPk(orderItem.productId);
//       if (product) {
//         await product.update({
//           quantity: product.quantity + orderItem.quantity,
//           status: "active",
//           isAvailable: true,
//         });
//       }
//     }

//     // Check if all items in the order have been processed
//     const allOrderItems = await OrderItem.findAll({
//       where: { orderId: orderItem.orderId },
//     });

//     const allAccepted = allOrderItems.every(
//       (item) => item.status === "Accepted"
//     );
//     const anyDeclined = allOrderItems.some(
//       (item) => item.status === "Declined"
//     );

//     // Update the order status based on item statuses
//     if (allAccepted) {
//       await orderItem.Order.update({
//         status: "Confirmed",
//         isConfirmed: true,
//         confirmedAt: new Date(),
//       });
//     } else if (
//       anyDeclined &&
//       allOrderItems.every((item) => item.status !== "Pending")
//     ) {
//       // If all items are processed and at least one is declined
//       await orderItem.Order.update({
//         status: "Partially Confirmed",
//       });
//     }

//     // Get Socket.IO instance
//     const io = req.app.get("io");

//     // Send real-time notification to buyer
//     const buyerId = orderItem.Order.buyerId;
//     const orderNumber = orderItem.Order.orderNumber;
//     const productName = orderItem.Product.productName;

//     io.to(`user:${buyerId}`).emit("order:updated", {
//       orderId: orderItem.orderId,
//       orderItemId: orderItem.id,
//       orderNumber: orderNumber,
//       status: status,
//       productName: productName,
//       message: `Your order item ${productName} has been ${status.toLowerCase()} by the farmer.`,
//     });

//     // Send email notification to buyer
//     const buyer = orderItem.Order.buyer;
//     if (buyer && buyer.email) {
//       const buyerMailOptions = {
//         to: buyer.email,
//         from: process.env.EMAIL_USER,
//         subject: `Order Update - ${orderNumber}`,
//         html: `
//           <html>
//             <body style="font-family: Arial, sans-serif;">
//               <h1>Order Update</h1>
//               <p>Hello ${buyer.username},</p>
//               <p>There's an update to your order #${orderNumber}.</p>
//               <p>The farmer has <strong>${status.toLowerCase()}</strong> your order for ${
//           orderItem.quantity
//         } ${orderItem.Product.unit} of ${productName}.</p>
//               ${
//                 status === "Declined"
//                   ? `
//                 <p><strong>Reason:</strong> ${
//                   farmerNotes || "No reason provided"
//                 }</p>
//                 <p>Don't worry, you won't be charged for this item.</p>
//               `
//                   : `
//                 <p>Your order is being prepared for shipping!</p>
//               `
//               }
//               <p>You can check the full details of your order in your account dashboard.</p>
//             </body>
//           </html>
//         `,
//       };

//       await transporter.sendMail(buyerMailOptions);
//     }

//     res.status(200).json({
//       StatusCode: 200,
//       IsSuccess: true,
//       ErrorMessage: [],
//       Result: {
//         message: `Order item ${status.toLowerCase()} successfully`,
//         orderItem: orderItem,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     next(
//       createError(
//         500,
//         `Server error while updating order item: ${error.message}`
//       )
//     );
//   }
// };

// // Get all orders for the current user (buyer or farmer)
// const getMyOrders = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     const user = await User.findByPk(userId);

//     if (!user) {
//       return next(createError(404, "User not found"));
//     }

//     let orders = [];

//     if (user.role === "Buyer") {
//       // If user is a buyer, get all their orders
//       orders = await Order.findAll({
//         where: { buyerId: userId },
//         order: [["createdAt", "DESC"]],
//         include: [
//           {
//             model: OrderItem,
//             include: [
//               {
//                 model: Product,
//                 attributes: ["productName", "image", "unit"],
//               },
//               {
//                 model: User,
//                 as: "farmer",
//                 attributes: ["username", "contact_number", "location"],
//               },
//             ],
//           },
//         ],
//       });
//     } else if (user.role === "Farmer") {
//       // If user is a farmer, get orders containing their products
//       const orderItems = await OrderItem.findAll({
//         where: { farmerId: userId },
//         include: [
//           {
//             model: Order,
//             include: [
//               {
//                 model: User,
//                 as: "buyer",
//                 attributes: ["username", "email", "contact_number"],
//               },
//             ],
//           },
//           {
//             model: Product,
//             attributes: ["productName", "image", "unit"],
//           },
//         ],
//         order: [["createdAt", "DESC"]],
//       });

//       // Group order items by order
//       const orderMap = new Map();
//       for (const item of orderItems) {
//         const orderId = item.Order.id;
//         if (!orderMap.has(orderId)) {
//           orderMap.set(orderId, {
//             ...item.Order.toJSON(),
//             items: [],
//           });
//         }
//         orderMap.get(orderId).items.push(item);
//       }

//       orders = Array.from(orderMap.values());
//     }

//     res.status(200).json({
//       StatusCode: 200,
//       IsSuccess: true,
//       ErrorMessage: [],
//       Result: {
//         orders,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     next(
//       createError(500, `Server error while fetching orders: ${error.message}`)
//     );
//   }
// };

// // Get pending order items for a farmer
// const getPendingOrderItems = async (req, res, next) => {
//   try {
//     const farmerId = req.user.id;

//     // Verify the user is a Farmer
//     const farmer = await User.findByPk(farmerId);
//     if (!farmer || farmer.role !== "Farmer") {
//       return next(createError(403, "Only farmers can access this endpoint"));
//     }

//     // Get pending order items
//     const pendingItems = await OrderItem.findAll({
//       where: {
//         farmerId: farmerId,
//         status: "Pending",
//       },
//       include: [
//         {
//           model: Order,
//           include: [
//             {
//               model: User,
//               as: "buyer",
//               attributes: ["username", "contact_number"],
//             },
//           ],
//         },
//         {
//           model: Product,
//           attributes: ["productName", "image", "unit", "price"],
//         },
//       ],
//       order: [["createdAt", "ASC"]],
//     });

//     res.status(200).json({
//       StatusCode: 200,
//       IsSuccess: true,
//       ErrorMessage: [],
//       Result: {
//         pendingItems,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     next(
//       createError(
//         500,
//         `Server error while fetching pending orders: ${error.message}`
//       )
//     );
//   }
// };

// // Get a specific order by ID
// const getOrderById = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;
//     const user = await User.findByPk(userId);

//     if (!user) {
//       return next(createError(404, "User not found"));
//     }

//     const order = await Order.findByPk(id, {
//       include: [
//         {
//           model: OrderItem,
//           include: [
//             {
//               model: Product,
//               attributes: ["productName", "image", "productType", "unit"],
//             },
//             {
//               model: User,
//               as: "farmer",
//               attributes: ["username", "email", "contact_number", "location"],
//             },
//           ],
//         },
//         {
//           model: User,
//           as: "buyer",
//           attributes: ["username", "email", "contact_number", "location"],
//         },
//       ],
//     });

//     if (!order) {
//       return next(createError(404, "Order not found"));
//     }

//     // Check if the user has permission to view this order
//     if (user.role === "Buyer" && order.buyerId !== userId) {
//       return next(
//         createError(403, "You don't have permission to view this order")
//       );
//     }

//     if (user.role === "Farmer") {
//       // Check if any of the order items belong to this farmer
//       const hasPermission = order.OrderItems.some(
//         (item) => item.farmerId === userId
//       );
//       if (!hasPermission) {
//         return next(
//           createError(403, "You don't have permission to view this order")
//         );
//       }
//     }

//     res.status(200).json({
//       StatusCode: 200,
//       IsSuccess: true,
//       ErrorMessage: [],
//       Result: {
//         order,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     next(
//       createError(500, `Server error while fetching order: ${error.message}`)
//     );
//   }
// };

// // Update order status
// const updateOrderStatus = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;
//     const userId = req.user.id;

//     // Validate status
//     const validStatuses = [
//       "Processing",
//       "Confirmed",
//       "Shipped",
//       "Delivered",
//       "Cancelled",
//     ];
//     if (!status || !validStatuses.includes(status)) {
//       return next(createError(400, "Invalid status"));
//     }

//     const order = await Order.findByPk(id, {
//       include: [
//         {
//           model: OrderItem,
//           include: [
//             {
//               model: Product,
//             },
//           ],
//         },
//         {
//           model: User,
//           as: "buyer",
//           attributes: ["username", "email"],
//         },
//       ],
//     });

//     if (!order) {
//       return next(createError(404, "Order not found"));
//     }

//     // Only allow farmers to update status to Shipped
//     // Only allow buyers to update status to Cancelled (if not already shipped)
//     const user = await User.findByPk(userId);

//     if (user.role === "Farmer") {
//       // Check if any of the order items belong to this farmer
//       const hasPermission = order.OrderItems.some(
//         (item) => item.farmerId === userId
//       );
//       if (!hasPermission) {
//         return next(
//           createError(403, "You don't have permission to update this order")
//         );
//       }

//       // Farmers can only update to Shipped
//       if (status !== "Shipped") {
//         return next(
//           createError(403, "Farmers can only update order status to Shipped")
//         );
//       }
//     } else if (user.role === "Buyer") {
//       // Buyers can only cancel their own orders
//       if (order.buyerId !== userId) {
//         return next(
//           createError(403, "You don't have permission to update this order")
//         );
//       }

//       // Buyers can only cancel orders that are not shipped or delivered
//       if (status === "Cancelled") {
//         if (order.status === "Shipped" || order.status === "Delivered") {
//           return next(
//             createError(
//               400,
//               "Cannot cancel an order that has been shipped or delivered"
//             )
//           );
//         }
//       } else {
//         return next(createError(403, "Buyers can only cancel orders"));
//       }
//     }

//     // Update the order status
//     await order.update({ status });

//     // If the order is cancelled, restore the product quantities
//     if (status === "Cancelled") {
//       for (const item of order.OrderItems) {
//         const product = await Product.findByPk(item.productId);
//         if (product) {
//           await product.update({
//             quantity: product.quantity + item.quantity,
//             status: "active",
//             isAvailable: true,
//           });
//         }
//       }
//     }

//     // If the order is delivered, update payment status for COD orders
//     if (status === "Delivered" && order.paymentMethod === "Cash on Delivery") {
//       await order.update({ paymentStatus: "Completed" });
//     }

//     // Get Socket.IO instance
//     const io = req.app.get("io");

//     // Send real-time notification to relevant users
//     if (user.role === "Farmer" && status === "Shipped") {
//       // Notify buyer that order has been shipped
//       io.to(`user:${order.buyerId}`).emit("order:shipped", {
//         orderId: order.id,
//         orderNumber: order.orderNumber,
//         message: `Your order #${order.orderNumber} has been shipped!`,
//       });
//     } else if (user.role === "Buyer" && status === "Cancelled") {
//       // Notify farmers that order has been cancelled
//       const farmerIds = [
//         ...new Set(order.OrderItems.map((item) => item.farmerId)),
//       ];
//       for (const farmerId of farmerIds) {
//         io.to(`user:${farmerId}`).emit("order:cancelled", {
//           orderId: order.id,
//           orderNumber: order.orderNumber,
//           message: `Order #${order.orderNumber} has been cancelled by the buyer.`,
//         });
//       }
//     }

//     // Send notification email
//     const buyer = order.buyer;
//     if (buyer && buyer.email) {
//       const mailOptions = {
//         to: buyer.email,
//         from: process.env.EMAIL_USER,
//         subject: `Order ${order.orderNumber} Status Update`,
//         html: `
//           <html>
//             <body style="font-family: Arial, sans-serif;">
//               <h1>Order Status Update</h1>
//               <p>Hello ${buyer.username},</p>
//               <p>Your order #${
//                 order.orderNumber
//               } has been updated to: <strong>${status}</strong></p>
//               ${
//                 status === "Shipped"
//                   ? `<p>Your order is on its way! You should receive it within 2-3 business days.</p>`
//                   : status === "Delivered"
//                   ? `<p>Your order has been delivered. Thank you for shopping with FasalBajar!</p>`
//                   : status === "Cancelled"
//                   ? `<p>Your order has been cancelled. If you have any questions, please contact customer support.</p>`
//                   : ``
//               }
//             </body>
//           </html>
//         `,
//       };

//       await transporter.sendMail(mailOptions);
//     }

//     res.status(200).json({
//       StatusCode: 200,
//       IsSuccess: true,
//       ErrorMessage: [],
//       Result: {
//         message: "Order status updated successfully",
//         order: await Order.findByPk(id, {
//           include: [
//             {
//               model: OrderItem,
//               include: [
//                 {
//                   model: Product,
//                   attributes: ["productName", "image"],
//                 },
//               ],
//             },
//           ],
//         }),
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     next(
//       createError(500, `Server error while updating order: ${error.message}`)
//     );
//   }
// };

// // Get order statistics for farmer dashboard
// const getOrderStats = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     const user = await User.findByPk(userId);

//     // This endpoint is primarily for farmers to see their sales stats
//     if (!user || user.role !== "Farmer") {
//       return next(createError(403, "Only farmers can access order statistics"));
//     }

//     // Get total sales for this farmer
//     const totalSales = await OrderItem.sum("subtotal", {
//       where: {
//         farmerId: userId,
//         status: "Accepted",
//       },
//     });

//     // Get count of orders by status
//     const pendingCount = await OrderItem.count({
//       where: {
//         farmerId: userId,
//         status: "Pending",
//       },
//     });

//     const acceptedCount = await OrderItem.count({
//       where: {
//         farmerId: userId,
//         status: "Accepted",
//       },
//     });

//     const declinedCount = await OrderItem.count({
//       where: {
//         farmerId: userId,
//         status: "Declined",
//       },
//     });

//     // Get recent orders
//     const recentOrders = await OrderItem.findAll({
//       where: { farmerId: userId },
//       limit: 5,
//       order: [["createdAt", "DESC"]],
//       include: [
//         {
//           model: Order,
//           include: [
//             {
//               model: User,
//               as: "buyer",
//               attributes: ["username"],
//             },
//           ],
//         },
//         {
//           model: Product,
//           attributes: ["productName", "unit"],
//         },
//       ],
//     });

//     // Get monthly sales data for charts
//     const currentDate = new Date();
//     const sixMonthsAgo = new Date();
//     sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

//     const monthlySales = await OrderItem.findAll({
//       attributes: [
//         [
//           sequelize.fn("date_trunc", "month", sequelize.col("createdAt")),
//           "month",
//         ],
//         [sequelize.fn("sum", sequelize.col("subtotal")), "total"],
//       ],
//       where: {
//         farmerId: userId,
//         status: "Accepted",
//         createdAt: {
//           [Op.gte]: sixMonthsAgo,
//         },
//       },
//       group: [sequelize.fn("date_trunc", "month", sequelize.col("createdAt"))],
//       order: [sequelize.fn("date_trunc", "month", sequelize.col("createdAt"))],
//     });

//     res.status(200).json({
//       StatusCode: 200,
//       IsSuccess: true,
//       ErrorMessage: [],
//       Result: {
//         totalSales: totalSales || 0,
//         orderCounts: {
//           pending: pendingCount,
//           accepted: acceptedCount,
//           declined: declinedCount,
//           total: pendingCount + acceptedCount + declinedCount,
//         },
//         recentOrders,
//         monthlySales,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     next(
//       createError(
//         500,
//         `Server error while fetching order statistics: ${error.message}`
//       )
//     );
//   }
// };

// module.exports = {
//   createOrder,
//   getMyOrders,
//   getOrderById,
//   updateOrderStatus,
//   getOrderStats,
//   updateOrderItemStatus,
//   getPendingOrderItems,
// };

const createError = require("http-errors");
const { User, Product, Order, OrderItem } = require("../Models/index");
const PaymentTransaction = require("../Models/paymentTransaction");

const { Op } = require("sequelize");
const sequelize = require("../config/dbConfig");
const nodemailer = require("nodemailer");
require("dotenv").config();
const axios = require("axios");

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

// Helper function to generate a unique order number
const generateOrderNumber = async () => {
  const prefix = "ORD";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  const orderNumber = `${prefix}${timestamp}${random}`;

  // Check if this order number already exists
  const existingOrder = await Order.findOne({ where: { orderNumber } });
  if (existingOrder) {
    // If it exists (very unlikely), generate a new one recursively
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

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Items are required");
    }
    if (!shippingAddress || !city || !state || !pinCode) {
      throw new Error("Shipping details are required");
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction });
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      if (product.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for product ${product.productName}`
        );
      }
      totalAmount += product.price * item.quantity;
      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        subtotal: product.price * item.quantity,
        farmerId: product.farmerId,
      });
    }

    // Add delivery fee
    const deliveryFee = 50;
    totalAmount += deliveryFee;

    // Generate unique order number
    const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create order
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

    // Create order items
    for (const itemData of orderItemsData) {
      await OrderItem.create(
        {
          orderId: order.id,
          productId: itemData.productId,
          quantity: itemData.quantity,
          price: itemData.price,
          subtotal: itemData.subtotal,
          farmerId: itemData.farmerId,
          status: "Pending",
        },
        { transaction }
      );

      // Update product stock
      await Product.update(
        { stock: sequelize.literal(`stock - ${itemData.quantity}`) },
        { where: { id: itemData.productId }, transaction }
      );
    }

    // Send notifications to buyer and farmers
    const buyer = await User.findByPk(buyerId, { transaction });
    const farmerIds = [...new Set(orderItemsData.map((item) => item.farmerId))];

    // Notify buyer
    await Notification.create(
      {
        userId: buyerId,
        message: `Your order ${orderNumber} has been placed successfully!`,
        type: "Order",
      },
      { transaction }
    );
    io.to(`user_${buyerId}`).emit("notification", {
      message: `Your order ${orderNumber} has been placed successfully!`,
      type: "Order",
    });

    // Notify farmers
    for (const farmerId of farmerIds) {
      await Notification.create(
        {
          userId: farmerId,
          message: `New order item for your product in order ${orderNumber}. Please review and accept/decline.`,
          type: "Order",
        },
        { transaction }
      );
      io.to(`user_${farmerId}`).emit("notification", {
        message: `New order item for your product in order ${orderNumber}. Please review and accept/decline.`,
        type: "Order",
      });
    }

    // Send emails
    await sendEmail(
      buyer.email,
      "Order Confirmation",
      `Your order ${orderNumber} has been placed successfully!`
    );
    for (const farmerId of farmerIds) {
      const farmer = await User.findByPk(farmerId, { transaction });
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

    // Validate status
    if (!status || !["Accepted", "Declined"].includes(status)) {
      return next(
        createError(400, "Status must be either 'Accepted' or 'Declined'")
      );
    }

    // Verify the user is a Farmer
    const user = await User.findByPk(userId);
    if (!user || user.role !== "Farmer") {
      return next(
        createError(403, "Only farmers can update order item status")
      );
    }

    // Find the order item
    const orderItem = await OrderItem.findOne({
      where: {
        id: itemId,
        farmerId: userId,
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

    // Check if the item is already processed
    if (orderItem.status !== "Pending") {
      return next(
        createError(
          400,
          `This item has already been ${orderItem.status.toLowerCase()}`
        )
      );
    }

    // Update the order item status
    await orderItem.update({
      status,
      statusUpdatedAt: new Date(),
      farmerNotes: farmerNotes || null,
    });

    // If declined, restore the product quantity
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

    // Check if all items in the order have been processed
    const allOrderItems = await OrderItem.findAll({
      where: { orderId: orderItem.orderId },
    });

    const allAccepted = allOrderItems.every(
      (item) => item.status === "Accepted"
    );
    const anyDeclined = allOrderItems.some(
      (item) => item.status === "Declined"
    );

    // Update the order status based on item statuses
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
      // If all items are processed and at least one is declined
      await orderItem.Order.update({
        status: "Partially Confirmed",
      });
    }

    // Get Socket.IO instance
    const io = req.app.get("io");

    // Send real-time notification to buyer
    const buyerId = orderItem.Order.buyerId;
    const orderNumber = orderItem.Order.orderNumber;
    const productName = orderItem.Product.productName;

    io.to(`user:${buyerId}`).emit("order:updated", {
      orderId: orderItem.orderId,
      orderItemId: orderItem.id,
      orderNumber: orderNumber,
      status: status,
      productName: productName,
      message: `Your order item ${productName} has been ${status.toLowerCase()} by the farmer.`,
    });

    // Send email notification to buyer
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
const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return next(createError(404, "User not found"));
    }

    let orders = [];

    if (user.role === "Buyer") {
      // If user is a buyer, get all their orders
      orders = await Order.findAll({
        where: { buyerId: userId },
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: OrderItem,
            include: [
              {
                model: Product,
                attributes: ["productName", "image", "unit"],
              },
              {
                model: User,
                as: "farmer",
                attributes: ["username", "contact_number", "location"],
              },
            ],
          },
        ],
      });
    } else if (user.role === "Farmer") {
      // If user is a farmer, get orders containing their products
      const orderItems = await OrderItem.findAll({
        where: { farmerId: userId },
        include: [
          {
            model: Order,
            include: [
              {
                model: User,
                as: "buyer",
                attributes: ["username", "email", "contact_number"],
              },
            ],
          },
          {
            model: Product,
            attributes: ["productName", "image", "unit"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      // Group order items by order
      const orderMap = new Map();
      for (const item of orderItems) {
        const orderId = item.Order.id;
        if (!orderMap.has(orderId)) {
          orderMap.set(orderId, {
            ...item.Order.toJSON(),
            items: [],
          });
        }
        orderMap.get(orderId).items.push(item);
      }

      orders = Array.from(orderMap.values());
    }

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        orders,
      },
    });
  } catch (error) {
    console.error(error);
    next(
      createError(500, `Server error while fetching orders: ${error.message}`)
    );
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
        farmerId: farmerId,
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
      // Check if any of the order items belong to this farmer
      const hasPermission = order.OrderItems.some(
        (item) => item.farmerId === userId
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
      // Check if any of the order items belong to this farmer
      const hasPermission = order.OrderItems.some(
        (item) => item.farmerId === userId
      );
      if (!hasPermission) {
        return next(
          createError(403, "You don't have permission to update this order")
        );
      }

      // Farmers can only update to Shipped
      if (status !== "Shipped") {
        return next(
          createError(403, "Farmers can only update order status to Shipped")
        );
      }
    } else if (user.role === "Buyer") {
      // Buyers can only cancel their own orders
      if (order.buyerId !== userId) {
        return next(
          createError(403, "You don't have permission to update this order")
        );
      }

      // Buyers can only cancel orders that are not shipped or delivered
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
      // Notify buyer that order has been shipped
      io.to(`user:${order.buyerId}`).emit("order:shipped", {
        orderId: order.id,
        orderNumber: order.orderNumber,
        message: `Your order #${order.orderNumber} has been shipped!`,
      });
    } else if (user.role === "Buyer" && status === "Cancelled") {
      // Notify farmers that order has been cancelled
      const farmerIds = [
        ...new Set(order.OrderItems.map((item) => item.farmerId)),
      ];
      for (const farmerId of farmerIds) {
        io.to(`user:${farmerId}`).emit("order:cancelled", {
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
                  ? `<p>Your order has been cancelled. If you have any questions, please contact customer support.</p>`
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
  const { orderId } = req.params;
  const buyerId = req.user.id;

  let transaction;

  try {
    transaction = await sequelize.transaction();

    const order = await Order.findByPk(orderId, {
      include: [{ model: OrderItem }],
      transaction,
    });

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

    const hasAcceptedItems = order.OrderItems.some(
      (item) => item.status === "Accepted"
    );
    if (!hasAcceptedItems) {
      throw new Error("No items have been accepted by farmers yet");
    }

    // Calculate total amount for accepted items
    const totalAmount = order.OrderItems.reduce((sum, item) => {
      if (item.status === "Accepted") {
        return sum + item.subtotal;
      }
      return sum;
    }, 0);

    // Initiate payment
    const { paymentUrl } = await initiatePayment(
      totalAmount,
      order.orderNumber,
      buyerId,
      order.paymentMethod,
      transaction
    );

    await transaction.commit();

    return res.status(200).json({
      Success: true,
      Result: { paymentUrl },
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

    // This endpoint is primarily for farmers to see their sales stats
    if (!user || user.role !== "Farmer") {
      return next(createError(403, "Only farmers can access order statistics"));
    }

    // Get total sales for this farmer
    const totalSales = await OrderItem.sum("subtotal", {
      where: {
        farmerId: userId,
        status: "Accepted",
      },
    });

    // Get count of orders by status
    const pendingCount = await OrderItem.count({
      where: {
        farmerId: userId,
        status: "Pending",
      },
    });

    const acceptedCount = await OrderItem.count({
      where: {
        farmerId: userId,
        status: "Accepted",
      },
    });

    const declinedCount = await OrderItem.count({
      where: {
        farmerId: userId,
        status: "Declined",
      },
    });

    // Get recent orders
    const recentOrders = await OrderItem.findAll({
      where: { farmerId: userId },
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

    // Get monthly sales data for charts
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
        farmerId: userId,
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

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
  updateOrderItemStatus,
  getPendingOrderItems,
  processPayment,
};
