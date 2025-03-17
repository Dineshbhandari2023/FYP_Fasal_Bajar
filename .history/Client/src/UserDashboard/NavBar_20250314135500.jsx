import React, { useState } from "react";

const Navbar = () => {
  const [navOpen, setNavOpen] = useState(false);

  const toggleNav = () => {
    setNavOpen(!navOpen);
  };

  return (
    <nav className="w-full bg-green-400 text-white">
      {/* <div className="flex items-center justify-center">
        <a href="/user-dashboard" className="text-4xl font-bold text-green-700">
          <span className="text-orange-600">Fasal</span>Bajar
        </a>
      </div> */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between lg:justify-end">
        {/* Mobile brand (only visible on smaller screens) */}
        <div className="flex lg:hidden">
          <a href="/user-dashboard" className="text-3xl font-bold">
            <span className="text-orange-400">Fasal</span>Bajar
          </a>
        </div>
        {/* Toggle button (mobile) */}
        <button onClick={toggleNav} className="text-white text-2xl lg:hidden">
          <i className="bi bi-list"></i>
        </button>

        {/* Navbar links */}
        <div
          className={`flex-col lg:flex-row lg:flex items-center space-x-0 lg:space-x-4 absolute lg:static top-[60px] left-0 w-full lg:w-auto bg-green-600 lg:bg-transparent transition-all duration-300 ${
            navOpen ? "flex" : "hidden"
          }`}
        >
          <a
            href="#"
            className="block px-4 py-2 hover:bg-green-500 lg:hover:bg-transparent"
          >
            Home
          </a>
          <a
            href="#"
            className="block px-4 py-2 hover:bg-green-500 lg:hover:bg-transparent"
          >
            About
          </a>
          <a
            href="#"
            className="block px-4 py-2 hover:bg-green-500 lg:hover:bg-transparent"
          >
            Service
          </a>
          <a
            href="#"
            className="block px-4 py-2 hover:bg-green-500 lg:hover:bg-transparent"
          >
            Product
          </a>

          {/* Dropdown (Pages) */}
          <div className="group relative block">
            <button className="w-full text-left px-4 py-2 hover:bg-green-500 lg:hover:bg-transparent">
              Pages <i className="bi bi-caret-down-fill"></i>
            </button>
            <div className="hidden group-hover:block absolute left-0 top-full bg-white text-gray-700 w-40 shadow-md z-10">
              <a href="#" className="block px-3 py-2 hover:bg-gray-200 text-sm">
                Blog Grid
              </a>
              <a href="#" className="block px-3 py-2 hover:bg-gray-200 text-sm">
                Blog Detail
              </a>
              <a href="#" className="block px-3 py-2 hover:bg-gray-200 text-sm">
                Features
              </a>
              <a href="#" className="block px-3 py-2 hover:bg-gray-200 text-sm">
                The Team
              </a>
              <a href="#" className="block px-3 py-2 hover:bg-gray-200 text-sm">
                Testimonial
              </a>
            </div>
          </div>

          <a
            href="#"
            className="block px-4 py-2 hover:bg-green-500 lg:hover:bg-transparent"
          >
            Contact
          </a>

          {/* If user is logged in - add "View Profile" */}
          <a
            href="#"
            className="block px-4 py-2 hover:bg-green-500 lg:hover:bg-transparent"
          >
            View Profile
          </a>
          <div className="flex items-center space-x-2">
            <i className="bi bi-phone-vibrate text-green-400 text-2xl"></i>
            <h2 className="text-lg font-semibold">+977 98********</h2>
          </div>

          <div className="flex items-center space-x-2 ml-8">
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
    </nav>
  );
};

export default Navbar;
