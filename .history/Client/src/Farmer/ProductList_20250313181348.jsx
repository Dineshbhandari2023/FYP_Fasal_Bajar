// ProductList.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Pencil, Trash2 } from "lucide-react";
import Sidebar from "./Sidebar";
import {
  fetchMyProducts,
  deleteProduct,
  updateProduct,
} from "../Redux/slice/productSlice";

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMyProducts());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const handleUpdate = (product) => {
    console.log("Update product", product);
    // Add your update modal logic here
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex">
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} />

      <div className="flex-1 p-6 md:ml-64">
        <div className="md:hidden mb-4">
          <button className="text-gray-600" onClick={toggleMobileMenu}>
            <Menu size={24} />
          </button>
          <h2 className="text-2xl font-bold">My Products</h2>
      </div>

      <div className="hidden md:block mb-4">
        <h2 className="text-2xl font-bold">My Products</h2>
      </div>

      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <table className="min-w-full border bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Image</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Type</th>
            <th className="px-4 py-2 border">Quantity (kg)</th>
            <th className="px-4 py-2 border">Price (per kg)</th>
            <th className="px-4 py-2 border">Location</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="text-center">
              <td className="px-4 py-2 border">
                {product.image ? (
                  <img
                    src={`http://localhost:8000/${product.image}`}
                    alt={product.productName}
                    className="w-16 h-16 object-cover mx-auto"
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td className="px-4 py-2 border">{product.productName}</td>
              <td className="px-4 py-2 border">{product.productType}</td>
              <td className="px-4 py-2 border">{product.quantity}</td>
              <td className="px-4 py-2 border">${product.price}</td>
              <td className="px-4 py-2 border">{product.location}</td>
              <td className="px-4 py-2 border">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                  onClick={() => handleUpdate(product)}
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>)};
    

export default ProductList;