import React, { useEffect } from "react";
import { Search, Bell, Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../Redux/actions/userActions";

const Navbar = ({ onMenuClick }) => {
  const dispatch = useDispatch();

  // Get user data from Redux state
  const { currentUser, loading, error } = useSelector((state) => state.users);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(getCurrentUser()); // Fetch current user
    }
  }, [dispatch, token]);

  return (
    <div className="bg-white border-b h-16 fixed top-0 right-0 left-0 md:left-64 z-10">
      <div className="flex items-center justify-between h-full px-4">
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
                {loading ? "Loading..." : currentUser?.username || "Guest"}
              </div>
              <div className="text-xs text-gray-500">
                {currentUser ? currentUser.role : ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Show error message if fetching fails */}
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
    </div>
  );
};

export default Navbar;
