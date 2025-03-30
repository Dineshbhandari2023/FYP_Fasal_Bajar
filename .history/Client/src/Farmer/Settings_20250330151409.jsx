import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCurrentUser,
  updateUser,
  logoutUser,
  logout,
} from "../Redux/slice/userSlice";
import { useNavigate } from "react-router-dom";
import Sidebar from "../pages/Sidebar";
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

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo, accessToken, loading, error } = useSelector(
    (state) => state.user
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
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

  // Populate local formData when userInfo updates (note: data is nested inside userInfo.user)
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
    // Create FormData so we can send file and text fields
    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("contact_number", formData.contact_number);
    data.append("location", formData.location);
    // Append the image file if a new file is selected
    if (newProfileImage) {
      data.append("image", newProfileImage);
    }
    dispatch(updateUser(data))
      .unwrap()
      .then(() => {
        setIsEditMode(false);
        // Re-fetch current user to update the UI
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

  // Use the stored URL as is. If no image URL is stored, use a placeholder.
  const profileImageUrl =
    userInfo && userInfo.profileImage
      ? userInfo.profileImage
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
        </div>

        {/* Main content */}
        <div className="p-4 md:p-8 overflow-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 hidden md:block">
              Account Settings
            </h1>

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
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {/* Header section */}
                <div className="bg-[#2A3B2A] text-white p-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                      Profile Information
                    </h2>
                    {!isEditMode ? (
                      <button
                        type="button"
                        onClick={() => setIsEditMode(true)}
                        className="flex items-center bg-white text-[#2A3B2A] px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
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

                {/* Display current profile image */}
                <div className="p-6 flex justify-center">
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="h-32 w-32 rounded-full object-cover border"
                  />
                </div>

                {/* Form section */}
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
                        <User size={16} className="mr-2 text-[#2A3B2A]" />{" "}
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
                            ? "border-gray-300 focus:border-[#2A3B2A] focus:ring-1 focus:ring-[#2A3B2A]"
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
                        <Mail size={16} className="mr-2 text-[#2A3B2A]" /> Email
                        Address
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
                            ? "border-gray-300 focus:border-[#2A3B2A] focus:ring-1 focus:ring-[#2A3B2A]"
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
                        <Shield size={16} className="mr-2 text-[#2A3B2A]" />{" "}
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

                    {/* Contact number field */}
                    <div className="space-y-2">
                      <label
                        htmlFor="contact_number"
                        className="flex items-center text-sm font-medium text-gray-700"
                      >
                        <Phone size={16} className="mr-2 text-[#2A3B2A]" />{" "}
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
                            ? "border-gray-300 focus:border-[#2A3B2A] focus:ring-1 focus:ring-[#2A3B2A]"
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
                        <MapPin size={16} className="mr-2 text-[#2A3B2A]" />{" "}
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
                            ? "border-gray-300 focus:border-[#2A3B2A] focus:ring-1 focus:ring-[#2A3B2A]"
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

                    {/* Save button */}
                    {isEditMode && (
                      <div className="pt-4">
                        <button
                          type="submit"
                          className="w-full bg-[#2A3B2A] text-white py-2.5 px-4 rounded-md font-medium hover:bg-[#3A4D3A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2A3B2A] focus:ring-offset-2"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                </form>

                {/* Logout section */}
                <div className="border-t border-gray-200 p-6">
                  <button
                    onClick={handleLogout}
                    className="w-full flex justify-center items-center bg-red-50 text-red-600 py-2.5 px-4 rounded-md font-medium hover:bg-red-100 transition-colors"
                  >
                    Logout
                  </button>
                </div>

                {/* Error message */}
                {error && (
                  <div className="bg-red-50 text-red-600 p-4 border-t border-red-100">
                    <p className="text-sm">{error}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
