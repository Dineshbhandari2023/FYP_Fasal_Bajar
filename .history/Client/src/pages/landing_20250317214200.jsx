import React, { useState } from "react";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      title: "Product Posting",
      description: "Easily list your agricultural products",
    },
    {
      title: "Order Management",
      description: "Track and manage all your orders",
    },
    {
      title: "Real-time Updates",
      description: "Get instant notifications on orders",
    },
    { title: "Location Filtering", description: "Find products in your area" },
  ];

  const steps = [
    {
      title: "Create Profile",
      description: "Sign up and complete your profile",
    },
    { title: "Post Products", description: "List your products with details" },
    {
      title: "Browse Products",
      description: "Search and filter available items",
    },
    { title: "Place Orders", description: "Purchase products securely" },
  ];

  const testimonials = [
    {
      name: "Ram Krishna",
      role: "Farmer",
      quote: "Fasal Bajar has helped me reach more buyers than ever before.",
    },
    {
      name: "Sita Sharma",
      role: "Wholesaler",
      quote: "Finding quality produce has never been easier. Great platform!",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center justify-between">
              <div className="flex-shrink-0 flex items-center">
                <Leaf className="h-8 w-8 text-green-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  Fasal Bajar
                </span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8 sm:space-x-20 md:flex md:ml-80 ">
                <a
                  href="#"
                  className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  How It Works
                </a>
                {/* <a
                  href="#"
                  className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Farmers
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Buyers
                </a> */}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              <button
                onClick={() => navigate("/login")}
                className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
              >
                Get Started
              </button>
            </div>
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="sm:hidden">
              <div className="space-y-1 px-2 pt-2 pb-3">
                <a
                  href="#"
                  className="block text-gray-900 px-3 py-2 text-base font-medium"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="block text-gray-500 hover:text-gray-900 px-3 py-2 text-base font-medium"
                >
                  How It Works
                </a>
                <a
                  href="#"
                  className="block text-gray-500 hover:text-gray-900 px-3 py-2 text-base font-medium"
                >
                  Farmers
                </a>
                <a
                  href="#"
                  className="block text-gray-500 hover:text-gray-900 px-3 py-2 text-base font-medium"
                >
                  Buyers
                </a>
                <button
                  onClick={() => navigate("/login")}
                  className="block w-full text-left text-gray-500 hover:text-gray-900 px-3 py-2 text-base font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="block w-full bg-green-600 text-white px-3 py-2 rounded-lg text-base font-medium hover:bg-green-700"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Connecting Nepal's Farmers</span>
              <span className="block text-green-600">with the World</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Empowering agriculture through technology. Join our digital
              marketplace connecting farmers with wholesalers and retailers.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10">
                  Explore Marketplace
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Platform Features
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Everything you need to connect, trade, and grow
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div className="inline-flex items-center justify-center p-3 bg-green-600 rounded-md shadow-lg">
                        <Leaf className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Simple steps to get started with Fasal Bajar
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="relative bg-white p-6 rounded-lg shadow-sm">
                    <div className="text-center">
                      <span className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-green-600 text-white mb-4">
                        {index + 1}
                      </span>
                      <h3 className="text-lg font-medium text-gray-900">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-base text-gray-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What Our Users Say
            </h2>
          </div>
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Star className="h-6 w-6 text-yellow-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-lg text-gray-900 italic">
                        "{testimonial.quote}"
                      </p>
                      <div className="mt-4">
                        <p className="text-base font-medium text-gray-900">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-lg text-green-100">
              Join Fasal Bajar today and be part of Nepal's digital agriculture
              revolution.
            </p>
            <div className="mt-8">
              <button
                onClick={() => {
                  navigate("/register");
                }}
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50 md:py-4 md:text-lg md:px-10"
              >
                Sign Up Now
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center">
                <Leaf className="h-8 w-8 text-green-500" />
                <span className="ml-2 text-xl font-bold text-white">
                  Fasal Bajar
                </span>
              </div>
              <p className="mt-4 text-gray-300">
                Connecting Nepal's farmers with wholesalers and retailers
                through technology.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Contact
              </h3>
              <div className="mt-4 space-y-4">
                <a
                  href="#"
                  className="text-base text-gray-300 hover:text-white flex items-center"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  +977 1234567890
                </a>
                <a
                  href="#"
                  className="text-base text-gray-300 hover:text-white flex items-center"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  info@fasalbajar.com
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Follow Us
              </h3>
              <div className="mt-4 flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-300">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300">
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 text-center">
              © 2025 Fasal Bajar. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
