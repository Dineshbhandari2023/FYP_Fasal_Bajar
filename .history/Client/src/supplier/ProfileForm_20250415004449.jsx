import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, HelpCircle } from "lucide-react";

export function ProfileForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(30);
  const [formValues, setFormValues] = useState({
    username: "Raj Kumar",
    email: "raj.kumar@example.com",
    phone: "9876543210",
    companyName: "",
    experience: "",
    vehicleType: "",
    vehicleRegistration: "",
    vehicleCapacity: "",
    serviceArea: "",
    address: "",
    licenseNumber: "",
    bio: "",
  });
  const [errors, setErrors] = useState({});

  // Calculate progress whenever form values change
  useEffect(() => {
    const totalFields = Object.keys(formValues).length;
    const filledFields = Object.values(formValues).filter(
      (value) => value !== undefined && value !== ""
    ).length;
    const newProgress = Math.round((filledFields / totalFields) * 100);
    setProgress(newProgress);
  }, [formValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formValues.username || formValues.username.length < 2) {
      newErrors.username = "Username must be at least 2 characters.";
    }

    if (
      !formValues.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formValues.phone || formValues.phone.length < 10) {
      newErrors.phone = "Phone number must be at least 10 digits.";
    }

    if (!formValues.vehicleType) {
      newErrors.vehicleType = "Please select a vehicle type.";
    }

    if (
      !formValues.vehicleRegistration ||
      formValues.vehicleRegistration.length < 5
    ) {
      newErrors.vehicleRegistration =
        "Vehicle registration must be at least 5 characters.";
    }

    if (!formValues.vehicleCapacity) {
      newErrors.vehicleCapacity = "Please enter vehicle capacity.";
    }

    if (!formValues.serviceArea || formValues.serviceArea.length < 3) {
      newErrors.serviceArea = "Please enter your service area.";
    }

    if (!formValues.address || formValues.address.length < 10) {
      newErrors.address = "Address must be at least 10 characters.";
    }

    if (!formValues.licenseNumber || formValues.licenseNumber.length < 5) {
      newErrors.licenseNumber = "License number must be at least 5 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log(formValues);
      setIsSubmitting(false);
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Complete Your Profile</h2>
          <p className="text-gray-500 mt-1">
            Please complete your profile to continue using the platform.
          </p>
          <div className="mt-4">
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
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formValues.username}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.username ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="username"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={formValues.phone}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="9876543210"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Company Name (Optional)
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                value={formValues.companyName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Your company name"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Vehicle Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="vehicleType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Vehicle Type
                </label>
                <select
                  id="vehicleType"
                  name="vehicleType"
                  value={formValues.vehicleType}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.vehicleType ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
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
                  <p className="mt-1 text-sm text-red-500">
                    {errors.vehicleType}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="vehicleRegistration"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Vehicle Registration Number
                </label>
                <input
                  id="vehicleRegistration"
                  name="vehicleRegistration"
                  type="text"
                  value={formValues.vehicleRegistration}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.vehicleRegistration
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="e.g., MH01AB1234"
                />
                {errors.vehicleRegistration && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.vehicleRegistration}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    Vehicle Capacity
                    <div className="relative group">
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-black text-white text-xs p-2 rounded shadow-lg whitespace-nowrap">
                        Enter capacity in kilograms (kg)
                      </div>
                    </div>
                  </div>
                </label>
                <input
                  id="vehicleCapacity"
                  name="vehicleCapacity"
                  type="text"
                  value={formValues.vehicleCapacity}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.vehicleCapacity
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="e.g., 500 kg"
                />
                {errors.vehicleCapacity && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.vehicleCapacity}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Service Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="serviceArea"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Service Area
                </label>
                <input
                  id="serviceArea"
                  name="serviceArea"
                  type="text"
                  value={formValues.serviceArea}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.serviceArea ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="e.g., North Delhi, Gurgaon"
                />
                {errors.serviceArea && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.serviceArea}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Enter the areas where you provide delivery services
                </p>
              </div>

              <div>
                <label
                  htmlFor="experience"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Years of Experience (Optional)
                </label>
                <select
                  id="experience"
                  name="experience"
                  value={formValues.experience}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select experience</option>
                  <option value="0-1">Less than 1 year</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">More than 10 years</option>
                </select>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formValues.address}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-green-500 resize-none`}
                  placeholder="Enter your complete address"
                ></textarea>
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">
              License & Documentation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="licenseNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  License Number
                </label>
                <input
                  id="licenseNumber"
                  name="licenseNumber"
                  type="text"
                  value={formValues.licenseNumber}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.licenseNumber ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="Enter your license number"
                />
                {errors.licenseNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.licenseNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload License Document
                </label>
                <div className="mt-2 flex items-center justify-center w-full">
                  <label
                    htmlFor="license-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF, JPG or PNG (MAX. 2MB)
                      </p>
                    </div>
                    <input id="license-upload" type="file" className="hidden" />
                  </label>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Bio (Optional)
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formValues.bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="Tell us a bit about yourself and your delivery service"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between p-6 border-t">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            disabled={isSubmitting || progress < 70}
            className={`px-4 py-2 rounded-md text-white ${
              isSubmitting || progress < 70
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2`}
          >
            {isSubmitting && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {progress < 70 ? "Complete Required Fields" : "Save & Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}
