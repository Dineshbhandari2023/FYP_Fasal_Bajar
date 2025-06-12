import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SupplierLayout } from "../SupplierLayout";
import {
  MapPin,
  Navigation,
  Truck,
  LocateFixed,
  Route,
  Package,
  Clock,
  Layers,
} from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import locationService from "../../map/WebSocketLocationService";
import {
  getAllSuppliers,
  getActiveDeliveries,
} from "../../Redux/slice/supplierSlice";

// Configure Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom icons for markers
const pickupIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const deliveryIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const supplierIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Calculate distance between two points (in km)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2); // Distance in km
};

// Component to update map view
function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

// Component to render route between locations
function RouteLayer({ pickupLocation, deliveryLocation, currentLocation }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  // Hide routing control UI
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .leaflet-routing-container { display: none !important; }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Cleanup routing control
  const cleanupRouting = () => {
    if (routingControlRef.current) {
      try {
        if (typeof routingControlRef.current.remove === "function") {
          routingControlRef.current.remove();
        } else if (map.removeControl) {
          map.removeControl(routingControlRef.current);
        }
      } catch (error) {
        console.error("Error cleaning up routing control:", error);
      }
      routingControlRef.current = null;
    }
  };

  useEffect(() => {
    if (!map || !pickupLocation || !deliveryLocation || !currentLocation) {
      console.warn("Missing required locations for routing:", {
        pickupLocation,
        deliveryLocation,
        currentLocation,
      });
      return;
    }

    // Validate waypoints
    const waypoints = [
      currentLocation,
      pickupLocation,
      deliveryLocation,
    ].filter(
      (loc) =>
        loc &&
        Array.isArray(loc) &&
        loc.length === 2 &&
        !isNaN(loc[0]) &&
        !isNaN(loc[1])
    );

    if (waypoints.length < 2) {
      console.warn("Insufficient valid waypoints for routing:", waypoints);
      return;
    }

    cleanupRouting();

    try {
      const customPlan = new L.Routing.Plan(
        waypoints.map((loc) => L.latLng(loc[0], loc[1])),
        {
          createMarker: () => null,
          draggableWaypoints: false,
          addWaypoints: false,
        }
      );

      routingControlRef.current = L.Routing.control({
        plan: customPlan,
        routeWhileDragging: false,
        showAlternatives: false,
        fitSelectedRoutes: false,
        show: false,
        lineOptions: {
          styles: [
            { color: "blue", opacity: 0.6, weight: 4 },
            { color: "white", opacity: 0.5, weight: 2 },
          ],
        },
        containerClassName: "leaflet-routing-container",
        addWaypoints: false,
        draggableWaypoints: false,
        formatter: new L.Routing.Formatter({
          getIconHTML: () => "",
          formatInstruction: () => "",
        }),
      });

      // Handle route found event
      routingControlRef.current.on("routesfound", (e) => {
        try {
          if (e.routes && e.routes.length > 0) {
            const bounds = e.routes[0].bounds;
            if (bounds && bounds.isValid()) {
              map.fitBounds(bounds, { padding: [50, 50] });
            } else {
              console.warn("Invalid route bounds:", bounds);
            }
          } else {
            console.warn("No routes found:", e);
          }
        } catch (error) {
          console.error("Error processing route:", error);
        }
      });

      // Handle routing errors
      routingControlRef.current.on("routingerror", (e) => {
        console.error("Routing error:", e.error);
      });

      routingControlRef.current.addTo(map);
    } catch (error) {
      console.error("Error creating routing control:", error);
    }

    return () => {
      cleanupRouting();
    };
  }, [map, pickupLocation, deliveryLocation, currentLocation]);

  return null;
}

export default function MapPage() {
  const dispatch = useDispatch();
  const { userInfo: user } = useSelector((state) => state.user);
  const { suppliers, activeDeliveries, supplierDetails } = useSelector(
    (state) => state.supplier
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("current");
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [mapCenter, setMapCenter] = useState([26.660944, 87.280769]); // Default center
  const [zoom, setZoom] = useState(13);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapLayers, setMapLayers] = useState("streets");
  const [supplierLocations, setSupplierLocations] = useState({});
  const mapRef = useRef(null);
  const watchIdRef = useRef(null);

  // Fetch suppliers and active deliveries
  useEffect(() => {
    dispatch(getActiveDeliveries());
    dispatch(getAllSuppliers({ page: 1, limit: 50 }));
  }, [dispatch]);

  // Select first delivery and center map
  useEffect(() => {
    if (activeDeliveries.length > 0 && !selectedDelivery) {
      setSelectedDelivery(activeDeliveries[0]);
    }
    if (selectedDelivery) {
      const { pickup, delivery } = getDeliveryLocations();
      if (pickup) {
        setMapCenter(pickup);
        setZoom(13);
      } else if (delivery) {
        setMapCenter(delivery);
        setZoom(13);
      }
    }
  }, [activeDeliveries, selectedDelivery]);

  // Real-time geolocation tracking
  useEffect(() => {
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = [latitude, longitude];
          setCurrentLocation(newLocation);
          if (!selectedDelivery) {
            setMapCenter(newLocation);
          }
          setIsLoaded(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to supplier service area
          if (supplierDetails?.serviceArea) {
            const fallback = parseLocation(supplierDetails.serviceArea);
            if (fallback) {
              setCurrentLocation(fallback);
              setMapCenter(fallback);
            }
          }
          setIsLoaded(true);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setIsLoaded(true);
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [supplierDetails]);

  // Subscribe to WebSocket location updates
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token || !user?.id) {
      console.warn("Cannot connect to WebSocket: missing token or user ID");
      return;
    }

    locationService.connect(token);

    const handleLocationUpdate = ({ supplierId, latitude, longitude }) => {
      if (supplierId === user?.id) {
        const newLocation = [latitude, longitude];
        setCurrentLocation(newLocation);
        if (!selectedDelivery) {
          setMapCenter(newLocation);
        }
      } else {
        setSupplierLocations((prev) => ({
          ...prev,
          [supplierId]: { latitude, longitude },
        }));
      }
    };

    const handleActiveSuppliers = (activeSuppliers) => {
      const locations = {};
      activeSuppliers.forEach(({ supplierId, latitude, longitude }) => {
        if (supplierId !== user?.id && latitude && longitude) {
          locations[supplierId] = { latitude, longitude };
        }
      });
      setSupplierLocations(locations);
    };

    locationService
      .onSupplierLocationUpdate(handleLocationUpdate)
      .onActiveSuppliersList(handleActiveSuppliers)
      .onConnect(() => {
        console.log("WebSocket connected");
        if (user?.id && user?.username) {
          locationService.registerAsSupplier(
            user.id,
            user.username,
            supplierDetails?.serviceArea
          );
        }
      })
      .onError((error) => {
        console.error("WebSocket error:", error);
      });

    return () => {
      locationService
        .onSupplierLocationUpdate(() => {})
        .onActiveSuppliersList(() => {})
        .disconnect();
    };
  }, [user?.id, user?.username, supplierDetails?.serviceArea]);

  // Parse location data
  const parseLocation = (location) => {
    if (!location) return null;
    try {
      if (typeof location === "string") {
        const parts = location
          .split(",")
          .map((part) => Number.parseFloat(part.trim()));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          return parts;
        }
      } else if (
        typeof location === "object" &&
        location.latitude !== undefined &&
        location.longitude !== undefined
      ) {
        return [
          Number.parseFloat(location.latitude),
          Number.parseFloat(location.longitude),
        ];
      }
    } catch (error) {
      console.error("Error parsing location:", error);
    }
    return null;
  };

  // Extract pickup and delivery locations
  const getDeliveryLocations = () => {
    if (!selectedDelivery) return { pickup: null, delivery: null };

    let pickupLocation = null;
    if (selectedDelivery.pickupLocation?.address) {
      pickupLocation = parseLocation(selectedDelivery.pickupLocation.address);
    } else if (selectedDelivery.OrderItem?.farmer?.location) {
      pickupLocation = parseLocation(
        selectedDelivery.OrderItem.farmer.location
      );
    }

    if (!pickupLocation && supplierDetails?.serviceArea) {
      pickupLocation = parseLocation(supplierDetails.serviceArea);
    }

    let deliveryLocation = null;
    if (selectedDelivery.deliveryLocation?.address) {
      deliveryLocation = parseLocation(
        selectedDelivery.deliveryLocation.address
      );
    } else if (selectedDelivery.OrderItem?.Order?.buyer?.location) {
      deliveryLocation = parseLocation(
        selectedDelivery.OrderItem.Order.buyer.location
      );
    }

    if (!deliveryLocation && supplierDetails?.serviceArea) {
      deliveryLocation = parseLocation(supplierDetails.serviceArea);
    }

    return { pickup: pickupLocation, delivery: deliveryLocation };
  };

  // Center map on current location
  const centerOnCurrentLocation = () => {
    if (currentLocation) {
      setMapCenter(currentLocation);
      setZoom(15);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);
          setZoom(15);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your current location.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Start navigation in Google Maps
  const startNavigation = () => {
    if (!selectedDelivery) return;

    let destinationAddress;
    if (["Assigned", "Pickup_In_Progress"].includes(selectedDelivery.status)) {
      destinationAddress = selectedDelivery.pickupLocation?.address;
    } else {
      destinationAddress = selectedDelivery.deliveryLocation?.address;
    }

    if (!destinationAddress) {
      alert("No valid destination address found.");
      return;
    }

    const encodedAddress = encodeURIComponent(destinationAddress);
    const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}&travelmode=driving`;
    window.open(navigationUrl, "_blank");
  };

  // Toggle map layer between streets and satellite
  const toggleMapLayer = () => {
    setMapLayers(mapLayers === "streets" ? "satellite" : "streets");
  };

  // Get status color for delivery
  const getStatusColor = (status) => {
    switch (status) {
      case "Assigned":
        return "bg-blue-100 text-blue-800";
      case "Pickup_In_Progress":
        return "bg-purple-100 text-purple-800";
      case "Picked_Up":
        return "bg-yellow-100 text-yellow-800";
      case "In_Transit":
        return "bg-amber-100 text-amber-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      case "Cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Status labels
  const statusConfig = {
    Assigned: { label: "Assigned" },
    Pickup_In_Progress: { label: "Pickup In Progress" },
    Picked_Up: { label: "Picked Up" },
    In_Transit: { label: "In Transit" },
    Delivered: { label: "Delivered" },
    Failed: { label: "Failed" },
    Cancelled: { label: "Cancelled" },
  };

  const { pickup: pickupLocation, delivery: deliveryLocation } =
    getDeliveryLocations();

  return (
    <SupplierLayout>
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Supplier Map</h1>
        <div className="flex flex-wrap gap-2">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 inline-flex items-center gap-2"
            onClick={centerOnCurrentLocation}
          >
            <LocateFixed className="h-4 w-4" />
            <span>My Location</span>
          </button>
          <button
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 inline-flex items-center gap-2"
            onClick={toggleMapLayer}
          >
            <Layers className="h-4 w-4" />
            <span>{mapLayers === "streets" ? "Satellite" : "Streets"}</span>
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 inline-flex items-center gap-2"
            onClick={startNavigation}
            disabled={!selectedDelivery}
          >
            <Navigation className="h-4 w-4" />
            <span>Navigate</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border">
          <div className="p-4 sm:p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium">Delivery Map</h2>
                <p className="text-sm text-gray-500">
                  Active deliveries in your service area
                </p>
              </div>
            </div>
            <div className="flex mt-4 border-b overflow-x-auto">
              <button
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  activeTab === "current"
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("current")}
              >
                Current Delivery
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  activeTab === "all"
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("all")}
              >
                All Active Orders
              </button>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div
              ref={mapRef}
              className="relative w-full overflow-hidden rounded-lg border"
              style={{ height: "calc(50vh - 100px)", minHeight: "300px" }}
            >
              {!isLoaded ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
                </div>
              ) : (
                <MapContainer
                  center={mapCenter}
                  zoom={zoom}
                  style={{ height: "100%", width: "100%" }}
                  zoomControl={false}
                  ref={mapRef}
                >
                  {mapLayers === "streets" ? (
                    <TileLayer
                      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                  ) : (
                    <TileLayer
                      attribution='© <a href="https://www.esri.com">Esri</a>'
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                  )}

                  {currentLocation && (
                    <Marker position={currentLocation} icon={supplierIcon}>
                      <Popup>
                        <div className="text-center">
                          <strong>Your Current Location</strong>
                          <p className="text-xs text-gray-600">
                            {currentLocation[0].toFixed(6)},{" "}
                            {currentLocation[1].toFixed(6)}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  )}

                  {pickupLocation && (
                    <Marker position={pickupLocation} icon={pickupIcon}>
                      <Popup>
                        <div className="text-center">
                          <strong>Pickup Location</strong>
                          <p className="text-xs text-gray-600">
                            {selectedDelivery?.pickupLocation?.address ||
                              selectedDelivery?.OrderItem?.farmer?.location ||
                              "Address not available"}
                          </p>
                          <p className="text-xs text-gray-600">
                            Status:{" "}
                            {statusConfig[selectedDelivery?.status]?.label ||
                              "N/A"}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  )}

                  {deliveryLocation && (
                    <Marker position={deliveryLocation} icon={deliveryIcon}>
                      <Popup>
                        <div className="text-center">
                          <strong>Delivery Location</strong>
                          <p className="text-xs text-gray-600">
                            {selectedDelivery?.deliveryLocation?.address ||
                              selectedDelivery?.OrderItem?.Order?.buyer
                                ?.location ||
                              "Address not available"}
                          </p>
                          <p className="text-xs text-gray-600">
                            Status:{" "}
                            {statusConfig[selectedDelivery?.status]?.label ||
                              "N/A"}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  )}

                  {Object.entries(supplierLocations).map(
                    ([supplierId, { latitude, longitude }]) => (
                      <Marker
                        key={supplierId}
                        position={[latitude, longitude]}
                        icon={supplierIcon}
                      >
                        <Popup>
                          <div className="text-center">
                            <strong>Supplier {supplierId}</strong>
                            <p className="text-xs text-gray-600">
                              {latitude.toFixed(6)}, {longitude.toFixed(6)}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    )
                  )}

                  {pickupLocation && deliveryLocation && currentLocation && (
                    <RouteLayer
                      pickupLocation={pickupLocation}
                      deliveryLocation={deliveryLocation}
                      currentLocation={currentLocation}
                    />
                  )}

                  <ChangeMapView center={mapCenter} zoom={zoom} />
                  <ZoomControl position="bottomright" />
                </MapContainer>
              )}

              {!pickupLocation && selectedDelivery && (
                <div className="absolute top-2 left-2 bg-yellow-100 text-yellow-800 p-2 rounded z-[1000]">
                  Warning: Pickup location not available
                </div>
              )}
              {!deliveryLocation && selectedDelivery && (
                <div className="absolute top-10 left-2 bg-yellow-100 text-yellow-800 p-2 rounded z-[1000]">
                  Warning: Delivery location not available
                </div>
              )}
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-3 border rounded-lg">
                <div className="text-sm font-medium text-gray-500">
                  Distance
                </div>
                <div className="text-lg font-bold">
                  {currentLocation && deliveryLocation
                    ? `${calculateDistance(
                        currentLocation[0],
                        currentLocation[1],
                        deliveryLocation[0],
                        deliveryLocation[1]
                      )} km`
                    : "N/A"}
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="text-sm font-medium text-gray-500">
                  Active Orders
                </div>
                <div className="text-lg font-bold">
                  {activeDeliveries.length} orders
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="text-sm font-medium text-gray-500">
                  Location Status
                </div>
                <div className="text-lg font-bold flex items-center">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      currentLocation ? "bg-green-500" : "bg-red-500"
                    } mr-2`}
                  ></span>
                  {currentLocation ? "Active" : "Inactive"}
                </div>
              </div>
            </div>

            {selectedDelivery && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Route className="h-4 w-4 text-green-600" />
                  Suggested Route
                </h3>
                <ol className="space-y-2 pl-6 list-decimal">
                  <li className="text-sm">
                    <span className="font-medium">Pickup:</span>{" "}
                    {selectedDelivery.pickupLocation?.address || "N/A"}
                  </li>
                  <li className="text-sm">
                    <span className="font-medium">Delivery:</span>{" "}
                    {selectedDelivery.deliveryLocation?.address || "N/A"}
                  </li>
                </ol>
                <div className="mt-3 flex justify-end">
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                    onClick={startNavigation}
                  >
                    Start Navigation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 sm:p-6 border-b">
            <h2 className="text-lg font-medium">Active Deliveries</h2>
            <p className="text-sm text-gray-500">
              Select a delivery to view on map
            </p>
          </div>
          <div className="p-4">
            <div className="space-y-3 max-h-[calc(50vh-100px)] overflow-y-auto">
              {activeDeliveries.length > 0 ? (
                activeDeliveries.map((delivery) => (
                  <div
                    key={delivery.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      selectedDelivery?.id === delivery.id
                        ? "border-green-500 bg-green-50"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      console.log("Selected delivery:", delivery);
                      setSelectedDelivery(delivery);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">
                            {delivery.deliveryNumber}
                          </h4>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(
                              delivery.status
                            )}`}
                          >
                            {statusConfig[delivery.status]?.label ||
                              delivery.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Order:{" "}
                          {delivery.OrderItem?.Order?.orderNumber || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-1 text-xs text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span>
                        {delivery.estimatedDeliveryTime
                          ? new Date(
                              delivery.estimatedDeliveryTime
                            ).toLocaleString([], {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div className="text-xs">
                        <div className="flex items-center gap-1 text-green-600">
                          <MapPin className="h-3 w-3" />
                          <span className="font-medium">Pickup</span>
                        </div>
                        <p className="truncate">
                          {delivery.pickupLocation?.address ||
                            delivery.OrderItem?.farmer?.location ||
                            "N/A"}
                        </p>
                      </div>
                      <div className="text-xs">
                        <div className="flex items-center gap-1 text-blue-600">
                          <MapPin className="h-3 w-3" />
                          <span className="font-medium">Delivery</span>
                        </div>
                        <p className="truncate">
                          {delivery.deliveryLocation?.address ||
                            delivery.OrderItem?.Order?.buyer?.location ||
                            "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 text-xs flex items-center gap-1">
                      <Package className="h-3 w-3 text-gray-500" />
                      <span className="truncate">
                        {delivery.OrderItem?.Product?.productName || "N/A"}
                        {delivery.OrderItem?.quantity &&
                          ` (${delivery.OrderItem.quantity})`}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Truck className="h-12 w-12 mx-auto text-gray-300" />
                  <h3 className="mt-2 text-lg font-medium text-gray-500">
                    No active deliveries
                  </h3>
                  <p className="text-gray-400">
                    You don't have any active deliveries at the moment
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      <SupplierLayout/>
      </div>
    </div>
  );
}
