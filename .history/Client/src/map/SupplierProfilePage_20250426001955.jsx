import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Truck,
} from "lucide-react";
import Navigation from "../UI/navigation";
import { StartChatButton } from "../chat/startChatButton";

const SERVER_URL = "http://localhost:8000";

const SupplierProfilePage = () => {
  const { id: supplierId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user || {});

  const [supplier, setSupplier] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [suppliersLoading, setSuppliersLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  const fetchSupplierDetails = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setAuthError(true);
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${SERVER_URL}/users/${supplierId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        setAuthError(true);
        throw new Error("Unauthorized access");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.ErrorMessage || "Failed to fetch supplier details"
        );
      }

      const data = await response.json();
      if (data.IsSuccess && data.Result.user_data) {
        setSupplier(data.Result.user_data);
      } else {
        throw new Error("Invalid supplier data");
      }
    } catch (error) {
      console.error("Error fetching supplier:", error);
      setApiError(error.message);
      if (
        error.message.includes("Unauthorized") ||
        error.message.includes("Authentication token")
      ) {
        setAuthError(true);
      }
    } finally {
      setSuppliersLoading(false);
    }
  };

  useEffect(() => {
    if (!userInfo) {
      navigate("/login", { state: { from: `/supplier/${supplierId}` } });
      return;
    }

    if (supplierId) {
      fetchSupplierDetails();
    }
  }, [supplierId, userInfo, navigate]);

  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navigation />
        </div>
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 inline-block">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Authentication Error
            </h2>
            <p className="text-gray-600 mb-6">
              Your session has expired or you are not authorized to view this
              page.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Log In Again
              </Link>
              <Link
                to="/map"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
              >
                Go to Map
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (suppliersLoading) {
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

  if (apiError && !supplier) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navigation />
        </div>
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Error</h2>
          <p className="mt-2 text-gray-600">{apiError}</p>
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

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navigation />
      </div>
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/map"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Map
        </Link>

        <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                {supplier.username.charAt(0).toUpperCase()}
              </div>
              <div className="ml-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {supplier.username}
                </h1>
                <div className="mt-4 flex space-x-2">
                  <StartChatButton
                    supplierId={supplierId}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  />
                  <a
                    href={`tel:${supplier.phone || "9855674323"}`}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Contact Supplier
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6 flex-1">
              <h2 className="text-xl font-semibold text-gray-900">
                Supplier Information
              </h2>
              <div className="mt-2 text-gray-600 space-y-2">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  <span>{supplier.location || "26.456883,27.264608"}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-blue-600" />
                  <span>{supplier.phone || "9855674323"}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-blue-600" />
                  <span>{supplier.email || "testsupplier@gmail.com"}</span>
                </div>
                <div className="flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-blue-600" />
                  <span>Vehicle: {supplier.vehicle || "truck_large"}</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900">About</h3>
                <p className="mt-1 text-gray-600">
                  {supplier.bio || "This supplier hasn't added a bio yet."}
                </p>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Service Area
                </h3>
                <p className="mt-1 text-gray-600">
                  {supplier.serviceArea || "Itahari"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierProfilePage;
