import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser, updateUser, logout } from "../Redux/slice/userSlice";
import { useNavigate } from "react-router-dom";
import Sidebar from "../pages/Sidebar";
import { Menu, Edit2, X } from "lucide-react";

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

  useEffect(() => {
    if (accessToken && !userInfo) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, accessToken, userInfo]);

  useEffect(() => {
    if (userInfo) {
      setFormData({
        username: userInfo.username,
        email: userInfo.email,
        role: userInfo.role,
        contact_number: userInfo.contact_number || "",
        location: userInfo.location || "",
      });
    }
  }, [userInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUser(formData))
      .unwrap()
      .then(() => {
        setIsEditMode(false);
        toast.success("Profile updated successfully");
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} />
      <div className="flex-1 md:ml-64">
        <div className="md:hidden bg-white p-4 border-b flex items-center">
          <button className="mr-4" onClick={toggleMobileMenu}>
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
        <div className="p-8 overflow-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Account Information</h2>
                {!isEditMode ? (
                  <button
                    type="button"
                    onClick={() => setIsEditMode(true)}
                    className="text-green-600 flex items-center"
                  >
                    <Edit2 size={16} className="mr-1" /> Edit
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditMode(false)}
                    className="text-red-500 flex items-center"
                  >
                    <X size={16} className="mr-1" /> Cancel
                  </button>
                )}
              </div>

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={!isEditMode}
                className="input"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditMode}
                className="input"
              />

              {/* Add remaining fields similarly */}

              {isEditMode && (
                <button type="submit" className="btn-save">
                  Save Changes
                </button>
              )}
            </form>

            <button className="btn-logout mt-6" onClick={handleLogout}>
              Logout
            </button>

            {error && <div className="error">{error}</div>}
            {loading && <div className="loading">Loading...</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
