"use client";

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Menu, Search, ShoppingCart, X, Leaf, MapPin } from "lucide-react";
import { logoutUser } from "../Redux/slice/userSlice"; // Adjust the import path as needed

export function Navigation() {
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const cartItems = 0; // Replace with your dynamic cart count if needed

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest(".mobile-menu-container")) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "shadow-md bg-[#136207]"
          : "bg-[#136207]/95 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/user-dashboard" className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-white" />
              <span className="font-bold text-white text-xl">Fasal Bajar</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-white">
            <Link
              to="/browse"
              className="relative py-2 transition-colors hover:text-green-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-600 after:transition-all hover:after:w-full"
            >
              Browse Crops
            </Link>
            <Link
              to="/orders"
              className="relative py-2 transition-colors hover:text-green-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-600 after:transition-all hover:after:w-full"
            >
              Orders
            </Link>
            <Link
              to="/map"
              className="relative py-2 transition-colors hover:text-green-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-600 after:transition-all hover:after:w-full flex items-center"
            >
              Farmer Map
            </Link>
          </nav>

          {/* Search, Cart, and User Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div
              className={`relative hidden md:block transition-all duration-300 ${
                searchFocused ? "w-80" : "w-64"
              }`}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search crops..."
                className="w-full rounded-full border border-gray-200 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>

            {/* Cart */}
            <Link to="/cart">
              <button className="relative p-2 rounded-full hover:text-green-900 text-white hover:bg-gray-100 transition-colors">
                <ShoppingCart className="h-5 w-5" />
                {cartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600  text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems}
                  </span>
                )}
              </button>
            </Link>

            {/* Profile and Logout buttons for desktop */}
            <div className="hidden md:flex items-center space-x-2">
              <Link
                to="/profile"
                className="px-4 py-2 rounded-md text-white hover:bg-green-50 hover:text-green-900 transition-colors font-medium"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition-colors font-medium"
              >
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
              <span className="sr-only">Toggle Menu</span>
            </button>
          </div>
        </div>

        {/* Mobile Search - Only visible on mobile */}
        <div className="pb-3 pt-1 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search crops..."
              className="w-full rounded-full border border-gray-200 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-container md:hidden">
          <div className="absolute top-16 left-0 w-full bg-white border-t border-b shadow-lg animate-fadeIn">
            <nav className="flex flex-col px-6 py-4 space-y-4">
              <Link
                to="/browse"
                className="flex items-center py-2 text-gray-800 hover:text-green-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse Crops
              </Link>
              <Link
                to="/orders"
                className="flex items-center py-2 text-gray-800 hover:text-green-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Orders
              </Link>
              <Link
                to="/map"
                className="flex items-center py-2 text-gray-800 hover:text-green-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Farmer Map
              </Link>
              <div className="h-px bg-gray-200 my-2"></div>
              <Link
                to="/profile"
                className="flex items-center py-2 text-gray-800 hover:text-green-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center py-2 text-left text-gray-800 hover:text-green-600 transition-colors"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navigation;
