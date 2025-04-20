import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getSupplierDetails,
  updateSupplierDetails,
  registerSupplierDetails,
} from "../../Redux/slice/supplierSlice";
import { fetchCurrentUser } from "../../Redux/slice/userSlice";

import { SupplierLayout } from "../SupplierLayout";
import {
  Truck,
  User,
  MapPin,
  Award,
  FileText,
  Calendar,
  Edit2,
  Save,
  X,
} from "lucide-react";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  const { supplierDetails, loading } = useSelector((state) => state.supplier);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    vehicleType: "",
    vehicleRegistration: "",
    vehicleCapacity: "",
    serviceArea: "",
    experience: "",
    licenseNumber: "",
    bio: "",
    licenseDocument: "",
  });
  const [licenseFile, setLicenseFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      dispatch(fetchCurrentUser());
    }

    setIsLoading(true);
    dispatch(getSupplierDetails())
      .unwrap()
      .then((userData) => {
        // Only fill form if they have an existing record
        const detail = userData.SupplierDetail;
        if (detail) {
          setFormData({
            vehicleType: detail.vehicleType,
            vehicleRegistration: detail.vehicleRegistration,
            vehicleCapacity: detail.vehicleCapacity,
            serviceArea: detail.serviceArea,
            experience: detail.experience,
            licenseNumber: detail.licenseNumber,
            bio: detail.bio,
            licenseDocument: detail.licenseDocument,
          });
        }
      })
      .catch((err) => {
        console.error("Error fetching supplier details:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [dispatch, userInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate specific fields
    if (name === "vehicleRegistration") {
      const isValid = validateVehicleRegistration(value);
      setValidationErrors((prev) => ({
        ...prev,
        vehicleRegistration: isValid
          ? ""
          : "Please enter a valid vehicle registration number (e.g., MH01AB1234)",
      }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLicenseFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (licenseFile) {
        data.append("licenseDocument", licenseFile);
      }

      if (supplierDetails) {
        await dispatch(updateSupplierDetails(data)).unwrap();
        setSuccessMessage("Profile updated successfully!");
      } else {
        await dispatch(registerSupplierDetails(data)).unwrap();
        setSuccessMessage("Profile registered successfully!");
      }

      setIsEditing(false);
      dispatch(getSupplierDetails());
    } catch (err) {
      console.error("Error saving profile:", err);
      setErrorMessage(err?.message || "Failed to save profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing && hasUnsavedChanges()) {
      setShowConfirmDialog(true);
    } else {
      toggleEditMode();
    }
  };

  const getVehicleTypeLabel = (type) => {
    const types = {
      bike: "Bike",
      auto: "Auto Rickshaw",
      van: "Delivery Van",
      truck_small: "Small Truck",
      truck_medium: "Medium Truck",
      truck_large: "Large Truck",
    };
    return types[type] || type;
  };

  const getExperienceLabel = (exp) => {
    const experiences = {
      "0-1": "Less than 1 year",
      "1-3": "1-3 years",
      "3-5": "3-5 years",
      "5-10": "5-10 years",
      "10+": "More than 10 years",
    };
    return experiences[exp] || exp;
  };

  const validateVehicleRegistration = (value) => {
    // Basic Indian vehicle registration format (e.g., MH01AB1234)
    const regex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;
    return regex.test(value) || value === "";
  };

  const hasUnsavedChanges = () => {
    if (!supplierDetails)
      return formData.vehicleType || formData.vehicleRegistration;

    return (
      formData.vehicleType !== (supplierDetails.vehicleType || "") ||
      formData.vehicleRegistration !==
        (supplierDetails.vehicleRegistration || "") ||
      formData.vehicleCapacity !== (supplierDetails.vehicleCapacity || "") ||
      formData.serviceArea !== (supplierDetails.serviceArea || "") ||
      formData.experience !== (supplierDetails.experience || "") ||
      formData.licenseNumber !== (supplierDetails.licenseNumber || "") ||
      formData.bio !== (supplierDetails.bio || "") ||
      licenseFile !== null
    );
  };

  const toggleEditMode = () => {
    if (isEditing && supplierDetails) {
        setFormData({
          vehicleType: supplierDetails.vehicleType || "",
          vehicleRegistration: supplierDetails.vehicleRegistration || "",
          vehicleCapacity: supplierDetails.vehicleCapacity || "",
          serviceArea: supplierDetails.serviceArea || "",
          experience: supplierDetails.experience || "",
          licenseNumber: supplierDetails.licenseNumber || "",
          bio: supplierDetails.bio || "",
          licenseDocument: supplierDetails.licenseDocument || "",
        });
      }
    }
    setIsEditing(!isEditing);
    setErrorMessage("");
    setSuccessMessage("");
    setValidationErrors({});
  };

  if (isLoading) {
    return (
      <SupplierLayout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-green-600 border-gray-200 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-lg">Loading profile...</p>
          </div>
        </div>
      </SupplierLayout>
    );
  }

  return (
    <SupplierLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Supplier Profile
            </h1>
            {supplierDetails ? (
              <button
                onClick={handleEditToggle}
                className={`flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
                  isEditing
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600"
              >
                <Edit2 className="w-4 h-4 mr-2" /> Complete Profile
              </button>
            )}
          </div>

          {/* Success and error messages */}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errorMessage}
            </div>
          )}

          {isEditing ? (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="border-b pb-6 mb-6">
                <h2 className="text-lg font-medium mb-4 text-gray-800">
                  Vehicle Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      value={formData.vehicleType}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="">Select vehicle type</option>
                      <option value="bike">Bike</option>
                      <option value="auto">Auto Rickshaw</option>
                      <option value="van">Delivery Van</option>
                      <option value="truck_small">Small Truck</option>
                      <option value="truck_medium">Medium Truck</option>
                      <option value="truck_large">Large Truck</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="vehicleRegistration"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Vehicle Registration Number
                    </label>
                    <input
                      type="text"
                      id="vehicleRegistration"
                      name="vehicleRegistration"
                      value={formData.vehicleRegistration}
                      onChange={handleInputChange}
                      className={`w-full p-2 border ${
                        validationErrors.vehicleRegistration
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded`}
                      placeholder="e.g., MH01AB1234"
                    />
                    {validationErrors.vehicleRegistration && (
                      <p className="mt-1 text-xs text-red-500">
                        {validationErrors.vehicleRegistration}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="vehicleCapacity"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Vehicle Capacity (kg)
                    </label>
                    <input
                      type="text"
                      id="vehicleCapacity"
                      name="vehicleCapacity"
                      value={formData.vehicleCapacity}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="e.g., 500"
                    />
                  </div>
                </div>
              </div>

              <div className="border-b pb-6 mb-6">
                <h2 className="text-lg font-medium mb-4 text-gray-800">
                  Service Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="serviceArea"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Service Area
                    </label>
                    <input
                      type="text"
                      id="serviceArea"
                      name="serviceArea"
                      value={formData.serviceArea}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="e.g., North Delhi, Gurgaon"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="experience"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Years of Experience
                    </label>
                    <select
                      id="experience"
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

              <div className="border-b pb-6 mb-6">
                <h2 className="text-lg font-medium mb-4 text-gray-800">
                  License & Documentation
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="licenseNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      License Number
                    </label>
                    <input
                      type="text"
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Enter your license number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Update License Document (Optional)
                    </label>
                    <div className="mt-1 flex items-center">
                      <label
                        htmlFor="license-upload"
                        className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <span>Upload new file</span>
                        <input
                          id="license-upload"
                          name="license-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <span className="ml-3 text-sm text-gray-500">
                        {licenseFile ? licenseFile.name : "No file selected"}
                      </span>
                    </div>
                    {licenseFile && (
                      <div className="mt-2 p-2 bg-gray-50 rounded border flex items-center">
                        <div className="flex-1 truncate">
                          <span className="text-sm font-medium">
                            {licenseFile.name}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({(licenseFile.size / 1024).toFixed(2)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setLicenseFile(null)}
                          className="ml-2 text-gray-500 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
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
                      rows={3}
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Tell us about yourself and your delivery service"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex items-center px-4 py-2 ${
                    isSubmitting
                      ? "bg-gray-400"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white rounded-md shadow-sm text-sm font-medium`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="bg-white rounded-full p-4 mb-4 md:mb-0 md:mr-6">
                    <User className="w-16 h-16 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {userInfo?.name || "Supplier"}
                    </h2>
                    <p className="text-green-100">{userInfo?.email || ""}</p>
                    <div className="mt-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>
                        {formData.serviceArea || "Service area not specified"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4 flex items-center text-gray-800">
                      <Truck className="w-5 h-5 mr-2 text-green-600" /> Vehicle
                      Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Vehicle Type</p>
                        <p className="font-medium">
                          {getVehicleTypeLabel(formData.vehicleType) ||
                            "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Registration Number
                        </p>
                        <p className="font-medium">
                          {formData.vehicleRegistration || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Capacity</p>
                        <p className="font-medium">
                          {formData.vehicleCapacity
                            ? `${formData.vehicleCapacity} kg`
                            : "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4 flex items-center text-gray-800">
                      <Award className="w-5 h-5 mr-2 text-green-600" />{" "}
                      Experience & Expertise
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">
                          Years of Experience
                        </p>
                        <p className="font-medium">
                          {getExperienceLabel(formData.experience) ||
                            "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Service Areas</p>
                        <p className="font-medium">
                          {formData.serviceArea || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 md:col-span-2">
                    <h3 className="text-lg font-medium mb-4 flex items-center text-gray-800">
                      <FileText className="w-5 h-5 mr-2 text-green-600" />{" "}
                      License Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">License Number</p>
                        <p className="font-medium">
                          {formData.licenseNumber || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          License Document
                        </p>
                        {formData.licenseDocument ? (
                          <a
                            href={formData.licenseDocument}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            <FileText className="w-4 h-4 mr-1" /> View Document
                          </a>
                        ) : (
                          <p className="text-gray-500">No document uploaded</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {formData.bio && (
                    <div className="border rounded-lg p-4 md:col-span-2">
                      <h3 className="text-lg font-medium mb-4 flex items-center text-gray-800">
                        <User className="w-5 h-5 mr-2 text-green-600" /> About
                        Me
                      </h3>
                      <p className="text-gray-700">{formData.bio}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-6 border-t">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    Joined:{" "}
                    {userInfo?.createdAt
                      ? new Date(userInfo.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-medium mb-4">Discard changes?</h3>
            <p className="text-gray-500 mb-4">
              You have unsaved changes. Are you sure you want to discard them?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  toggleEditMode();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </SupplierLayout>
  );
};

export default ProfilePage;
