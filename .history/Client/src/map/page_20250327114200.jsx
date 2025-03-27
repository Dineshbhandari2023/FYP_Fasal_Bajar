import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Phone, Mail, User, MapPin, X, Star } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Navigation from "../UI/navigation";
import { fetchFarmers } from "../Redux/slice/userSlice";

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom marker icon
const farmerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
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
  const { farmersList, loading, error } = useSelector((state) => state.user);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showFarmerDetails, setShowFarmerDetails] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [mapCenter, setMapCenter] = useState([26.660944, 87.280769]); // Default center (Itahari)
  const [zoom, setZoom] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchFarmers());
  }, [dispatch]);

  // Helper function to convert location string to array
  const parseLocation = (locationString) => {
    if (!locationString) return null;
    try {
      const parts = locationString
        .split(",")
        .map((part) => Number.parseFloat(part.trim()));
      if (parts.length === 2 && parts.every((num) => !isNaN(num))) {
        return parts;
      }
    } catch (error) {
      console.error("Error parsing location:", error);
    }
    return null;
  };

  const handleMarkerClick = (farmer) => {
    setSelectedFarmer(farmer);
    setShowFarmerDetails(true);
  };

  const handleViewOnMap = (locationString) => {
    const locationArray = parseLocation(locationString);
    if (locationArray) {
      setMapCenter(locationArray);
      setZoom(15);
    }
  };

  const handleContactFarmer = (farmer) => {
    setSelectedFarmer(farmer);
    setShowContactModal(true);
  };

  const closeDetails = () => {
    setShowFarmerDetails(false);
  };

  const closeContactModal = () => {
    setShowContactModal(false);
  };

  // Filter farmers based on search term
  const filteredFarmers = farmersList?.filter(
    (farmer) =>
      farmer.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            Find Local Farmers
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Connect directly with farmers in your area to get fresh, locally
            grown produce. Browse the map or list below to find farmers near
            you.
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search by farmer name or location..."
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
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
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
                  Error loading farmer data: {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Map Container */}
        <div
          className="bg-white rounded-lg shadow-lg overflow-hidden mb-8"
          style={{ height: "500px" }}
        >
          {!loading && !error && (
            <MapContainer
              center={mapCenter}
              zoom={zoom}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {filteredFarmers?.map((farmer) => {
                const locationArray = parseLocation(farmer.location);
                if (!locationArray) return null;

                return (
                  <Marker
                    key={farmer.id}
                    position={locationArray}
                    icon={farmerIcon}
                    eventHandlers={{
                      click: () => handleMarkerClick(farmer),
                    }}
                  >
                    <Popup>
                      <div className="text-center p-1">
                        <h3 className="font-semibold">{farmer.username}</h3>
                        <p className="text-sm text-gray-600">
                          {farmer.location}
                        </p>
                        <button
                          className="mt-1 text-xs text-green-600 hover:text-green-800"
                          onClick={() => handleMarkerClick(farmer)}
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

        {/* Farmer List */}
        <h2 className="text-2xl font-semibold text-green-800 mb-4">
          Available Farmers
        </h2>

        {filteredFarmers?.length === 0 && !loading && (
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
                  No farmers found matching your search criteria.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarmers?.map((farmer) => (
            <div
              key={farmer.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden border transition-all duration-300 ${
                selectedFarmer?.id === farmer.id
                  ? "border-green-500 ring-2 ring-green-200"
                  : "border-gray-200 hover:shadow-lg"
              }`}
            >
              <div className="p-6">
                <div className="flex items-start">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mr-4 border-2 border-green-500">
                    {farmer.image ? (
                      <img
                        src={farmer.image || "/placeholder.svg"}
                        alt={farmer.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 text-green-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {farmer.username}
                    </h3>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${
                            i < 4
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-sm text-gray-600">4.0</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 flex items-center">
                      <MapPin className="h-3 w-3 mr-1 text-green-600" />
                      {farmer.location}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-green-600" />
                    {farmer.contact_number || "No phone number"}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2 text-green-600" />
                    {farmer.email}
                  </div>
                </div>

                <div className="mt-5 flex justify-between">
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm flex items-center"
                    onClick={() => handleViewOnMap(farmer.location)}
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    View on Map
                  </button>
                  <button
                    className="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors text-sm"
                    onClick={() => handleContactFarmer(farmer)}
                  >
                    Contact Farmer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Farmer Details Sidebar */}
      {showFarmerDetails && selectedFarmer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-green-800">
                  Farmer Details
                </h2>
                <button
                  onClick={closeDetails}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center mx-auto border-4 border-green-500 mb-4">
                  {selectedFarmer.image ? (
                    <img
                      src={selectedFarmer.image || "/placeholder.svg"}
                      alt={selectedFarmer.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-16 w-16 text-green-600" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedFarmer.username}
                </h3>
                <p className="text-gray-600 flex items-center justify-center mt-1">
                  <MapPin className="h-4 w-4 mr-1 text-green-600" />
                  {selectedFarmer.location}
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-green-800 mb-2">
                  Contact Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-green-600" />
                    <span>
                      {selectedFarmer.contact_number || "No phone number"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-green-600" />
                    <span>{selectedFarmer.email}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-green-800 mb-2">About</h4>
                <p className="text-gray-700">
                  {selectedFarmer.bio || "This farmer hasn't added a bio yet."}
                </p>
              </div>

              <button
                onClick={() => handleContactFarmer(selectedFarmer)}
                className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <Phone className="h-5 w-5 mr-2" />
                Contact Farmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && selectedFarmer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-green-800">
                Contact Farmer
              </h2>
              <button
                onClick={closeContactModal}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                You can contact{" "}
                <span className="font-semibold">{selectedFarmer.username}</span>{" "}
                directly using the following information:
              </p>

              <div className="bg-green-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-green-600" />
                  <a
                    href={`tel:${selectedFarmer.contact_number}`}
                    className="text-green-700 hover:underline"
                  >
                    {selectedFarmer.contact_number || "No phone number"}
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-green-600" />
                  <a
                    href={`mailto:${selectedFarmer.email}`}
                    className="text-green-700 hover:underline"
                  >
                    {selectedFarmer.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={closeContactModal}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <a
                href={`tel:${selectedFarmer.contact_number}`}
                className="flex-1 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-center"
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
