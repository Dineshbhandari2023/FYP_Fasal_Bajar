import React, { useState, useEffect } from "react";

const EditProduct = ({ product, isOpen, onClose, onSave }) => {
  // Initialize local state with empty values
  const [formData, setFormData] = useState({
    productName: "",
    productType: "",
    quantity: 0,
    price: 0,
    location: "",
  });

  // When the modal opens or product changes, populate form fields with product's current details
  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName || "",
        productType: product.productType || "",
        quantity: product.quantity || 0,
        price: product.price || 0,
        location: product.location || "",
      });
    }
  }, [product]);

  // Update local form state on change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  // If modal is not open, render nothing
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 w-full max-w-md rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Product Name</label>
            <input
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter product name"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Product Type</label>
            <input
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter product type"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Quantity (kg)</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter quantity"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Price (per kg)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter price"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter location"
            />
          </div>

          {/* Optional: Display current image if available */}
          {product && product.image && (
            <div className="mb-4">
              <label className="block mb-1">Current Image</label>
              <img
                src={`http://localhost:8000/${product.image}`}
                alt={product.productName}
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
