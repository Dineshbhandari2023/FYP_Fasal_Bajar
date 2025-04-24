const express = require("express");
const router = express.Router();

// Import order controller functions
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
  updateOrderItemStatus,
  getPendingOrderItems,
  processPayment,
  handlePaymentFailure,
  handlePaymentSuccess,
} = require("../Controllers/orderController");

// Import auth middleware to protect routes
const { authMiddleWare } = require("../Util/jwt");

// Create a new order (protected route)
router.post("/", authMiddleWare, createOrder);

//Route to process online payment
// router.post("/process-payment", authMiddleWare, processPayment);
router.post("/:id/payment", authMiddleWare, processPayment);

// Get all orders for the current user (protected route)
router.get("/myorders", authMiddleWare, getMyOrders);

// Get pending order items for farmers
router.get("/pending-items", authMiddleWare, getPendingOrderItems);

// Get order statistics (for farmers)
router.get("/stats", authMiddleWare, getOrderStats);

// Get a specific order by ID (protected route)
router.get("/:id", authMiddleWare, getOrderById);

// Update order status (protected route)
router.patch("/:id/status", authMiddleWare, updateOrderStatus);

// Update order item status (for farmers to accept/decline)
router.patch("/items/:itemId/status", authMiddleWare, updateOrderItemStatus);

router.get("/payment/success", authMiddleWare, handlePaymentSuccess);
router.get("/payment/failure", authMiddleWare, handlePaymentFailure);

module.exports = router;
