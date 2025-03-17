import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Bell, Menu } from "lucide-react";
import { login } from "../slice/authstore";

const Navbar = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("/user", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch user data");
          }
          return res.json();
        })
        .then((data) => {
          // Dispatch the login action to update Redux store with the user data.
          dispatch(login(data.user));
        })
        .catch((err) => {
          console.error("Error fetching current user:", err);
        });
    }
  }, [dispatch]);

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-4">
          <button className="relative">
            <Bell className="h-6 w-6 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              2
            </span>
          </button>
          <div className="flex items-center">
            <img
              src="/api/placeholder/32/32"
              alt="User"
              className="h-8 w-8 rounded-full"
            />
            <div className="ml-2 hidden sm:block">
              <div className="text-sm font-medium">
                {user ? user.username : "Loading..."}
              </div>
              <div className="text-xs text-gray-500">
                {user ? user.role : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
