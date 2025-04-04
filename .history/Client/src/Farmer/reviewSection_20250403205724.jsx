import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Filter, ChevronDown, Star } from "lucide-react";
import ReviewCard from "./ReviewCard";
import {
  fetchFarmerReviews,
  fetchFarmerRating,
} from "../Redux/slice/reviewSlice";

const ReviewsSection = ({ farmerId }) => {
  const dispatch = useDispatch();

  // Destructure reviews state safely
  const reviewsState = useSelector((state) => state.reviews) || {};
  const {
    reviews = [],
    rating = { averageRating: 0, totalReviews: 0 },
    loading = false,
    error = null,
  } = reviewsState;

  // Get logged in user from auth state (assumes user.role is available)
  const { user } = useSelector((state) => state.auth) || { user: null };

  // Local states for search, sort, filter, and filter panel toggle
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterRating, setFilterRating] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (farmerId) {
      dispatch(fetchFarmerReviews(farmerId));
      dispatch(fetchFarmerRating(farmerId));
    }
  }, [dispatch, farmerId]);

  // Use API rating if available; fallback to reviews length if needed
  const averageRating = rating?.averageRating || 0;
  const totalReviews = rating?.totalReviews || reviews.length;

  // Check if the logged in user is a buyer (they can review)
  const isBuyer = user && user.role === "Buyer";

  // If the user is a buyer, separate their review; otherwise, show all reviews
  let loggedInUserReview = null;
  let otherReviews = reviews;
  if (isBuyer) {
    loggedInUserReview = reviews.find(
      (review) =>
        review.user?.username.toLowerCase() === user.username.toLowerCase()
    );
    otherReviews = reviews.filter(
      (review) =>
        review.user?.username.toLowerCase() !== user.username.toLowerCase()
    );
  }

  // Apply search, filter, and sorting on reviews (otherReviews if buyer, all otherwise)
  const filteredReviews = otherReviews
    .filter((review) => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        if (
          !review.comment.toLowerCase().includes(term) &&
          !review.user?.username.toLowerCase().includes(term) &&
          !(
            review.productName &&
            review.productName.toLowerCase().includes(term)
          )
        ) {
          return false;
        }
      }
      if (filterRating > 0 && review.rating !== filterRating) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date);
      const dateB = new Date(b.createdAt || b.date);
      if (sortBy === "recent") {
        return dateB - dateA;
      } else if (sortBy === "highest") {
        return b.rating - a.rating;
      } else if (sortBy === "lowest") {
        return a.rating - b.rating;
      }
      return 0;
    });

  return (
    <div className="my-4">
      {loading && <p>Loading reviews...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header with overall review stats */}
          <div className="bg-gradient-to-r from-green-700 to-green-500 text-white p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Buyer Reviews</h2>
              <div className="flex items-center">
                <div className="flex items-center bg-white bg-opacity-20 rounded-lg px-2 py-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={`${
                          star <= Math.round(averageRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-white"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-1 text-sm font-medium">
                    {averageRating.toFixed(1)}
                  </span>
                </div>
                <span className="ml-2 text-sm">
                  ({totalReviews} review{totalReviews > 1 && "s"})
                </span>
              </div>
            </div>
          </div>

          {/* Search and filter section */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                  >
                    <Filter size={18} className="mr-1 text-gray-500" />
                    <span className="text-sm">Filter</span>
                    <ChevronDown size={16} className="ml-1 text-gray-500" />
                  </button>
                  {isFilterOpen && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="p-3">
                        <h4 className="text-sm font-medium mb-2">
                          Filter by Rating
                        </h4>
                        <div className="space-y-2">
                          {[0, 5, 4, 3, 2, 1].map((ratingValue) => (
                            <label
                              key={ratingValue}
                              className="flex items-center cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="rating"
                                checked={filterRating === ratingValue}
                                onChange={() => setFilterRating(ratingValue)}
                                className="mr-2"
                              />
                              {ratingValue === 0 ? (
                                <span className="text-sm">All Ratings</span>
                              ) : (
                                <div className="flex items-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      size={14}
                                      className={`${
                                        star <= ratingValue
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              )}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="recent">Most Recent</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                </select>
              </div>
            </div>
          </div>

          {/* If the logged in user is a buyer, display "Your Review" */}
          {isBuyer && (
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Your Review</h3>
              {loggedInUserReview ? (
                <ReviewCard review={loggedInUserReview} />
              ) : (
                <div className="text-gray-600 text-sm">
                  You haven’t left a review yet.
                </div>
              )}
            </div>
          )}

          {/* Reviews list for other users (or all reviews if not a buyer) */}
          <div className="p-4 max-h-[500px] overflow-y-auto">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No reviews match your filters.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
