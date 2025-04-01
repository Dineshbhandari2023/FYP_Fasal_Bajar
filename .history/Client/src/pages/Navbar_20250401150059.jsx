import React, { useEffect } from "react";
import { Search, Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "../Redux/slice/userSlice";
import ReviewNotifications from "../Farmer/reviewNotifications";

// Set your server's base URL (ensure this variable is defined in your .env if needed)
const SERVER_URL = "http://localhost:8000";

const Navbar = ({ onMenuClick }) => {
  const dispatch = useDispatch();

  const {
    userInfo: currentUser,
    loading,
    error,
    accessToken,
  } = useSelector((state) => state.user);

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, accessToken]);

  // Build the full URL for the profile image using currentUser.profileImage
  const profileImageUrl =
    currentUser && currentUser.profileImage
      ? `${SERVER_URL}${currentUser.profileImage}`
      : "/placeholder.svg";

  return (
    <div className="bg-white border-b h-16 fixed top-0 right-0 left-0 md:left-64 z-10">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left: Menu & Search */}
        <div className="flex items-center flex-1">
          <button onClick={onMenuClick} className="mr-4 md:hidden">
            <Menu className="h-6 w-6" />
          </button>
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products, suppliers..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        {/* Right: Review Notifications & User Info */}
        <div className="flex items-center space-x-4">
          {/* Integrated review notifications */}
          <ReviewNotifications />

          <div className="flex items-center">
            <img
              src={profileImageUrl}
              alt="User"
              className="h-8 w-8 rounded-full"
            />
            <div className="ml-2 hidden sm:block">
              <div className="text-sm font-medium">
                {loading
                  ? "Loading..."
                  : error
                  ? "Error"
                  : currentUser?.username || "Guest"}
              </div>
              <div className="text-xs text-gray-500">
                {currentUser?.role || ""}
              </div>
            </div>
          </div>
        </div>
      </div>
      {error && (
        <div className="text-red-500 text-center text-sm mt-1">{error}</div>
      )}
    </div>
  );
};

export default Navbar;
