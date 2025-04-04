import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Phone,
  Mail,
  MapPin,
  Star,
  ArrowLeft,
  Edit,
  Trash2,
} from "lucide-react";
import Navigation from "../UI/navigation";
import { StartChatButton } from "../chat/startChatButton";
import {
  fetchFarmerReviews,
  fetchFarmerRating,
  updateReview,
  deleteReview,
  resetSubmitStatus,
} from "../Redux/slice/reviewSlice";

const FarmerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingReviewText, setEditingReviewText] = useState("");
  const [submitStatus, setSubmitStatus] = useState(null);

  const farmerReviews = useSelector((state) => state.review.farmerReviews);
  const farmerRating = useSelector((state) => state.review.farmerRating);
  const submitState = useSelector((state) => state.review.submit);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchFarmer = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/farmers/${id}`
        );
        if (!response.ok) {
          throw new Error("Could not fetch farmer");
        }
        const data = await response.json();
        setSelectedFarmer(data);
      } catch (error) {
        console.error("Error fetching farmer:", error);
      }
    };

    fetchFarmer();
    dispatch(fetchFarmerReviews(id));
    dispatch(fetchFarmerRating(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (farmerReviews) {
      setReviews(farmerReviews);
    }
    if (farmerRating) {
      setRating(farmerRating);
    }
  }, [farmerReviews, farmerRating]);

  useEffect(() => {
    if (submitState) {
      setSubmitStatus(submitState);
      if (submitState.status === "success") {
        dispatch(fetchFarmerReviews(id));
        dispatch(fetchFarmerRating(id));
        setNewReview("");
        setRating(0);
        setIsEditing(false);
        setEditingReviewId(null);
        setEditingReviewText("");
      }
      setTimeout(() => {
        dispatch(resetSubmitStatus());
      }, 3000);
    }
  }, [submitState, dispatch, id]);

  if (!selectedFarmer) {
    return <div>Loading...</div>;
  }

  const handleContactFarmer = (farmer) => {
    window.location.href = `tel:${farmer.phone}`;
  };

  const handleAddReview = async () => {
    if (newReview.trim() === "" || rating === 0) {
      alert("Please provide both a review and a rating.");
      return;
    }

    const reviewData = {
      text: newReview,
      rating: rating,
      farmerId: id,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reviewData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add review");
      }

      dispatch(fetchFarmerReviews(id));
      dispatch(fetchFarmerRating(id));
      setNewReview("");
      setRating(0);
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const handleEditReview = (review) => {
    setIsEditing(true);
    setEditingReviewId(review.id);
    setEditingReviewText(review.text);
  };

  const handleUpdateReview = async () => {
    if (editingReviewText.trim() === "") {
      alert("Review text cannot be empty.");
      return;
    }

    const reviewData = {
      id: editingReviewId,
      text: editingReviewText,
    };

    dispatch(updateReview(reviewData));
  };

  const handleDeleteReview = (reviewId) => {
    dispatch(deleteReview(reviewId));
  };

  return (
    <div>
      <Navigation />
      <div className="container mx-auto mt-8 p-4">
        <Link
          to="/map"
          className="inline-flex items-center mb-4 text-blue-500 hover:text-blue-700"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Map
        </Link>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex flex-col items-center sm:flex-row sm:justify-between">
              <h3 className="text-2xl leading-6 font-medium text-gray-900">
                {selectedFarmer.name}
              </h3>
              <div className="mt-2 sm:mt-0">
                <span className="text-yellow-500 flex items-center">
                  {Array.from({ length: rating }, (_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-500" />
                  ))}
                  {Array.from({ length: 5 - rating }, (_, i) => (
                    <Star key={i} className="h-5 w-5" />
                  ))}
                  <span className="ml-2 text-gray-700">{rating} out of 5</span>
                </span>
              </div>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {selectedFarmer.bio}
            </p>
          </div>

          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <a
                    href={`tel:${selectedFarmer.phone}`}
                    className="flex items-center"
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    {selectedFarmer.phone}
                  </a>
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <a
                    href={`mailto:${selectedFarmer.email}`}
                    className="flex items-center"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    {selectedFarmer.email}
                  </a>
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {selectedFarmer.address}
                </dd>
              </div>
            </dl>
          </div>

          <div className="px-4 py-5 sm:px-6">
            <button
              onClick={() => handleContactFarmer(selectedFarmer)}
              className="w-full py-2 sm:py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Contact Farmer
            </button>
            <div className="mt-3">
              <StartChatButton
                farmerId={selectedFarmer.id}
                className="w-full py-2 sm:py-3"
              />
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <h4 className="text-xl font-semibold mb-4">Reviews</h4>

          {/* Add Review Form */}
          {user && (
            <div className="mb-6">
              <label
                htmlFor="review"
                className="block text-sm font-medium text-gray-700"
              >
                Add a Review:
              </label>
              <textarea
                id="review"
                rows="3"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
              ></textarea>

              <div className="mt-2">
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium text-gray-700"
                >
                  Rating:
                </label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`mr-1 text-yellow-500 ${
                        star <= rating ? "fill-current" : "text-gray-300"
                      }`}
                    >
                      <Star className="h-5 w-5" />
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddReview}
                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit Review
              </button>
              {submitStatus && submitStatus.status === "loading" && (
                <p className="text-gray-500 mt-2">Submitting...</p>
              )}
              {submitStatus && submitStatus.status === "success" && (
                <p className="text-green-500 mt-2">
                  Review submitted successfully!
                </p>
              )}
              {submitStatus && submitStatus.status === "error" && (
                <p className="text-red-500 mt-2">
                  Error: {submitStatus.message}
                </p>
              )}
            </div>
          )}

          {/* Display Reviews */}
          {reviews && reviews.length > 0 ? (
            <ul>
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="bg-gray-50 shadow rounded-lg p-4 mb-4"
                >
                  <div className="flex justify-between items-center">
                    <div className="text-gray-800">
                      {isEditing && editingReviewId === review.id ? (
                        <textarea
                          rows="2"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={editingReviewText}
                          onChange={(e) => setEditingReviewText(e.target.value)}
                        />
                      ) : (
                        review.text
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-500 flex items-center mr-2">
                        {Array.from({ length: review.rating }, (_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-500" />
                        ))}
                      </span>
                      {user && user.id === review.userId && (
                        <div>
                          {isEditing && editingReviewId === review.id ? (
                            <>
                              <button
                                onClick={handleUpdateReview}
                                className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
                              >
                                Update
                              </button>
                              <button
                                onClick={() => {
                                  setIsEditing(false);
                                  setEditingReviewId(null);
                                  setEditingReviewText("");
                                }}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditReview(review)}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteReview(review.id)}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;
