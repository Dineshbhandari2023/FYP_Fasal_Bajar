import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Pencil, Trash2 } from "lucide-react";
import {
  fetchMyProducts,
  deleteProduct,
  updateProduct,
} from "../Redux/slice/productSlice";
import Sidebar from "../pages/Sidebar";
import EditProduct from "../Farmer/EditProduct"; // import the modal

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // For editing a product
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch products for the logged-in user on component mount
  useEffect(() => {
    dispatch(fetchMyProducts());
  }, [dispatch]);

  // Delete product
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  // Open edit modal
  const openEditModal = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setSelectedProduct(null);
    setIsEditModalOpen(false);
  };

  // Called when user saves the updated data in the modal
  const handleSaveChanges = (updatedFields) => {
    // Combine original product with updated fields
    const formData = {
      ...selectedProduct,
      ...updatedFields,
    };

    dispatch(updateProduct({ productId: selectedProduct.id, formData }));
    closeEditModal();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex">
      {/* Sidebar component */}
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} />

      {/* Main content container */}
      <div className="flex-1 p-4 md:ml-64">
        {/* Mobile header with toggle button */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-700 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h2 className="text-2xl font-bold">My Products</h2>
        </div>

        {/* Desktop header */}
        <div className="hidden md:block mb-4">
          <h2 className="text-2xl font-bold">My Products</h2>
        </div>

        {/* Content */}
        {loading && <p>Loading products...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && products?.length === 0 && <p>No products found.</p>}

        <table className="min-w-full border">
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
            {products?.map((product) => (
              <tr key={product.id} className="text-center">
                {/* Display product image */}
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
                <td className="px-4 py-2 border">{product.price}</td>
                <td className="px-4 py-2 border">{product.location}</td>
                <td className="px-4 py-2 border">
                  {/* Edit Button */}
                  <button
                    className="bg-blue-500 text-white px-2 py-1 mr-2 rounded hover:bg-blue-600"
                    onClick={() => openEditModal(product)}
                  >
                    <Pencil size={16} />
                  </button>
                  {/* Delete Button */}
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Edit Modal */}
        <EditProductModal
          product={selectedProduct}
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSave={handleSaveChanges}
        />
      </div>
    </div>
  );
};

export default ProductList;
