import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, createProduct } from "../Redux/slice/productSlice";
import { Upload } from "lucide-react";

const CreateProduct = () => {
  const dispatch = useDispatch();
  const {
    products = [],
    loading,
    error,
  } = useSelector((state) => state.products || {});

  const [formData, setFormData] = useState({
    productName: "",
    productType: "",
    quantity: "",
    price: "",
    location: "",
    imageFile: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    if (!formData.productName.trim())
      newErrors.productName = "Product name is required";
    if (!formData.productType.trim())
      newErrors.productType = "Product type is required";
    if (!formData.quantity || Number(formData.quantity) <= 0)
      newErrors.quantity = "Valid quantity is required";
    if (!formData.price || Number(formData.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    return newErrors;
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg("");

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    // Prepare FormData for multipart/form-data
    const data = new FormData();
    data.append("productName", formData.productName);
    data.append("productType", formData.productType);
    data.append("quantity", formData.quantity);
    data.append("price", formData.price);
    data.append("location", formData.location);

    // Updated field name to "image" to match backend
    if (formData.imageFile) {
      data.append("image", formData.imageFile);
    }

    // Dispatch createProduct thunk
    dispatch(createProduct(data)).then(() => {
      setSuccessMsg("Product created successfully!");
      setFormData({
        productName: "",
        productType: "",
        quantity: "",
        price: "",
        location: "",
        imageFile: null,
      });
      setFormErrors({});
      dispatch(fetchProducts()); // refresh product list
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        imageFile: e.target.files[0],
      }));
    }
  };

  return (
    // <div className="max-w-4xl mx-auto">
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Create Product</h2>
      </div>

      {/* Success / Error messages */}
      {successMsg && <p className="text-green-500 mb-4">{successMsg}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Product Form */}
        <div className="bg-white p-4 rounded-lg shadow">
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
                    formErrors.productName
                      ? "border-red-500"
                      : "border-gray-300"
                  } px-3 py-2`}
                  placeholder="Enter product name"
                />
                {formErrors.productName && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.productName}
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
                    formErrors.productType
                      ? "border-red-500"
                      : "border-gray-300"
                  } px-3 py-2`}
                  placeholder="e.g. Vegetable, Fruit, Grain"
                />
                {formErrors.productType && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.productType}
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
                    formErrors.quantity ? "border-red-500" : "border-gray-300"
                  } px-3 py-2`}
                  placeholder="Enter quantity"
                />
                {formErrors.quantity && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.quantity}
                  </p>
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
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${
                    formErrors.price ? "border-red-500" : "border-gray-300"
                  } px-3 py-2`}
                  placeholder="Enter price per kg"
                />
                {formErrors.price && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.price}
                  </p>
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
                    formErrors.location ? "border-red-500" : "border-gray-300"
                  } px-3 py-2`}
                  placeholder="e.g. Kathmandu"
                />
                {formErrors.location && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.location}
                  </p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center h-8">
                  <Upload className="mx-auto h-2 w-2 text-gray-400" />
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
                disabled={loading}
              >
                {loading ? "Posting..." : "Post Product"}
              </button>
            </div>
          </form>
        </div>

        {/* Current Listings */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Current Listings</h3>
            {loading && <p className="text-gray-500">Loading products...</p>}
            {!loading && products?.length === 0 && (
              <p className="text-gray-500">No products available.</p>
            )}
            {products?.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between mb-3"
              >
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
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
