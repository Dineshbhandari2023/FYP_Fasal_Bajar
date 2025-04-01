const express = require("express");
const router = express.Router();

// Import review controller functions
const {
  createReview,
  getFarmerReviews,
  updateReview,
  deleteReview,
  getFarmerRating,
} = require("../Controllers/reviewController");

// Import auth middleware to protect routes
const { authMiddleWare } = require("../Util/jwt");

// Public routes
router.get("/farmer/:farmerId", getFarmerReviews);
router.get("/farmer/:farmerId/rating", getFarmerRating);

// Protected routes (requires token)
router.post("/", authMiddleWare, createReview);
router.put("/:reviewId", authMiddleWare, updateReview);
router.delete("/:reviewId", authMiddleWare, deleteReview);

module.exports = router;
