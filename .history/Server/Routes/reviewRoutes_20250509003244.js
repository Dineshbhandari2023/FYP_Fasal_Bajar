const express = require("express");
const router = express.Router();
const {
  createReview,
  getFarmerReviews,
  updateReview,
  deleteReview,
  getFarmerRating,
} = require("../Controllers/reviewController");
const { authMiddleWare } = require("../Util/jwt");

router.get("/farmer/:farmerId", getFarmerReviews);
router.get("/farmer/:farmerId/rating", getFarmerRating);
router.post("/", authMiddleWare, createReview);
router.put("/:reviewId", authMiddleWare, updateReview);
router.delete("/:reviewId", authMiddleWare, deleteReview);

module.exports = router;
