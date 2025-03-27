"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  ChevronRight,
  Leaf,
  Star,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  ArrowRight,
  CheckCircle,
  Users,
  ShoppingBag,
  Bell,
} from "lucide-react";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const featureCardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <ShoppingBag className="h-6 w-6 text-white" />,
      title: "Product Posting",
      description:
        "Easily list your agricultural products with detailed descriptions and pricing",
    },
    {
      icon: <Bell className="h-6 w-6 text-white" />,
      title: "Order Management",
      description:
        "Track and manage all your orders in one convenient dashboard",
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-white" />,
      title: "Real-time Updates",
      description:
        "Get instant notifications on orders, inquiries, and market trends",
    },
    {
      icon: <Users className="h-6 w-6 text-white" />,
      title: "Location Filtering",
      description:
        "Find products in your area with advanced location-based search",
    },
  ];

  const steps = [
    {
      title: "Create Profile",
      description:
        "Sign up and complete your profile with your farm or business details",
    },
    {
      title: "Post Products",
      description:
        "List your products with high-quality images and detailed specifications",
    },
    {
      title: "Browse Products",
      description:
        "Search and filter available items based on category, location, and price",
    },
    {
      title: "Place Orders",
      description: "Purchase products securely with multiple payment options",
    },
  ];

  const testimonials = [
    {
      name: "Ram Krishna",
      role: "Farmer, Chitwan",
      quote:
        "Fasal Bajar has helped me reach more buyers than ever before. My income has increased by 30% since joining.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Sita Sharma",
      role: "Wholesaler, Kathmandu",
      quote:
        "Finding quality produce has never been easier. The platform connects me directly with farmers, cutting out middlemen.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <motion.div
                className="flex-shrink-0 flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <Leaf
                  className={`h-8 w-8 ${
                    scrolled ? "text-green-600" : "text-green-500"
                  }`}
                />
                <span
                  className={`ml-2 text-xl font-bold ${
                    scrolled ? "text-gray-900" : "text-gray-800"
                  }`}
                >
                  Fasal Bajar
                </span>
              </motion.div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8 sm:space-x-20 md:flex md:ml-80">
                <motion.a
                  href="#"
                  className={`${
                    scrolled ? "text-gray-900" : "text-gray-800"
                  } inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent hover:border-green-500 transition-all duration-200`}
                  whileHover={{ y: -2 }}
                >
                  Home
                </motion.a>
                <motion.a
                  href="#how-it-works"
                  className={`${
                    scrolled ? "text-gray-600" : "text-gray-700"
                  } hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent hover:border-green-500 transition-all duration-200`}
                  whileHover={{ y: -2 }}
                >
                  How It Works
                </motion.a>
                <motion.a
                  href="#features"
                  className={`${
                    scrolled ? "text-gray-600" : "text-gray-700"
                  } hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent hover:border-green-500 transition-all duration-200`}
                  whileHover={{ y: -2 }}
                >
                  Features
                </motion.a>
                <motion.a
                  href="#testimonials"
                  className={`${
                    scrolled ? "text-gray-600" : "text-gray-700"
                  } hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent hover:border-green-500 transition-all duration-200`}
                  whileHover={{ y: -2 }}
                >
                  Testimonials
                </motion.a>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              <motion.button
                onClick={() => navigate("/login")}
                className={`${
                  scrolled ? "text-gray-600" : "text-gray-700"
                } hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200`}
                whileHover={{ scale: 1.05 }}
              >
                Sign In
              </motion.button>
              <motion.button
                onClick={() => navigate("/register")}
                className="bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-200 shadow-md"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              >
                Get Started
              </motion.button>
            </div>
            <div className="flex items-center sm:hidden">
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                whileTap={{ scale: 0.95 }}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </motion.button>
            </div>
          </div>
          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              className="sm:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-1 px-2 pt-2 pb-3">
                <a
                  href="#"
                  className="block text-gray-900 px-3 py-2 text-base font-medium border-l-4 border-green-500"
                >
                  Home
                </a>
                <a
                  href="#how-it-works"
                  className="block text-gray-500 hover:text-gray-900 px-3 py-2 text-base font-medium border-l-4 border-transparent hover:border-green-300"
                >
                  How It Works
                </a>
                <a
                  href="#features"
                  className="block text-gray-500 hover:text-gray-900 px-3 py-2 text-base font-medium border-l-4 border-transparent hover:border-green-300"
                >
                  Features
                </a>
                <a
                  href="#testimonials"
                  className="block text-gray-500 hover:text-gray-900 px-3 py-2 text-base font-medium border-l-4 border-transparent hover:border-green-300"
                >
                  Testimonials
                </a>
                <button
                  onClick={() => navigate("/login")}
                  className="block w-full text-left text-gray-500 hover:text-gray-900 px-3 py-2 text-base font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="block w-full bg-green-600 text-white px-3 py-2 rounded-lg text-base font-medium hover:bg-green-700 mt-2"
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </nav>
      </motion.header>

      {/* Hero Section */}
      <motion.div
        className="relative bg-gradient-to-b from-green-50 to-white pt-28 pb-16 sm:pt-32 sm:pb-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="inline-block px-4 py-1.5 text-xs font-semibold bg-green-100 text-green-800 rounded-full mb-4">
                Nepal's Premier Agricultural Marketplace
              </span>
            </motion.div>
            <motion.h1
              className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl md:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="block">Connecting Nepal's Farmers</span>
              <span className="block text-green-600 mt-2">with the World</span>
            </motion.h1>
            <motion.p
              className="mt-6 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-8 md:text-xl md:max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Empowering agriculture through technology. Join our digital
              marketplace connecting farmers with wholesalers and retailers.
            </motion.p>
            <motion.div
              className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <motion.button
                className="w-full flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10 shadow-lg"
                whileHover={{
                  scale: 1.05,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                Explore Marketplace
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <motion.div
          className="absolute top-1/2 left-0 w-40 h-40 bg-green-100 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-0 w-64 h-64 bg-green-100 rounded-full opacity-20 translate-x-1/2"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="py-16 bg-white"
        id="features"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center" variants={fadeIn}>
            <motion.span
              className="inline-block px-3 py-1 text-sm font-semibold bg-green-100 text-green-800 rounded-full mb-4"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Features
            </motion.span>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Platform Features
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Everything you need to connect, trade, and grow your agricultural
              business
            </p>
          </motion.div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  variants={featureCardVariant}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                >
                  <div className="flow-root bg-white rounded-xl px-6 pb-8 pt-12 shadow-lg border border-gray-100 h-full">
                    <div className="absolute -top-6 inset-x-0 flex justify-center">
                      <div className="inline-flex items-center justify-center p-3 bg-green-600 rounded-lg shadow-lg">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-900 tracking-tight text-center">
                      {feature.title}
                    </h3>
                    <p className="mt-4 text-base text-gray-500 text-center">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* How It Works Section */}
      <motion.div
        className="bg-gradient-to-b from-white to-green-50 py-16 sm:py-24"
        id="how-it-works"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center" variants={fadeIn}>
            <motion.span
              className="inline-block px-3 py-1 text-sm font-semibold bg-green-100 text-green-800 rounded-full mb-4"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Process
            </motion.span>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Simple steps to get started with Fasal Bajar
            </p>
          </motion.div>

          <div className="mt-16 relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-green-200 -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  variants={featureCardVariant}
                  custom={index}
                >
                  <div className="relative bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <div className="text-center">
                      <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-600 text-white mb-4 text-lg font-bold">
                        {index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-base text-gray-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-20">
                      <ArrowRight className="h-6 w-6 text-green-500" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        className="py-16 bg-white"
        id="testimonials"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center" variants={fadeIn}>
            <motion.span
              className="inline-block px-3 py-1 text-sm font-semibold bg-green-100 text-green-800 rounded-full mb-4"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Testimonials
            </motion.span>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What Our Users Say
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Hear from the farmers and businesses who use Fasal Bajar
            </p>
          </motion.div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
                  variants={featureCardVariant}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div className="flex flex-col sm:flex-row items-start">
                    <div className="flex-shrink-0 mb-4 sm:mb-0">
                      <div className="relative">
                        <img
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="h-16 w-16 rounded-full object-cover border-2 border-green-500"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                          <Star className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="sm:ml-6">
                      <div className="flex mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-lg text-gray-800 italic">
                        "{testimonial.quote}"
                      </p>
                      <div className="mt-4">
                        <p className="text-base font-semibold text-gray-900">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        className="bg-gradient-to-r from-green-600 to-green-700"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 sm:py-24">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-lg text-green-100 max-w-2xl mx-auto">
              Join Fasal Bajar today and be part of Nepal's digital agriculture
              revolution. Connect with buyers and sellers across the country.
            </p>
            <motion.div className="mt-10" whileHover={{ scale: 1.05 }}>
              <motion.button
                onClick={() => {
                  navigate("/register");
                }}
                className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-medium rounded-lg text-green-700 bg-white hover:bg-green-50 md:py-4 md:text-lg md:px-10 shadow-xl transition-all duration-200"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign Up Now
                <ChevronRight className="ml-2 h-5 w-5" />
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="relative overflow-hidden">
          <motion.div
            className="absolute -bottom-16 -left-16 w-64 h-64 bg-green-500 rounded-full opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute -top-20 -right-20 w-80 h-80 bg-green-500 rounded-full opacity-10"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <motion.div className="flex items-center" whileHover={{ x: 5 }}>
                <Leaf className="h-8 w-8 text-green-500" />
                <span className="ml-2 text-xl font-bold text-white">
                  Fasal Bajar
                </span>
              </motion.div>
              <p className="mt-4 text-gray-300 max-w-md">
                Connecting Nepal's farmers with wholesalers and retailers
                through technology. Empowering agricultural communities across
                the nation.
              </p>
              <div className="mt-6">
                <motion.button
                  className="bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-200 shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Download Our App
                </motion.button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <motion.a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                    whileHover={{ x: 5, color: "#ffffff" }}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    About Us
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                    whileHover={{ x: 5, color: "#ffffff" }}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Our Services
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                    whileHover={{ x: 5, color: "#ffffff" }}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Privacy Policy
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                    whileHover={{ x: 5, color: "#ffffff" }}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Terms & Conditions
                  </motion.a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                Contact
              </h3>
              <div className="space-y-3">
                <motion.a
                  href="tel:+9771234567890"
                  className="text-gray-300 hover:text-white flex items-center group"
                  whileHover={{ x: 5 }}
                >
                  <div className="bg-green-600 p-2 rounded-full mr-3 group-hover:bg-green-500 transition-colors duration-200">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  +977 1234567890
                </motion.a>
                <motion.a
                  href="mailto:info@fasalbajar.com"
                  className="text-gray-300 hover:text-white flex items-center group"
                  whileHover={{ x: 5 }}
                >
                  <div className="bg-green-600 p-2 rounded-full mr-3 group-hover:bg-green-500 transition-colors duration-200">
                    <Mail className="h-4 w-4 text-white" />
                  </div>
                  info@fasalbajar.com
                </motion.a>
              </div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mt-8 mb-4">
                Follow Us
              </h3>
              <div className="flex space-x-4">
                <motion.a
                  href="#"
                  className="text-gray-400 hover:text-white"
                  whileHover={{ y: -5, scale: 1.2 }}
                >
                  <div className="bg-gray-800 p-2 rounded-full hover:bg-green-600 transition-colors duration-200">
                    <Facebook className="h-5 w-5" />
                  </div>
                </motion.a>
                <motion.a
                  href="#"
                  className="text-gray-400 hover:text-white"
                  whileHover={{ y: -5, scale: 1.2 }}
                >
                  <div className="bg-gray-800 p-2 rounded-full hover:bg-green-600 transition-colors duration-200">
                    <Twitter className="h-5 w-5" />
                  </div>
                </motion.a>
                <motion.a
                  href="#"
                  className="text-gray-400 hover:text-white"
                  whileHover={{ y: -5, scale: 1.2 }}
                >
                  <div className="bg-gray-800 p-2 rounded-full hover:bg-green-600 transition-colors duration-200">
                    <Instagram className="h-5 w-5" />
                  </div>
                </motion.a>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 text-center">
              © {new Date().getFullYear()} Fasal Bajar. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
