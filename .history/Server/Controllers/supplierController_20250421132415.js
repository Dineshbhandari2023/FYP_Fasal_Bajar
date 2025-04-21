const createError = require("http-errors");
const { Op, Sequelize } = require("sequelize");
const {
  User,
  SupplierDetails,
  Delivery,
  OrderItem,
  Order,
  Product,
} = require("../Models/index");
const path = require("path");
const fs = require("fs");

// Helper: construct relative URL for uploaded document
const getDocumentUrl = (file) => {
  return `/uploads/${file.filename}`;
};

// Get current supplier details
const getSupplierProfile = async (req, res, next) => {
  const userId = req.user.id;

  try {
    // Find the user with supplier details
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: SupplierDetails,
          required: false,
        },
      ],
    });

    if (!user) {
      console.log("User not found for ID:", userId);
      return next(createError(404, "User not found"));
    }

    if (user.role !== "Supplier") {
      return next(createError(403, "User is not registered as a supplier"));
    }

    // Get delivery statistics
    const deliveryStats = await Delivery.findAll({
      where: { supplierId: userId },
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("id")), "totalDeliveries"],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal(
              'CASE WHEN status = "Delivered" THEN 1 ELSE 0 END'
            )
          ),
          "completedDeliveries",
        ],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal('CASE WHEN status = "Failed" THEN 1 ELSE 0 END')
          ),
          "failedDeliveries",
        ],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal(
              'CASE WHEN status = "Cancelled" THEN 1 ELSE 0 END'
            )
          ),
          "cancelledDeliveries",
        ],
      ],
      raw: true,
    });

    // Combine user data with delivery stats
    const userData = user.toJSON();
    userData.SupplierDetail = user.SupplierDetail || null;

    userData.deliveryStats = deliveryStats[0] || {
      totalDeliveries: 0,
      completedDeliveries: 0,
      failedDeliveries: 0,
      cancelledDeliveries: 0,
    };

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        message: "Supplier profile fetched successfully",
        data: userData,
      },
    });
  } catch (error) {
    console.error(error);
    next(createError(500, "Server error while fetching supplier profile"));
  }
};

// Register a new supplier (extends user registration)
const registerSupplier = async (req, res, next) => {
  const {
    vehicleType,
    vehicleRegistration,
    vehicleCapacity,
    serviceArea,
    experience,
    licenseNumber,
    bio,
  } = req.body;

  const userId = req.user.id;

  try {
    // Check if user exists and is a supplier
    const user = await User.findByPk(userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    if (user.role !== "Supplier") {
      return next(createError(403, "User is not registered as a supplier"));
    }

    // Check if supplier details already exist
    const existingDetails = await SupplierDetails.findOne({
      where: { userId },
    });

    if (existingDetails) {
      return next(
        createError(400, "Supplier details already exist for this user")
      );
    }

    // Check for duplicate vehicle registration
    const duplicateVehicle = await SupplierDetails.findOne({
      where: { vehicleRegistration },
    });

    if (duplicateVehicle) {
      return next(
        createError(400, "Vehicle registration number already exists")
      );
    }

    // Check for duplicate license number
    const duplicateLicense = await SupplierDetails.findOne({
      where: { licenseNumber },
    });

    if (duplicateLicense) {
      return next(createError(400, "License number already exists"));
    }

    // Process license document if uploaded
    let licenseDocument = null;
    if (req.file) {
      licenseDocument = getDocumentUrl(req.file);
    }

    // Create supplier details
    const supplierDetails = await SupplierDetails.create({
      userId,
      vehicleType,
      vehicleRegistration,
      vehicleCapacity,
      serviceArea,
      experience,
      licenseNumber,
      licenseDocument,
      bio,
    });

    res.status(201).json({
      StatusCode: 201,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        message: "Supplier details registered successfully",
        data: supplierDetails,
      },
    });
  } catch (error) {
    console.error(error);
    next(createError(500, "Server error while registering supplier details"));
  }
};

// Update supplier details
const updateSupplierDetails = async (req, res, next) => {
  const {
    vehicleType,
    vehicleCapacity,
    serviceArea,
    experience,
    bio,
    isAvailable,
  } = req.body;

  const userId = req.user.id;

  try {
    // Check if supplier details exist
    const supplierDetails = await SupplierDetails.findOne({
      where: { userId },
    });

    if (!supplierDetails) {
      return next(
        createError(
          404,
          "Supplier details not found. Please register your supplier profile first."
        )
      );
    }

    // Update fields
    if (vehicleType) supplierDetails.vehicleType = vehicleType;
    if (vehicleCapacity) supplierDetails.vehicleCapacity = vehicleCapacity;
    if (serviceArea) supplierDetails.serviceArea = serviceArea;
    if (experience) supplierDetails.experience = experience;
    if (bio) supplierDetails.bio = bio;
    if (isAvailable !== undefined) supplierDetails.isAvailable = isAvailable;

    // Process license document if uploaded
    if (req.file) {
      supplierDetails.licenseDocument = getDocumentUrl(req.file);
    }

    await supplierDetails.save();

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        message: "Supplier details updated successfully",
        data: supplierDetails,
      },
    });
  } catch (error) {
    console.error(error);
    next(createError(500, "Server error while updating supplier details"));
  }
};

// Update current location
const updateCurrentLocation = async (req, res, next) => {
  const { latitude, longitude } = req.body;
  const userId = req.user.id;

  if (!latitude || !longitude) {
    return next(createError(400, "Latitude and longitude are required"));
  }

  try {
    const supplierDetails = await SupplierDetails.findOne({
      where: { userId },
    });

    if (!supplierDetails) {
      return next(createError(404, "Supplier details not found"));
    }

    supplierDetails.currentLocation = { latitude, longitude };
    await supplierDetails.save();

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        message: "Current location updated successfully",
      },
    });
  } catch (error) {
    console.error(error);
    next(createError(500, "Server error while updating location"));
  }
};

// Get all available deliveries for a supplier
const getAvailableDeliveries = async (req, res, next) => {
  const userId = req.user.id;

  try {
    // Get supplier details to check service area
    const supplierDetails = await SupplierDetails.findOne({
      where: { userId },
    });

    if (!supplierDetails) {
      return next(createError(404, "Supplier details not found"));
    }

    // Find order items that need delivery in the supplier's service area
    // This is a simplified query - in a real app, you'd use geolocation matching
    const availableDeliveries = await OrderItem.findAll({
      where: {
        status: "Accepted", // Only accepted orders by farmers
      },
      include: [
        {
          model: Order,
          where: {
            status: "Confirmed", // Only confirmed orders
          },
          include: [
            {
              model: User,
              as: "buyer",
              attributes: ["id", "username", "contact_number", "location"],
            },
          ],
        },
        {
          model: Product,
          attributes: ["id", "productName", "location"],
        },
        {
          model: User,
          as: "farmer",
          attributes: ["id", "username", "contact_number", "location"],
        },
      ],
      // Exclude items that already have deliveries assigned
      having: Sequelize.literal(
        "NOT EXISTS (SELECT 1 FROM Deliveries WHERE Deliveries.orderItemId = OrderItem.id)"
      ),
    });

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        message: "Available deliveries fetched successfully",
        data: availableDeliveries,
      },
    });
  } catch (error) {
    console.error(error);
    next(createError(500, "Server error while fetching available deliveries"));
  }
};

// Accept a delivery
const acceptDelivery = async (req, res, next) => {
  const { orderItemId } = req.body;
  const supplierId = req.user.id;

  if (!orderItemId) {
    return next(createError(400, "Order item ID is required"));
  }

  try {
    // Check if the order item exists and is available for delivery
    const orderItem = await OrderItem.findByPk(orderItemId, {
      include: [
        {
          model: Order,
          include: [
            {
              model: User,
              as: "buyer",
              attributes: ["id", "username", "location"],
            },
          ],
        },
        {
          model: User,
          as: "farmer",
          attributes: ["id", "username", "location"],
        },
      ],
    });

    if (!orderItem) {
      return next(createError(404, "Order item not found"));
    }

    if (orderItem.status !== "Accepted") {
      return next(createError(400, "Order item is not ready for delivery"));
    }

    // Check if delivery already exists for this order item
    const existingDelivery = await Delivery.findOne({
      where: { orderItemId },
    });

    if (existingDelivery) {
      return next(
        createError(400, "Delivery already assigned for this order item")
      );
    }

    // Create a delivery number
    const deliveryNumber = `DEL-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`;

    // Create delivery record
    const delivery = await Delivery.create({
      deliveryNumber,
      supplierId,
      orderItemId,
      status: "Assigned",
      pickupLocation: {
        address: orderItem.farmer.location,
        // In a real app, you would include coordinates
      },
      deliveryLocation: {
        address: orderItem.Order.buyer.location,
        // In a real app, you would include coordinates
      },
      assignedAt: new Date(),
      estimatedPickupTime: new Date(Date.now() + 30 * 60000), // 30 minutes from now
      estimatedDeliveryTime: new Date(Date.now() + 90 * 60000), // 90 minutes from now
    });

    res.status(201).json({
      StatusCode: 201,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        message: "Delivery accepted successfully",
        data: delivery,
      },
    });
  } catch (error) {
    console.error(error);
    next(createError(500, "Server error while accepting delivery"));
  }
};

// Update delivery status
const updateDeliveryStatus = async (req, res, next) => {
  const { deliveryId, status, notes } = req.body;
  const supplierId = req.user.id;

  if (!deliveryId || !status) {
    return next(createError(400, "Delivery ID and status are required"));
  }

  const validStatuses = [
    "Pickup_In_Progress",
    "Picked_Up",
    "In_Transit",
    "Delivered",
    "Failed",
    "Cancelled",
  ];

  if (!validStatuses.includes(status)) {
    return next(createError(400, "Invalid status"));
  }

  try {
    const delivery = await Delivery.findOne({
      where: {
        id: deliveryId,
        supplierId,
      },
    });

    if (!delivery) {
      return next(
        createError(404, "Delivery not found or not assigned to you")
      );
    }

    // Update status and related timestamps
    delivery.status = status;
    if (notes) delivery.notes = notes;

    if (status === "Picked_Up") {
      delivery.pickedUpAt = new Date();
    } else if (status === "Delivered") {
      delivery.deliveredAt = new Date();

      // Update supplier's total deliveries count
      const supplierDetails = await SupplierDetails.findOne({
        where: { userId: supplierId },
      });

      if (supplierDetails) {
        supplierDetails.totalDeliveries += 1;
        await supplierDetails.save();
      }
    }

    // Process proof of delivery if uploaded
    if (req.file && status === "Delivered") {
      delivery.proofOfDelivery = getDocumentUrl(req.file);
    }

    await delivery.save();

    // If delivery is marked as delivered, update the order item status too
    if (status === "Delivered") {
      const orderItem = await OrderItem.findByPk(delivery.orderItemId);
      if (orderItem) {
        await orderItem.update({
          status: "Delivered",
          statusUpdatedAt: new Date(),
        });

        // Check if all items in the order have been delivered
        const allOrderItems = await OrderItem.findAll({
          where: { orderId: orderItem.orderId },
        });

        const allDelivered = allOrderItems.every(
          (item) => item.status === "Delivered"
        );

        if (allDelivered) {
          // Update the order status to Delivered
          const order = await Order.findByPk(orderItem.orderId);
          if (order) {
            await order.update({
              status: "Delivered",
              deliveredAt: new Date(),
            });
          }
        }
      }
    }

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        message: "Delivery status updated successfully",
        data: delivery,
      },
    });
  } catch (error) {
    console.error(error);
    next(createError(500, "Server error while updating delivery status"));
  }
};

// Get supplier's active deliveries
const getActiveDeliveries = async (req, res, next) => {
  const supplierId = req.user.id;

  try {
    const activeDeliveries = await Delivery.findAll({
      where: {
        supplierId,
        status: {
          [Op.notIn]: ["Delivered", "Failed", "Cancelled"],
        },
      },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Order,
              include: [
                {
                  model: User,
                  as: "buyer",
                  attributes: ["id", "username", "contact_number", "location"],
                },
              ],
            },
            {
              model: Product,
              attributes: ["id", "productName", "quantity", "price", "image"],
            },
            {
              model: User,
              as: "farmer",
              attributes: ["id", "username", "contact_number", "location"],
            },
          ],
        },
      ],
      order: [["assignedAt", "DESC"]],
    });

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        message: "Active deliveries fetched successfully",
        data: activeDeliveries,
      },
    });
  } catch (error) {
    console.error(error);
    next(createError(500, "Server error while fetching active deliveries"));
  }
};

// Get supplier's delivery history
const getDeliveryHistory = async (req, res, next) => {
  const supplierId = req.user.id;
  const page = Number.parseInt(req.query.page) || 1;
  const limit = Number.parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await Delivery.findAndCountAll({
      where: {
        supplierId,
        status: {
          [Op.in]: ["Delivered", "Failed", "Cancelled"],
        },
      },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Order,
              include: [
                {
                  model: User,
                  as: "buyer",
                  attributes: ["id", "username", "location"],
                },
              ],
            },
            {
              model: Product,
              attributes: ["id", "productName"],
            },
            {
              model: User,
              as: "farmer",
              attributes: ["id", "username", "location"],
            },
          ],
        },
      ],
      order: [["deliveredAt", "DESC"]],
      offset,
      limit,
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        message: "Delivery history fetched successfully",
        data: rows,
        pagination: {
          totalDeliveries: count,
          totalPages,
          currentPage: page,
          pageSize: rows.length,
        },
      },
    });
  } catch (error) {
    console.error(error);
    next(createError(500, "Server error while fetching delivery history"));
  }
};

// Get all suppliers (for admin or public view)
const getAllSuppliers = async (req, res, next) => {
  const page = Number.parseInt(req.query.page) || 1;
  const limit = Number.parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await User.findAndCountAll({
      where: { role: "Supplier" },
      attributes: { exclude: ["password"] },
      include: [
        {
          model: SupplierDetails,
          attributes: [
            "vehicleType",
            "serviceArea",
            "rating",
            "totalDeliveries",
            "isAvailable",
            "status",
          ],
        },
      ],
      offset,
      limit,
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        message: "Suppliers fetched successfully",
        data: rows,
        pagination: {
          totalSuppliers: count,
          totalPages,
          currentPage: page,
          pageSize: rows.length,
        },
      },
    });
  } catch (error) {
    console.error(error);
    next(createError(500, "Server error while fetching suppliers"));
  }
};

module.exports = {
  getSupplierProfile,
  registerSupplier,
  updateSupplierDetails,
  updateCurrentLocation,
  getAvailableDeliveries,
  acceptDelivery,
  updateDeliveryStatus,
  getActiveDeliveries,
  getDeliveryHistory,
  getAllSuppliers,
};
