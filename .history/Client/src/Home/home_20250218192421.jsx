import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Body from "./body";

const Home = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 right-4 lg:hidden p-2 rounded-full z-50"
      >
        <Sidebar />
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed left-64 top-0 h-screen w-64 bg-[#2A3B2A]">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex justify-start items-center mx-auto px-4 sm:px-6 lg:px-8">
        <Navbar onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        <Body />
      </div>

      {/* Footer */}
      <div className="py-4 text-center text-sm text-gray-600 md:ml-64">
        <p>© 2025 Fasal_Bajar. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="hover:text-gray-900">
            Terms of Service
          </a>
          <a href="#" className="hover:text-gray-900">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-gray-900">
            Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
