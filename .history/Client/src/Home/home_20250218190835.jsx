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

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition duration-200 ease-in-out z-30 md:hidden`}
      >
        <Sidebar />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="min-h-screen">
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
