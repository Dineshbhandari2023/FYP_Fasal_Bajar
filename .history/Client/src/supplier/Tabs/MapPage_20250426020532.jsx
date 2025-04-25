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
} from "lucide-react";
import {
  getAllSuppliers,
  getActiveDeliveries,
} from "../../Redux/slice/supplierSlice";
import RealTimeLocationTracker from "./RealTimeLocationTracker";

export default function SupplierMapPage() {
  const dispatch = useDispatch();
  const { suppliers, activeDeliveries, supplierDetails } = useSelector(
    (state) => state.supplier
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("current");
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  // Load deliveries and suppliers data
  useEffect(() => {
    dispatch(getActiveDeliveries());
    dispatch(getAllSuppliers({ page: 1, limit: 50 }));
  }, [dispatch]);

  // Initialize map when component mounts
  useEffect(() => {
    // Simulate map loading - in a real app, you would initialize a map library here
    // such as Google Maps, Mapbox, or Leaflet
    const timer = setTimeout(() => {
      setIsLoaded(true);
      initializeMap();

      // Set the first delivery as selected by default
      if (activeDeliveries.length > 0) {
        setSelectedDelivery(activeDeliveries[0]);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [activeDeliveries]);

  // Initialize map - this is a placeholder for actual map initialization
  const initializeMap = () => {
    console.log("Map initialized");

    // Get current location to center the map
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
          console.log("Current location set:", { latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  // Update markers when suppliers or deliveries change
  useEffect(() => {
    if (isLoaded && (suppliers.length > 0 || activeDeliveries.length > 0)) {
      updateMapMarkers();
    }
  }, [isLoaded, suppliers, activeDeliveries, selectedDelivery]);

  // Update map markers - this is a placeholder for actual marker creation
  const updateMapMarkers = () => {
    const newMarkers = [];

    // In a real implementation, you would create markers for each supplier and delivery
    // For example with Google Maps:

    // Add markers for suppliers
    suppliers.forEach((supplier) => {
      if (supplier.SupplierDetail?.currentLocation) {
        const { latitude, longitude } = supplier.SupplierDetail.currentLocation;

        // const marker = new google.maps.Marker({
        //   position: { lat: latitude, lng: longitude },
        //   map: map,
        //   icon: {
        //     url: '/assets/truck-icon.png',
        //     scaledSize: new google.maps.Size(32, 32)
        //   },
        //   title: supplier.username
        // });

        // newMarkers.push(marker);
        console.log("Added supplier marker:", supplier.username, {
          latitude,
          longitude,
        });
      }
    });

    // Add markers for delivery pickup and dropoff locations
    if (selectedDelivery) {
      const delivery = selectedDelivery;

      // Pickup location (farmer)
      if (delivery.pickupLocation) {
        // In a real app, you would geocode the address to get coordinates
        // or use stored coordinates

        // const pickupMarker = new google.maps.Marker({
        //   position: { lat: pickupLat, lng: pickupLng },
        //   map: map,
        //   icon: {
        //     url: '/assets/pickup-icon.png',
        //     scaledSize: new google.maps.Size(32, 32)
        //   },
        //   title: 'Pickup Location'
        // });

        // newMarkers.push(pickupMarker);
        console.log("Added pickup marker for delivery:", delivery.id);
      }

      // Delivery location (customer)
      if (delivery.deliveryLocation) {
        // In a real app, you would geocode the address to get coordinates
        // or use stored coordinates

        // const deliveryMarker = new google.maps.Marker({
        //   position: { lat: deliveryLat, lng: deliveryLng },
        //   map: map,
        //   icon: {
        //     url: '/assets/delivery-icon.png',
        //     scaledSize: new google.maps.Size(32, 32)
        //   },
        //   title: 'Delivery Location'
        // });

        // newMarkers.push(deliveryMarker);
        console.log("Added delivery marker for delivery:", delivery.id);
      }

      // Draw route between pickup and delivery
      // In a real app, you would use the Directions API to draw a route
      // const directionsService = new google.maps.DirectionsService();
      // const directionsRenderer = new google.maps.DirectionsRenderer({
      //   map: map,
      //   suppressMarkers: true
      // });

      // directionsService.route({
      //   origin: { lat: pickupLat, lng: pickupLng },
      //   destination: { lat: deliveryLat, lng: deliveryLng },
      //   travelMode: google.maps.TravelMode.DRIVING
      // }, (response, status) => {
      //   if (status === 'OK') {
      //     directionsRenderer.setDirections(response);
      //   }
      // });
    }

    setMarkers(newMarkers);
  };

  // Function to get status color
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

  // Center map on current location
  const centerOnCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });

          // In a real implementation with Google Maps:
          // map.setCenter({ lat: latitude, lng: longitude });
          // map.setZoom(15);

          console.log("Centered map on current location:", {
            latitude,
            longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Could not get your current location. Please check your device settings."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Start navigation to selected delivery
  const startNavigation = () => {
    if (!selectedDelivery) return;

    // Determine the destination based on delivery status
    let destinationAddress;

    if (["Assigned", "Pickup_In_Progress"].includes(selectedDelivery.status)) {
      // Navigate to pickup location
      destinationAddress = selectedDelivery.pickupLocation?.address;
    } else {
      // Navigate to delivery location
      destinationAddress = selectedDelivery.deliveryLocation?.address;
    }

    if (!destinationAddress) {
      alert("No valid destination address found.");
      return;
    }

    // Open in Google Maps or other navigation app
    const encodedAddress = encodeURIComponent(destinationAddress);
    const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}&travelmode=driving`;

    window.open(navigationUrl, "_blank");
  };

  const statusConfig = {
    Assigned: { label: "Assigned" },
    Pickup_In_Progress: { label: "Pickup In Progress" },
    Picked_Up: { label: "Picked Up" },
    In_Transit: { label: "In Transit" },
    Delivered: { label: "Delivered" },
    Failed: { label: "Failed" },
    Cancelled: { label: "Cancelled" },
  };

  return (
    <RealTimeLocationTracker trackingInterval={60000}>
      <SupplierLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Map View</h1>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 inline-flex items-center gap-2"
                onClick={centerOnCurrentLocation}
              >
                <LocateFixed className="h-4 w-4" />
                <span>My Location</span>
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
            {/* Map View */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium">Delivery Map</h2>
                    <p className="text-sm text-gray-500">
                      Active deliveries in your service area
                    </p>
                  </div>
                </div>

                <div className="flex mt-4 border-b">
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === "current"
                        ? "border-b-2 border-green-600 text-green-600"
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("current")}
                  >
                    Current Delivery
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === "all"
                        ? "border-b-2 border-green-600 text-green-600"
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("all")}
                  >
                    All Active Orders
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === "optimize"
                        ? "border-b-2 border-green-600 text-green-600"
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("optimize")}
                  >
                    Route Optimization
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div
                  ref={mapRef}
                  className="relative aspect-video w-full overflow-hidden rounded-lg border bg-gray-100"
                >
                  {!isLoaded ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
                    </div>
                  ) : (
                    <div
                      className="h-full w-full bg-cover bg-center"
                      style={{ backgroundImage: `url('/assets/map.png')` }}
                    >
                      {/* Map content would go here */}
                      <div className="absolute inset-0">
                        {/* This would be replaced with actual map markers */}
                        {selectedDelivery && (
                          <>
                            {/* Pickup Location - Farmer */}
                            <div className="absolute top-[30%] left-[25%] transform -translate-x-1/2 -translate-y-1/2">
                              <div className="relative">
                                <div className="p-1 bg-white rounded-full shadow-md">
                                  <MapPin className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap">
                                  <span className="px-2 py-1 bg-white border rounded-full text-xs shadow-sm">
                                    Pickup Location
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Dropoff Location - Customer */}
                            <div className="absolute top-[40%] left-[65%] transform -translate-x-1/2 -translate-y-1/2">
                              <div className="relative">
                                <div className="p-1 bg-white rounded-full shadow-md">
                                  <MapPin className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap">
                                  <span className="px-2 py-1 bg-white border rounded-full text-xs shadow-sm">
                                    Delivery Location
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Current Location - Supplier */}
                            <div className="absolute top-[60%] left-[45%] transform -translate-x-1/2 -translate-y-1/2">
                              <div className="relative">
                                <div className="p-1 bg-white rounded-full shadow-md animate-pulse">
                                  <Truck className="h-6 w-6 text-amber-600" />
                                </div>
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap">
                                  <span className="px-2 py-1 bg-amber-500 text-white rounded-full text-xs shadow-sm">
                                    Your Location
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Route line visualization */}
                            <svg
                              className="absolute inset-0 w-full h-full"
                              style={{ pointerEvents: "none" }}
                            >
                              <path
                                d="M 120,150 Q 250,100 270,300 T 420,200"
                                stroke="#16a34a"
                                strokeWidth="3"
                                fill="none"
                                strokeDasharray="5,5"
                              />
                              <path
                                d="M 270,300 Q 350,350 420,200"
                                stroke="#2563eb"
                                strokeWidth="3"
                                fill="none"
                              />
                            </svg>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-3 border rounded-lg">
                    <div className="text-sm font-medium text-gray-500">
                      Estimated Time
                    </div>
                    <div className="text-lg font-bold">
                      {selectedDelivery?.estimatedDeliveryTime
                        ? new Date(
                            selectedDelivery.estimatedDeliveryTime
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-sm font-medium text-gray-500">
                      Distance
                    </div>
                    <div className="text-lg font-bold">
                      {currentLocation && selectedDelivery?.deliveryLocation
                        ? "Calculating..." // In a real app, you would calculate this
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

            {/* Deliveries List */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-medium">Active Deliveries</h2>
                <p className="text-sm text-gray-500">
                  Select a delivery to view on map
                </p>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {activeDeliveries.length > 0 ? (
                    activeDeliveries.map((delivery) => (
                      <div
                        key={delivery.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                          selectedDelivery?.id === delivery.id
                            ? "border-green-500 bg-green-50"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedDelivery(delivery)}
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
          </div>
        </div>
      </SupplierLayout>
    </RealTimeLocationTracker>
  );
}
