import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, createProduct } from "../Redux/slice/productstore";
import { Upload } from "lucide-react";

const CreateProduct = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  const [formData, setFormData] = useState({
    productName: "",
    productType: "",
    quantity: "",
    price: "",
    location: "",
    // categoryId: "",
    imageFile: null,
  });
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  // Optionally fetch existing products on mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Validate the form to ensure all required fields are present
  const validateForm = () => {
    const newErrors = {};
    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required";
    }
    if (!formData.productType.trim()) {
      newErrors.productType = "Product type is required";
    }
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      newErrors.quantity = "Valid quantity is required";
    }
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg("");
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Build FormData for multipart/form-data
    const data = new FormData();
    data.append("productName", formData.productName);
    data.append("productType", formData.productType);
    data.append("quantity", formData.quantity);
    data.append("price", formData.price);
    data.append("location", formData.location);
    // data.append("categoryId", formData.categoryId); // Uncomment if needed

    // If user selected a file, append it as "image" (matching your multer field name)
    if (formData.imageFile) {
      data.append("image", formData.imageFile);
    }

    dispatch(createProduct(data))
      .unwrap()
      .then((createdProduct) => {
        // Clear form on success and display a success message
        setFormData({
          productName: "",
          productType: "",
          quantity: "",
          price: "",
          location: "",
          // categoryId: "",
          imageFile: null,
        });
        setErrors({});
        setSuccessMsg("Product created successfully!");
      })
      .catch((err) => {
        console.error("Error creating product:", err);
      });
  };

  // Handle text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle file input
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        imageFile: e.target.files[0],
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Create Product</h2>
      </div>

      {/* Display API error or success message if any */}
      {/* {error && <p className="text-red-500 mb-4">Error: {error}</p>} */}
      {successMsg && <p className="text-green-500 mb-4">{successMsg}</p>}

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

              {/* Product Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Type
                </label>
                <input
                  type="text"
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.productType ? "border-red-500" : "border-gray-300"
                  } px-3 py-2`}
                  placeholder="e.g. Vegetable, Fruit, Grain"
                />
                {errors.productType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.productType}
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

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price (per kg)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  } px-3 py-2`}
                  placeholder="Enter price per kg"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.location ? "border-red-500" : "border-gray-300"
                  } px-3 py-2`}
                  placeholder="e.g. Kathmandu"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Drag and drop or browse
                  </p>
                  <input
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    className="mt-2"
                    accept="image/*"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
              >
                {loading ? "Posting..." : "Post Product"}
              </button>
            </div>
          </form>
        </div>

        {/* Current Listings & extra information */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Current Listings</h3>
            {loading && <p className="text-gray-500">Loading products...</p>}
            {products.map((p) => (
              <div key={p.id} className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{p.productName}</h4>
                  <p className="text-sm text-gray-500">
                    {p.quantity} kg • {p.productType}
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
            {/* Additional information can be added here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
