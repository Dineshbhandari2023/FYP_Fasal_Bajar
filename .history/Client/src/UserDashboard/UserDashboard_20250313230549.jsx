import React, { useState } from "react";

const UserDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [language, setLanguage] = useState("en");
  const [orders, setOrders] = useState([
    {
      id: 1,
      status: "Processing",
      date: "2023-07-20",
    },
    {
      id: 2,
      status: "Shipped",
      date: "2023-07-21",
    },
  ]);

  const categories = ["All", "Fruits", "Vegetables", "Grains", "Meat"];
  const locations = ["All", "Local", "National"];

  // Sample products
  const products = [
    {
      id: 1,
      name: "Fresh Apples",
      price: 2.5,
      location: "Local",
      category: "Fruits",
      available: true,
    },
    {
      id: 2,
      name: "Brown Rice",
      price: 4.0,
      location: "National",
      category: "Grains",
      available: false,
    },
    // Add more products as needed
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-600">Fasal Bajar</h1>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search products..."
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-48"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-48"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>

            {/* Language selector */}
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-32"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>

            {/* Cart icon */}
            <button
              className="bg-green-500 text-white rounded-full p-3 fixed bottom-4 right-4"
              onClick={() => setCartOpen(true)}
            >
              🛒 {cartItems.length}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* Filters applied */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          <p className="text-gray-600">
            Showing {products.length} results for "{searchQuery}" in "
            {selectedLocation}"
          </p>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
                <span className="bg-green-100 px-2 py-1 rounded-full text-sm text-green-600">
                  {product.available ? "Available" : "Sold Out"}
                </span>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500">₹{product.price}</span>
                <span className="text-sm text-gray-500">
                  Category: {product.category}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Location: {product.location}
                </p>
                {product.available ? (
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
                    onClick={() => {
                      const newCart = [...cartItems, product];
                      setCartItems(newCart);
                    }}
                  >
                    Add to Cart
                  </button>
                ) : (
                  <p className="text-gray-500">Sold Out</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Orders history */}
        <div className="bg-white shadow-md rounded-lg p-4 mt-6">
          <h2 className="text-xl font-semibold mb-4">My Orders</h2>
          {orders.map((order) => (
            <div key={order.id} className="border-t pt-4 last:border-b-0">
              <div className="flex justify-between items-center mb-3">
                <p className="font-medium text-gray-800">{order.name}</p>
                <span className="bg-green-100 px-2 py-1 rounded-full text-sm text-green-600">
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-1">
                Order ID: #{order.id}
              </p>
              <p className="text-sm text-gray-500">Date: {order.date}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Cart modal */}
      <div
        className={
          cartOpen
            ? "fixed bottom-4 right-4 w-96 bg-white shadow-xl rounded-lg m-4"
            : "hidden"
        }
      >
        <div className="p-4">
          <h3 className="font-semibold mb-4">Your Cart</h3>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center mb-2"
            >
              <span>{item.name}</span>
              <span>₹{item.price}</span>
            </div>
          ))}
          <button
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors duration-200"
            onClick={() => setCartOpen(false)}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
