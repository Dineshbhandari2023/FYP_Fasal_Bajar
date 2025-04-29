const express = require("express");
const router = express.Router();
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
  getFarmerOrders,
} = require("../Controllers/orderController");
const { authMiddleWare } = require("../Util/jwt");
router.post("/", authMiddleWare, createOrder);

router.post("/:orderId/payment", authMiddleWare, processPayment);
router.get("/myorders", authMiddleWare, getMyOrders);
router.get("/pending-items", authMiddleWare, getPendingOrderItems);
router.get("/stats", authMiddleWare, getOrderStats);
router.patch("/:id/status", authMiddleWare, updateOrderStatus);
router.patch("/items/:itemId/status", authMiddleWare, updateOrderItemStatus);

router.get("/payment/success", authMiddleWare, handlePaymentSuccess);
router.get("/payment/failure", authMiddleWare, handlePaymentFailure);
router.get("/farmer-orders", authMiddleWare, getFarmerOrders);

module.exports = router;
