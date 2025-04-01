const createError = require("http-errors");
const Review = require("../Models/review");
const User = require("../Models/user");
const { Op } = require("sequelize");

// Create a new review
// const createReview = async (req, res, next) => {
//   try {
//     const { farmerId, rating, comment } = req.body;

//     // Make sure we have a valid user ID from authentication
//     if (!req.user || !req.user.id) {
//       return next(createError(401, "Authentication required"));
//     }

//     const userId = req.user.id;

//     console.log("Creating review with data:", {
//       farmerId,
//       userId,
//       rating,
//       comment,
//     });

//     if (!farmerId || !rating) {
//       return next(createError(400, "Farmer ID and rating are required"));
//     }

//     // Validate rating
//     if (rating < 1 || rating > 5) {
//       return next(createError(400, "Rating must be between 1 and 5"));
//     }

//     // Check if farmer exists - convert farmerId to number to ensure consistent comparison
//     const farmerIdNum = Number.parseInt(farmerId, 10);
//     const farmer = await User.findOne({
//       where: { id: farmerIdNum, role: "Farmer" },
//     });

//     if (!farmer) {
//       return next(createError(404, "Farmer not found"));
//     }

//     // Check if user is trying to review themselves
//     if (userId === farmerIdNum) {
//       return next(createError(400, "You cannot review yourself"));
//     }

//     // Check if user has already reviewed this farmer
//     const existingReview = await Review.findOne({
//       where: {
//         userId,
//         farmerId: farmerIdNum,
//       },
//     });

//     if (existingReview) {
//       return next(createError(400, "You have already reviewed this farmer"));
//     }

//     // Create the review - ensure all values are properly typed
//     const newReview = await Review.create({
//       rating: Number.parseInt(rating, 10),
//       comment: comment || "",
//       farmerId: farmerIdNum,
//       userId: userId,
//     });

//     console.log("Review created:", newReview.toJSON());

//     // Get the user info to include in the response
//     const user = await User.findByPk(userId, {
//       attributes: ["id", "username", "profileImage"],
//     });

//     // Prepare the review object with user data
//     const reviewWithUser = {
//       ...newReview.toJSON(),
//       user,
//     };

//     // Emit socket event for real-time updates using the review socket handler
//     const reviewSocket = req.app.get("reviewSocket");
//     if (reviewSocket) {
//       reviewSocket.emitNewReview(farmerIdNum, reviewWithUser);
//       reviewSocket.notifyReviewAuthor(userId, "review_submitted", {
//         message: "Your review has been submitted successfully",
//         review: reviewWithUser,
//       });
//     }

//     res.status(201).json({
//       StatusCode: 201,
//       IsSuccess: true,
//       ErrorMessage: [],
//       Result: {
//         message: "Review submitted successfully",
//         review: reviewWithUser,
//       },
//     });
//   } catch (error) {
//     console.error("Error creating review:", error);
//     next(createError(500, "Server error while creating review"));
//   }
// };

const createReview = async (req, res, next) => {
  try {
    const { farmerId, rating, comment, userId } = req.body;

    // Log the request body and user from auth middleware
    console.log("Review request body:", req.body);
    console.log(
      "User from auth middleware:",
      req.user
        ? {
            id: req.user.id,
            username: req.user.username,
            role: req.user.role,
          }
        : "No user"
    );

    // Use userId from request body if provided, otherwise use from auth
    const reviewUserId = userId || (req.user && req.user.id);

    if (!reviewUserId) {
      console.error("No user ID available for review");
      return next(createError(401, "Authentication required"));
    }

    console.log("Creating review with data:", {
      farmerId,
      userId: reviewUserId,
      rating,
      comment,
    });

    if (!farmerId || !rating) {
      return next(createError(400, "Farmer ID and rating are required"));
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return next(createError(400, "Rating must be between 1 and 5"));
    }

    // Check if farmer exists - convert farmerId to number to ensure consistent comparison
    const farmerIdNum = Number.parseInt(farmerId, 10);
    const farmer = await User.findOne({
      where: { id: farmerIdNum, role: "Farmer" },
    });

    if (!farmer) {
      return next(createError(404, "Farmer not found"));
    }

    // Check if user is trying to review themselves
    if (reviewUserId === farmerIdNum) {
      return next(createError(400, "You cannot review yourself"));
    }

    // Check if user has already reviewed this farmer
    const existingReview = await Review.findOne({
      where: {
        userId: reviewUserId,
        farmerId: farmerIdNum,
      },
    });

    if (existingReview) {
      return next(createError(400, "You have already reviewed this farmer"));
    }

    // Create the review with explicit field mapping
    const newReview = await Review.create({
      rating: Number.parseInt(rating, 10),
      comment: comment || "",
      farmerId: farmerIdNum,
      userId: reviewUserId, // Make sure this is set correctly
    });

    console.log("Review created successfully:", newReview.toJSON());

    // Get the user info to include in the response
    const user = await User.findByPk(reviewUserId, {
      attributes: ["id", "username", "profileImage"],
    });

    // Prepare the review object with user data
    const reviewWithUser = {
      ...newReview.toJSON(),
      user,
    };

    // Emit socket event for real-time updates using the review socket handler
    const reviewSocket = req.app.get("reviewSocket");
    if (reviewSocket) {
      reviewSocket.emitNewReview(farmerIdNum, reviewWithUser);
      reviewSocket.notifyReviewAuthor(reviewUserId, "review_submitted", {
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
    const farmerIdNum = Number.parseInt(farmerId, 10);

    // Check if farmer exists
    // const farmer = await User.findOne({
    //   where: { id: farmerIdNum, role: "Farmer" },
    // });

    console.log("Farmer ID:", farmerIdNum);
    const farmer = await User.findOne({
      where: { id: farmerIdNum, role: "Farmer" },
    });
    console.log("Fetched Farmer:", farmer);

    if (!farmer) {
      return next(createError(404, "Farmer not found"));
    }

    // Get all reviews for this farmer
    const reviews = await Review.findAll({
      where: { farmerId: farmerIdNum },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "profileImage", "role"],
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

    if (!req.user || !req.user.id) {
      return next(createError(401, "Authentication required"));
    }

    const userId = req.user.id;

    // Find the review
    const review = await Review.findByPk(reviewId);

    if (!review) {
      return next(createError(404, "Review not found"));
    }

    // Check if the user is the owner of the review
    if (review.userId !== userId) {
      return next(createError(403, "You can only update your own reviews"));
    }

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return next(createError(400, "Rating must be between 1 and 5"));
    }

    // Update the review
    await review.update({
      rating:
        rating !== undefined ? Number.parseInt(rating, 10) : review.rating,
      comment: comment !== undefined ? comment : review.comment,
    });

    // Get the updated review with user info
    const updatedReview = await Review.findByPk(reviewId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "profileImage"],
        },
      ],
    });

    // Emit socket event for real-time updates
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

    if (!req.user || !req.user.id) {
      return next(createError(401, "Authentication required"));
    }

    const userId = req.user.id;

    // Find the review
    const review = await Review.findByPk(reviewId);

    if (!review) {
      return next(createError(404, "Review not found"));
    }

    // Check if the user is the owner of the review or an admin
    if (review.userId !== userId && req.user.role !== "Admin") {
      return next(createError(403, "You can only delete your own reviews"));
    }

    const farmerId = review.farmerId;

    // Delete the review
    await review.destroy();

    // Emit socket event for real-time updates
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
    const farmerIdNum = Number.parseInt(farmerId, 10);

    // Check if farmer exists
    const farmer = await User.findOne({
      where: { id: farmerIdNum, role: "Farmer" },
    });

    if (!farmer) {
      return next(createError(404, "Farmer not found"));
    }

    // Get all ratings for this farmer
    const reviews = await Review.findAll({
      where: { farmerId: farmerIdNum },
      attributes: ["rating"],
    });

    // Calculate average rating
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
