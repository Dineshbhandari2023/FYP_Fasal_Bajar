import { Star, TrendingUp, Award, ThumbsUp } from "lucide-react";

const ReviewStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
        <div className="bg-green-100 p-2 rounded-full mb-2">
          <Star className="h-5 w-5 text-green-600" />
        </div>
        <span className="text-xl font-bold text-gray-800">
          {stats.averageRating.toFixed(1)}
        </span>
        <span className="text-xs text-gray-500">Average Rating</span>
      </div>

      <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
        <div className="bg-blue-100 p-2 rounded-full mb-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
        </div>
        <span className="text-xl font-bold text-gray-800">
          {stats.totalReviews}
        </span>
        <span className="text-xs text-gray-500">Total Reviews</span>
      </div>

      <div className="flex flex-col items-center p-3 bg-yellow-50 rounded-lg">
        <div className="bg-yellow-100 p-2 rounded-full mb-2">
          <Award className="h-5 w-5 text-yellow-600" />
        </div>
        <span className="text-xl font-bold text-gray-800">
          {stats.fiveStarPercentage}%
        </span>
        <span className="text-xs text-gray-500">5-Star Reviews</span>
      </div>

      <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg">
        <div className="bg-purple-100 p-2 rounded-full mb-2">
          <ThumbsUp className="h-5 w-5 text-purple-600" />
        </div>
        <span className="text-xl font-bold text-gray-800">
          {stats.responseRate}%
        </span>
        <span className="text-xs text-gray-500">Response Rate</span>
      </div>
    </div>
  );
};

export default ReviewStats;
