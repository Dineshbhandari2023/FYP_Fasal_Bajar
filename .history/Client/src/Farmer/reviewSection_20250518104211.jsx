import { useState, useEffect } from "react";
import { Search, Filter, ChevronDown, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFarmerReviews,
  fetchFarmerRating,
} from "../Redux/slice/reviewSlice";
import ReviewCard from "./reviewCard";
import socketService from "../services/socketService";

const ReviewsSection = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { reviews, rating, loading, error } = useSelector(
    (state) => state.review
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterRating, setFilterRating] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const SERVER_URL = "http://localhost:8000";

  // Fetch reviews when component mounts
  useEffect(() => {
    if (userInfo && userInfo.id) {
      dispatch(fetchFarmerReviews(userInfo.id));
      dispatch(fetchFarmerRating(userInfo.id));

      // Join the farmer's review room for real-time updates
      if (userInfo.role === "Farmer") {
        socketService.joinFarmerReviewRoom(userInfo.id);
      }
    }

    // Cleanup when component unmounts
    return () => {
      if (userInfo && userInfo.role === "Farmer") {
        socketService.leaveFarmerReviewRoom(userInfo.id);
      }
    };
  }, [dispatch, userInfo]);

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter((review) => {
      // Filter by search term
      if (
        searchTerm &&
        !review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !review.user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Filter by rating
      if (filterRating > 0 && review.rating !== filterRating) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by selected option
      if (sortBy === "recent") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "highest") {
        return b.rating - a.rating;
      } else if (sortBy === "lowest") {
        return a.rating - b.rating;
      }
      return 0;
    });

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header with gradient background */}
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
                        star <= Math.round(rating.averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-white"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-1 text-sm font-medium">
                  {rating.averageRating.toFixed(1)}
                </span>
              </div>
              <span className="ml-2 text-sm">
                ({rating.totalReviews} reviews)
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
                        {[0, 5, 4, 3, 2, 1].map((rating) => (
                          <label
                            key={rating}
                            className="flex items-center cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="rating"
                              checked={filterRating === rating}
                              onChange={() => setFilterRating(rating)}
                              className="mr-2"
                            />
                            {rating === 0 ? (
                              <span className="text-sm">All Ratings</span>
                            ) : (
                              <div className="flex items-center">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      size={14}
                                      className={`${
                                        star <= rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
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

        {/* Reviews list */}
        <div className="p-4 max-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>Error loading reviews. Please try again later.</p>
            </div>
          ) : filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={{
                  ...review,
                  buyerName: review.user?.username || "Anonymous",
                  // buyerImage:
                  //   review.user?.profileImage ||
                  //   "/placeholder.svg?height=40&width=40",
                  // buyerImage: `${SERVER_URL}${review.users.profileImage}`,
                  date: formatDate(review.createdAt),
                }}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || filterRating > 0 ? (
                <p>No reviews match your filters.</p>
              ) : (
                <p>No reviews yet. Be the first to receive a review!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;
