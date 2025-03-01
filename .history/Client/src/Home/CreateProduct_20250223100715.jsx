import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import {
  Upload,
  Bell,
  Home,
  Package,
  BarChart2,
  Settings,
  ChevronRight,
} from "lucide-react";

// Main App Component
const CreateProduct = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 p-6">
          <CreateProduct />
        </main>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { icon: Home, label: "Dashboard", href: "#" },
    { icon: Package, label: "Create Product", href: "#", active: true },
    { icon: Package, label: "My Products", href: "#" },
    { icon: BarChart2, label: "Analytics", href: "#" },
    { icon: Settings, label: "Settings", href: "#" },
  ];

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-green-800 text-white transition-all duration-300 ease-in-out`}
    >
      <div className="p-4">
        <h1 className={`text-xl font-bold ${!isOpen && "hidden"}`}>
          AgroMarket
        </h1>
      </div>
      <nav className="mt-4">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className={`flex items-center px-4 py-3 hover:bg-green-700 ${
              item.active ? "bg-green-700" : ""
            }`}
          >
            <item.icon className="h-5 w-5" />
            {isOpen && <span className="ml-3">{item.label}</span>}
          </a>
        ))}
      </nav>
    </aside>
  );
};

// Navbar Component
const Navbar = ({ onMenuClick }) => {
  return (
    <header className="bg-white shadow">
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={onMenuClick}
          className="text-gray-600 hover:text-gray-900"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-gray-900">
            <Bell className="h-6 w-6" />
          </button>
          <div className="h-8 w-8 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </header>
  );
};

// Create Product Component
const CreateProduct = () => {
  const [formData, setFormData] = useState({
    productName: "",
    quantity: "",
    harvestDate: "",
    images: [],
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required";
    }
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = "Valid quantity is required";
    }
    if (!formData.harvestDate) {
      newErrors.harvestDate = "Harvest date is required";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      // Handle form submission
      console.log("Form submitted:", formData);
    } else {
      setErrors(newErrors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Create Product</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Product Details</h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.productName ? "border-red-500" : "border-gray-300"
                  } px-3 py-2`}
                  placeholder="Enter product name"
                />
                {errors.productName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.productName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity (kg)
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.quantity ? "border-red-500" : "border-gray-300"
                  } px-3 py-2`}
                  placeholder="Enter quantity"
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Expected Harvest Date
                </label>
                <input
                  type="date"
                  name="harvestDate"
                  value={formData.harvestDate}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.harvestDate ? "border-red-500" : "border-gray-300"
                  } px-3 py-2`}
                />
                {errors.harvestDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.harvestDate}
                  </p>
                )}
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drag and drop your product images here, or browse
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
              >
                Post Product
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Current Listings</h3>
            <div className="space-y-4">
              {[
                {
                  name: "Organic Tomatoes",
                  quantity: "500 kg",
                  harvest: "Aug 16, 2025",
                },
                {
                  name: "Sweet Corn",
                  quantity: "1000 kg",
                  harvest: "Sep 1, 2025",
                },
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-500">
                      {product.quantity} • Harvest: {product.harvest}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Market Insights</h3>
            <div>
              <h4 className="font-medium mb-2">Trending Crops</h4>
              <div className="flex space-x-2">
                {["Tomatoes", "Potatoes", "Corn"].map((crop, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {crop}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold">85%</p>
                <p className="text-sm text-gray-500">Market Demand</p>
              </div>
              <div>
                <p className="text-2xl font-bold">$2.5</p>
                <p className="text-sm text-gray-500">Avg. Price/kg</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">+12%</p>
                <p className="text-sm text-gray-500">Price Trend</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
