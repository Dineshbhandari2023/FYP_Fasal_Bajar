import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCurrentUser,
  updateUser,
  logoutUser,
  logout,
} from "../Redux/slice/userSlice";
import { useNavigate } from "react-router-dom";
import Sidebar from "../pages/Sidebar";
import ReviewsSection from "./components/reviews-section";
import ReviewNotifications from "./components/review-notifications";
import {
  Menu,
  Edit2,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
} from "lucide-react";

// Set your server's base URL. You can also set REACT_APP_SERVER_URL in your .env file.
const SERVER_URL = "http://localhost:8000";

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, accessToken, loading, error } = useSelector(
    (state) => state.user
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' or 'reviews'
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    contact_number: "",
    location: "",
  });
  const [newProfileImage, setNewProfileImage] = useState(null);

  // Fetch current user when accessToken is present
  useEffect(() => {
    if (accessToken) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, accessToken]);

  // Populate local formData when userInfo updates
  useEffect(() => {
    if (userInfo) {
      setFormData({
        username: userInfo.username || "",
        email: userInfo.email || "",
        role: userInfo.role || "",
        contact_number: userInfo.contact_number || "",
        location: userInfo.location || "",
        profileImage: userInfo.profile_image || "",
      });
    }
  }, [userInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("contact_number", formData.contact_number);
    data.append("location", formData.location);
    if (newProfileImage) {
      data.append("image", newProfileImage);
    }
    dispatch(updateUser(data))
      .unwrap()
      .then(() => {
        setIsEditMode(false);
        dispatch(fetchCurrentUser());
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(logoutUser());
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const profileImageUrl =
    userInfo && userInfo.profileImage
      ? `${SERVER_URL}${userInfo.profileImage}`
      : "/placeholder.svg";

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} />
      <div className="flex-1 md:ml-64">
        {/* Mobile header */}
        <div className="md:hidden bg-white p-4 border-b shadow-sm flex items-center">
          <button
            className="mr-4 text-gray-700 hover:text-[#2A3B2A] transition-colors"
            onClick={toggleMobileMenu}
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Settings</h1>
          <div className="ml-auto">
            <ReviewNotifications />
          </div>
        </div>

        {/* Main content */}
        <div className="p-4 md:p-8 overflow-auto">
          {/* Page header with tabs */}
          <div className="max-w-6xl mx-auto mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-800">
                Account Settings
              </h1>
              <div className="hidden md:block">
                <ReviewNotifications />
              </div>
            </div>

            {/* Tabs - visible on mobile */}
            <div className="mt-6 border-b border-gray-200 md:hidden">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`pb-4 text-sm font-medium ${
                    activeTab === "profile"
                      ? "border-b-2 border-green-600 text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`pb-4 text-sm font-medium ${
                    activeTab === "reviews"
                      ? "border-b-2 border-green-600 text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Reviews
                </button>
              </div>
            </div>
          </div>

          {/* Use a grid to have two columns on medium+ screens */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Profile Settings */}
            <div
              className={
                activeTab === "profile" || window.innerWidth >= 768
                  ? "block"
                  : "hidden"
              }
            >
              {loading ? (
                <div className="bg-white shadow-md rounded-lg p-8 flex justify-center items-center">
                  <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                  {/* Header with gradient background */}
                  <div className="bg-gradient-to-r from-green-700 to-green-500 text-white p-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">
                        Profile Information
                      </h2>
                      {!isEditMode ? (
                        <button
                          type="button"
                          onClick={() => setIsEditMode(true)}
                          className="flex items-center bg-white text-green-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                        >
                          <Edit2 size={16} className="mr-1.5" /> Edit Profile
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsEditMode(false)}
                          className="flex items-center bg-red-100 text-red-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
                        >
                          <X size={16} className="mr-1.5" /> Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Profile image */}
                  <div className="p-6 flex justify-center">
                    <img
                      src={profileImageUrl || "/placeholder.svg"}
                      alt="Profile"
                      className="h-32 w-32 rounded-full object-cover border-2 border-green-500"
                    />
                  </div>

                  {/* Form */}
                  <form
                    onSubmit={handleSubmit}
                    className="p-6"
                    encType="multipart/form-data"
                  >
                    <div className="space-y-6">
                      {/* Username field */}
                      <div className="space-y-2">
                        <label
                          htmlFor="username"
                          className="flex items-center text-sm font-medium text-gray-700"
                        >
                          <User size={16} className="mr-2 text-green-700" />{" "}
                          Username
                        </label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          disabled={!isEditMode}
                          className={`w-full px-4 py-2.5 rounded-md border ${
                            isEditMode
                              ? "border-gray-300 focus:border-green-700 focus:ring-1 focus:ring-green-700"
                              : "bg-gray-50 border-gray-200 text-gray-700"
                          } transition-colors`}
                        />
                      </div>

                      {/* Email field */}
                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="flex items-center text-sm font-medium text-gray-700"
                        >
                          <Mail size={16} className="mr-2 text-green-700" />{" "}
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditMode}
                          className={`w-full px-4 py-2.5 rounded-md border ${
                            isEditMode
                              ? "border-gray-300 focus:border-green-700 focus:ring-1 focus:ring-green-700"
                              : "bg-gray-50 border-gray-200 text-gray-700"
                          } transition-colors`}
                        />
                      </div>

                      {/* Role field */}
                      <div className="space-y-2">
                        <label
                          htmlFor="role"
                          className="flex items-center text-sm font-medium text-gray-700"
                        >
                          <Shield size={16} className="mr-2 text-green-700" />{" "}
                          Role
                        </label>
                        <input
                          type="text"
                          id="role"
                          name="role"
                          value={formData.role}
                          disabled={true}
                          className="w-full px-4 py-2.5 rounded-md border bg-gray-50 border-gray-200 text-gray-700"
                        />
                      </div>

                      {/* Contact Number field */}
                      <div className="space-y-2">
                        <label
                          htmlFor="contact_number"
                          className="flex items-center text-sm font-medium text-gray-700"
                        >
                          <Phone size={16} className="mr-2 text-green-700" />{" "}
                          Contact Number
                        </label>
                        <input
                          type="text"
                          id="contact_number"
                          name="contact_number"
                          value={formData.contact_number}
                          onChange={handleInputChange}
                          disabled={!isEditMode}
                          className={`w-full px-4 py-2.5 rounded-md border ${
                            isEditMode
                              ? "border-gray-300 focus:border-green-700 focus:ring-1 focus:ring-green-700"
                              : "bg-gray-50 border-gray-200 text-gray-700"
                          } transition-colors`}
                        />
                      </div>

                      {/* Location field */}
                      <div className="space-y-2">
                        <label
                          htmlFor="location"
                          className="flex items-center text-sm font-medium text-gray-700"
                        >
                          <MapPin size={16} className="mr-2 text-green-700" />{" "}
                          Location
                        </label>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          disabled={!isEditMode}
                          className={`w-full px-4 py-2.5 rounded-md border ${
                            isEditMode
                              ? "border-gray-300 focus:border-green-700 focus:ring-1 focus:ring-green-700"
                              : "bg-gray-50 border-gray-200 text-gray-700"
                          } transition-colors`}
                        />
                      </div>

                      {/* Profile Image field in edit mode */}
                      {isEditMode && (
                        <div className="space-y-2">
                          <label
                            htmlFor="profileImage"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Update Profile Image
                          </label>
                          <input
                            type="file"
                            id="profileImage"
                            name="profileImage"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="w-full p-2 border rounded"
                          />
                        </div>
                      )}

                      {/* Save Changes button */}
                      {isEditMode && (
                        <div className="pt-4">
                          <button
                            type="submit"
                            className="w-full bg-green-700 text-white py-2.5 px-4 rounded-md font-medium hover:bg-green-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
                          >
                            Save Changes
                          </button>
                        </div>
                      )}
                    </div>
                  </form>

                  {/* Logout Section */}
                  <div className="border-t border-gray-200 p-6">
                    <button
                      onClick={handleLogout}
                      className="w-full flex justify-center items-center bg-red-50 text-red-600 py-2.5 px-4 rounded-md font-medium hover:bg-red-100 transition-colors"
                    >
                      Logout
                    </button>
                  </div>

                  {/* Display error message */}
                  {error && (
                    <div className="bg-red-50 text-red-600 p-4 border-t border-red-100">
                      <p className="text-sm">{error}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Reviews */}
            <div
              className={
                activeTab === "reviews" || window.innerWidth >= 768
                  ? "block"
                  : "hidden"
              }
            >
              <ReviewsSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
