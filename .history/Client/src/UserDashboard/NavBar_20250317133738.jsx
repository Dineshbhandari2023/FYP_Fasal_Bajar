"use client";

import { useState, useEffect } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleNav = () => {
    setNavOpen(!navOpen);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md text-green-800"
          : "bg-gradient-to-r from-green-500 to-green-600 text-white"
      }`}
    >
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* BRAND */}
          <div className="flex-shrink-0">
            <a
              href="/user-dashboard"
              className="flex items-center text-2xl sm:text-3xl lg:text-4xl font-bold"
            >
              <span className="text-orange-500 transition-colors duration-300">
                Fasal
              </span>
              <span
                className={`${
                  scrolled ? "text-green-700" : "text-white"
                } transition-colors duration-300`}
              >
                Bajar
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            <NavLink href="/user-dashboard" scrolled={scrolled}>
              Home
            </NavLink>
            <NavLink href="/about" scrolled={scrolled}>
              About
            </NavLink>
            <NavLink href="/service" scrolled={scrolled}>
              Service
            </NavLink>
            <NavLink href="/product" scrolled={scrolled}>
              Product
            </NavLink>

            {/* Dropdown (Pages) */}
            <div className="relative group">
              <button
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  scrolled
                    ? "text-green-800 hover:bg-green-100"
                    : "text-white hover:bg-green-700"
                } transition-colors duration-200`}
              >
                Pages <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                <div className="py-1">
                  <a
                    href="/features"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                  >
                    Features
                  </a>
                  <a
                    href="/testimonials"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                  >
                    Testimonials
                  </a>
                </div>
              </div>
            </div>

            <NavLink href="/contact" scrolled={scrolled}>
              Contact
            </NavLink>
            <NavLink href="/profile" scrolled={scrolled}>
              View Profile
            </NavLink>
          </div>

          {/* Contact Info & Social - Desktop */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <div
              className={`flex items-center space-x-2 ${
                scrolled ? "text-green-700" : "text-white"
              }`}
            >
              <Phone className="h-5 w-5 text-orange-500" />
              <span className="font-medium">+977 98********</span>
            </div>

            <div className="flex items-center space-x-2">
              <SocialIcon icon="twitter" scrolled={scrolled} />
              <SocialIcon icon="facebook" scrolled={scrolled} />
              <SocialIcon icon="linkedin" scrolled={scrolled} />
              <SocialIcon icon="instagram" scrolled={scrolled} />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={toggleNav}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                scrolled
                  ? "text-green-800 hover:text-green-600 hover:bg-green-100"
                  : "text-white hover:text-white hover:bg-green-700"
              } focus:outline-none transition duration-150 ease-in-out`}
              aria-label="Toggle Navigation"
            >
              {navOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          navOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className={`px-2 pt-2 pb-3 space-y-1 ${
            scrolled ? "bg-white" : "bg-green-600"
          }`}
        >
          <MobileNavLink href="/user-dashboard" scrolled={scrolled}>
            Home
          </MobileNavLink>
          <MobileNavLink href="/about" scrolled={scrolled}>
            About
          </MobileNavLink>
          <MobileNavLink href="/service" scrolled={scrolled}>
            Service
          </MobileNavLink>
          <MobileNavLink href="/product" scrolled={scrolled}>
            Product
          </MobileNavLink>

          {/* Mobile Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.currentTarget.nextElementSibling.classList.toggle("hidden");
              }}
              className={`w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium ${
                scrolled
                  ? "text-green-800 hover:bg-green-100"
                  : "text-white hover:bg-green-700"
              }`}
            >
              Pages
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            <div className="hidden pl-4 py-2 space-y-1">
              <a
                href="/features"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  scrolled
                    ? "text-green-800 hover:bg-green-100"
                    : "text-white hover:bg-green-700"
                }`}
              >
                Features
              </a>
              <a
                href="/testimonials"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  scrolled
                    ? "text-green-800 hover:bg-green-100"
                    : "text-white hover:bg-green-700"
                }`}
              >
                Testimonials
              </a>
            </div>
          </div>

          <MobileNavLink href="/contact" scrolled={scrolled}>
            Contact
          </MobileNavLink>
          <MobileNavLink href="/profile" scrolled={scrolled}>
            View Profile
          </MobileNavLink>

          {/* Contact Info - Mobile */}
          <div
            className={`flex items-center space-x-2 px-3 py-2 ${
              scrolled ? "text-green-800" : "text-white"
            }`}
          >
            <Phone className="h-5 w-5 text-orange-500" />
            <span className="font-medium">+977 98********</span>
          </div>

          {/* Social Icons - Mobile */}
          <div className="flex items-center space-x-2 px-3 py-2">
            <SocialIcon icon="twitter" scrolled={scrolled} mobile />
            <SocialIcon icon="facebook" scrolled={scrolled} mobile />
            <SocialIcon icon="linkedin" scrolled={scrolled} mobile />
            <SocialIcon icon="instagram" scrolled={scrolled} mobile />
          </div>
        </div>
      </div>
    </nav>
  );
};

// Desktop Navigation Link Component
const NavLink = ({ href, children, scrolled }) => (
  <a
    href={href}
    className={`px-3 py-2 rounded-md text-sm font-medium ${
      scrolled
        ? "text-green-800 hover:bg-green-100 hover:text-green-700"
        : "text-white hover:bg-green-700 hover:text-white"
    } transition-colors duration-200`}
  >
    {children}
  </a>
);

// Mobile Navigation Link Component
const MobileNavLink = ({ href, children, scrolled }) => (
  <a
    href={href}
    className={`block px-3 py-2 rounded-md text-base font-medium ${
      scrolled
        ? "text-green-800 hover:bg-green-100"
        : "text-white hover:bg-green-700"
    }`}
  >
    {children}
  </a>
);

// Social Icon Component
const SocialIcon = ({ icon, scrolled, mobile = false }) => {
  const getIconClass = () => {
    switch (icon) {
      case "twitter":
        return "fab fa-twitter";
      case "facebook":
        return "fab fa-facebook-f";
      case "linkedin":
        return "fab fa-linkedin-in";
      case "instagram":
        return "fab fa-instagram";
      default:
        return "fab fa-twitter";
    }
  };

  return (
    <a
      href="#"
      className={`${
        mobile ? "w-8 h-8" : "w-9 h-9"
      } flex items-center justify-center rounded-full transition-colors duration-200 ${
        scrolled
          ? "bg-green-100 text-green-700 hover:bg-green-200"
          : "bg-green-700 text-white hover:bg-green-800"
      }`}
    >
      <i className={getIconClass()}></i>
    </a>
  );
};

export default Navbar;
