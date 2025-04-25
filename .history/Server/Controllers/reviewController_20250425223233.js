const createError = require("http-errors");
const Review = require("../Models/review");
const User = require("../Models/user");
const { Op } = require("sequelize");

// const createReview = async (req, res, next) => {
//   try {
//     const { entityId, entityType, rating, comment, userId } = req.body;

//     // Log the request body and user from auth middleware
//     console.log("Review request body:", req.body);
//     console.log(
//       "User from auth middleware:",
//       req.user
//         ? {
//             id: req.user.id,
//             username: req.user.username,
//             role: req.user.role,
//           }
//         : "No user"
//     );

//     // Use userId from request body if provided, otherwise use from auth
//     const reviewUserId = userId || (req.user && req.user.id);

//     if (!reviewUserId) {
//       console.error("No user ID available for review");
//       return next(createError(401, "Authentication required"));
//     }

//     console.log("Creating review with data:", {
//       entityId,
//       entityType,
//       userId: reviewUserId,
//       rating,
//       comment,
//     });

//     if (!entityId || !entityType || !rating) {
//       return next(
//         createError(400, "Entity ID, entity type, and rating are required")
//       );
//     }

//     // Validate entityType
//     if (!["Farmer", "Supplier"].includes(entityType)) {
//       return next(
//         createError(400, "Invalid entity type. Must be 'Farmer' or 'Supplier'")
//       );
//     }

//     // Validate rating
//     if (rating < 1 || rating > 5) {
//       return next(createError(400, "Rating must be between 1 and 5"));
//     }

//     // Check if entity exists - convert entityId to number
//     const entityIdNum = Number.parseInt(entityId, 10);
//     const entity = await User.findOne({
//       where: { id: entityIdNum, role: entityType },
//     });

//     if (!entity) {
//       return next(createError(404, `${entityType} not found`));
//     }

//     // Check if user is trying to review themselves
//     if (reviewUserId === entityIdNum) {
//       return next(createError(400, "You cannot review yourself"));
//     }

//     // Check if user has already reviewed this entity
//     const existingReview = await Review.findOne({
//       where: {
//         userId: reviewUserId,
//         [entityType === "Farmer" ? "farmerId" : "supplierId"]: entityIdNum,
//       },
//     });

//     if (existingReview) {
//       return next(
//         createError(
//           400,
//           `You have already reviewed this ${entityType.toLowerCase()}`
//         )
//       );
//     }

//     // Create the review with explicit field mapping
//     const reviewData = {
//       rating: Number.parseInt(rating, 10),
//       comment: comment || "",
//       userId: reviewUserId,
//     };
//     if (entityType === "Farmer") {
//       reviewData.farmerId = entityIdNum;
//     } else {
//       reviewData.supplierId = entityIdNum;
//     }

//     const newReview = await Review.create(reviewData);

//     console.log("Review created successfully:", newReview.toJSON());

//     // Get the user info to include in the response
//     const user = await User.findByPk(reviewUserId, {
//       attributes: ["id", "username", "profileImage"],
//     });

//     // Prepare the review object with user data
//     const reviewWithUser = {
//       ...newReview.toJSON(),
//       user,
//     };

//     // Emit socket event for real-time updates
//     const reviewSocket = req.app.get("reviewSocket");
//     if (reviewSocket) {
//       reviewSocket.emitNewReview(entityIdNum, reviewWithUser);
//       reviewSocket.notifyReviewAuthor(reviewUserId, "review_submitted", {
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
    const { entityId, entityType, rating, comment, userId } = req.body;

    // Log the request body for debugging
    console.log("Review request body:", req.body);

    // Validate required fields
    if (!entityId || !entityType || rating === undefined) {
      return next(
        createError(400, "Entity ID, entity type, and rating are required")
      );
    }

    // Validate entityId is a number
    const entityIdNum = Number.parseInt(entityId, 10);
    if (isNaN(entityIdNum)) {
      return next(createError(400, "Entity ID must be a valid number"));
    }

    // Validate entityType
    if (!["Farmer", "Supplier"].includes(entityType)) {
      return next(
        createError(400, "Invalid entity type. Must be 'Farmer' or 'Supplier'")
      );
    }

    // Validate rating
    const ratingNum = Number.parseInt(rating, 10);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return next(
        createError(400, "Rating must be an integer between 1 and 5")
      );
    }

    // Determine userId
    const reviewUserId = userId || (req.user && req.user.id);
    if (!reviewUserId) {
      console.error("No user ID available for review");
      return next(createError(401, "Authentication required"));
    }

    // Check if entity exists
    const entity = await User.findOne({
      where: { id: entityIdNum, role: entityType },
    });
    if (!entity) {
      return next(createError(404, `${entityType} not found`));
    }

    // Prevent self-reviews
    if (reviewUserId === entityIdNum) {
      return next(createError(400, "You cannot review yourself"));
    }

    // Check for duplicate reviews
    const existingReview = await Review.findOne({
      where: {
        userId: reviewUserId,
        [entityType === "Farmer" ? "farmerId" : "supplierId"]: entityIdNum,
      },
    });
    if (existingReview) {
      return next(
        createError(
          400,
          `You have already reviewed this ${entityType.toLowerCase()}`
        )
      );
    }

    // Create review
    const reviewData = {
      rating: ratingNum,
      comment: comment || "",
      userId: reviewUserId,
      ...(entityType === "Farmer"
        ? { farmerId: entityIdNum }
        : { supplierId: entityIdNum }),
    };

    const newReview = await Review.create(reviewData);

    // Fetch user info
    const user = await User.findByPk(reviewUserId, {
      attributes: ["id", "username", "profileImage"],
    });

    const reviewWithUser = {
      ...newReview.toJSON(),
      user,
    };

    // Emit socket events
    const reviewSocket = req.app.get("reviewSocket");
    if (reviewSocket) {
      reviewSocket.emitNewReview(entityIdNum, reviewWithUser);
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

const getFarmerReviews = async (req, res, next) => {
  try {
    const { farmerId } = req.params;
    const farmerIdNum = Number.parseInt(farmerId, 10);

    console.log("Farmer ID:", farmerIdNum);
    const farmer = await User.findOne({
      where: { id: farmerIdNum, role: "Farmer" },
    });
    console.log("Fetched Farmer:", farmer);

    if (!farmer) {
      return next(createError(404, "Farmer not found"));
    }

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

const getSupplierReviews = async (req, res, next) => {
  try {
    const { supplierId } = req.params;
    const supplierIdNum = Number.parseInt(supplierId, 10);

    console.log("Supplier ID:", supplierIdNum);
    const supplier = await User.findOne({
      where: { id: supplierIdNum, role: "Supplier" },
    });
    console.log("Fetched Supplier:", supplier);

    if (!supplier) {
      return next(createError(404, "Supplier not found"));
    }

    const reviews = await Review.findAll({
      where: { supplierId: supplierIdNum },
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
    console.error("Error fetching supplier reviews:", error);
    next(createError(500, "Server error while fetching reviews"));
  }
};

const updateReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    if (!req.user || !req.user.id) {
      return next(createError(401, "Authentication required"));
    }

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
      rating:
        rating !== undefined ? Number.parseInt(rating, 10) : review.rating,
      comment: comment !== undefined ? comment : review.comment,
    });

    const updatedReview = await Review.findByPk(reviewId, {
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
      const entityId = updatedReview.farmerId || updatedReview.supplierId;
      reviewSocket.emitUpdatedReview(entityId, updatedReview);
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

const deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    if (!req.user || !req.user.id) {
      return next(createError(401, "Authentication required"));
    }

    const userId = req.user.id;

    const review = await Review.findByPk(reviewId);

    if (!review) {
      return next(createError(404, "Review not found"));
    }

    if (review.userId !== userId && req.user.role !== "Admin") {
      return next(createError(403, "You can only delete your own reviews"));
    }

    const entityId = review.farmerId || review.supplierId;

    await review.destroy();

    const reviewSocket = req.app.get("reviewSocket");
    if (reviewSocket) {
      reviewSocket.emitDeletedReview(entityId, reviewId);
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

const getFarmerRating = async (req, res, next) => {
  try {
    const { farmerId } = req.params;
    const farmerIdNum = Number.parseInt(farmerId, 10);

    const farmer = await User.findOne({
      where: { id: farmerIdNum, role: "Farmer" },
    });

    if (!farmer) {
      return next(createError(404, "Farmer not found"));
    }

    const reviews = await Review.findAll({
      where: { farmerId: farmerIdNum },
      attributes: ["rating"],
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

const getSupplierRating = async (req, res, next) => {
  try {
    const { supplierId } = req.params;
    const supplierIdNum = Number.parseInt(supplierId, 10);

    const supplier = await User.findOne({
      where: { id: supplierIdNum, role: "Supplier" },
    });

    if (!supplier) {
      return next(createError(404, "Supplier not found"));
    }

    const reviews = await Review.findAll({
      where: { supplierId: supplierIdNum },
      attributes: ["rating"],
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
    console.error("Error fetching supplier rating:", error);
    next(createError(500, "Server error while fetching rating"));
  }
};

module.exports = {
  createReview,
  getFarmerReviews,
  getSupplierReviews,
  updateReview,
  deleteReview,
  getFarmerRating,
  getSupplierRating,
};
