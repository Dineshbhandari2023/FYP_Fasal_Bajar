import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, createProduct } from "../Redux/slice/productstore";
import { Upload } from "lucide-react";

// Create Product Component
const CreateProduct = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  const [formData, setFormData] = useState({
    productName: "",
    quantity: "",
    harvestDate: "",
    // If your backend expects an array of images or file uploads, you'll handle this differently
    images: [],
  });
  const [errors, setErrors] = useState({});

  // Optionally fetch existing products on mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Basic client-side validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required";
    }
    if (!formData.quantity || Number(formData.quantity) <= 0) {
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
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Build the object you want to send to the server
    const newProductData = {
      name: formData.productName,
      quantity: formData.quantity,
      harvestDate: formData.harvestDate,
      // If you're not using file uploads yet, skip images
      images: formData.images,
    };

    // Dispatch the createProduct thunk
    dispatch(createProduct(newProductData))
      .unwrap()
      .then(() => {
        // Clear the form on success
        setFormData({
          productName: "",
          quantity: "",
          harvestDate: "",
          images: [],
        });
      })
      .catch((err) => {
        console.error("Error creating product:", err);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field-level errors
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

      {/* If needed, show a global error from the store */}
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CREATE PRODUCT FORM */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Product Details</h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Product Name */}
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

              {/* Quantity */}
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

              {/* Harvest Date */}
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

              {/* Placeholder for images */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drag and drop product images here, or browse
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
              >
                Post Product
              </button>
            </div>
          </form>
        </div>

        {/* Some Mock UI / Additional Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Current Listings</h3>
            {loading && <p className="text-gray-500">Loading products...</p>}
            {/* Example local mock or existing data */}
            {products.map((p) => (
              <div key={p.id} className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{p.name}</h4>
                  <p className="text-sm text-gray-500">
                    {p.quantity} kg • Harvest: {p.harvestDate}
                  </p>
                </div>
                <span className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded">
                  Active
                </span>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Market Insights</h3>
            {/* ...some other stuff */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
