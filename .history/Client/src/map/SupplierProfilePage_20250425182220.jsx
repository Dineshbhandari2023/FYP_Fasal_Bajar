import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSupplierReviews,
  fetchSupplierRating,
  submitReview,
  updateReview,
  deleteReview,
  resetSubmitStatus,
} from "../Redux/slice/reviewSlice";
import Navigation from "../components/Navigation";
import { ArrowLeft, Star } from "lucide-react";
import StartChatButton from "../chat/StartChatButton";

const SERVER_URL = "http://localhost:8000";

const SupplierProfilePage = () => {
  const { id: supplierId } = useParams();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const {
    reviews,
    rating,
    loading: reviewsLoading,
    error: reviewsError,
    submitLoading,
    submitError,
    submitSuccess,
  } = useSelector((state) => state.reviews);

  const [supplier, setSupplier] = useState(null);
  const [apiSubmitError, setApiSubmitError] = useState(null);
  const [suppliersLoading, setSuppliersLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const isBuyer =
    userInfo && (userInfo.role === "Buyer" || userInfo.role === "buyer");
  const hasReviewed = reviews.some((review) => review.userId === userInfo?.id);
  const shouldShowReviewButton = isBuyer && !hasReviewed;

  const fetchSupplierDetails = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/users/${supplierId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.ErrorMessage || "Failed to fetch supplier details"
        );
      }
      const data = await response.json();
      if (data.IsSuccess && data.Result.user_data) {
        setSupplier(data.Result.user_data);
      } else {
        throw new Error("Invalid supplier data");
      }
    } catch (error) {
      console.error("Error fetching supplier:", error);
      setApiSubmitError(error.message);
    } finally {
      setSuppliersLoading(false);
    }
  };

  useEffect(() => {
    if (supplierId) {
      fetchSupplierDetails();
      dispatch(fetchSupplierReviews(supplierId));
      dispatch(fetchSupplierRating(supplierId));
    }
    return () => {
      dispatch(resetSubmitStatus());
    };
  }, [dispatch, supplierId]);

  const handleReviewSubmit = () => {
    if (!isBuyer) return;
    if (!newReview.rating || newReview.rating < 1 || newReview.rating > 5) {
      setApiSubmitError("Please select a rating between 1 and 5");
      return;
    }

    const reviewData = {
      entityId: supplierId,
      entityType: "Supplier",
      rating: newReview.rating,
      comment: newReview.comment,
    };

    if (editingReviewId) {
      dispatch(updateReview({ reviewId: editingReviewId, reviewData }));
    } else {
      dispatch(submitReview(reviewData));
    }
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review.id);
    setNewReview({ rating: review.rating, comment: review.comment });
    setShowReviewForm(true);
  };

  const handleDeleteReview = (reviewId) => {
    dispatch(deleteReview(reviewId));
  };

  const handleStarClick = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  const handleForceShowReviewForm = () => {
    setShowReviewForm(true);
  };

  useEffect(() => {
    if (submitSuccess) {
      setNewReview({ rating: 0, comment: "" });
      setEditingReviewId(null);
      setShowReviewForm(false);
      dispatch(resetSubmitStatus());
    }
  }, [submitSuccess, dispatch]);

  if (suppliersLoading || reviewsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navigation />
        </div>
        <div
          className="container mx-auto px-4 py-8 flex justify-center items-center"
          style={{ minHeight: "calc(100vh - 80px)" }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (apiSubmitError || reviewsError) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navigation />
        </div>
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Error</h2>
          <p className="mt-2 text-gray-600">{apiSubmitError || reviewsError}</p>
          <Link
            to="/map"
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Map
          </Link>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navigation />
        </div>
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Supplier Not Found
          </h2>
          <p className="mt-2 text-gray-600">
            The supplier you are looking for does not exist.
          </p>
          <Link
            to="/map"
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Map
          </Link>
        </div>
      </div>
    );
  }

  const userReview = reviews.find((review) => review.userId === userInfo?.id);

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navigation />
      </div>
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/map"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Map
        </Link>

        <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                {supplier.username.charAt(0).toUpperCase()}
              </div>
              <div className="ml-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {supplier.username}
                </h1>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-400 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.round(rating.averageRating)
                            ? "fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </span>
                  <span className="ml-2 text-gray-600">
                    {rating.averageRating.toFixed(1)} ({rating.totalReviews}{" "}
                    reviews)
                  </span>
                </div>
                <div className="mt-4 flex space-x-2">
                  <StartChatButton
                    supplierId={supplierId}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  />
                  <button className="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 flex items-center">
                    Message Supplier
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6 flex-1">
              <h2 className="text-xl font-semibold text-gray-900">
                Supplier Information
              </h2>
              <div className="mt-2 text-gray-600">
                <p>📍 {supplier.location || "26.456883,27.264608"}</p>
                <p>📞 {supplier.phone || "9855674323"}</p>
                <p>📧 {supplier.email || "testsupplier@gmail.com"}</p>
                <p>🚛 Vehicle: {supplier.vehicle || "truck_large"}</p>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900">About</h3>
                <p className="mt-1 text-gray-600">
                  {supplier.bio || "This supplier hasn't added a bio yet."}
                </p>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Service Area
                </h3>
                <p className="mt-1 text-gray-600">
                  {supplier.serviceArea || "Itahari"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Reviews & Feedback
            </h2>
            <div className="mt-2">
              <p>Is buyer: {isBuyer ? "Yes" : "No"}</p>
              <p>Has reviewed: {hasReviewed ? "Yes" : "No"}</p>
              <p>Should show button: {shouldShowReviewButton ? "Yes" : "No"}</p>
            </div>
            {(shouldShowReviewButton || showReviewForm) && (
              <div className="mt-4">
                {!showReviewForm && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2"
                  >
                    Write a Review
                  </button>
                )}
                <button
                  onClick={handleForceShowReviewForm}
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                >
                  Force Show Review Form
                </button>
              </div>
            )}

            {showReviewForm && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingReviewId ? "Edit Your Review" : "Write a Review"}
                </h3>
                <div className="flex items-center mt-2">
                  <span className="mr-2">Rating:</span>
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
                </div>
                <textarea
                  className="mt-4 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Write your review here..."
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                />
                {submitError && (
                  <p className="mt-2 text-red-600">{submitError}</p>
                )}
                <button
                  onClick={handleReviewSubmit}
                  disabled={submitLoading}
                  className={`mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                    submitLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {submitLoading
                    ? "Submitting..."
                    : editingReviewId
                    ? "Update Review"
                    : "Submit Review"}
                </button>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Customer Reviews
              </h3>
              {reviews.length === 0 ? (
                <p className="mt-2 text-gray-600">
                  No reviews yet. Be the first to leave a review!
                </p>
              ) : (
                <div className="mt-4 space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b pb-4 last:border-b-0"
                    >
                      <div className="flex items-start">
                        <img
                          src={
                            review.user.profileImage || "/default-profile.png"
                          }
                          alt={review.user.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">
                                {review.user.username}
                              </p>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            {review.userId === userInfo?.id && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditReview(review)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteReview(review.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                          <p className="mt-2 text-gray-600">{review.comment}</p>
                          <p className="mt-1 text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
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

export default SupplierProfilePage;
