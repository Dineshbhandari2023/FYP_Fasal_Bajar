// import { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { SupplierLayout } from "../SupplierLayout";
// import {
//   MapPin,
//   Navigation,
//   Truck,
//   LocateFixed,
//   Route,
//   Package,
//   Clock,
//   Layers,
// } from "lucide-react";
// import {
//   getAllSuppliers,
//   getActiveDeliveries,
// } from "../../Redux/slice/supplierSlice";
// import RealTimeLocationTracker from "./RealTimeLocationTracker";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   useMap,
//   ZoomControl,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "leaflet-routing-machine";

// // Fix for default marker icon in react-leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
// });

// // Custom marker icons
// const pickupIcon = new L.Icon({
//   iconUrl:
//     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
//   shadowSize: [41, 41],
// });

// const deliveryIcon = new L.Icon({
//   iconUrl:
//     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
//   shadowSize: [41, 41],
// });

// const supplierIcon = new L.Icon({
//   iconUrl:
//     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
//   shadowSize: [41, 41],
// });

// // Component to update map view when center changes
// function ChangeMapView({ center, zoom }) {
//   const map = useMap();
//   useEffect(() => {
//     if (center) {
//       map.setView(center, zoom);
//     }
//   }, [center, zoom, map]);
//   return null;
// }

// // Component to draw route between points
// function RouteLayer({ pickupLocation, deliveryLocation, currentLocation }) {
//   const map = useMap();
//   const routingControlRef = useRef(null);

//   // Add CSS to hide routing machine UI elements
//   useEffect(() => {
//     // Add CSS to hide routing machine UI elements
//     const style = document.createElement("style");
//     style.textContent = `
//       .display-none {
//         display: none !important;
//       }
//       .leaflet-routing-container {
//         display: none !important;
//       }
//     `;
//     document.head.appendChild(style);

//     return () => {
//       document.head.removeChild(style);
//     };
//   }, []);

//   useEffect(() => {
//     if (!map || !pickupLocation || !deliveryLocation) return;

//     // Clear previous routing control if it exists
//     if (routingControlRef.current) {
//       map.removeControl(routingControlRef.current);
//       routingControlRef.current = null;
//     }

//     // Create waypoints based on delivery status and current location
//     const waypoints = [];

//     // If we have current location, start from there
//     if (currentLocation) {
//       waypoints.push(L.latLng(currentLocation[0], currentLocation[1]));
//     }

//     // Add pickup and delivery locations
//     waypoints.push(L.latLng(pickupLocation[0], pickupLocation[1]));
//     waypoints.push(L.latLng(deliveryLocation[0], deliveryLocation[1]));

//     // Create routing control
//     try {
//       routingControlRef.current = L.Routing.control({
//         waypoints,
//         routeWhileDragging: false,
//         showAlternatives: false,
//         fitSelectedRoutes: false,
//         show: false,
//         lineOptions: {
//           styles: [
//             { color: "blue", opacity: 0.6, weight: 4 },
//             { color: "white", opacity: 0.5, weight: 2 },
//           ],
//         },
//         createMarker: () => {
//           return null; // Don't create markers for waypoints (we'll use our own)
//         },
//         // Hide the itinerary and waypoint panels
//         collapsible: true,
//         collapsed: true,
//         // Completely hide the control container
//         containerClassName: "display-none",
//         // Disable all UI elements
//         addWaypoints: false,
//         draggableWaypoints: false,
//         waypointMode: "connect",
//         useZoomParameter: false,
//         autoRoute: true,
//         // Add a custom formatter that returns empty strings for all instructions
//         formatter: new L.Routing.Formatter({
//           getIconHTML: () => "",
//           formatInstruction: () => "",
//         }),
//       }).addTo(map);
//     } catch (error) {
//       console.error("Error creating routing control:", error);
//     }

//     return () => {
//       if (routingControlRef.current) {
//         map.removeControl(routingControlRef.current);
//       }
//     };
//   }, [map, pickupLocation, deliveryLocation, currentLocation]);

//   return null;
// }

// export default function SupplierMapPage() {
//   const dispatch = useDispatch();
//   const { suppliers, activeDeliveries, supplierDetails } = useSelector(
//     (state) => state.supplier
//   );
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [activeTab, setActiveTab] = useState("current");
//   const [selectedDelivery, setSelectedDelivery] = useState(null);
//   const [mapCenter, setMapCenter] = useState([26.660944, 87.280769]); // Default center (Itahari, Nepal)
//   const [zoom, setZoom] = useState(13);
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [mapLayers, setMapLayers] = useState("streets"); // streets, satellite
//   const mapRef = useRef(null);
//   const leafletMapRef = useRef(null);

//   // Load deliveries and suppliers data
//   useEffect(() => {
//     dispatch(getActiveDeliveries());
//     dispatch(getAllSuppliers({ page: 1, limit: 50 }));
//   }, [dispatch]);

//   // Set the first delivery as selected by default when data loads
//   useEffect(() => {
//     if (activeDeliveries.length > 0 && !selectedDelivery) {
//       setSelectedDelivery(activeDeliveries[0]);
//     }
//   }, [activeDeliveries, selectedDelivery]);

//   // Get current location to center the map
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setCurrentLocation([latitude, longitude]);
//           setMapCenter([latitude, longitude]);
//           setIsLoaded(true);
//           console.log("Current location set:", { latitude, longitude });
//         },
//         (error) => {
//           console.error("Error getting location:", error);
//           setIsLoaded(true); // Still mark as loaded even if we couldn't get location
//         },
//         { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
//       );
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//       setIsLoaded(true); // Still mark as loaded even if geolocation is not supported
//     }
//   }, []);

//   // Parse location string or object to array [lat, lng]
//   const parseLocation = (location) => {
//     if (!location) return null;
//     try {
//       if (typeof location === "string") {
//         // Parse string format like "26.660944, 87.280769"
//         const parts = location
//           .split(",")
//           .map((part) => Number.parseFloat(part.trim()));
//         if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
//           return parts;
//         }
//       } else if (typeof location === "object") {
//         // Parse object format like {latitude: 26.660944, longitude: 87.280769}
//         if (
//           location.latitude !== undefined &&
//           location.longitude !== undefined
//         ) {
//           return [
//             Number.parseFloat(location.latitude),
//             Number.parseFloat(location.longitude),
//           ];
//         }
//       }
//     } catch (error) {
//       console.error("Error parsing location:", error);
//     }
//     return null;
//   };

//   // Get pickup and delivery locations for the selected delivery
//   const getDeliveryLocations = () => {
//     if (!selectedDelivery) return { pickup: null, delivery: null };

//     // Try to get pickup location
//     let pickupLocation = null;
//     if (selectedDelivery.pickupLocation) {
//       pickupLocation = parseLocation(selectedDelivery.pickupLocation);
//     } else if (selectedDelivery.OrderItem?.farmer?.location) {
//       pickupLocation = parseLocation(
//         selectedDelivery.OrderItem.farmer.location
//       );
//     }

//     // If we still don't have pickup location, use a default or placeholder
//     if (!pickupLocation) {
//       // For demo purposes, use a location near the current location
//       if (currentLocation) {
//         pickupLocation = [currentLocation[0] - 0.01, currentLocation[1] - 0.01];
//       } else {
//         pickupLocation = [26.65, 87.27]; // Default location
//       }
//     }

//     // Try to get delivery location
//     let deliveryLocation = null;
//     if (selectedDelivery.deliveryLocation) {
//       deliveryLocation = parseLocation(selectedDelivery.deliveryLocation);
//     } else if (selectedDelivery.OrderItem?.Order?.buyer?.location) {
//       deliveryLocation = parseLocation(
//         selectedDelivery.OrderItem.Order.buyer.location
//       );
//     }

//     // If we still don't have delivery location, use a default or placeholder
//     if (!deliveryLocation) {
//       // For demo purposes, use a location near the current location
//       if (currentLocation) {
//         deliveryLocation = [
//           currentLocation[0] + 0.01,
//           currentLocation[1] + 0.01,
//         ];
//       } else {
//         deliveryLocation = [26.67, 87.29]; // Default location
//       }
//     }

//     return { pickup: pickupLocation, delivery: deliveryLocation };
//   };

//   // Center map on current location
//   const centerOnCurrentLocation = () => {
//     if (currentLocation) {
//       setMapCenter([currentLocation.latitude, currentLocation.longitude]);
//       setZoom(15);
//     } else if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setCurrentLocation([latitude, longitude]);
//           setMapCenter([latitude, longitude]);
//           setZoom(15);
//           console.log("Centered map on current location:", {
//             latitude,
//             longitude,
//           });
//         },
//         (error) => {
//           console.error("Error getting location:", error);
//           alert(
//             "Could not get your current location. Please check your device settings."
//           );
//         },
//         { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
//       );
//     } else {
//       alert("Geolocation is not supported by this browser.");
//     }
//   };

//   // Start navigation to selected delivery
//   const startNavigation = () => {
//     if (!selectedDelivery) return;

//     // Determine the destination based on delivery status
//     let destinationAddress;

//     if (["Assigned", "Pickup_In_Progress"].includes(selectedDelivery.status)) {
//       // Navigate to pickup location
//       destinationAddress = selectedDelivery.pickupLocation?.address;
//     } else {
//       // Navigate to delivery location
//       destinationAddress = selectedDelivery.deliveryLocation?.address;
//     }

//     if (!destinationAddress) {
//       alert("No valid destination address found.");
//       return;
//     }

//     // Open in Google Maps or other navigation app
//     const encodedAddress = encodeURIComponent(destinationAddress);
//     const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}&travelmode=driving`;

//     window.open(navigationUrl, "_blank");
//   };

//   // Toggle map layer between streets and satellite
//   const toggleMapLayer = () => {
//     setMapLayers(mapLayers === "streets" ? "satellite" : "streets");
//   };

//   // Function to get status color
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Assigned":
//         return "bg-blue-100 text-blue-800";
//       case "Pickup_In_Progress":
//         return "bg-purple-100 text-purple-800";
//       case "Picked_Up":
//         return "bg-yellow-100 text-yellow-800";
//       case "In_Transit":
//         return "bg-amber-100 text-amber-800";
//       case "Delivered":
//         return "bg-green-100 text-green-800";
//       case "Failed":
//         return "bg-red-100 text-red-800";
//       case "Cancelled":
//         return "bg-gray-100 text-gray-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const statusConfig = {
//     Assigned: { label: "Assigned" },
//     Pickup_In_Progress: { label: "Pickup In Progress" },
//     Picked_Up: { label: "Picked Up" },
//     In_Transit: { label: "In Transit" },
//     Delivered: { label: "Delivered" },
//     Failed: { label: "Failed" },
//     Cancelled: { label: "Cancelled" },
//   };

//   // Get delivery locations for the selected delivery
//   const { pickup: pickupLocation, delivery: deliveryLocation } =
//     getDeliveryLocations();

//   return (
//     <RealTimeLocationTracker trackingInterval={60000}>
//       <SupplierLayout>
//         <div className="space-y-6">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <h1 className="text-3xl font-bold tracking-tight">Map View</h1>
//             <div className="flex flex-wrap gap-2">
//               <button
//                 className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 inline-flex items-center gap-2"
//                 onClick={centerOnCurrentLocation}
//               >
//                 <LocateFixed className="h-4 w-4" />
//                 <span>My Location</span>
//               </button>
//               <button
//                 className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 inline-flex items-center gap-2"
//                 onClick={toggleMapLayer}
//               >
//                 <Layers className="h-4 w-4" />
//                 <span>{mapLayers === "streets" ? "Satellite" : "Streets"}</span>
//               </button>
//               <button
//                 className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 inline-flex items-center gap-2"
//                 onClick={startNavigation}
//                 disabled={!selectedDelivery}
//               >
//                 <Navigation className="h-4 w-4" />
//                 <span>Navigate</span>
//               </button>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Map View */}
//             <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border">
//               <div className="p-4 sm:p-6 border-b">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h2 className="text-lg font-medium">Delivery Map</h2>
//                     <p className="text-sm text-gray-500">
//                       Active deliveries in your service area
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex mt-4 border-b overflow-x-auto">
//                   <button
//                     className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
//                       activeTab === "current"
//                         ? "border-b-2 border-green-600 text-green-600"
//                         : "text-gray-500"
//                     }`}
//                     onClick={() => setActiveTab("current")}
//                   >
//                     Current Delivery
//                   </button>
//                   <button
//                     className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
//                       activeTab === "all"
//                         ? "border-b-2 border-green-600 text-green-600"
//                         : "text-gray-500"
//                     }`}
//                     onClick={() => setActiveTab("all")}
//                   >
//                     All Active Orders
//                   </button>
//                   <button
//                     className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
//                       activeTab === "optimize"
//                         ? "border-b-2 border-green-600 text-green-600"
//                         : "text-gray-500"
//                     }`}
//                     onClick={() => setActiveTab("optimize")}
//                   >
//                     Route Optimization
//                   </button>
//                 </div>
//               </div>
//               <div className="p-4 sm:p-6">
//                 <div
//                   ref={mapRef}
//                   className="relative w-full overflow-hidden rounded-lg border"
//                   style={{ height: "calc(50vh - 100px)", minHeight: "300px" }}
//                 >
//                   {!isLoaded ? (
//                     <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
//                       <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
//                     </div>
//                   ) : (
//                     <MapContainer
//                       center={mapCenter}
//                       zoom={zoom}
//                       style={{ height: "100%", width: "100%" }}
//                       zoomControl={false}
//                       ref={leafletMapRef}
//                     >
//                       {/* Base map layer */}
//                       {mapLayers === "streets" ? (
//                         <TileLayer
//                           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                         />
//                       ) : (
//                         <TileLayer
//                           attribution='&copy; <a href="https://www.esri.com">Esri</a>'
//                           url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
//                         />
//                       )}

//                       {/* Current location marker */}
//                       {currentLocation && (
//                         <Marker position={currentLocation} icon={supplierIcon}>
//                           <Popup>
//                             <div className="text-center">
//                               <strong>Your Current Location</strong>
//                               <p className="text-xs text-gray-600">
//                                 {currentLocation[0].toFixed(6)},{" "}
//                                 {currentLocation[1].toFixed(6)}
//                               </p>
//                             </div>
//                           </Popup>
//                         </Marker>
//                       )}

//                       {/* Pickup location marker */}
//                       {pickupLocation && (
//                         <Marker position={pickupLocation} icon={pickupIcon}>
//                           <Popup>
//                             <div className="text-center">
//                               <strong>Pickup Location</strong>
//                               <p className="text-xs text-gray-600">
//                                 {selectedDelivery?.pickupLocation?.address ||
//                                   selectedDelivery?.OrderItem?.farmer
//                                     ?.location ||
//                                   "Address not available"}
//                               </p>
//                             </div>
//                           </Popup>
//                         </Marker>
//                       )}

//                       {/* Delivery location marker */}
//                       {deliveryLocation && (
//                         <Marker position={deliveryLocation} icon={deliveryIcon}>
//                           <Popup>
//                             <div className="text-center">
//                               <strong>Delivery Location</strong>
//                               <p className="text-xs text-gray-600">
//                                 {selectedDelivery?.deliveryLocation?.address ||
//                                   selectedDelivery?.OrderItem?.Order?.buyer
//                                     ?.location ||
//                                   "Address not available"}
//                               </p>
//                             </div>
//                           </Popup>
//                         </Marker>
//                       )}

//                       {/* Route between points */}
//                       {pickupLocation &&
//                         deliveryLocation &&
//                         currentLocation && (
//                           <RouteLayer
//                             pickupLocation={pickupLocation}
//                             deliveryLocation={deliveryLocation}
//                             currentLocation={currentLocation}
//                           />
//                         )}

//                       {/* Update map view when center changes */}
//                       <ChangeMapView center={mapCenter} zoom={zoom} />

//                       {/* Add zoom control in a better position */}
//                       <ZoomControl position="bottomright" />
//                     </MapContainer>
//                   )}
//                 </div>

//                 <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//                   <div className="p-3 border rounded-lg">
//                     <div className="text-sm font-medium text-gray-500">
//                       Estimated Time
//                     </div>
//                     <div className="text-lg font-bold">
//                       {selectedDelivery?.estimatedDeliveryTime
//                         ? new Date(
//                             selectedDelivery.estimatedDeliveryTime
//                           ).toLocaleTimeString([], {
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           })
//                         : "N/A"}
//                     </div>
//                   </div>
//                   <div className="p-3 border rounded-lg">
//                     <div className="text-sm font-medium text-gray-500">
//                       Distance
//                     </div>
//                     <div className="text-lg font-bold">
//                       {currentLocation && deliveryLocation
//                         ? "Calculating..."
//                         : "N/A"}
//                     </div>
//                   </div>
//                   <div className="p-3 border rounded-lg">
//                     <div className="text-sm font-medium text-gray-500">
//                       Active Orders
//                     </div>
//                     <div className="text-lg font-bold">
//                       {activeDeliveries.length} orders
//                     </div>
//                   </div>
//                   <div className="p-3 border rounded-lg">
//                     <div className="text-sm font-medium text-gray-500">
//                       Location Status
//                     </div>
//                     <div className="text-lg font-bold flex items-center">
//                       <span
//                         className={`h-2 w-2 rounded-full ${
//                           currentLocation ? "bg-green-500" : "bg-red-500"
//                         } mr-2`}
//                       ></span>
//                       {currentLocation ? "Active" : "Inactive"}
//                     </div>
//                   </div>
//                 </div>

//                 {selectedDelivery && (
//                   <div className="mt-4 p-4 border rounded-lg bg-gray-50">
//                     <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
//                       <Route className="h-4 w-4 text-green-600" />
//                       Suggested Route
//                     </h3>
//                     <ol className="space-y-2 pl-6 list-decimal">
//                       <li className="text-sm">
//                         <span className="font-medium">Pickup:</span>{" "}
//                         {selectedDelivery.pickupLocation?.address || "N/A"}
//                       </li>
//                       <li className="text-sm">
//                         <span className="font-medium">Delivery:</span>{" "}
//                         {selectedDelivery.deliveryLocation?.address || "N/A"}
//                       </li>
//                     </ol>
//                     <div className="mt-3 flex justify-end">
//                       <button
//                         className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
//                         onClick={startNavigation}
//                       >
//                         Start Navigation
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Deliveries List */}
//             <div className="bg-white rounded-lg shadow-sm border">
//               <div className="p-4 sm:p-6 border-b">
//                 <h2 className="text-lg font-medium">Active Deliveries</h2>
//                 <p className="text-sm text-gray-500">
//                   Select a delivery to view on map
//                 </p>
//               </div>
//               <div className="p-4">
//                 <div className="space-y-3 max-h-[calc(50vh-100px)] overflow-y-auto">
//                   {activeDeliveries.length > 0 ? (
//                     activeDeliveries.map((delivery) => (
//                       <div
//                         key={delivery.id}
//                         className={`border rounded-lg p-3 cursor-pointer transition-colors ${
//                           selectedDelivery?.id === delivery.id
//                             ? "border-green-500 bg-green-50"
//                             : "hover:bg-gray-50"
//                         }`}
//                         onClick={() => setSelectedDelivery(delivery)}
//                       >
//                         <div className="flex justify-between items-start">
//                           <div>
//                             <div className="flex items-center gap-2">
//                               <h4 className="font-medium text-sm">
//                                 {delivery.deliveryNumber}
//                               </h4>
//                               <span
//                                 className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(
//                                   delivery.status
//                                 )}`}
//                               >
//                                 {statusConfig[delivery.status]?.label ||
//                                   delivery.status}
//                               </span>
//                             </div>
//                             <p className="text-xs text-gray-500 mt-1">
//                               Order:{" "}
//                               {delivery.OrderItem?.Order?.orderNumber || "N/A"}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="mt-2 flex items-center gap-1 text-xs text-gray-600">
//                           <Clock className="h-3 w-3" />
//                           <span>
//                             {delivery.estimatedDeliveryTime
//                               ? new Date(
//                                   delivery.estimatedDeliveryTime
//                                 ).toLocaleString([], {
//                                   month: "short",
//                                   day: "numeric",
//                                   hour: "2-digit",
//                                   minute: "2-digit",
//                                 })
//                               : "N/A"}
//                           </span>
//                         </div>

//                         <div className="mt-2 grid grid-cols-2 gap-2">
//                           <div className="text-xs">
//                             <div className="flex items-center gap-1 text-green-600">
//                               <MapPin className="h-3 w-3" />
//                               <span className="font-medium">Pickup</span>
//                             </div>
//                             <p className="truncate">
//                               {delivery.pickupLocation?.address ||
//                                 delivery.OrderItem?.farmer?.location ||
//                                 "N/A"}
//                             </p>
//                           </div>
//                           <div className="text-xs">
//                             <div className="flex items-center gap-1 text-blue-600">
//                               <MapPin className="h-3 w-3" />
//                               <span className="font-medium">Delivery</span>
//                             </div>
//                             <p className="truncate">
//                               {delivery.deliveryLocation?.address ||
//                                 delivery.OrderItem?.Order?.buyer?.location ||
//                                 "N/A"}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="mt-2 text-xs flex items-center gap-1">
//                           <Package className="h-3 w-3 text-gray-500" />
//                           <span className="truncate">
//                             {delivery.OrderItem?.Product?.productName || "N/A"}
//                             {delivery.OrderItem?.quantity &&
//                               ` (${delivery.OrderItem.quantity})`}
//                           </span>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="text-center py-8">
//                       <Truck className="h-12 w-12 mx-auto text-gray-300" />
//                       <h3 className="mt-2 text-lg font-medium text-gray-500">
//                         No active deliveries
//                       </h3>
//                       <p className="text-gray-400">
//                         You don't have any active deliveries at the moment
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </SupplierLayout>
//     </RealTimeLocationTracker>
//   );
// }
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
  getAllSuppliers,
  getActiveDeliveries,
} from "../../Redux/slice/supplierSlice";
import RealTimeLocationTracker from "./RealTimeLocationTracker";
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

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom marker icons
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

// Component to update map view when center changes
function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

// Component to draw route between points
function RouteLayer({ pickupLocation, deliveryLocation, currentLocation }) {
  const map = useMap();
  const routingControlRef = useRef(null);
  const routeLayersRef = useRef([]);

  // Add CSS to hide routing machine UI elements
  useEffect(() => {
    // Add CSS to hide routing machine UI elements
    const style = document.createElement("style");
    style.textContent = `
      .display-none {
        display: none !important;
      }
      .leaflet-routing-container {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (!map || !pickupLocation || !deliveryLocation) return;

    // Clean up function to safely remove routing control
    const cleanupRouting = () => {
      if (routingControlRef.current) {
        try {
          // First, manually remove any route layers that were added
          if (routeLayersRef.current && routeLayersRef.current.length > 0) {
            routeLayersRef.current.forEach((layer) => {
              if (layer && map && map.hasLayer && map.hasLayer(layer)) {
                map.removeLayer(layer);
              }
            });
            routeLayersRef.current = [];
          }

          // Then remove the control itself if it exists and has a remove method
          if (
            routingControlRef.current &&
            typeof routingControlRef.current.remove === "function"
          ) {
            routingControlRef.current.remove();
          } else if (map && map.removeControl && routingControlRef.current) {
            // Fallback to removeControl if remove method doesn't exist
            map.removeControl(routingControlRef.current);
          }
        } catch (error) {
          console.error("Error cleaning up routing control:", error);
        }
        routingControlRef.current = null;
      }
    };

    // Clean up previous routing control
    cleanupRouting();

    // Create waypoints based on delivery status and current location
    const waypoints = [];

    // If we have current location, start from there
    if (currentLocation) {
      waypoints.push(L.latLng(currentLocation[0], currentLocation[1]));
    }

    // Add pickup and delivery locations
    waypoints.push(L.latLng(pickupLocation[0], pickupLocation[1]));
    waypoints.push(L.latLng(deliveryLocation[0], deliveryLocation[1]));

    // Create routing control
    try {
      // Create a custom plan to capture the route layers
      const customPlan = new L.Routing.Plan(waypoints, {
        createMarker: () => null, // Don't create markers
        draggableWaypoints: false,
        addWaypoints: false,
      });

      // Create routing control with the custom plan
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
        // Hide the itinerary and waypoint panels
        collapsible: true,
        collapsed: true,
        // Completely hide the control container
        containerClassName: "display-none",
        // Disable all UI elements
        addWaypoints: false,
        draggableWaypoints: false,
        waypointMode: "connect",
        useZoomParameter: false,
        autoRoute: true,
        // Add a custom formatter that returns empty strings for all instructions
        formatter: new L.Routing.Formatter({
          getIconHTML: () => "",
          formatInstruction: () => "",
        }),
      });

      // Capture route layers when they're added
      routingControlRef.current.on("routesfound", (e) => {
        try {
          // Store references to the route layers
          if (e.routes && e.routes.length > 0) {
            // Clear previous references
            routeLayersRef.current = [];

            // Store new layer references
            e.routes.forEach((route) => {
              if (route && route.layer) {
                routeLayersRef.current.push(route.layer);
              }
            });
          }
        } catch (error) {
          console.error("Error storing route layers:", error);
        }
      });

      // Add the control to the map
      routingControlRef.current.addTo(map);
    } catch (error) {
      console.error("Error creating routing control:", error);
    }

    // Clean up when component unmounts or dependencies change
    return () => {
      if (map) {
        // Add this check
        cleanupRouting();
      }
    };
  }, [map, pickupLocation, deliveryLocation, currentLocation]);

  return null;
}

export default function SupplierMapPage() {
  const dispatch = useDispatch();
  const { suppliers, activeDeliveries, supplierDetails } = useSelector(
    (state) => state.supplier
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("current");
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [mapCenter, setMapCenter] = useState([26.660944, 87.280769]); // Default center (Itahari, Nepal)
  const [zoom, setZoom] = useState(13);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapLayers, setMapLayers] = useState("streets"); // streets, satellite
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);

  // Load deliveries and suppliers data
  useEffect(() => {
    dispatch(getActiveDeliveries());
    dispatch(getAllSuppliers({ page: 1, limit: 50 }));
  }, [dispatch]);

  // Set the first delivery as selected by default when data loads
  useEffect(() => {
    if (activeDeliveries.length > 0 && !selectedDelivery) {
      setSelectedDelivery(activeDeliveries[0]);
    }
  }, [activeDeliveries, selectedDelivery]);

  // Get current location to center the map
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);
          setIsLoaded(true);
          console.log("Current location set:", { latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoaded(true); // Still mark as loaded even if we couldn't get location
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setIsLoaded(true); // Still mark as loaded even if geolocation is not supported
    }
  }, []);

  // Parse location string or object to array [lat, lng]
  const parseLocation = (location) => {
    if (!location) return null;
    try {
      if (typeof location === "string") {
        // Parse string format like "26.660944, 87.280769"
        const parts = location
          .split(",")
          .map((part) => Number.parseFloat(part.trim()));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          return parts;
        }
      } else if (typeof location === "object") {
        // Parse object format like {latitude: 26.660944, longitude: 87.280769}
        if (
          location.latitude !== undefined &&
          location.longitude !== undefined
        ) {
          return [
            Number.parseFloat(location.latitude),
            Number.parseFloat(location.longitude),
          ];
        }
      }
    } catch (error) {
      console.error("Error parsing location:", error);
    }
    return null;
  };

  // Get pickup and delivery locations for the selected delivery
  const getDeliveryLocations = () => {
    if (!selectedDelivery) return { pickup: null, delivery: null };

    // Try to get pickup location
    let pickupLocation = null;
    if (selectedDelivery.pickupLocation) {
      pickupLocation = parseLocation(selectedDelivery.pickupLocation);
    } else if (selectedDelivery.OrderItem?.farmer?.location) {
      pickupLocation = parseLocation(
        selectedDelivery.OrderItem.farmer.location
      );
    }

    // If we still don't have pickup location, use a default or placeholder
    if (!pickupLocation) {
      // For demo purposes, use a location near the current location
      if (currentLocation) {
        pickupLocation = [currentLocation[0] - 0.01, currentLocation[1] - 0.01];
      } else {
        pickupLocation = [26.65, 87.27]; // Default location
      }
    }

    // Try to get delivery location
    let deliveryLocation = null;
    if (selectedDelivery.deliveryLocation) {
      deliveryLocation = parseLocation(selectedDelivery.deliveryLocation);
    } else if (selectedDelivery.OrderItem?.Order?.buyer?.location) {
      deliveryLocation = parseLocation(
        selectedDelivery.OrderItem.Order.buyer.location
      );
    }

    // If we still don't have delivery location, use a default or placeholder
    if (!deliveryLocation) {
      // For demo purposes, use a location near the current location
      if (currentLocation) {
        deliveryLocation = [
          currentLocation[0] + 0.01,
          currentLocation[1] + 0.01,
        ];
      } else {
        deliveryLocation = [26.67, 87.29]; // Default location
      }
    }

    return { pickup: pickupLocation, delivery: deliveryLocation };
  };

  // Center map on current location
  const centerOnCurrentLocation = () => {
    if (currentLocation) {
      setMapCenter([currentLocation.latitude, currentLocation.longitude]);
      setZoom(15);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);
          setZoom(15);
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
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
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

  // Toggle map layer between streets and satellite
  const toggleMapLayer = () => {
    setMapLayers(mapLayers === "streets" ? "satellite" : "streets");
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

  const statusConfig = {
    Assigned: { label: "Assigned" },
    Pickup_In_Progress: { label: "Pickup In Progress" },
    Picked_Up: { label: "Picked Up" },
    In_Transit: { label: "In Transit" },
    Delivered: { label: "Delivered" },
    Failed: { label: "Failed" },
    Cancelled: { label: "Cancelled" },
  };

  // Get delivery locations for the selected delivery
  const { pickup: pickupLocation, delivery: deliveryLocation } =
    getDeliveryLocations();

  return (
    <RealTimeLocationTracker trackingInterval={60000}>
      <SupplierLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Map View</h1>
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
            {/* Map View */}
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
                  <button
                    className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
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
                      ref={leafletMapRef}
                    >
                      {/* Base map layer */}
                      {mapLayers === "streets" ? (
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                      ) : (
                        <TileLayer
                          attribution='&copy; <a href="https://www.esri.com">Esri</a>'
                          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        />
                      )}

                      {/* Current location marker */}
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

                      {/* Pickup location marker */}
                      {pickupLocation && (
                        <Marker position={pickupLocation} icon={pickupIcon}>
                          <Popup>
                            <div className="text-center">
                              <strong>Pickup Location</strong>
                              <p className="text-xs text-gray-600">
                                {selectedDelivery?.pickupLocation?.address ||
                                  selectedDelivery?.OrderItem?.farmer
                                    ?.location ||
                                  "Address not available"}
                              </p>
                            </div>
                          </Popup>
                        </Marker>
                      )}

                      {/* Delivery location marker */}
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
                            </div>
                          </Popup>
                        </Marker>
                      )}

                      {/* Route between points */}
                      {pickupLocation &&
                        deliveryLocation &&
                        currentLocation && (
                          <RouteLayer
                            pickupLocation={pickupLocation}
                            deliveryLocation={deliveryLocation}
                            currentLocation={currentLocation}
                          />
                        )}

                      {/* Update map view when center changes */}
                      <ChangeMapView center={mapCenter} zoom={zoom} />

                      {/* Add zoom control in a better position */}
                      <ZoomControl position="bottomright" />
                    </MapContainer>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
                      {currentLocation && deliveryLocation
                        ? "Calculating..."
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
