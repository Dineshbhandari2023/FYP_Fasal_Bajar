const express = require("express");
const router = express.Router();

const {
  createReview,
  getFarmerReviews,
  getSupplierReviews,
  updateReview,
  deleteReview,
  getFarmerRating,
  getSupplierRating,
} = require("../Controllers/reviewController");

const { authMiddleWare } = require("../Util/jwt");

// Public routes
router.get("/farmer/:farmerId", getFarmerReviews);
router.get("/farmer/:farmerId/rating", getFarmerRating);
router.get("/supplier/:supplierId", getSupplierReviews);
router.get("/supplier/:supplierId/rating", getSupplierRating);

// Protected routes (requires token)
router.post("/", authMiddleWare, createReview);
router.put("/:reviewId", authMiddleWare, updateReview);
router.delete("/:reviewId", authMiddleWare, deleteReview);

module.exports = router;
