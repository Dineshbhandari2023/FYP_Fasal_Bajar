const express = require("express");
const router = express.Router();
const { authMiddleWare } = require("../Util/jwt");
const {
  createReview,
  getFarmerReviews,
  getSupplierReviews,
  updateReview,
  deleteReview,
  getFarmerRating,
  getSupplierRating,
} = require("../Controllers/reviewController");

// Public routes
router.get("/farmer/:farmerId", getFarmerReviews);
router.get("/farmer/:farmerId/rating", getFarmerRating);
router.get("/supplier/:supplierId", getSupplierReviews);
router.get("/supplier/:supplierId/rating", getSupplierRating);

// Protected routes
router.use(authMiddleWare);
router.post("/", createReview);
router.put("/:reviewId", updateReview);
router.delete("/:reviewId", deleteReview);

module.exports = router;
