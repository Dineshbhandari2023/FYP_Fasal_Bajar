import React, { useState } from "react";

const TopBar = () => {
  return (
    <div className="hidden lg:block w-full bg-gray-100">
      <div className="max-w-7xl mx-auto px-5 py-3 flex justify-between items-center">
        {/* Left: phone number */}
        <div className="flex items-center space-x-2">
          <i className="bi bi-phone-vibrate text-green-600 text-2xl"></i>
          <h2 className="text-lg font-semibold">+012 345 6789</h2>
        </div>

        {/* Center: brand name */}
        <div className="flex items-center justify-center">
          <a href="/" className="text-4xl font-bold text-green-700">
            <span className="text-orange-600">Farm</span>Fresh
          </a>
        </div>

        {/* Right: social icons */}
        <div className="flex items-center space-x-2">
          <a
            href="#"
            className="bg-green-600 text-white w-9 h-9 flex items-center justify-center rounded-full"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="#"
            className="bg-green-600 text-white w-9 h-9 flex items-center justify-center rounded-full"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="#"
            className="bg-green-600 text-white w-9 h-9 flex items-center justify-center rounded-full"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a
            href="#"
            className="bg-green-600 text-white w-9 h-9 flex items-center justify-center rounded-full"
          >
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
