const createError = require("http-errors");
const { Review, User } = require("../Models");
const { Op } = require("sequelize");

// Create a new review
const createReview = async (req, res, next) => {
  try {
    const { farmerId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!farmerId || !rating) {
      return next(createError(400, "Farmer ID and rating are required"));
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return next(createError(400, "Rating must be between 1 and 5"));
    }

    // Check if farmer exists
    const farmer = await User.findOne({
      where: { id: farmerId, role: "Farmer" },
    });

    if (!farmer) {
      return next(createError(404, "Farmer not found"));
    }

    // Check if user is trying to review themselves
    if (userId === Number.parseInt(farmerId)) {
      return next(createError(400, "You cannot review yourself"));
    }

    // Check if user has already reviewed this farmer
    const existingReview = await Review.findOne({
      where: { userId, farmerId },
    });

    if (existingReview) {
      return next(createError(400, "You have already reviewed this farmer"));
    }

    // Create the review
    const newReview = await Review.create({
      rating,
      comment,
      farmerId,
      userId,
    });

    // Get the user info to include in the response
    const user = await User.findByPk(userId, {
      attributes: ["id", "username", "profileImage"],
    });

    const reviewWithUser = {
      ...newReview.toJSON(),
      user,
    };

    // Emit socket event for real-time updates
    const reviewSocket = req.app.get("reviewSocket");
    if (reviewSocket) {
      reviewSocket.emitNewReview(farmerId, reviewWithUser);
      reviewSocket.notifyReviewAuthor(userId, "review_submitted", {
        message: "Your review has been submitted successfully",
        review: reviewWithUser,
      });
    }

    res.status(201).json({
      StatusCode: 201,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        message: "Review submitted successfully",
        review: reviewWithUser,
      },
    });
  } catch (error) {
    console.error("Error creating review:", error);
    next(createError(500, "Server error while creating review"));
  }
};

// Get reviews for a specific farmer
const getFarmerReviews = async (req, res, next) => {
  try {
    const { farmerId } = req.params;

    // Check if farmer exists
    const farmer = await User.findOne({
      where: { id: farmerId, role: "Farmer" },
    });

    if (!farmer) {
      return next(createError(404, "Farmer not found"));
    }

    // Select only the existing fields
    const reviews = await Review.findAll({
      attributes: [
        "id",
        "rating",
        "comment",
        "farmerId",
        "userId",
        "createdAt",
        "updatedAt",
      ],
      where: { farmerId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "profileImage"],
        },
      ],
    });

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        message: "Reviews fetched successfully",
        reviews,
      },
    });
  } catch (error) {
    console.error("Error fetching farmer reviews:", error);
    next(createError(500, "Server error while fetching reviews"));
  }
};

// Update a review
const updateReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findByPk(reviewId);
    if (!review) {
      return next(createError(404, "Review not found"));
    }

    if (review.userId !== userId) {
      return next(createError(403, "You can only update your own reviews"));
    }

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return next(createError(400, "Rating must be between 1 and 5"));
    }

    await review.update({
      rating: rating !== undefined ? rating : review.rating,
      comment: comment !== undefined ? comment : review.comment,
    });

    const updatedReview = await Review.findByPk(reviewId, {
      attributes: [
        "id",
        "rating",
        "comment",
        "farmerId",
        "userId",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "profileImage"],
        },
      ],
    });

    const reviewSocket = req.app.get("reviewSocket");
    if (reviewSocket) {
      reviewSocket.emitUpdatedReview(review.farmerId, updatedReview);
      reviewSocket.notifyReviewAuthor(userId, "review_updated", {
        message: "Your review has been updated successfully",
        review: updatedReview,
      });
    }

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        message: "Review updated successfully",
        review: updatedReview,
      },
    });
  } catch (error) {
    console.error("Error updating review:", error);
    next(createError(500, "Server error while updating review"));
  }
};

// Delete a review
const deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findByPk(reviewId);
    if (!review) {
      return next(createError(404, "Review not found"));
    }

    if (review.userId !== userId && req.user.role !== "Admin") {
      return next(createError(403, "You can only delete your own reviews"));
    }

    const farmerId = review.farmerId;
    await review.destroy();

    const reviewSocket = req.app.get("reviewSocket");
    if (reviewSocket) {
      reviewSocket.emitDeletedReview(farmerId, reviewId);
      reviewSocket.notifyReviewAuthor(userId, "review_deleted", {
        message: "Your review has been deleted successfully",
        reviewId,
      });
    }

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        message: "Review deleted successfully",
      },
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    next(createError(500, "Server error while deleting review"));
  }
};

// Get average rating for a farmer
const getFarmerRating = async (req, res, next) => {
  try {
    const { farmerId } = req.params;
    const farmer = await User.findOne({
      where: { id: farmerId, role: "Farmer" },
    });
    if (!farmer) {
      return next(createError(404, "Farmer not found"));
    }

    const reviews = await Review.findAll({
      attributes: ["rating"],
      where: { farmerId },
    });

    let averageRating = 0;
    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      averageRating = sum / reviews.length;
    }

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        averageRating,
        totalReviews: reviews.length,
      },
    });
  } catch (error) {
    console.error("Error fetching farmer rating:", error);
    next(createError(500, "Server error while fetching rating"));
  }
};

module.exports = {
  createReview,
  getFarmerReviews,
  updateReview,
  deleteReview,
  getFarmerRating,
};
