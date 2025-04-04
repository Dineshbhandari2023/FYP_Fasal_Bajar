import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Menu, Search, ShoppingCart, X, Leaf } from "lucide-react";
import { logoutUser } from "../Redux/slice/userSlice"; // Adjust the import path as needed
import { motion, AnimatePresence } from "framer-motion";
import { ChatButton } from "../chat/chatButton"; // Add this import

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [cartItems, setCartItems] = useState(0); // Replace with actual cart logic
  const dispatch = useDispatch();

  useEffect(() => {
    // Replace with actual cart item count retrieval logic
    setCartItems(3);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <nav className="bg-green-700 text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center text-xl font-semibold">
          <Leaf className="h-6 w-6 mr-2" />
          Cropify
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white focus:outline-none"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Navigation Items */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Search Bar */}
          <motion.div
            className={`relative hidden md:block transition-all duration-300 ${
              searchFocused ? "w-80" : "w-64"
            }`}
            animate={{ width: searchFocused ? "20rem" : "16rem" }}
            transition={{ duration: 0.3 }}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search crops..."
              className="w-full rounded-full border border-gray-200 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </motion.div>

          {/* Cart */}
          <Link to="/cart">
            <motion.button
              className="relative p-2 rounded-full hover:text-green-900 text-white hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItems > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  {cartItems}
                </motion.span>
              )}
            </motion.button>
          </Link>

          {/* Add ChatButton here */}
          <ChatButton />

          {/* Profile and Logout buttons for desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/profile"
              className="px-4 py-2 rounded-md text-white hover:bg-green-50 hover:text-green-900 transition-colors font-medium"
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Profile
              </motion.span>
            </Link>
            <motion.button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu (Conditional Rendering) */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden absolute top-full left-0 w-full bg-green-700 text-white z-10 flex flex-col items-center py-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/" className="block py-2 hover:text-green-200">
                Home
              </Link>
              <Link to="/products" className="block py-2 hover:text-green-200">
                Products
              </Link>
              <Link to="/cart" className="block py-2 hover:text-green-200">
                Cart
              </Link>
              <Link to="/profile" className="block py-2 hover:text-green-200">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block py-2 hover:text-green-200"
              >
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;
