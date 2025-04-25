import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Phone, Mail, User, MapPin, X, Star } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Navigation from "../UI/navigation";
import { fetchFarmers } from "../Redux/slice/userSlice";
import { getAllSuppliers } from "../Redux/slice/supplierSlice"; // Import supplier action
import { Link } from "react-router-dom";

// Set your server's base URL
const SERVER_URL = "http://localhost:8000";

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom marker icon for farmers
const farmerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Custom marker icon for suppliers (blue to differentiate)
const supplierIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Component to update map view when center changes
function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

const Map = () => {
  const dispatch = useDispatch();
  const {
    farmersList,
    loading: farmersLoading,
    error: farmersError,
  } = useSelector((state) => state.user);
  const {
    suppliers = [],
    loading: suppliersLoading,
    error: suppliersError,
  } = useSelector((state) => state.supplier); // Select suppliers from Redux
  const [selectedEntity, setSelectedEntity] = useState(null); // Changed from selectedFarmer to selectedEntity
  const [entityType, setEntityType] = useState(null); // Track whether it's a farmer or supplier
  const [showDetails, setShowDetails] = useState(false); // Changed from showFarmerDetails
  const [showContactModal, setShowContactModal] = useState(false);
  const [mapCenter, setMapCenter] = useState([26.660944, 87.280769]); // Default center (Itahari)
  const [zoom, setZoom] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Ref for the sidebar to handle clicks outside it
  const sidebarRef = useRef(null);

  useEffect(() => {
    dispatch(fetchFarmers());
    dispatch(getAllSuppliers({ page: 1, limit: 100 })); // Fetch all suppliers
  }, [dispatch]);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Helper function to convert location string to an array of numbers
  const parseLocation = (location) => {
    if (!location) return null;
    try {
      if (typeof location === "string") {
        const parts = location
          .split(",")
          .map((part) => Number.parseFloat(part.trim()));
        if (parts.length === 2 && parts.every((num) => !isNaN(num))) {
          return parts;
        }
      } else if (
        typeof location === "object" &&
        location.latitude &&
        location.longitude
      ) {
        const lat = Number.parseFloat(location.latitude);
        const lon = Number.parseFloat(location.longitude);
        if (!isNaN(lat) && !isNaN(lon)) {
          return [lat, lon];
        }
      }
    } catch (error) {
      console.error("Error parsing location:", error);
    }
    return null;
  };

  const handleMarkerClick = (entity, type) => {
    setSelectedEntity(entity);
    setEntityType(type); // "farmer" or "supplier"
    setShowDetails(true);
  };

  const handleViewOnMap = (locationString) => {
    const locationArray = parseLocation(locationString);
    if (locationArray) {
      setMapCenter(locationArray);
      setZoom(15);
      // Close the details if open on mobile
      if (isMobile && showDetails) {
        setShowDetails(false);
      }
    }
  };

  const handleContactEntity = (entity, type) => {
    setSelectedEntity(entity);
    setEntityType(type);
    setShowContactModal(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
  };

  const closeContactModal = () => {
    setShowContactModal(false);
  };

  // Filter farmers and suppliers based on search term
  const filteredFarmers = farmersList?.filter(
    (farmer) =>
      farmer.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSuppliers = suppliers?.filter(
    (supplier) =>
      supplier.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-center map when there's only one matching search result
  useEffect(() => {
    const totalResults =
      (filteredFarmers?.length || 0) + (filteredSuppliers?.length || 0);
    if (searchTerm && totalResults === 1) {
      if (filteredFarmers?.length === 1) {
        handleViewOnMap(filteredFarmers[0].location);
      } else if (filteredSuppliers?.length === 1) {
        handleViewOnMap(filteredSuppliers[0].location);
      }
    }
  }, [searchTerm, filteredFarmers, filteredSuppliers]);

  // Close sidebar on click outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowDetails(false);
      }
    }
    if (showDetails) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDetails]);

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navigation />
      </div>

      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="mb-4 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-2">
            Find Local Farmers & Suppliers
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl">
            Connect directly with farmers and suppliers in your area to get
            fresh, locally grown produce or reliable delivery services. Browse
            the map or list below to find them near you.
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-4 md:mb-6">
          <div className="relative max-w-full md:max-w-md">
            <input
              type="text"
              placeholder="Search by name or location..."
              className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Loading and error states */}
        {(farmersLoading || suppliersLoading) && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}

        {(farmersError || suppliersError) && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 md:mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {farmersError
                    ? `Error loading farmer data: ${farmersError}`
                    : suppliersError
                    ? `Error loading supplier data: ${suppliersError}`
                    : "Error loading data"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Map Container */}
        <div
          className="bg-white rounded-lg shadow-lg overflow-hidden mb-4 md:mb-8 relative z-10"
          style={{ height: "50vh", minHeight: "300px" }}
        >
          {!farmersLoading &&
            !suppliersLoading &&
            !farmersError &&
            !suppliersError && (
              <MapContainer
                center={mapCenter}
                zoom={zoom}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Farmer Markers */}
                {filteredFarmers?.map((farmer) => {
                  const locationArray = parseLocation(farmer.location);
                  if (!locationArray) return null;
                  return (
                    <Marker
                      key={`farmer-${farmer.id}`}
                      position={locationArray}
                      icon={farmerIcon}
                      eventHandlers={{
                        click: () => handleMarkerClick(farmer, "farmer"),
                      }}
                    >
                      <Popup>
                        <div className="text-center p-1">
                          <h3 className="font-semibold">{farmer.username}</h3>
                          <p className="text-xs text-gray-600">
                            Farmer - {farmer.location}
                          </p>
                          <button
                            className="mt-1 text-xs text-green-600 hover:text-green-800"
                            onClick={() => handleMarkerClick(farmer, "farmer")}
                          >
                            View Details
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}

                {/* Supplier Markers */}
                {filteredSuppliers?.map((supplier) => {
                  const locationArray = parseLocation(supplier.location);
                  if (!locationArray) return null;
                  return (
                    <Marker
                      key={`supplier-${supplier.id}`}
                      position={locationArray}
                      icon={supplierIcon}
                      eventHandlers={{
                        click: () => handleMarkerClick(supplier, "supplier"),
                      }}
                    >
                      <Popup>
                        <div className="text-center p-1">
                          <h3 className="font-semibold">{supplier.username}</h3>
                          <p className="text-xs text-gray-600">
                            Supplier - {supplier.location}
                          </p>
                          <button
                            className="mt-1 text-xs text-green-600 hover:text-green-800"
                            onClick={() =>
                              handleMarkerClick(supplier, "supplier")
                            }
                          >
                            View Details
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}

                <ChangeMapView center={mapCenter} zoom={zoom} />
              </MapContainer>
            )}
        </div>

        {/* Entity List */}
        <h2 className="text-xl md:text-2xl font-semibold text-green-800 mb-3 md:mb-4">
          Available Farmers & Suppliers
        </h2>

        {filteredFarmers?.length === 0 &&
          filteredSuppliers?.length === 0 &&
          !farmersLoading &&
          !suppliersLoading && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    No farmers or suppliers found matching your search criteria.
                  </p>
                </div>
              </div>
            </div>
          )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Farmers List */}
          {filteredFarmers?.map((farmer) => (
            <div
              key={`farmer-${farmer.id}`}
              className={`bg-white rounded-lg shadow-md overflow-hidden border transition-all duration-300 ${
                selectedEntity?.id === farmer.id && entityType === "farmer"
                  ? "border-green-500 ring-2 ring-green-200"
                  : "border-gray-200 hover:shadow-lg"
              }`}
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-start">
                  <Link
                    to={`/far槽mer/${farmer.id}`}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 flex items-center justify-center mr-3 sm:mr-4 border-2 border-green-500 flex-shrink-0 hover:border-green-600 transition-colors"
                  >
                    {farmer.profileImage ? (
                      <img
                        src={`${SERVER_URL}${farmer.profileImage}`}
                        alt={farmer.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
                    )}
                  </Link>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      {farmer.username}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      Farmer
                    </p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={`${
                            i < 4
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-xs sm:text-sm text-gray-600">
                        4.0
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 flex items-center">
                      <MapPin className="h-3 w-3 mr-1 text-green-600" />
                      {farmer.location}
                    </p>
                  </div>
                </div>

                <div className="mt-3 space-y-1 sm:space-y-2">
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-green-600" />
                    {farmer.contact_number || "No phone number"}
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-green-600" />
                    <span className="truncate max-w-[180px]">
                      {farmer.email}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <button
                    className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs sm:text-sm flex items-center justify-center"
                    onClick={() => handleViewOnMap(farmer.location)}
                  >
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    View on Map
                  </button>
                  <Link
                    to={`/farmer/${farmer.id}`}
                    className="px-3 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors text-xs sm:text-sm flex items-center justify-center"
                  >
                    View Profile
                  </Link>
                  <button
                    className="px-3 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors text-xs sm:text-sm flex items-center justify-center"
                    onClick={() => handleContactEntity(farmer, "farmer")}
                  >
                    Contact Farmer
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Suppliers List */}
          {filteredSuppliers?.map((supplier) => (
            <div
              key={`supplier-${supplier.id}`}
              className={`bg-white rounded-lg shadow-md overflow-hidden border transition-all duration-300 ${
                selectedEntity?.id === supplier.id && entityType === "supplier"
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200 hover:shadow-lg"
              }`}
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-start">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100 flex items-center justify-center mr-3 sm:mr-4 border-2 border-blue-500 flex-shrink-0 hover:border-blue-600 transition-colors">
                    {supplier.profileImage ? (
                      <img
                        src={`${SERVER_URL}${supplier.profileImage}`}
                        alt={supplier.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      {supplier.username}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      Supplier
                    </p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={`${
                            i <
                            (supplier.SupplierDetails?.rating
                              ? Math.round(supplier.SupplierDetails.rating)
                              : 0)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-xs sm:text-sm text-gray-600">
                        {supplier.SupplierDetails?.rating
                          ? supplier.SupplierDetails.rating.toFixed(1)
                          : "N/A"}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 flex items-center">
                      <MapPin className="h-3 w-3 mr-1 text-blue-600" />
                      {supplier.location}
                    </p>
                  </div>
                </div>

                <div className="mt-3 space-y-1 sm:space-y-2">
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-blue-600" />
                    {supplier.contact_number || "No phone number"}
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-blue-600" />
                    <span className="truncate max-w-[180px]">
                      {supplier.email}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <button
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs sm:text-sm flex items-center justify-center"
                    onClick={() => handleViewOnMap(supplier.location)}
                  >
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    View on Map
                  </button>
                  <button
                    className="px-3 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-xs sm:text-sm flex items-center justify-center"
                    onClick={() => handleContactEntity(supplier, "supplier")}
                  >
                    Contact Supplier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Entity Details Sidebar */}
      {showDetails && selectedEntity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end">
          <div
            ref={sidebarRef}
            className="bg-white w-full sm:max-w-sm md:max-w-md h-full overflow-y-auto"
            style={{
              animation: "slideInRight 0.3s forwards",
            }}
          >
            <style jsx>{`
              @keyframes slideInRight {
                from {
                  transform: translateX(100%);
                }
                to {
                  transform: translateX(0);
                }
              }
            `}</style>
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-green-800">
                  {entityType === "farmer" ? "Farmer" : "Supplier"} Details
                </h2>
                <button
                  onClick={closeDetails}
                  className="p-2 rounded-full hover:bg-gray-100 bg-gray-50 transition-colors"
                  aria-label="Close details"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
                </button>
              </div>

              <div className="text-center mb-4 sm:mb-6">
                <div
                  className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full ${
                    entityType === "farmer"
                      ? "bg-green-100 border-green-500"
                      : "bg-blue-100 border-blue-500"
                  } flex items-center justify-center mx-auto border-4 mb-3 sm:mb-4`}
                >
                  {selectedEntity.profileImage ? (
                    <img
                      src={`${SERVER_URL}${selectedEntity.profileImage}`}
                      alt={selectedEntity.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User
                      className={`h-12 w-12 sm:h-16 sm:w-16 ${
                        entityType === "farmer"
                          ? "text-green-600"
                          : "text-blue-600"
                      }`}
                    />
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {selectedEntity.username}
                </h3>
                <p className="text-sm text-gray-600 flex items-center justify-center mt-1">
                  <MapPin
                    className={`h-4 w-4 mr-1 ${
                      entityType === "farmer"
                        ? "text-green-600"
                        : "text-blue-600"
                    }`}
                  />
                  {selectedEntity.location}
                </p>
              </div>

              <div
                className={`${
                  entityType === "farmer" ? "bg-green-50" : "bg-blue-50"
                } p-3 sm:p-4 rounded-lg mb-4 sm:mb-6`}
              >
                <h4
                  className={`font-semibold ${
                    entityType === "farmer" ? "text-green-800" : "text-blue-800"
                  } mb-2`}
                >
                  Contact Information
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center">
                    <Phone
                      className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 ${
                        entityType === "farmer"
                          ? "text-green-600"
                          : "text-blue-600"
                      }`}
                    />
                    <span className="text-sm">
                      {selectedEntity.contact_number || "No phone number"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Mail
                      className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 ${
                        entityType === "farmer"
                          ? "text-green-600"
                          : "text-blue-600"
                      }`}
                    />
                    <span className="text-sm break-all">
                      {selectedEntity.email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-4 sm:mb-6">
                <h4
                  className={`font-semibold ${
                    entityType === "farmer" ? "text-green-800" : "text-blue-800"
                  } mb-2`}
                >
                  About
                </h4>
                <p className="text-sm text-gray-700">
                  {selectedEntity.bio ||
                    `This ${entityType} hasn't added a bio yet.`}
                </p>
              </div>

              <button
                onClick={() => handleContactEntity(selectedEntity, entityType)}
                className={`w-full py-2 sm:py-3 ${
                  entityType === "farmer"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white rounded-md transition-colors flex items-center justify-center`}
              >
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Contact {entityType === "farmer" ? "Farmer" : "Supplier"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && selectedEntity && (
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
              <h2
                className={`text-lg sm:text-xl font-bold ${
                  entityType === "farmer" ? "text-green-800" : "text-blue-800"
                }`}
              >
                Contact {entityType === "farmer" ? "Farmer" : "Supplier"}
              </h2>
              <button
                onClick={closeContactModal}
                className="p-1 sm:p-2 rounded-full hover:bg-gray-100"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
              </button>
            </div>

            <div className="mb-4 sm:mb-6">
              <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
                You can contact{" "}
                <span className="font-semibold">{selectedEntity.username}</span>{" "}
                directly using the following information:
              </p>

              <div
                className={`${
                  entityType === "farmer" ? "bg-green-50" : "bg-blue-50"
                } p-3 sm:p-4 rounded-lg space-y-2 sm:space-y-3`}
              >
                <div className="flex items-center">
                  <Phone
                    className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 ${
                      entityType === "farmer"
                        ? "text-green-600"
                        : "text-blue-600"
                    }`}
                  />
                  <a
                    href={`tel:${selectedEntity.contact_number}`}
                    className={`text-sm sm:text-base ${
                      entityType === "farmer"
                        ? "text-green-700 hover:underline"
                        : "text-blue-700 hover:underline"
                    }`}
                  >
                    {selectedEntity.contact_number || "No phone number"}
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail
                    className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 ${
                      entityType === "farmer"
                        ? "text-green-600"
                        : "text-blue-600"
                    }`}
                  />
                  <a
                    href={`mailto:${selectedEntity.email}`}
                    className={`text-sm sm:text-base ${
                      entityType === "farmer"
                        ? "text-green-700 hover:underline"
                        : "text-blue-700 hover:underline"
                    } break-all`}
                  >
                    {selectedEntity.email}
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
                href={`tel:${selectedEntity.contact_number}`}
                className={`py-2 ${
                  entityType === "farmer"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white rounded-md transition-colors text-center text-sm sm:text-base`}
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

export default Map;
