import React, { useState, useEffect } from "react";
import Sidebar from "../pages/Sidebar";
import Navbar from "../pages/Navbar";
import CreateProduct from "./CreateProduct";

const Product = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setSidebarOpen(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="relative flex min-h-screen bg-gray-100">
      {/* Overlay (only on mobile when sidebar is open) */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          ${isMobile ? "fixed" : "relative"} 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          top-0 left-0 
          h-screen w-64 
          bg-white 
          shadow 
          transition-transform duration-300 ease-in-out 
          z-30
        `}
      >
        <Sidebar isOpen={isSidebarOpen} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onMenuClick={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          isMobile={isMobile}
        />
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          <div className="max-w-full mx-auto">
            <CreateProduct />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Product;
