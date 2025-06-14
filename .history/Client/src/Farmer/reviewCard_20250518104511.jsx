// import { Star } from "lucide-react";

// const ReviewCard = ({ review }) => {
//   // Helper function to get full URL for profile images
//   const getProfileImage = (url) => {
//     // If the url exists and doesn't start with "http", assume it's relative
//     if (url && !url.startsWith("http")) {
//       return `http://localhost:8000${url}`;
//     }
//     return url || "/placeholder.svg";
//   };

//   // Generate star rating display
//   const renderStars = (rating) => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         <Star
//           key={i}
//           size={16}
//           className={`${
//             i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
//           }`}
//         />
//       );
//     }
//     return stars;
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4 transition-all hover:shadow-md">
//       <div className="flex items-start">
//         <img
//           src={getProfileImage(review.user?.profileImage)}
//           alt={review.user?.username}
//           className="h-10 w-10 rounded-full object-cover mr-3"
//         />
//         <div className="flex-1">
//           <div className="flex justify-between items-center mb-1">
//             <h4 className="font-medium text-gray-900">
//               {review.user?.username}
//             </h4>
//             <span className="text-xs text-gray-500">
//               {review.createdAt
//                 ? new Date(review.createdAt).toLocaleDateString()
//                 : review.date}
//             </span>
//           </div>
//           <div className="flex items-center mb-2">
//             <div className="flex mr-2">{renderStars(review.rating)}</div>
//             <span className="text-sm text-gray-600">{review.rating}/5</span>
//           </div>
//           <p className="text-gray-700 text-sm">{review.comment}</p>
//           {review.productName && (
//             <div className="mt-2 text-xs bg-green-50 text-green-700 py-1 px-2 rounded-full inline-block">
//               Product: {review.productName}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReviewCard;

import { Star } from "lucide-react";

const ReviewCard = ({ review }) => {
  // Generate star rating display
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={`${
            i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4 transition-all hover:shadow-md">
      <div className="flex items-start">
        <img
          src={review.buyerImage}
          alt={review.buyerName}
          className="h-10 w-10 rounded-full object-cover mr-3"
          onError={(e) =>
            (e.target.src = "/placeholder.svg?height=40&width=40")
          }
        />
        <div className="flex-1">
          {/* User Details Section */}
          <div className="mb-2">
            <h4 className="font-medium text-gray-900">{review.buyerName}</h4>
            <div className="text-xs text-gray-500 space-y-1">
              <p>
                <span className="font-medium">User ID:</span>{" "}
                {review.users?.id || "N/A"}
              </p>
              <p>
                <span className="font-medium">Role:</span>{" "}
                {review.users?.role || "N/A"}
              </p>
              <p>
                <span className="font-medium">Profile Image Path:</span>{" "}
                {review.users?.profileImage || "N/A"}
              </p>
            </div>
          </div>

          {/* Review Details */}
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <div className="flex mr-2">{renderStars(review.rating)}</div>
              <span className="text-sm text-gray-600">{review.rating}/5</span>
            </div>
            <span className="text-xs text-gray-500">
              {review.createdAt
                ? new Date(review.createdAt).toLocaleDateString()
                : review.date}
            </span>
          </div>
          <p className="text-gray-700 text-sm">{review.comment}</p>
          {review.productName && (
            <div className="mt-2 text-xs bg-green-50 text-green-700 py-1 px-2 rounded-full inline-block">
              Product: {review.productName}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
