import { useEffect, useState } from "react";
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
import StartChatButton from "../chat/startChatButton";
import socketService from "../services/socketService";
import {
  submitReview,
  fetchFarmerReviews,
  fetchFarmerRating,
  updateReview,
  deleteReview,
  resetSubmitStatus,
} from "../Redux/slice/reviewSlice";

const SERVER_URL = "http://localhost:8000";

const FarmerProfile = () => {
  const { id: farmerId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user || {});
  const {
    reviews = [],
    rating = { averageRating: 0, totalReviews: 0 },
    loading = false,
    error = null,
    submitLoading = false,
    submitError = null,
    submitSuccess = false,
  } = useSelector((state) => state.reviews || {});
  const { farmersList = [], loading: farmersLoading = false } = useSelector(
    (state) => state.user || {}
  );

  const [farmer, setFarmer] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [apiError, setApiError] = useState(null);

  const isBuyer = userInfo && userInfo.role.toLowerCase() === "buyer";
  const hasReviewed = reviews.some((review) => review.userId === userInfo?.id);
  const shouldShowReviewButton = isBuyer && !hasReviewed && !editingReviewId;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login", { state: { from: `/farmer/${farmerId}` } });
      return;
    }

    if (farmersList.length > 0) {
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
  }, [farmerId, farmersList, farmersLoading, navigate, userInfo]);

  const fetchFarmerDetails = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Authentication token not found");

      const response = await fetch(`${SERVER_URL}/users/${farmerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.ErrorMessage || "Failed to fetch farmer details"
        );
      }

      const data = await response.json();
      if (data.IsSuccess && data.Result.user_data) {
        setFarmer(data.Result.user_data);
      } else {
        throw new Error("Invalid farmer data");
      }
    } catch (error) {
      console.error("Error fetching farmer:", error);
      setApiError(error.message);
    }
  };

  useEffect(() => {
    if (farmerId) {
      dispatch(fetchFarmerReviews(farmerId));
      dispatch(fetchFarmerRating(farmerId));
      socketService.joinFarmerReviewRoom(farmerId);
    }

    return () => {
      dispatch(resetSubmitStatus());
      if (farmerId) socketService.leaveFarmerReviewRoom(farmerId);
    };
  }, [dispatch, farmerId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!isBuyer) {
      setApiError("Only buyers can submit reviews");
      return;
    }

    if (!newReview.rating || newReview.rating < 1 || newReview.rating > 5) {
      setApiError("Please select a rating between 1 and 5");
      return;
    }

    const reviewData = {
      entityId: farmerId,
      entityType: "Farmer",
      rating: parseInt(newReview.rating, 10),
      comment: newReview.comment || "",
    };

    try {
      if (editingReviewId) {
        await dispatch(
          updateReview({ reviewId: editingReviewId, reviewData })
        ).unwrap();
      } else {
        await dispatch(submitReview(reviewData)).unwrap();
      }
    } catch (error) {
      setApiError(error || "Failed to submit review");
    }
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review.id);
    setNewReview({ rating: review.rating, comment: review.comment || "" });
    setShowReviewForm(true);
  };

  const handleDeleteReview = (reviewId) => {
    dispatch(deleteReview(reviewId));
    setShowDeleteConfirm(null);
  };

  const handleStarClick = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  const handleCancelReview = () => {
    setNewReview({ rating: 0, comment: "" });
    setEditingReviewId(null);
    setShowReviewForm(false);
    setApiError(null);
  };

  useEffect(() => {
    if (submitSuccess) {
      setNewReview({ rating: 0, comment: "" });
      setEditingReviewId(null);
      setShowReviewForm(false);
      dispatch(resetSubmitStatus());
    }
  }, [submitSuccess, dispatch]);

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

  if (apiError && !farmer) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navigation />
        </div>
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Error</h2>
          <p className="mt-2 text-gray-600">{apiError}</p>
          <Link
            to="/map"
            className="mt-4 inline-flex items-center text-green-600 hover:text-green-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Map
          </Link>
        </div>
      </div>
    );
  }

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
              <div className="mt-4 w-full">
                <StartChatButton farmerId={farmerId} className="w-full py-3" />
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
                    <span className="text-gray-700">
                      {farmer.location || "Not provided"}
                    </span>
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
                      {farmer.email || "Not provided"}
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
              <div className="mt-6">
                <a
                  href={`tel:${farmer.contact_number}`}
                  className="w-full py-2 sm:py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Contact Farmer
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-green-800">
                Reviews & Feedback
              </h2>
              {shouldShowReviewButton && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Write a Review
                </button>
              )}
            </div>

            {showReviewForm && (
              <div className="mb-6 bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingReviewId ? "Edit Your Review" : "Write a Review"}
                </h3>
                <form onSubmit={handleSubmitReview}>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-6 w-6 cursor-pointer ${
                            i < newReview.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                          onClick={() => handleStarClick(i + 1)}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">
                        {newReview.rating || "Select"} / 5
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comment (optional)
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows={4}
                      placeholder="Share your experience with this farmer..."
                      value={newReview.comment}
                      onChange={(e) =>
                        setNewReview((prev) => ({
                          ...prev,
                          comment: e.target.value,
                        }))
                      }
                    />
                  </div>
                  {(submitError || apiError) && (
                    <p className="mt-2 text-red-600">
                      {submitError || apiError}
                    </p>
                  )}
                  {submitSuccess && (
                    <p className="mt-2 text-green-600">
                      Review submitted successfully!
                    </p>
                  )}
                  <div className="mt-4 flex space-x-3">
                    <button
                      type="submit"
                      className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ${
                        submitLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={submitLoading}
                    >
                      {submitLoading
                        ? "Submitting..."
                        : editingReviewId
                        ? "Update Review"
                        : "Submit Review"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelReview}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Customer Reviews
              </h3>
              {error && <p className="mt-2 text-red-600">Error: {error}</p>}
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
                      className="border-b pb-4 last:border-b-0"
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
                      <p className="mt-2 text-gray-700">
                        {review.comment || "No comment"}
                      </p>
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
