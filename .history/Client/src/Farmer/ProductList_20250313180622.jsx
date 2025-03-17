import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../Redux/slice/productSlice";
import { Package, TrendingUp, MessageCircle } from "lucide-react";

const Body = () => {
  const dispatch = useDispatch();

  // Fetch products from Redux store
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="p-6 mt-16 md:ml-64">
      <div className="bg-[#2A3B2A] text-white p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-semibold mb-2">Welcome back!</h1>
        <p>Ready to explore today's fresh products from our trusted farmers?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <button className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <Package className="h-6 w-6 text-green-600" />
          <span className="font-bold tracking-wide">Browse Products</span>
        </button>
        <button className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <TrendingUp className="h-6 w-6 text-green-600" />
          <span className="font-bold tracking-wide">View Orders</span>
        </button>
        <button className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <MessageCircle className="h-6 w-6 text-green-600" />
          <span className="font-bold tracking-wide">Contact Supplier</span>
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {products &&
          products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <img
                src={`http://localhost:8000/${product.image}`}
                alt={product.productName}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium">{product.productName}</h3>
                <p className="text-gray-600">{product.price}</p>
              </div>
            </div>
          ))}
      </div>

      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default Body;
