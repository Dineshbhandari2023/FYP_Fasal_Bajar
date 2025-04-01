import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Star,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from "lucide-react";
import { fetchFarmerReviews } from "../Redux/slice/reviewSlice";
import socketService from "../services/socketService";

const RecentReviews = () => {
  const dispatch = useDispatch();
  const { userInfo, accessToken } = useSelector((state) => state.user);
  // Provide a default fallback if state.reviews is undefined
  const reviewsState = useSelector((state) => state.reviews) || {
    reviews: [],
    loading: false,
    error: null,
  };
  const { reviews, loading, error } = reviewsState;
  const [expanded, setExpanded] = useState(false);

  // Server URL
  const SERVER_URL = "http://localhost:8000";

  useEffect(() => {
    if (!userInfo || !accessToken) return;
    // Only fetch reviews if the user is a Farmer
    if (userInfo.role !== "Farmer") return;

    // Fetch reviews via Redux thunk
    dispatch(fetchFarmerReviews(userInfo.id));

    // Join the farmer's review room using the socketService
    socketService.joinFarmerReviewRoom(userInfo.id);

    return () => {
      // Leave the review room when the component unmounts
      socketService.leaveFarmerReviewRoom(userInfo.id);
    };
  }, [userInfo, accessToken, dispatch]);

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Render star rating
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        fill={i < rating ? "#FFD700" : "none"}
        color={i < rating ? "#FFD700" : "#D1D5DB"}
      />
    ));
  };

  if (!userInfo || userInfo.role !== "Farmer") {
    return null;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mt-8">
      {/* Header */}
      <div className="bg-[#2A3B2A] text-white p-6">
        <button
          onClick={toggleExpanded}
          className="w-full flex justify-between items-center"
        >
          <h2 className="text-xl font-semibold flex items-center">
            <MessageCircle size={20} className="mr-2" />
            Recent Reviews
          </h2>
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Review list - only show when expanded */}
      {expanded && (
        <div className="p-4">
          {loading ? (
            <div className="p-4 flex justify-center">
              <div className="animate-pulse space-y-4 w-full">
                <div className="h-12 bg-gray-200 rounded w-full"></div>
                <div className="h-12 bg-gray-200 rounded w-full"></div>
                <div className="h-12 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500 flex items-center justify-center">
              <AlertTriangle size={16} className="mr-2" />
              {error}
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              You haven't received any reviews yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {reviews.slice(0, 5).map((review) => (
                <div key={review.id} className="py-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <img
                        src={
                          review.user.profileImage
                            ? `${SERVER_URL}${review.user.profileImage}`
                            : "/placeholder.svg"
                        }
                        alt={review.user.username}
                        className="h-10 w-10 rounded-full mr-3 object-cover"
                      />
                      <div>
                        <p className="font-medium">{review.user.username}</p>
                        <div className="flex mt-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="mt-2 text-gray-700">{review.comment}</p>
                  )}
                </div>
              ))}
              {reviews.length > 5 && (
                <div className="py-3 text-center">
                  <button
                    className="text-[#2A3B2A] hover:underline text-sm font-medium"
                    onClick={() => {
                      /* Navigate to all reviews */
                    }}
                  >
                    View all {reviews.length} reviews
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentReviews;
