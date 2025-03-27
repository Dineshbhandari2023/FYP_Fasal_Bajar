import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Phone, Mail, Star, Leaf, NavigationIcon } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Navigation from "../UI/navigation"; // Import the Navigation component

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Sample farmer data - in a real app, this would come from an API
const sampleFarmers = [
  {
    id: 1,
    name: "Ram Krishna Sharma",
    location: [27.7172, 85.324], // Kathmandu
    address: "Balaju, Kathmandu",
    phone: "+977 9812345678",
    email: "ram.sharma@example.com",
    rating: 4.8,
    crops: ["Rice", "Wheat", "Vegetables"],
    description:
      "Organic farmer with 15 years of experience in sustainable farming practices.",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Sita Kumari",
    location: [27.6588, 85.3247], // Lalitpur
    address: "Patan, Lalitpur",
    phone: "+977 9823456789",
    email: "sita.kumari@example.com",
    rating: 4.5,
    crops: ["Fruits", "Vegetables", "Herbs"],
    description: "Specializes in seasonal fruits and organic vegetables.",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "Hari Bahadur",
    location: [27.671, 85.4298], // Bhaktapur
    address: "Suryabinayak, Bhaktapur",
    phone: "+977 9834567890",
    email: "hari.bahadur@example.com",
    rating: 4.7,
    crops: ["Potatoes", "Tomatoes", "Onions"],
    description:
      "Family-owned farm producing high-quality vegetables for over 20 years.",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 4,
    name: "Gita Thapa",
    location: [27.703, 85.33], // Chabahil
    address: "Chabahil, Kathmandu",
    phone: "+977 9845678901",
    email: "gita.thapa@example.com",
    rating: 4.6,
    crops: ["Corn", "Beans", "Peas"],
    description:
      "Focuses on traditional farming methods with modern techniques.",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 5,
    name: "Bishnu Prasad",
    location: [27.698, 85.3592], // Baneshwor
    address: "Baneshwor, Kathmandu",
    phone: "+977 9856789012",
    email: "bishnu.prasad@example.com",
    rating: 4.9,
    crops: ["Mushrooms", "Leafy Greens", "Herbs"],
    description: "Specializes in exotic mushrooms and medicinal herbs.",
    image: "/placeholder.svg?height=80&width=80",
  },
];

const Map = () => {
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [mapCenter, setMapCenter] = useState([27.7172, 85.324]); // Default center (Kathmandu)
  const [zoom, setZoom] = useState(12);

  const handleMarkerClick = (farmer) => {
    setSelectedFarmer(farmer);
  };

  const handleViewOnMap = (location) => {
    setMapCenter(location);
    setZoom(15);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Include the Navigation component */}
      <Navigation />

      <div className="container z-auto mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Farmer Locations
          </h1>
          <p className="text-gray-600">
            Discover local farmers in your area. Connect directly with farmers
            to get fresh produce.
          </p>
        </div>

        {/* Map Container */}
        <div
          className="bg-white rounded-lg shadow-lg overflow-hidden mb-8"
          style={{ height: "500px" }}
        >
          <MapContainer
            center={mapCenter}
            zoom={zoom}
            style={{ height: "100%", width: "100%" }}
            whenCreated={(map) => {
              map.on("popupopen", (e) => {
                const px = map.project(e.popup._latlng);
                px.y -= e.popup._container.clientHeight / 2;
                map.panTo(map.unproject(px), { animate: true });
              });
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {sampleFarmers.map((farmer) => (
              <Marker
                key={farmer.id}
                position={farmer.location}
                icon={customIcon}
                eventHandlers={{
                  click: () => handleMarkerClick(farmer),
                }}
              >
                <Popup>
                  <div className="text-center p-1">
                    <h3 className="font-semibold">{farmer.name}</h3>
                    <p className="text-sm text-gray-600">{farmer.address}</p>
                    <button
                      className="mt-1 text-xs text-green-600 hover:text-green-800"
                      onClick={() => setSelectedFarmer(farmer)}
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Farmer List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleFarmers.map((farmer) => (
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
                  <img
                    src={farmer.image || "/placeholder.svg"}
                    alt={farmer.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-green-500 mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {farmer.name}
                    </h3>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(farmer.rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : i < farmer.rating
                              ? "text-yellow-400 fill-yellow-400 opacity-50"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-sm text-gray-600">
                        {farmer.rating}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 flex items-center">
                      <Leaf className="h-3 w-3 mr-1 text-green-600" />
                      {farmer.crops.join(", ")}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm text-gray-600">
                  {farmer.description}
                </p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-green-600" />
                    {farmer.phone}
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
                    <NavigationIcon className="h-4 w-4 mr-1" />
                    View on Map
                  </button>
                  <button className="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors text-sm">
                    Contact Farmer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Map;
