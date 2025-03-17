import React, { useState, useEffect } from "react";
import axios from "axios";
import { Menu, Edit2, X } from "lucide-react";
import Sidebar from "../pages/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/slice/userSlice";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Pull from the same user slice
  const {
    userInfo, // includes { id, username, email, role, ... }
    accessToken,
  } = useSelector((state) => state.user);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    contact_number: "",
    location: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [originalData, setOriginalData] = useState({ ...formData });

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    productAlerts: false,
    supplierMessages: true,
  });

  // Fetch user data from your API if we have an accessToken and user ID
  useEffect(() => {
    const fetchUserById = async () => {
      if (!accessToken || !userInfo?.id) {
        console.warn("No token or user ID found in Redux store");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/users/${userInfo.id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true,
          }
        );

        const userData = response.data.Result.user_data;
        if (userData) {
          setUser(userData);
          setFormData({
            fullName: userData.username,
            email: userData.email,
            role: userData.role,
            contact_number: userData.contact_number || "",
            location: userData.location || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });

          setOriginalData({
            fullName: userData.username,
            email: userData.email,
            role: userData.role,
            contact_number: userData.contact_number || "",
            location: userData.location || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        }
      } catch (error) {
        console.error("Error fetching user by ID:", error);
        if (!error.response) {
          alert("Network error - please check if your server is running");
        }
      }
    };

    fetchUserById();
  }, [accessToken, userInfo]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleToggleChange = (setting) => {
    setNotifications((prevNotifications) => ({
      ...prevNotifications,
      [setting]: !prevNotifications[setting],
    }));
  };

  const enableEditMode = () => {
    setOriginalData({ ...formData });
    setIsEditMode(true);
  };

  const cancelEdit = () => {
    setFormData({ ...originalData });
    setIsEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accessToken || !userInfo?.id) {
      console.error("No token or user ID found for updating user");
      return;
    }

    const updatePayload = {
      user: {
        username: formData.fullName,
        email: formData.email,
        role: formData.role,
        contact_number: formData.contact_number,
        location: formData.location,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      },
    };

    try {
      const response = await axios.put(
        `http://localhost:8000/users/${userInfo.id}`,
        updatePayload,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );

      if (response.data?.Result?.user_data) {
        const updatedUser = response.data.Result.user_data;

        setUser(updatedUser);
        setFormData({
          fullName: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role,
          contact_number: updatedUser.contact_number || "",
          location: updatedUser.location || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setOriginalData({
          fullName: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role,
          contact_number: updatedUser.contact_number || "",
          location: updatedUser.location || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setMessage("User updated successfully!");
        setIsEditMode(false);
      }
    } catch (error) {
      console.error(
        "Error updating user:",
        error.response ? error.response.data : error.message
      );
      setMessage("Error updating user. Please try again.");
    }
  };

  const handleLogout = () => {
    dispatch(logout()); // from userSlice
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} />

      <div className="flex-1 md:ml-64">
        {/* Mobile Header */}
        <div className="md:hidden bg-white p-4 border-b border-gray-200 flex items-center">
          <button className="mr-4 text-gray-600" onClick={toggleMobileMenu}>
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
          <div className="bg-white rounded-lg shadow-sm max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="hidden md:block mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
                <p className="text-gray-600">
                  Manage your account preferences and settings
                </p>
              </div>
            </div>

            {message && (
              <div className="mb-4 text-center text-green-600">{message}</div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Account Information */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Account Information
                  </h2>
                  {!isEditMode ? (
                    <button
                      type="button"
                      onClick={enableEditMode}
                      className="flex items-center text-sm font-medium text-green-600 hover:text-green-700"
                    >
                      <Edit2 size={16} className="mr-1" />
                      Edit Information
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-700"
                    >
                      <X size={16} className="mr-1" />
                      Cancel
                    </button>
                  )}
                </div>

                {/* Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      disabled={!isEditMode}
                      className={`w-full px-3 py-2 border rounded-md ${
                        !isEditMode
                          ? "bg-gray-50 text-gray-500"
                          : "bg-white focus:outline-none focus:border-green-500"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditMode}
                      className={`w-full px-3 py-2 border rounded-md ${
                        !isEditMode
                          ? "bg-gray-50 text-gray-500"
                          : "bg-white focus:outline-none focus:border-green-500"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Role
                    </label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      disabled={!isEditMode}
                      className={`w-full px-3 py-2 border rounded-md ${
                        !isEditMode
                          ? "bg-gray-50 text-gray-500"
                          : "bg-white focus:outline-none focus:border-green-500"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact_number"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Contact Number
                    </label>
                    <input
                      type="text"
                      id="contact_number"
                      name="contact_number"
                      value={formData.contact_number}
                      onChange={handleInputChange}
                      disabled={!isEditMode}
                      className={`w-full px-3 py-2 border rounded-md ${
                        !isEditMode
                          ? "bg-gray-50 text-gray-500"
                          : "bg-white focus:outline-none focus:border-green-500"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      disabled={!isEditMode}
                      className={`w-full px-3 py-2 border rounded-md ${
                        !isEditMode
                          ? "bg-gray-50 text-gray-500"
                          : "bg-white focus:outline-none focus:border-green-500"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Save Changes */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    !isEditMode && "opacity-50 cursor-not-allowed"
                  }`}
                  disabled={!isEditMode}
                >
                  Save Changes
                </button>
              </div>
            </form>

            {/* Logout Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
