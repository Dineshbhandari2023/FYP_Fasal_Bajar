import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Phone, Mail, MapPin, ArrowLeft, User } from "lucide-react";
import Navigation from "../UI/navigation";
import { StartChatButton } from "../chat/startChatButton";

// Set your server's base URL
const SERVER_URL = "http://localhost:8000";

const SupplierProfilePage = () => {
  const { id: supplierId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get userInfo from Redux state
  const { userInfo } = useSelector((state) => state.user || {});

  // Local state
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  // Fetch supplier details
  useEffect(() => {
    const fetchSupplierDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${SERVER_URL}/users/${supplierId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch supplier details");
        }
        const data = await response.json();
        if (data.IsSuccess && data.Result.user_data) {
          setSupplier(data.Result.user_data);
        } else {
          throw new Error("Invalid supplier data");
        }
      } catch (error) {
        console.error("Error fetching supplier:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (supplierId) {
      fetchSupplierDetails();
    }
  }, [supplierId]);

  // Handle contact modal
  const handleContactSupplier = () => {
    setShowContactModal(true);
  };

  const closeContactModal = () => {
    setShowContactModal(false);
  };

  // Parse location for display
  const parseLocation = (location) => {
    if (!location) return "Location not available";

    try {
      if (typeof location === "string") {
        return location;
      } else if (
        typeof location === "object" &&
        location.latitude &&
        location.longitude
      ) {
        return `${location.latitude}, ${location.longitude}`;
      }
    } catch (error) {
      console.error("Error parsing location:", error);
    }

    return "Location not available";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navigation />
        </div>
        <div
          className="container mx-auto px-4 py-8 flex justify-center items-center"
          style={{ minHeight: "calc(100vh - 80px)" }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navigation />
        </div>
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <Link
            to="/map"
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Map
          </Link>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navigation />
        </div>
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Supplier Not Found
          </h2>
          <p className="mt-2 text-gray-600">
            The supplier you are looking for does not exist.
          </p>
          <Link
            to="/map"
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Map
          </Link>
        </div>
      </div>
    );
  }

  const locationDisplay = supplier.SupplierDetail?.currentLocation
    ? parseLocation(supplier.SupplierDetail.currentLocation)
    : parseLocation(supplier.location);

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navigation />
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <Link
          to="/map"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Map
        </Link>

        {/* Supplier Profile Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="md:flex">
            <div className="md:w-1/3 p-6 flex flex-col items-center justify-center bg-blue-50">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-500 mb-4">
                {supplier.profileImage ? (
                  <img
                    src={`${SERVER_URL}${supplier.profileImage}`}
                    alt={supplier.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-20 w-20 text-blue-600" />
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900">
                {supplier.username}
              </h1>
              <p className="text-gray-600 text-center mt-1">Supplier</p>

              {/* Add StartChatButton here */}
              <div className="mt-4 w-full">
                <StartChatButton
                  supplierId={supplierId}
                  className="w-full py-3"
                />
              </div>
            </div>

            <div className="md:w-2/3 p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">
                Supplier Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="text-gray-700">{locationDisplay}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="text-gray-700">
                      {supplier.contact_number || "No phone number"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="text-gray-700 break-all">
                      {supplier.email}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">About</h3>
                  <p className="text-gray-700">
                    {supplier.bio || "This supplier hasn't added a bio yet."}
                  </p>

                  {supplier.SupplierDetail?.serviceArea && (
                    <div className="mt-4">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Service Area
                      </h3>
                      <p className="text-gray-700">
                        {supplier.SupplierDetail.serviceArea}
                      </p>
                    </div>
                  )}

                  {supplier.SupplierDetail?.vehicleType && (
                    <div className="mt-4">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Vehicle Type
                      </h3>
                      <p className="text-gray-700">
                        {supplier.SupplierDetail.vehicleType}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Add contact button */}
              <div className="mt-6">
                <button
                  onClick={handleContactSupplier}
                  className="w-full py-2 sm:py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Contact Supplier
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Supplier Information */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">
              Services Offered
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Delivery Services
                </h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  <li>Local produce delivery</li>
                  <li>Farm-to-market transportation</li>
                  <li>Cold chain logistics</li>
                  <li>Bulk agricultural goods transport</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Availability</h3>
                <p className="text-gray-700 mb-2">
                  {supplier.SupplierDetail?.availability ||
                    "Monday to Saturday, 8:00 AM - 6:00 PM"}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Response Time:</span> Usually
                  within 1-2 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-lg w-full max-w-sm sm:max-w-md p-4 sm:p-6"
            style={{
              animation: "fadeIn 0.2s forwards",
            }}
          >
            <style jsx>{`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: scale(0.95);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
            `}</style>
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-blue-800">
                Contact Supplier
              </h2>
              <button
                onClick={closeContactModal}
                className="p-1 sm:p-2 rounded-full hover:bg-gray-100"
              >
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-4 sm:mb-6">
              <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
                You can contact{" "}
                <span className="font-semibold">{supplier.username}</span>{" "}
                directly using the following information:
              </p>

              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg space-y-2 sm:space-y-3">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-blue-600" />
                  <a
                    href={`tel:${supplier.contact_number}`}
                    className="text-sm sm:text-base text-blue-700 hover:underline"
                  >
                    {supplier.contact_number || "No phone number"}
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-blue-600" />
                  <a
                    href={`mailto:${supplier.email}`}
                    className="text-sm sm:text-base text-blue-700 hover:underline break-all"
                  >
                    {supplier.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:space-x-3">
              <button
                onClick={closeContactModal}
                className="py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <a
                href={`tel:${supplier.contact_number}`}
                className="py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-center text-sm sm:text-base"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierProfilePage;
