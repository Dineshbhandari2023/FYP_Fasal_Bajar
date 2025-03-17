import React, { useState } from "react";

const EditProduct = ({ product, isOpen, onClose, onSave }) => {
  // Local state to store updated fields
  const [formData, setFormData] = useState({
    productName: product?.productName || "",
    productType: product?.productType || "",
    quantity: product?.quantity || 0,
    price: product?.price || 0,
    location: product?.location || "",
  });

  // Update local state when user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Call the onSave prop with updated data
  const handleSave = () => {
    onSave(formData);
  };

  if (!isOpen) return null; // If modal is closed, render nothing

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 w-full max-w-md rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Edit Product</h2>

        <div className="mb-4">
          <label className="block mb-1">Product Name</label>
          <input
            name="productName"
            className="border w-full p-2"
            value={formData.productName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Product Type</label>
          <input
            name="productType"
            className="border w-full p-2"
            value={formData.productType}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Quantity (kg)</label>
          <input
            name="quantity"
            type="number"
            className="border w-full p-2"
            value={formData.quantity}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Price (per kg)</label>
          <input
            name="price"
            type="number"
            className="border w-full p-2"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Location</label>
          <input
            name="location"
            className="border w-full p-2"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
