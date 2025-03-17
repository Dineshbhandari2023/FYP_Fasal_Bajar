import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, createProduct } from "../Redux/slice/productstore";
// import { fetchProducts, createProduct } from "../slice/productSlice";
import { Upload } from "lucide-react";

// Create Product Component
const CreateProduct = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  const [formData, setFormData] = useState({
    productName: "",
    quantity: "",
    harvestDate: "",
    images: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

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
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Dispatch the createProduct thunk action
    dispatch(createProduct(formData))
      .unwrap()
      .then(() => {
        // Optionally reset the form if successful
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
