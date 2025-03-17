import React, { useEffect } from "react";
import { Search, Bell, Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../redux/actions/userActions"; // import thunk

const Navbar = ({ onMenuClick }) => {
  const dispatch = useDispatch();

  // Get user data, loading, and error from Redux store
  const { currentUser, loading, error } = useSelector((state) => state.users);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    // If token exists, fetch current user on mount
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token]);

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

        {/* Right: Notifications & User Info */}
        <div className="flex items-center space-x-4">
          <button className="relative">
            <Bell className="h-6 w-6 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              2
            </span>
          </button>

          <div className="flex items-center">
            <img
              src={currentUser?.image || "/api/placeholder/32/32"}
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

      {/* Display error if fetching current user fails */}
      {error && (
        <div className="text-red-500 text-center text-sm mt-1">{error}</div>
      )}
    </div>
  );
};

export default Navbar;
