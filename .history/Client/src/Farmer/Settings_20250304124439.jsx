// import React, { useState } from "react";
// import { Menu, Edit2, X } from "lucide-react";
// import Sidebar from "../pages/Sidebar";

// const Settings = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: "John Doe",
//     email: "john@example.com",
//     role: "Manager",
//     location: "New York, USA",
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   // Store original data to be able to cancel edits
//   const [originalData, setOriginalData] = useState({ ...formData });

//   const [notifications, setNotifications] = useState({
//     orderUpdates: true,
//     productAlerts: false,
//     supplierMessages: true,
//   });

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleToggleChange = (setting) => {
//     setNotifications({
//       ...notifications,
//       [setting]: !notifications[setting],
//     });
//   };

//   const enableEditMode = () => {
//     // Store current data before editing
//     setOriginalData({ ...formData });
//     setIsEditMode(true);
//   };

//   const cancelEdit = () => {
//     // Restore original data
//     setFormData({ ...originalData });
//     setIsEditMode(false);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Logic to save settings would go here
//     console.log("Form data:", formData);
//     console.log("Notification settings:", notifications);
//     // After successful save, exit edit mode
//     setIsEditMode(false);
//     // Update original data with newly saved data
//     setOriginalData({ ...formData });
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar component */}
//       <Sidebar isMobileMenuOpen={isMobileMenuOpen} />

//       {/* Main content */}
//       <div className="flex-1 md:ml-64">
//         {/* Mobile header with menu toggle */}
//         <div className="md:hidden bg-white p-4 border-b border-gray-200 flex items-center">
//           <button className="mr-4 text-gray-600" onClick={toggleMobileMenu}>
//             <Menu size={24} />
//           </button>
//           <h1 className="text-xl font-bold">Settings</h1>
//         </div>

//         {/* Settings content */}
//         <div className="p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
//           <div className="bg-white rounded-lg shadow-sm max-w-4xl mx-auto p-6">
//             {/* Header - hidden on mobile since we have the top bar */}
//             <div className="hidden md:block mb-6 flex justify-between items-center">
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
//                 <p className="text-gray-600">
//                   Manage your account preferences and settings
//                 </p>
//               </div>
//             </div>

//             <form onSubmit={handleSubmit}>
//               {/* Account Information */}
//               <div className="mb-8">
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-lg font-semibold text-gray-800">
//                     Account Information
//                   </h2>
//                   {!isEditMode ? (
//                     <button
//                       type="button"
//                       onClick={enableEditMode}
//                       className="flex items-center text-sm font-medium text-green-600 hover:text-green-700"
//                     >
//                       <Edit2 size={16} className="mr-1" />
//                       Edit Information
//                     </button>
//                   ) : (
//                     <button
//                       type="button"
//                       onClick={cancelEdit}
//                       className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-700"
//                     >
//                       <X size={16} className="mr-1" />
//                       Cancel
//                     </button>
//                   )}
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label
//                       htmlFor="fullName"
//                       className="block text-sm font-medium text-gray-700 mb-1"
//                     >
//                       Full Name
//                     </label>
//                     <input
//                       type="text"
//                       id="fullName"
//                       name="fullName"
//                       value={formData.fullName}
//                       onChange={handleInputChange}
//                       disabled={!isEditMode}
//                       className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                         !isEditMode ? "bg-gray-50 text-gray-500" : "bg-white"
//                       }`}
//                     />
//                   </div>
//                   <div>
//                     <label
//                       htmlFor="email"
//                       className="block text-sm font-medium text-gray-700 mb-1"
//                     >
//                       Email Address
//                     </label>
//                     <input
//                       type="email"
//                       id="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       disabled={!isEditMode}
//                       className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                         !isEditMode ? "bg-gray-50 text-gray-500" : "bg-white"
//                       }`}
//                     />
//                   </div>
//                   <div>
//                     <label
//                       htmlFor="role"
//                       className="block text-sm font-medium text-gray-700 mb-1"
//                     >
//                       Role
//                     </label>
//                     <input
//                       type="text"
//                       id="role"
//                       name="role"
//                       value={formData.role}
//                       onChange={handleInputChange}
//                       disabled={!isEditMode}
//                       className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                         !isEditMode ? "bg-gray-50 text-gray-500" : "bg-white"
//                       }`}
//                     />
//                   </div>
//                   <div>
//                     <label
//                       htmlFor="location"
//                       className="block text-sm font-medium text-gray-700 mb-1"
//                     >
//                       Location
//                     </label>
//                     <input
//                       type="text"
//                       id="location"
//                       name="location"
//                       value={formData.location}
//                       onChange={handleInputChange}
//                       disabled={!isEditMode}
//                       className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                         !isEditMode ? "bg-gray-50 text-gray-500" : "bg-white"
//                       }`}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Update Password */}
//               <div className="mb-8">
//                 <h2 className="text-lg font-semibold text-gray-800 mb-4">
//                   Update Password
//                 </h2>
//                 <div className="space-y-4">
//                   <div>
//                     <label
//                       htmlFor="currentPassword"
//                       className="block text-sm font-medium text-gray-700 mb-1"
//                     >
//                       Current Password
//                     </label>
//                     <input
//                       type="password"
//                       id="currentPassword"
//                       name="currentPassword"
//                       value={formData.currentPassword}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                       placeholder="••••••••"
//                     />
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label
//                         htmlFor="newPassword"
//                         className="block text-sm font-medium text-gray-700 mb-1"
//                       >
//                         New Password
//                       </label>
//                       <input
//                         type="password"
//                         id="newPassword"
//                         name="newPassword"
//                         value={formData.newPassword}
//                         onChange={handleInputChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                         placeholder="••••••••"
//                       />
//                     </div>
//                     <div>
//                       <label
//                         htmlFor="confirmPassword"
//                         className="block text-sm font-medium text-gray-700 mb-1"
//                       >
//                         Confirm New Password
//                       </label>
//                       <input
//                         type="password"
//                         id="confirmPassword"
//                         name="confirmPassword"
//                         value={formData.confirmPassword}
//                         onChange={handleInputChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                         placeholder="••••••••"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Notification Preferences */}
//               <div className="mb-8">
//                 <h2 className="text-lg font-semibold text-gray-800 mb-4">
//                   Notification Preferences
//                 </h2>
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between py-3 border-b border-gray-200">
//                     <div>
//                       <h3 className="font-medium text-gray-800">
//                         Order Updates
//                       </h3>
//                       <p className="text-sm text-gray-600">
//                         Receive notifications about your order status
//                       </p>
//                     </div>
//                     <label className="relative inline-flex items-center cursor-pointer">
//                       <input
//                         type="checkbox"
//                         className="sr-only peer"
//                         checked={notifications.orderUpdates}
//                         onChange={() => handleToggleChange("orderUpdates")}
//                       />
//                       <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
//                     </label>
//                   </div>

//                   <div className="flex items-center justify-between py-3 border-b border-gray-200">
//                     <div>
//                       <h3 className="font-medium text-gray-800">
//                         Product Alerts
//                       </h3>
//                       <p className="text-sm text-gray-600">
//                         Get notified about new products and updates
//                       </p>
//                     </div>
//                     <label className="relative inline-flex items-center cursor-pointer">
//                       <input
//                         type="checkbox"
//                         className="sr-only peer"
//                         checked={notifications.productAlerts}
//                         onChange={() => handleToggleChange("productAlerts")}
//                       />
//                       <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
//                     </label>
//                   </div>

//                   <div className="flex items-center justify-between py-3">
//                     <div>
//                       <h3 className="font-medium text-gray-800">
//                         Supplier Messages
//                       </h3>
//                       <p className="text-sm text-gray-600">
//                         Receive messages from your suppliers
//                       </p>
//                     </div>
//                     <label className="relative inline-flex items-center cursor-pointer">
//                       <input
//                         type="checkbox"
//                         className="sr-only peer"
//                         checked={notifications.supplierMessages}
//                         onChange={() => handleToggleChange("supplierMessages")}
//                       />
//                       <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
//                     </label>
//                   </div>
//                 </div>
//               </div>

//               {/* Save Changes Button */}
//               <div className="flex justify-end">
//                 <button
//                   type="submit"
//                   className={`px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors ${
//                     !isEditMode && "opacity-50 cursor-not-allowed"
//                   }`}
//                   disabled={!isEditMode}
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Settings;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Menu, Edit2, X } from "lucide-react";
import Sidebar from "../pages/Sidebar";

const Settings = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  // Initial form data; now including contact_number
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

  // Store original data to allow cancelling edits
  const [originalData, setOriginalData] = useState({ ...formData });

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    productAlerts: false,
    supplierMessages: true,
  });

  // Fetch user data from API on mount
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      axios
        .get("http://localhost:8000/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        .then((response) => {
          if (response.data && response.data.user) {
            const { username, email, role, contact_number, location } =
              response.data.user;
            setUser(response.data.user);
            setFormData({
              fullName: username,
              email: email,
              role: role,
              contact_number: contact_number || "",
              location: location,
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
            setOriginalData({
              fullName: username,
              email: email,
              role: role,
              contact_number: contact_number || "",
              location: location,
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
          }
        })
        .catch((error) => {
          console.error(
            "Error fetching current user in Settings:",
            error.response ? error.response.data : error.message
          );
        });
    }
  }, []);

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
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    // Prepare update payload with all user details
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
        "http://localhost:8000/user",
        updatePayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (response.data && response.data.user) {
        setUser(response.data.user);
        setFormData({
          fullName: response.data.user.username,
          email: response.data.user.email,
          role: response.data.user.role,
          contact_number: response.data.user.contact_number || "",
          location: response.data.user.location,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setOriginalData({
          fullName: response.data.user.username,
          email: response.data.user.email,
          role: response.data.user.role,
          contact_number: response.data.user.contact_number || "",
          location: response.data.user.location,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setMessage("User updated successfully!");
      }
      setIsEditMode(false);
    } catch (error) {
      console.error(
        "Error updating user:",
        error.response ? error.response.data : error.message
      );
      setMessage("Error updating user. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar component */}
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} />

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        {/* Mobile header with menu toggle */}
        <div className="md:hidden bg-white p-4 border-b border-gray-200 flex items-center">
          <button className="mr-4 text-gray-600" onClick={toggleMobileMenu}>
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>

        {/* Settings content */}
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
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-green-500 ${
                        !isEditMode ? "bg-gray-50 text-gray-500" : "bg-white"
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
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-green-500 ${
                        !isEditMode ? "bg-gray-50 text-gray-500" : "bg-white"
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
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-green-500 ${
                        !isEditMode ? "bg-gray-50 text-gray-500" : "bg-white"
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
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-green-500 ${
                        !isEditMode ? "bg-gray-50 text-gray-500" : "bg-white"
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
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-green-500 ${
                        !isEditMode ? "bg-gray-50 text-gray-500" : "bg-white"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Update Password */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Update Password
                </h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Notification Preferences
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        Order Updates
                      </h3>
                      <p className="text-sm text-gray-600">
                        Receive notifications about your order status
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notifications.orderUpdates}
                        onChange={() => handleToggleChange("orderUpdates")}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        Product Alerts
                      </h3>
                      <p className="text-sm text-gray-600">
                        Get notified about new products and updates
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notifications.productAlerts}
                        onChange={() => handleToggleChange("productAlerts")}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        Supplier Messages
                      </h3>
                      <p className="text-sm text-gray-600">
                        Receive messages from your suppliers
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notifications.supplierMessages}
                        onChange={() => handleToggleChange("supplierMessages")}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Save Changes Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors ${
                    !isEditMode && "opacity-50 cursor-not-allowed"
                  }`}
                  disabled={!isEditMode}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
