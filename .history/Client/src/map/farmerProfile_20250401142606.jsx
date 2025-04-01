import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Phone,
  Mail,
  MapPin,
  Star,
  ArrowLeft,
  Send,
  Edit,
  Trash2,
} from "lucide-react";
import Navigation from "../UI/navigation";
import socketService from "../services/socketService";
import {
  fetchFarmerReviews,
  fetchFarmerRating,
  updateReview,
  deleteReview,
  resetSubmitStatus,
} from "../Redux/slice/reviewSlice";

// Set your server's base URL
const SERVER_URL = "http://localhost:8000";

const FarmerProfile = () => {
  const { id: farmerId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Debug the Redux store structure
  const reduxState = useSelector((state) => state);
  console.log("Redux state structure:", reduxState);

  // FIXED: Get userInfo instead of currentUser from Redux state
  const { userInfo, accessToken } = useSelector((state) => state.user || {});
  console.log("User info:", userInfo); // Debug user info
  console.log("Access token:", accessToken ? "Present" : "Missing"); // Debug token

  // Use a safe selector with default values to prevent destructuring errors
  const {
    reviews = [],
    rating = { averageRating: 0, totalReviews: 0 },
    loading = false,
    error = null,
    submitLoading = false,
    submitError = null,
    submitSuccess = false,
  } = useSelector((state) => state.review || {}); // FIXED: Changed from reviews to review

  console.log("Reviews:", reviews); // Debug reviews

  const { farmersList = [], loading: farmersLoading = false } = useSelector(
    (state) => state.user || {}
  );

  // Local state
  const [farmer, setFarmer] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [editingReview, setEditingReview] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [apiSubmitError, setApiSubmitError] = useState(null);

  // Find farmer from Redux state or fetch individually
  useEffect(() => {
    if (farmersList?.length > 0) {
      const foundFarmer = farmersList.find(
        (f) => f.id === Number.parseInt(farmerId)
      );
      if (foundFarmer) {
        setFarmer(foundFarmer);
      } else {
        fetchFarmerDetails();
      }
    } else if (!farmersLoading) {
      fetchFarmerDetails();
    }
  }, [farmerId, farmersList, farmersLoading]);

  // Fetch farmer details if not in Redux state
  const fetchFarmerDetails = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/users/${farmerId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch farmer details");
      }
      const data = await response.json();
      if (data.IsSuccess && data.Result.user_data) {
        setFarmer(data.Result.user_data);
      }
    } catch (error) {
      console.error("Error fetching farmer:", error);
    }
  };

  // Fetch reviews and rating
  useEffect(() => {
    if (farmerId) {
      dispatch(fetchFarmerReviews(farmerId));
      dispatch(fetchFarmerRating(farmerId));
    }
  }, [dispatch, farmerId]);

  // Socket.io for real-time reviews
  useEffect(() => {
    if (farmerId) {
      // Join the farmer's review room
      socketService.joinFarmerReviewRoom(farmerId);
    }

    return () => {
      // Leave the room when component unmounts
      if (farmerId) {
        socketService.leaveFarmerReviewRoom(farmerId);
      }
    };
  }, [farmerId]);

  // Reset submit status when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetSubmitStatus());
    };
  }, [dispatch]);

  // Handle rating change
  const handleRatingChange = (rating) => {
    if (editingReview) {
      setEditingReview({ ...editingReview, rating });
    } else {
      setNewReview({ ...newReview, rating });
    }
  };

  // Handle comment change
  const handleCommentChange = (e) => {
    if (editingReview) {
      setEditingReview({ ...editingReview, comment: e.target.value });
    } else {
      setNewReview({ ...newReview, comment: e.target.value });
    }
  };

  // Direct API call for review submission
  const submitReviewDirectly = async (reviewData) => {
    try {
      setApiSubmitError(null);

      // Get token from localStorage or Redux state
      const token = localStorage.getItem("accessToken") || accessToken;

      if (!token) {
        setApiSubmitError(
          "Authentication token is missing. Please log in again."
        );
        return false;
      }

      console.log(
        "Submitting review with token:",
        token.substring(0, 15) + "..."
      );
      console.log("Review data:", reviewData);

      const response = await fetch(`${SERVER_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Review submission failed:", data);
        setApiSubmitError(data.ErrorMessage || "Failed to submit review");
        return false;
      }

      console.log("Review submitted successfully:", data);

      // Refresh reviews
      dispatch(fetchFarmerReviews(farmerId));
      dispatch(fetchFarmerRating(farmerId));

      return true;
    } catch (error) {
      console.error("Error submitting review:", error);
      setApiSubmitError("An unexpected error occurred. Please try again.");
      return false;
    }
  };

  // Handle form submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!userInfo) {
      navigate("/login", { state: { from: `/farmer/${farmerId}` } });
      return;
    }

    if (editingReview) {
      dispatch(
        updateReview({
          reviewId: editingReview.id,
          reviewData: {
            rating: editingReview.rating,
            comment: editingReview.comment,
          },
        })
      ).then(() => {
        setEditingReview(null);
      });
    } else {
      // Prepare review data
      const reviewData = {
        farmerId,
        userId: userInfo.id,
        rating: newReview.rating,
        comment: newReview.comment,
      };

      console.log("Submitting review:", reviewData);

      // Try direct API call instead of using Redux
      const success = await submitReviewDirectly(reviewData);

      if (success) {
        setNewReview({ rating: 5, comment: "" });
        setShowReviewForm(false);
      }
    }
  };

  // Start editing a review
  const handleEditReview = (review) => {
    setEditingReview(review);
    setNewReview({ rating: 5, comment: "" }); // Reset new review form
    setShowReviewForm(false);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingReview(null);
  };

  // Delete review
  const handleDeleteReview = (reviewId) => {
    dispatch(deleteReview(reviewId)).then(() => {
      setShowDeleteConfirm(null);
    });
  };

  // Check if current user has already reviewed this farmer
  const hasUserReviewed = () => {
    if (!userInfo) return false;

    // More robust check for user reviews
    const userHasReviewed = reviews.some((review) => {
      // Check both userId and user.id if available
      const reviewUserId = review.userId || (review.user && review.user.id);
      return reviewUserId === userInfo.id;
    });

    console.log("User has reviewed:", userHasReviewed); // Debug
    return userHasReviewed;
  };

  // Find the current user's review
  const findUserReview = () => {
    if (!userInfo) return null;

    return reviews.find((review) => {
      // Check both userId and user.id if available
      const reviewUserId = review.userId || (review.user && review.user.id);
      return reviewUserId === userInfo.id;
    });
  };

  // Force show review button for debugging
  const handleForceShowReviewForm = () => {
    setShowReviewForm(true);
  };

  if (farmersLoading || !farmer) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navigation />
        </div>
        <div
          className="container mx-auto px-4 py-8 flex justify-center items-center"
          style={{ minHeight: "calc(100vh - 80px)" }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  // Check if user is a buyer
  const isBuyer =
    userInfo && (userInfo.role === "Buyer" || userInfo.role === "buyer");

  // Check if user should see the review button
  const shouldShowReviewButton =
    isBuyer && !hasUserReviewed() && !editingReview && !showReviewForm;

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navigation />
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <Link
          to="/map"
          className="inline-flex items-center text-green-600 hover:text-green-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Map
        </Link>

        {/* Farmer Profile Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="md:flex">
            <div className="md:w-1/3 p-6 flex flex-col items-center justify-center bg-green-50">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-green-100 flex items-center justify-center border-4 border-green-500 mb-4">
                {farmer.profileImage ? (
                  <img
                    src={`${SERVER_URL}${farmer.profileImage}`}
                    alt={farmer.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <svg
                    className="h-20 w-20 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900">
                {farmer.username}
              </h1>
              <div className="flex items-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={`${
                      i < Math.round(rating.averageRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-lg font-semibold text-gray-700">
                  {rating.averageRating.toFixed(1)}
                </span>
                <span className="ml-1 text-sm text-gray-500">
                  ({rating.totalReviews} reviews)
                </span>
              </div>
            </div>

            <div className="md:w-2/3 p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4">
                Farmer Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-green-600" />
                    <span className="text-gray-700">{farmer.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-green-600" />
                    <span className="text-gray-700">
                      {farmer.contact_number || "No phone number"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-green-600" />
                    <span className="text-gray-700 break-all">
                      {farmer.email}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">About</h3>
                  <p className="text-gray-700">
                    {farmer.bio || "This farmer hasn't added a bio yet."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-green-800">
                Reviews & Feedback
              </h2>

              {/* Debug info - only visible in development */}
              {process.env.NODE_ENV === "development" && (
                <div className="text-xs text-gray-500">
                  <p>Is buyer: {isBuyer ? "Yes" : "No"}</p>
                  <p>Has reviewed: {hasUserReviewed() ? "Yes" : "No"}</p>
                  <p>
                    Should show button: {shouldShowReviewButton ? "Yes" : "No"}
                  </p>
                  <p>Token: {accessToken ? "Present" : "Missing"}</p>
                </div>
              )}

              {/* Add Review Button - Only show if user hasn't reviewed and isn't editing */}
              {shouldShowReviewButton && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Write a Review
                </button>
              )}

              {/* Emergency review button - only visible in development */}
              {process.env.NODE_ENV === "development" &&
                isBuyer &&
                !showReviewForm && (
                  <button
                    onClick={handleForceShowReviewForm}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors flex items-center ml-2"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Force Show Review Form
                  </button>
                )}
            </div>

            {/* Submit Review Form */}
            {userInfo && isBuyer && showReviewForm && !editingReview && (
              <div className="mb-6 border-b pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Leave a Review
                </h3>

                {submitSuccess && !editingReview && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-green-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700">
                          Your review has been submitted successfully!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {apiSubmitError && !editingReview && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{apiSubmitError}</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmitReview}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => handleRatingChange(rating)}
                          className="focus:outline-none mr-1"
                        >
                          <Star
                            size={24}
                            className={`${
                              rating <= newReview.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-500">
                        {newReview.rating} out of 5
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="comment"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Your Review
                    </label>
                    <textarea
                      id="comment"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Share your experience with this farmer..."
                      value={newReview.comment}
                      onChange={handleCommentChange}
                      required
                    ></textarea>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                      disabled={submitLoading}
                    >
                      {submitLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Review
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      onClick={() => setShowReviewForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Edit Review Form */}
            {userInfo && editingReview && (
              <div className="mb-6 border-b pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Edit Your Review
                </h3>

                {submitError && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{submitError}</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmitReview}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => handleRatingChange(rating)}
                          className="focus:outline-none mr-1"
                        >
                          <Star
                            size={24}
                            className={`${
                              rating <= editingReview.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-500">
                        {editingReview.rating} out of 5
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="edit-comment"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Your Review
                    </label>
                    <textarea
                      id="edit-comment"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={editingReview.comment}
                      onChange={handleCommentChange}
                      required
                    ></textarea>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                      disabled={submitLoading}
                    >
                      {submitLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Update Review
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Your Review Section - Show if user has already reviewed */}
            {userInfo && hasUserReviewed() && !editingReview && (
              <div className="mb-6 border-b pb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Your Review
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditReview(findUserReview())}
                      className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                      title="Edit review"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(findUserReview().id)}
                      className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                      title="Delete review"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {findUserReview() && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${
                            i < findUserReview().rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-700">
                        {new Date(
                          findUserReview().createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{findUserReview().comment}</p>

                    {/* Delete confirmation */}
                    {showDeleteConfirm === findUserReview().id && (
                      <div className="mt-3 p-3 bg-red-50 rounded-md border border-red-200">
                        <p className="text-sm text-red-700 mb-2">
                          Are you sure you want to delete your review?
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleDeleteReview(findUserReview().id)
                            }
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                            disabled={submitLoading}
                          >
                            {submitLoading ? "Deleting..." : "Yes, Delete"}
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Reviews List */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Customer Reviews
              </h3>

              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : reviews.length === 0 ? (
                <div className="bg-gray-50 p-4 rounded-md text-center">
                  <p className="text-gray-600">
                    No reviews yet. Be the first to leave a review!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b pb-4 last:border-b-0 last:pb-0"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start">
                          <div className="mr-3">
                            {review.user?.profileImage ? (
                              <img
                                src={`${SERVER_URL}${review.user.profileImage}`}
                                alt={review.user.username}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <svg
                                  className="h-6 w-6 text-gray-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {review.user.username || "Anonymous"}
                            </h4>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={`${
                                    i < review.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-2">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>

                          {/* Edit/Delete buttons for user's own review */}
                          {userInfo && userInfo.id === review.userId && (
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleEditReview(review)}
                                className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                                title="Edit review"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(review.id)}
                                className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                                title="Delete review"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="mt-2 text-gray-700">{review.comment}</p>

                      {/* Delete confirmation */}
                      {showDeleteConfirm === review.id && (
                        <div className="mt-2 p-3 bg-red-50 rounded-md">
                          <p className="text-sm text-red-700 mb-2">
                            Are you sure you want to delete this review?
                          </p>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDeleteReview(review.id)}
                              className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                              disabled={submitLoading}
                            >
                              {submitLoading ? "Deleting..." : "Yes, Delete"}
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;
