import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Menu, Search, ShoppingCart, X, Leaf } from "lucide-react";
import { logoutUser } from "../Redux/slice/userSlice"; // Adjust the import path as needed
import { motion, AnimatePresence } from "framer-motion";
import { ChatButton } from "../chat/chatButton"; // Add this import

export function Navigation() {
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cartItems = 0; // Replace with your dynamic cart count if needed

  // Check if mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

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

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        when: "afterChildren",
      },
    },
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <motion.header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "shadow-md bg-[#136207]"
          : "bg-[#136207]/95 backdrop-blur-sm"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/user-dashboard" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Leaf className="h-6 w-6 text-white" />
              </motion.div>
              <motion.span
                className="font-bold text-white text-xl"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Fasal Bajar
              </motion.span>
            </Link>
          </motion.div>

          {/* Desktop Navigation - Centered */}
          <motion.nav
            className="hidden lg:flex items-center justify-center space-x-8 text-sm font-medium text-white"
            variants={navVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Link
                to="/browse"
                className="relative py-2 transition-colors hover:text-green-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-300 after:transition-all hover:after:w-full"
              >
                Browse Crops
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link
                to="/orders"
                className="relative py-2 transition-colors hover:text-green-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-300 after:transition-all hover:after:w-full"
              >
                Orders
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link
                to="/map"
                className="relative py-2 transition-colors hover:text-green-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-300 after:transition-all hover:after:w-full flex items-center"
              >
                Map
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link
                to="/messages"
                className="relative py-2 transition-colors hover:text-green-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-300 after:transition-all hover:after:w-full flex items-center"
              >
                Messages
              </Link>
            </motion.div>
          </motion.nav>

          {/* Right Side: Search, Cart, and User Actions */}
          <motion.div
            className="flex items-center space-x-2 lg:space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {/* Cart */}
            <Link to="/cart">
              <motion.button
                className="relative p-2 rounded-full hover:text-green-300 text-white hover:bg-green-800/50 transition-colors"
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

            {/* Chat Button */}
            <ChatButton />

            {/* Profile and Logout buttons for desktop */}
            <div className="hidden lg:flex items-center">
              <Link
                to="/profile"
                className="px-4 py-2 rounded-md text-white hover:bg-green-800/50 hover:text-green-300 transition-colors font-medium"
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
                className="px-4 py-2 rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition-colors font-medium ml-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
            </div>

            {/* Mobile menu button */}
            <motion.button
              className="p-2 rounded-md text-white hover:bg-green-700 lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
              <span className="sr-only">Toggle Menu</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Mobile Search - Only visible on mobile */}
        <motion.div
          className="pb-3 pt-1 lg:hidden"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        ></motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-menu-container lg:hidden"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div className="absolute top-[calc(4rem-1px)] left-0 w-full bg-white border-t border-b shadow-lg z-50">
              <motion.nav className="flex flex-col px-6 py-4 space-y-4">
                <motion.div variants={mobileItemVariants}>
                  <Link
                    to="/browse"
                    className="flex items-center py-2 text-gray-800 hover:text-green-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Browse Crops
                  </Link>
                </motion.div>
                <motion.div variants={mobileItemVariants}>
                  <Link
                    to="/orders"
                    className="flex items-center py-2 text-gray-800 hover:text-green-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Orders
                  </Link>
                </motion.div>
                <motion.div variants={mobileItemVariants}>
                  <Link
                    to="/map"
                    className="flex items-center py-2 text-gray-800 hover:text-green-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Map
                  </Link>
                </motion.div>
                <motion.div variants={mobileItemVariants}>
                  <Link
                    to="/messages"
                    className="flex items-center py-2 text-gray-800 hover:text-green-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Messages
                  </Link>
                </motion.div>
                <motion.div
                  className="h-px bg-gray-200 my-2"
                  variants={mobileItemVariants}
                ></motion.div>
                <motion.div variants={mobileItemVariants}>
                  <Link
                    to="/profile"
                    className="flex items-center py-2 text-gray-800 hover:text-green-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </motion.div>
                <motion.div variants={mobileItemVariants}>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center py-2 text-left w-full text-gray-800 hover:text-green-600 transition-colors"
                  >
                    Logout
                  </button>
                </motion.div>
              </motion.nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Navigation;
