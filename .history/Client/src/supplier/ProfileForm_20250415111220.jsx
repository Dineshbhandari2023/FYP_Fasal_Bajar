"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  registerSupplierDetails,
  getSupplierDetails,
} from "../../src/Redux/slice/supplierSlice";

const SupplierProfileForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { supplierDetails, loading, error } = useSelector(
    (state) => state.supplier
  );

  const [formData, setFormData] = useState({
    vehicleType: "",
    vehicleRegistration: "",
    vehicleCapacity: "",
    serviceArea: "",
    experience: "",
    licenseNumber: "",
    bio: "",
  });

  const [licenseFile, setLicenseFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch supplier details if they exist
  useEffect(() => {
    dispatch(getSupplierDetails())
      .unwrap()
      .then((data) => {
        if (data) {
          setFormData({
            vehicleType: data.vehicleType || "",
            vehicleRegistration: data.vehicleRegistration || "",
            vehicleCapacity: data.vehicleCapacity || "",
            serviceArea: data.serviceArea || "",
            experience: data.experience || "",
            licenseNumber: data.licenseNumber || "",
            bio: data.bio || "",
          });
        }
      })
      .catch((err) => {
        console.error("Error fetching supplier details:", err);
      });
  }, [dispatch]);

  // Calculate progress whenever form values change
  useEffect(() => {
    const requiredFields = [
      "vehicleType",
      "vehicleRegistration",
      "vehicleCapacity",
      "serviceArea",
      "licenseNumber",
    ];
    const filledRequiredFields = requiredFields.filter(
      (field) => formData[field] && formData[field].trim() !== ""
    ).length;
    const newProgress = Math.round(
      (filledRequiredFields / requiredFields.length) * 100
    );
    setProgress(newProgress);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLicenseFile(e.target.files[0]);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vehicleType) {
      newErrors.vehicleType = "Vehicle type is required";
    }

    if (!formData.vehicleRegistration) {
      newErrors.vehicleRegistration = "Vehicle registration number is required";
    }

    if (!formData.vehicleCapacity) {
      newErrors.vehicleCapacity = "Vehicle capacity is required";
    }

    if (!formData.serviceArea) {
      newErrors.serviceArea = "Service area is required";
    }

    if (!formData.licenseNumber) {
      newErrors.licenseNumber = "License number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Create FormData object for file upload
      const data = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // Append license file if selected
      if (licenseFile) {
        data.append("licenseDocument", licenseFile);
      }

      // Dispatch the registerSupplierDetails action
      await dispatch(registerSupplierDetails(data)).unwrap();

      setSuccessMessage(
        "Supplier profile completed successfully! Redirecting to dashboard..."
      );

      setTimeout(() => {
        navigate("/supplier/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Error submitting supplier profile:", err);
      setErrors({
        general: err || "Failed to complete supplier profile",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4">
          Complete Your Supplier Profile
        </h1>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.general}
          </div>
        )}

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Profile Completion</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b pb-6">
            <h2 className="text-lg font-medium mb-4">Vehicle Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type
                </label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${
                    errors.vehicleType ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select vehicle type</option>
                  <option value="bike">Bike</option>
                  <option value="auto">Auto Rickshaw</option>
                  <option value="van">Delivery Van</option>
                  <option value="truck_small">Small Truck</option>
                  <option value="truck_medium">Medium Truck</option>
                  <option value="truck_large">Large Truck</option>
                </select>
                {errors.vehicleType && (
                  <p className="text-red-500 text-sm">{errors.vehicleType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Registration Number
                </label>
                <input
                  type="text"
                  name="vehicleRegistration"
                  value={formData.vehicleRegistration}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${
                    errors.vehicleRegistration
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="e.g., MH01AB1234"
                />
                {errors.vehicleRegistration && (
                  <p className="text-red-500 text-sm">
                    {errors.vehicleRegistration}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Capacity (kg)
                </label>
                <input
                  type="text"
                  name="vehicleCapacity"
                  value={formData.vehicleCapacity}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${
                    errors.vehicleCapacity
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="e.g., 500"
                />
                {errors.vehicleCapacity && (
                  <p className="text-red-500 text-sm">
                    {errors.vehicleCapacity}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="border-b pb-6">
            <h2 className="text-lg font-medium mb-4">Service Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Area
                </label>
                <input
                  type="text"
                  name="serviceArea"
                  value={formData.serviceArea}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${
                    errors.serviceArea ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., North Delhi, Gurgaon"
                />
                {errors.serviceArea && (
                  <p className="text-red-500 text-sm">{errors.serviceArea}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Enter the areas where you provide delivery services
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select experience</option>
                  <option value="0-1">Less than 1 year</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">More than 10 years</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-b pb-6">
            <h2 className="text-lg font-medium mb-4">
              License & Documentation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Number
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${
                    errors.licenseNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your license number"
                />
                {errors.licenseNumber && (
                  <p className="text-red-500 text-sm">{errors.licenseNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload License Document
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="license-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="license-upload"
                          name="license-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, PDF up to 10MB
                    </p>
                  </div>
                </div>
                {licenseFile && (
                  <p className="text-sm text-green-600 mt-2">
                    File selected: {licenseFile.name}
                  </p>
                )}
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio (Optional)
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Tell us about yourself and your delivery service"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || progress < 80}
              className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
                loading || progress < 80
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Submitting..." : "Complete Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierProfileForm;
