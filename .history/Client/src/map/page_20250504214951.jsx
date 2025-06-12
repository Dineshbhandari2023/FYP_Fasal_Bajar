// import { useEffect, useState, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import {
//   Phone,
//   Mail,
//   User,
//   MapPin,
//   X,
//   Star,
//   Wifi,
//   WifiOff,
// } from "lucide-react";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import Navigation from "../UI/navigation";
// import { fetchFarmers } from "../Redux/slice/userSlice";
// import { getAllSuppliers } from "../Redux/slice/supplierSlice";
// import { Link } from "react-router-dom";
// import locationService from "./webSocketLocationService";

// // Set your server's base URL
// const SERVER_URL = "http://localhost:8000";

// // Fix for default marker icon in react-leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
// });

// // Custom marker icon for farmers
// const farmerIcon = new L.Icon({
//   iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
//   shadowSize: [41, 41],
// });

// // Custom marker icon for suppliers (blue to differentiate)
// const supplierIcon = new L.Icon({
//   iconUrl:
//     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
//   shadowSize: [41, 41],
// });

// // Custom marker icon for active suppliers (green to show they're online)
// const activeSupplierIcon = new L.Icon({
//   iconUrl:
//     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
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
//     map.setView(center, zoom);
//   }, [center, zoom, map]);
//   return null;
// }

// const Map = () => {
//   const dispatch = useDispatch();
//   const {
//     farmersList,
//     loading: farmersLoading,
//     error: farmersError,
//   } = useSelector((state) => state.user);
//   const {
//     suppliers = [],
//     loading: suppliersLoading,
//     error: suppliersError,
//   } = useSelector((state) => state.supplier);
//   const [selectedEntity, setSelectedEntity] = useState(null);
//   const [entityType, setEntityType] = useState(null);
//   const [showDetails, setShowDetails] = useState(false);
//   const [showContactModal, setShowContactModal] = useState(false);
//   const [mapCenter, setMapCenter] = useState([26.660944, 87.280769]); // Default center (Itahari)
//   const [zoom, setZoom] = useState(12);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isMobile, setIsMobile] = useState(false);
//   const [wsConnected, setWsConnected] = useState(false);
//   const [realtimeSuppliers, setRealtimeSuppliers] = useState({});
//   const [showRealtimeOnly, setShowRealtimeOnly] = useState(false);
//   const mapRef = useRef(null);
//   const leafletMapRef = useRef(null);

//   // Ref for the sidebar to handle clicks outside it
//   const sidebarRef = useRef(null);

//   useEffect(() => {
//     dispatch(fetchFarmers());
//     dispatch(getAllSuppliers({ page: 1, limit: 100 }));
//   }, [dispatch]);

//   // Initialize WebSocket connection for real-time location updates
//   useEffect(() => {
//     const service = locationService
//       .connect()
//       .onConnect(() => {
//         console.log("WebSocket connected for real-time supplier tracking");
//         setWsConnected(true);
//         // ask server for the full active list immediately
//         service.getActiveSuppliers();
//       })
//       .onDisconnect(() => {
//         console.log("WebSocket disconnected");
//         setWsConnected(false);
//       })
//       // initialize map of all active suppliers
//       .onActiveSuppliersList((suppliersArray) => {
//         const mapObj = {};
//         suppliersArray.forEach((sup) => {
//           mapObj[sup.supplierId] = {
//             latitude: sup.latitude,
//             longitude: sup.longitude,
//             username: sup.username,
//             serviceArea: sup.serviceArea,
//             lastUpdated: new Date(sup.lastUpdated || sup.timestamp),
//             isActive: sup.isActive,
//           };
//         });
//         setRealtimeSuppliers(mapObj);
//       })
//       // toggle individual supplier online/offline
//       .onSupplierStatusChange((evt) => {
//         setRealtimeSuppliers((prev) => {
//           const next = { ...prev };
//           if (evt.isActive) {
//             // bring them back (if we have a last location)
//             next[evt.supplierId] = {
//               ...(next[evt.supplierId] || {}),
//               username: evt.username,
//               serviceArea: evt.serviceArea,
//               isActive: true,
//               lastUpdated: new Date(evt.timestamp),
//             };
//           } else {
//             // remove them completely (or you could mark isActive=false)
//             delete next[evt.supplierId];
//           }
//           return next;
//         });
//       })
//       // existing per-supplier live‐location handler
//       .onSupplierLocationUpdate((data) => {
//         console.log("Received supplier location update:", data);
//         setRealtimeSuppliers((prev) => ({
//           ...prev,
//           [data.supplierId]: {
//             ...(prev[data.supplierId] || {}),
//             latitude: data.latitude,
//             longitude: data.longitude,
//             lastUpdated: new Date(data.timestamp),
//             isActive: true,
//           },
//         }));
//       })
//       .onError((error) => {
//         console.error("WebSocket error:", error);
//       });

//     return () => {
//       service.disconnect();
//     };
//   }, []);

//   // Debug supplier data
//   useEffect(() => {
//     console.log("Suppliers fetched:", suppliers);
//   }, [suppliers]);

//   // Check if device is mobile
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   // Helper function to convert location string or object to an array of numbers
//   const parseLocation = (location) => {
//     if (!location) return null;
//     try {
//       if (typeof location === "string") {
//         const parts = location
//           .split(",")
//           .map((part) => Number.parseFloat(part.trim()));
//         if (parts.length === 2 && parts.every((num) => !isNaN(num))) {
//           return parts;
//         }
//       } else if (
//         typeof location === "object" &&
//         location.latitude &&
//         location.longitude
//       ) {
//         const lat = Number.parseFloat(location.latitude);
//         const lon = Number.parseFloat(location.longitude);
//         if (!isNaN(lat) && !isNaN(lon)) {
//           return [lat, lon];
//         }
//       }
//     } catch (error) {
//       console.error("Error parsing location:", error);
//     }
//     return null;
//   };

//   // Check if a supplier has real-time location data
//   const hasRealtimeLocation = (supplierId) =>
//     Boolean(realtimeSuppliers[supplierId]?.isActive);

//   // Get the most up-to-date location for a supplier (real-time if available, otherwise from DB)
//   const getSupplierLocation = (supplier) => {
//     // Check if we have real-time data for this supplier
//     if (realtimeSuppliers[supplier.id]) {
//       return [
//         Number(realtimeSuppliers[supplier.id].latitude),
//         Number(realtimeSuppliers[supplier.id].longitude),
//       ];
//     }

//     // Fall back to the location from the database
//     return parseLocation(supplier.SupplierDetail?.currentLocation);
//   };

//   // Check if a supplier's real-time data is recent (within the last 5 minutes)
//   // const isRealtimeRecent = (supplierId) => {
//   //   const data = realtimeSuppliers[supplierId];
//   //   if (!data || !data.lastUpdated) return false;
//   //   return data.lastUpdated > new Date(Date.now() - 5 * 60 * 1000);
//   // };
//   const isRealtimeRecent = (supplierId) => {
//     const data = realtimeSuppliers[supplierId];
//     if (!data || !data.lastUpdated) return false;
//     // instead of 5 minutes, maybe use 30 minutes:
//     return data.lastUpdated > new Date(Date.now() - 30 * 60 * 1000);
//   };

//   // const handleMarkerClick = (entity, type) => {
//   //   setSelectedEntity(entity);
//   //   setEntityType(type);
//   //   setShowDetails(true);
//   // };
//   function handleMarkerClick(entity, type) {
//     if (type === "supplier" && realtimeSuppliers[entity.id]) {
//       setSelectedEntity({
//         ...entity,
//         liveLocation: realtimeSuppliers[entity.id],
//       });
//     } else {
//       setSelectedEntity(entity);
//     }
//     setEntityType(type);
//     setShowDetails(true);
//   }

//   const handleViewOnMap = (entity, type) => {
//     let locationArray;

//     if (type === "supplier" && realtimeSuppliers[entity.id]) {
//       // Use real-time location if available
//       locationArray = [
//         Number(realtimeSuppliers[entity.id].latitude),
//         Number(realtimeSuppliers[entity.id].longitude),
//       ];
//     } else {
//       // Fall back to stored location
//       const location =
//         type === "supplier"
//           ? entity.SupplierDetail?.currentLocation || entity.location
//           : entity.location;
//       locationArray = parseLocation(location);
//     }

//     if (locationArray) {
//       console.log(
//         `Centering map on ${type} ${entity.username}:`,
//         locationArray
//       );
//       setMapCenter(locationArray);
//       setZoom(15);
//       if (isMobile && showDetails) {
//         setShowDetails(false);
//       }
//     } else {
//       console.warn(
//         `Cannot center map for ${type} ${entity.username}: Invalid location`
//       );
//     }
//   };

//   const handleContactEntity = (entity, type) => {
//     setSelectedEntity(entity);
//     setEntityType(type);
//     setShowContactModal(true);
//   };

//   const closeDetails = () => {
//     setShowDetails(false);
//   };

//   const closeContactModal = () => {
//     setShowContactModal(false);
//   };

//   // Filter farmers and suppliers based on search term and real-time filter
//   const filteredFarmers = farmersList?.filter(
//     (farmer) =>
//       farmer.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       farmer.location?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredSuppliers = suppliers?.filter((supplier) => {
//     const matchesSearch =
//       supplier.username.toLowerCase().includes(searchTerm) ||
//       supplier.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       supplier.SupplierDetail?.serviceArea
//         ?.toLowerCase()
//         .includes(searchTerm.toLowerCase());

//     // Then apply real-time only filter if enabled
//     if (showRealtimeOnly) {
//       return matchesSearch && Boolean(realtimeSuppliers[supplier.id]?.isActive);
//     }

//     return matchesSearch;
//   });

//   // Auto-center map when there's only one matching search result
//   useEffect(() => {
//     const totalResults =
//       (filteredFarmers?.length || 0) + (filteredSuppliers?.length || 0);
//     if (searchTerm && totalResults === 1) {
//       if (filteredFarmers?.length === 1) {
//         handleViewOnMap(filteredFarmers[0], "farmer");
//       } else if (filteredSuppliers?.length === 1) {
//         handleViewOnMap(filteredSuppliers[0], "supplier");
//       }
//     }
//   }, [searchTerm, filteredFarmers, filteredSuppliers]);

//   // Close sidebar on click outside of it
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
//         setShowDetails(false);
//       }
//     }
//     if (showDetails) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [showDetails]);

//   const live = realtimeSuppliers[selectedEntity?.id];

//   return (
//     <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
//       <div className="fixed top-0 left-0 right-0 z-50">
//         <Navigation />
//       </div>

//       <div className="container mx-auto px-4 py-4 md:py-8">
//         <div className="mb-4 md:mb-8">
//           <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-2">
//             Find Local Farmers & Suppliers
//           </h1>
//           <p className="text-sm md:text-base text-gray-600 max-w-2xl">
//             Connect directly with farmers and suppliers in your area to get
//             fresh, locally grown produce or reliable delivery services. Browse
//             the map or list below to find them near you.
//           </p>
//         </div>

//         {/* Search and filter controls */}
//         <div className="mb-4 md:mb-6 flex flex-col md:flex-row gap-3 items-start md:items-center">
//           <div className="relative max-w-full md:max-w-md">
//             <input
//               type="text"
//               placeholder="Search by name, location, or service area..."
//               className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <svg
//                 className="h-5 w-5 text-gray-400"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                 />
//               </svg>
//             </div>
//           </div>

//           {/* Real-time tracking status and filter */}
//           <div className="flex items-center gap-3">
//             <div className="flex items-center gap-1 text-sm">
//               <div
//                 className={`h-2 w-2 rounded-full ${
//                   wsConnected ? "bg-green-500" : "bg-red-500"
//                 }`}
//               ></div>
//               <span className="text-gray-600">
//                 {wsConnected
//                   ? "Real-time tracking active"
//                   : "Real-time tracking inactive"}
//               </span>
//             </div>

//             <label className="flex items-center gap-2 text-sm cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={showRealtimeOnly}
//                 onChange={() => setShowRealtimeOnly(!showRealtimeOnly)}
//                 className="rounded text-green-600 focus:ring-green-500"
//               />
//               <span className="text-gray-700">Show active suppliers only</span>
//             </label>
//           </div>
//         </div>

//         {/* Loading and error states */}
//         {(farmersLoading || suppliersLoading) && (
//           <div className="flex justify-center items-center py-8">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
//           </div>
//         )}

//         {(farmersError || suppliersError) && (
//           <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 md:mb-8">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <svg
//                   className="h-5 w-5 text-red-500"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-red-700">
//                   {farmersError
//                     ? `Error loading farmer data: ${farmersError}`
//                     : suppliersError
//                     ? `Error loading supplier data: ${suppliersError}`
//                     : "Error loading data"}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Map Container */}
//         <div
//           className="bg-white rounded-lg shadow-lg overflow-hidden mb-4 md:mb-8 relative z-10"
//           style={{ height: "50vh", minHeight: "300px" }}
//           ref={mapRef}
//         >
//           {!farmersLoading &&
//             !suppliersLoading &&
//             !farmersError &&
//             !suppliersError && (
//               <MapContainer
//                 center={mapCenter}
//                 zoom={zoom}
//                 style={{ height: "100%", width: "100%" }}
//                 ref={leafletMapRef}
//               >
//                 <TileLayer
//                   attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 />
//                 {/* Farmer Markers */}
//                 {filteredFarmers?.map((farmer) => {
//                   const locationArray = parseLocation(farmer.location);
//                   if (!locationArray) {
//                     console.warn(
//                       `Invalid location for farmer ${farmer.username}:`,
//                       farmer.location
//                     );
//                     return null;
//                   }
//                   return (
//                     <Marker
//                       key={`farmer-${farmer.id}`}
//                       position={locationArray}
//                       icon={farmerIcon}
//                       eventHandlers={{
//                         click: () => handleMarkerClick(farmer, "farmer"),
//                       }}
//                     >
//                       <Popup>
//                         <div className="text-center p-1">
//                           <h3 className="font-semibold">{farmer.username}</h3>
//                           <p className="text-xs text-gray-600">
//                             Farmer - {farmer.location}
//                           </p>
//                           <button
//                             className="mt-1 text-xs text-green-600 hover:text-green-800"
//                             onClick={() => handleMarkerClick(farmer, "farmer")}
//                           >
//                             View Details
//                           </button>
//                         </div>
//                       </Popup>
//                     </Marker>
//                   );
//                 })}

//                 {/* Supplier Markers */}
//                 {filteredSuppliers?.map((supplier) => {
//                   // Get the most up-to-date location (real-time if available)
//                   const locationArray = getSupplierLocation(supplier);

//                   if (!locationArray) {
//                     console.warn(
//                       `Invalid location for supplier ${supplier.username}:`,
//                       supplier.SupplierDetail?.currentLocation
//                     );
//                     return null;
//                   }

//                   // Determine if this supplier has real-time data and if it's recent
//                   const hasRealtime = hasRealtimeLocation(supplier.id);
//                   const isRecent = isRealtimeRecent(supplier.id);

//                   // Choose the appropriate icon based on real-time status
//                   const icon =
//                     hasRealtime && isRecent ? activeSupplierIcon : supplierIcon;

//                   return (
//                     <Marker
//                       key={`supplier-${supplier.id}`}
//                       position={locationArray}
//                       icon={icon}
//                       eventHandlers={{
//                         click: () => handleMarkerClick(supplier, "supplier"),
//                       }}
//                     >
//                       <Popup>
//                         <div className="text-center p-1">
//                           <h3 className="font-semibold">{supplier.username}</h3>
//                           <p className="text-xs text-gray-600">
//                             Supplier
//                             {hasRealtime && isRecent && (
//                               <span className="ml-1 inline-flex items-center text-green-600">
//                                 <Wifi className="h-3 w-3 mr-1" />
//                                 Live
//                               </span>
//                             )}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             {hasRealtime && isRecent
//                               ? `Updated: ${new Date(
//                                   realtimeSuppliers[supplier.id].lastUpdated
//                                 ).toLocaleTimeString()}`
//                               : "Location from database"}
//                           </p>
//                           <button
//                             className="mt-1 text-xs text-blue-600 hover:text-blue-800"
//                             onClick={() =>
//                               handleMarkerClick(supplier, "supplier")
//                             }
//                           >
//                             View Details
//                           </button>
//                         </div>
//                       </Popup>
//                     </Marker>
//                   );
//                 })}
//                 <ChangeMapView center={mapCenter} zoom={zoom} />
//               </MapContainer>
//             )}
//         </div>

//         {/* Entity List */}
//         <h2 className="text-xl md:text-2xl font-semibold text-green-800 mb-3 md:mb-4">
//           Available Farmers & Suppliers
//         </h2>

//         {filteredFarmers?.length === 0 &&
//           filteredSuppliers?.length === 0 &&
//           !farmersLoading &&
//           !suppliersLoading && (
//             <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <svg
//                     className="h-5 w-5 text-yellow-400"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </div>
//                 <div className="ml-3">
//                   <p className="text-sm text-yellow-700">
//                     No farmers or suppliers found matching your search criteria.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
//           {/* Farmers List */}
//           {filteredFarmers?.map((farmer) => (
//             <div
//               key={`farmer-${farmer.id}`}
//               className={`bg-white rounded-lg shadow-md overflow-hidden border transition-all duration-300 ${
//                 selectedEntity?.id === farmer.id && entityType === "farmer"
//                   ? "border-green-500 ring-2 ring-green-200"
//                   : "border-gray-200 hover:shadow-lg"
//               }`}
//             >
//               <div className="p-4 sm:p-6">
//                 <div className="flex items-start">
//                   <Link
//                     to={`/farmer/${farmer.id}`}
//                     className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 flex items-center justify-center mr-3 sm:mr-4 border-2 border-green-500 flex-shrink-0 hover:border-green-600 transition-colors"
//                   >
//                     {farmer.profileImage ? (
//                       <img
//                         src={`${SERVER_URL}${farmer.profileImage}`}
//                         alt={farmer.username}
//                         className="w-full h-full rounded-full object-cover"
//                       />
//                     ) : (
//                       <User className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
//                     )}
//                   </Link>
//                   <div>
//                     <h3 className="text-base sm:text-lg font-semibold text-gray-900">
//                       {farmer.username}
//                     </h3>
//                     <p className="text-xs sm:text-sm text-gray-600 mt-1">
//                       Farmer
//                     </p>
//                     <div className="flex items-center mt-1">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           size={14}
//                           className={`${
//                             i < 4
//                               ? "text-yellow-400 fill-yellow-400"
//                               : "text-gray-300"
//                           }`}
//                         />
//                       ))}
//                       <span className="ml-1 text-xs sm:text-sm text-gray-600">
//                         4.0
//                       </span>
//                     </div>
//                     <p className="text-xs sm:text-sm text-gray-600 mt-1 flex items-center">
//                       <MapPin className="h-3 w-3 mr-1 text-green-600" />
//                       {farmer.location}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="mt-3 space-y-1 sm:space-y-2">
//                   <div className="flex items-center text-xs sm:text-sm text-gray-600">
//                     <Phone className="h-3 w-3 sm:h-4 sm:h-4 mr-2 text-green-600" />
//                     {farmer.contact_number || "No phone number"}
//                   </div>
//                   <div className="flex items-center text-xs sm:text-sm text-gray-600">
//                     <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-green-600" />
//                     <span className="truncate max-w-[180px]">
//                       {farmer.email}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="mt-4 flex flex-col sm:flex-row gap-2">
//                   <button
//                     className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs sm:text-sm flex items-center justify-center"
//                     onClick={() => handleViewOnMap(farmer, "farmer")}
//                   >
//                     <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
//                     View on Map
//                   </button>
//                   <Link
//                     to={`/farmer/${farmer.id}`}
//                     className="px-3 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors text-xs sm:text-sm flex items-center justify-center"
//                   >
//                     View Profile
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           ))}

//           {/* Suppliers List */}
//           {filteredSuppliers?.map((supplier) => {
//             // Check if this supplier has real-time location data
//             const hasRealtime = hasRealtimeLocation(supplier.id);
//             const isRecent = isRealtimeRecent(supplier.id);

//             return (
//               <div
//                 key={`supplier-${supplier.id}`}
//                 className={`bg-white rounded-lg shadow-md overflow-hidden border transition-all duration-300 ${
//                   selectedEntity?.id === supplier.id &&
//                   entityType === "supplier"
//                     ? "border-blue-500 ring-2 ring-blue-200"
//                     : "border-gray-200 hover:shadow-lg"
//                 }`}
//               >
//                 <div className="p-4 sm:p-6">
//                   <div className="flex items-start">
//                     <Link
//                       to={`/supplier/${supplier.id}`}
//                       className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100 flex items-center justify-center mr-3 sm:mr-4 border-2 border-blue-500 flex-shrink-0 hover:border-blue-600 transition-colors"
//                     >
//                       {supplier.profileImage ? (
//                         <img
//                           src={`${SERVER_URL}${supplier.profileImage}`}
//                           alt={supplier.username}
//                           className="w-full h-full rounded-full object-cover"
//                         />
//                       ) : (
//                         <User className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
//                       )}
//                     </Link>
//                     <div>
//                       <h3 className="text-base sm:text-lg font-semibold text-gray-900">
//                         {supplier.username}
//                       </h3>
//                       <p className="text-xs sm:text-sm text-gray-600 mt-1 flex items-center">
//                         Supplier
//                         {hasRealtime && isRecent && (
//                           <span className="ml-2 inline-flex items-center text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs">
//                             <Wifi className="h-3 w-3 mr-1" />
//                             Live
//                           </span>
//                         )}
//                       </p>
//                       <div className="flex items-center mt-1">
//                         {[...Array(5)].map((_, i) => (
//                           <Star
//                             key={i}
//                             size={14}
//                             className={`${
//                               i <
//                               (supplier.SupplierDetail?.rating
//                                 ? Math.round(supplier.SupplierDetail.rating)
//                                 : 0)
//                                 ? "text-yellow-400 fill-yellow-400"
//                                 : "text-gray-300"
//                             }`}
//                           />
//                         ))}
//                         <span className="ml-1 text-xs sm:text-sm text-gray-600">
//                           {supplier.SupplierDetail?.rating
//                             ? supplier.SupplierDetail.rating.toFixed(1)
//                             : "N/A"}
//                         </span>
//                       </div>
//                       <p className="text-xs sm:text-sm text-gray-600 mt-1 flex items-center">
//                         <MapPin className="h-3 w-3 mr-1 text-blue-600" />
//                         {hasRealtime && isRecent
//                           ? `${realtimeSuppliers[supplier.id].latitude.toFixed(
//                               6
//                             )}, ${realtimeSuppliers[
//                               supplier.id
//                             ].longitude.toFixed(6)}`
//                           : supplier.SupplierDetail?.currentLocation
//                           ? `${supplier.SupplierDetail.currentLocation.latitude}, ${supplier.SupplierDetail.currentLocation.longitude}`
//                           : supplier.location || "Location not available"}
//                       </p>
//                       {hasRealtime && isRecent && (
//                         <p className="text-xs text-green-600 mt-1">
//                           Updated:{" "}
//                           {new Date(
//                             realtimeSuppliers[supplier.id].lastUpdated
//                           ).toLocaleTimeString()}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="mt-3 space-y-1 sm:space-y-2">
//                     <div className="flex items-center text-xs sm:text-sm text-gray-600">
//                       <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-blue-600" />
//                       {supplier.contact_number || "No phone number"}
//                     </div>
//                     <div className="flex items-center text-xs sm:text-sm text-gray-600">
//                       <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-blue-600" />
//                       <span className="truncate max-w-[180px]">
//                         {supplier.email}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="mt-4 flex flex-col sm:flex-row gap-2">
//                     <button
//                       className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs sm:text-sm flex items-center justify-center"
//                       onClick={() => handleViewOnMap(supplier, "supplier")}
//                     >
//                       <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
//                       View on Map
//                     </button>
//                     <Link
//                       to={`/supplier/${supplier.id}`}
//                       className="px-3 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-xs sm:text-sm flex items-center justify-center"
//                     >
//                       View Profile
//                     </Link>
//                     {/* <button
//                       className="px-3 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-xs sm:text-sm flex items-center justify-center"
//                       onClick={() => handleContactEntity(supplier, "supplier")}
//                     >
//                       Contact Supplier
//                     </button> */}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Entity Details Sidebar */}
//       {showDetails && selectedEntity && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end">
//           <div
//             ref={sidebarRef}
//             className="bg-white w-full sm:max-w-sm md:max-w-md h-full overflow-y-auto"
//             style={{
//               animation: "slideInRight 0.3s forwards",
//             }}
//           >
//             <style>{`
//               @keyframes slideInRight {
//                 from {
//                   transform: translateX(100%);
//                 }
//                 to {
//                   transform: translateX(0);
//                 }
//               }
//             `}</style>
//             <div className="p-4 sm:p-6">
//               <div className="flex justify-between items-center mb-4 sm:mb-6">
//                 <h2 className="text-xl sm:text-2xl font-bold text-green-800">
//                   {entityType === "farmer" ? "Farmer" : "Supplier"} Details
//                 </h2>
//                 <button
//                   onClick={closeDetails}
//                   className="p-2 rounded-full hover:bg-gray-100 bg-gray-50 transition-colors"
//                   aria-label="Close details"
//                 >
//                   <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
//                 </button>
//               </div>

//               <div className="text-center mb-4 sm:mb-6">
//                 <div
//                   className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full ${
//                     entityType === "farmer"
//                       ? "bg-green-100 border-green-500"
//                       : "bg-blue-100 border-blue-500"
//                   } flex items-center justify-center mx-auto border-4 mb-3 sm:mb-4`}
//                 >
//                   {selectedEntity.profileImage ? (
//                     <img
//                       src={`${SERVER_URL}${selectedEntity.profileImage}`}
//                       alt={selectedEntity.username}
//                       className="w-full h-full rounded-full object-cover"
//                     />
//                   ) : (
//                     <User
//                       className={`h-12 w-12 sm:h-16 sm:w-16 ${
//                         entityType === "farmer"
//                           ? "text-green-600"
//                           : "text-blue-600"
//                       }`}
//                     />
//                   )}
//                 </div>
//                 <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
//                   {selectedEntity.username}
//                 </h3>
//                 {/* Show real-time status for suppliers */}
//                 {/* Live status badge */}
//                 {entityType === "supplier" &&
//                   (live ? (
//                     <span className="inline-flex items-center text-green-600 …">
//                       <Wifi className="h-4 w-4 mr-1" /> Live Tracking Active
//                     </span>
//                   ) : (
//                     <span className="inline-flex items-center text-gray-600 …">
//                       <WifiOff className="h-4 w-4 mr-1" /> No Live Data
//                     </span>
//                   ))}

//                 {entityType === "supplier" && live && (
//                   <div className="mt-2 text-sm text-gray-700">
//                     📍 {live.latitude.toFixed(6)}, {live.longitude.toFixed(6)}
//                     <br />
//                     ⏱️ {live.lastUpdated.toLocaleTimeString()}
//                   </div>
//                 )}
//                 <p className="text-sm text-gray-600 flex items-center justify-center mt-2">
//                   <MapPin
//                     className={`h-4 w-4 mr-1 ${
//                       entityType === "farmer"
//                         ? "text-green-600"
//                         : "text-blue-600"
//                     }`}
//                   />
//                   {entityType === "farmer"
//                     ? selectedEntity.location
//                     : hasRealtimeLocation(selectedEntity.id) &&
//                       isRealtimeRecent(selectedEntity.id)
//                     ? `${realtimeSuppliers[selectedEntity.id].latitude.toFixed(
//                         6
//                       )}, ${realtimeSuppliers[
//                         selectedEntity.id
//                       ].longitude.toFixed(6)}`
//                     : selectedEntity.SupplierDetail?.currentLocation
//                     ? `${selectedEntity.SupplierDetail.currentLocation.latitude}, ${selectedEntity.SupplierDetail.currentLocation.longitude}`
//                     : selectedEntity.location || "Location not available"}
//                 </p>
//                 {entityType === "supplier" &&
//                   hasRealtimeLocation(selectedEntity.id) &&
//                   isRealtimeRecent(selectedEntity.id) && (
//                     <p className="text-xs text-green-600 mt-1">
//                       Last updated:{" "}
//                       {new Date(
//                         realtimeSuppliers[selectedEntity.id].lastUpdated
//                       ).toLocaleString()}
//                     </p>
//                   )}
//               </div>

//               <div
//                 className={`${
//                   entityType === "farmer" ? "bg-green-50" : "bg-blue-50"
//                 } p-3 sm:p-4 rounded-lg mb-4 sm:mb-6`}
//               >
//                 <h4
//                   className={`font-semibold ${
//                     entityType === "farmer" ? "text-green-800" : "text-blue-800"
//                   } mb-2`}
//                 >
//                   Contact Information
//                 </h4>
//                 <div className="space-y-2 sm:space-y-3">
//                   <div className="flex items-center">
//                     <Phone
//                       className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 ${
//                         entityType === "farmer"
//                           ? "text-green-600"
//                           : "text-blue-600"
//                       }`}
//                     />
//                     <span className="text-sm">
//                       {selectedEntity.contact_number || "No phone number"}
//                     </span>
//                   </div>
//                   <div className="flex items-center">
//                     <Mail
//                       className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 ${
//                         entityType === "farmer"
//                           ? "text-green-600"
//                           : "text-blue-600"
//                       }`}
//                     />
//                     <span className="text-sm break-all">
//                       {selectedEntity.email}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="mb-4 sm:mb-6">
//                 <h4
//                   className={`font-semibold ${
//                     entityType === "farmer" ? "text-green-800" : "text-blue-800"
//                   } mb-2`}
//                 >
//                   About
//                 </h4>
//                 <p className="text-sm text-gray-700">
//                   {selectedEntity.bio ||
//                     `This ${entityType} hasn't added a bio yet.`}
//                 </p>
//               </div>

//               <button
//                 onClick={() => handleContactEntity(selectedEntity, entityType)}
//                 className={`w-full py-2 sm:py-3 ${
//                   entityType === "farmer"
//                     ? "bg-green-600 hover:bg-green-700"
//                     : "bg-blue-600 hover:bg-blue-700"
//                 } text-white rounded-md transition-colors flex items-center justify-center`}
//               >
//                 <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
//                 Contact {entityType === "farmer" ? "Farmer" : "Supplier"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Contact Modal */}
//       {showContactModal && selectedEntity && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
//           <div
//             className="bg-white rounded-lg w-full max-w-sm sm:max-w-md p-4 sm:p-6"
//             style={{
//               animation: "fadeIn 0.2s forwards",
//             }}
//           >
//             <style>{`
//               @keyframes fadeIn {
//                 from {
//                   opacity: 0;
//                   transform: scale(0.95);
//                 }
//                 to {
//                   opacity: 1;
//                   transform: scale(1);
//                 }
//               }
//             `}</style>
//             <div className="flex justify-between items-center mb-3 sm:mb-4">
//               <h2
//                 className={`text-lg sm:text-xl font-bold ${
//                   entityType === "farmer" ? "text-green-800" : "text-blue-800"
//                 }`}
//               >
//                 Contact {entityType === "farmer" ? "Farmer" : "Supplier"}
//               </h2>
//               <button
//                 onClick={closeContactModal}
//                 className="p-1 sm:p-2 rounded-full hover:bg-gray-100"
//               >
//                 <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
//               </button>
//             </div>

//             <div className="mb-4 sm:mb-6">
//               <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
//                 You can contact{" "}
//                 <span className="font-semibold">{selectedEntity.username}</span>{" "}
//                 directly using the following information:
//               </p>

//               <div
//                 className={`${
//                   entityType === "farmer" ? "bg-green-50" : "bg-blue-50"
//                 } p-3 sm:p-4 rounded-lg space-y-2 sm:space-y-3`}
//               >
//                 <div className="flex items-center">
//                   <Phone
//                     className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 ${
//                       entityType === "farmer"
//                         ? "text-green-600"
//                         : "text-blue-600"
//                     }`}
//                   />
//                   <a
//                     href={`tel:${selectedEntity.contact_number}`}
//                     className={`text-sm sm:text-base ${
//                       entityType === "farmer"
//                         ? "text-green-700 hover:underline"
//                         : "text-blue-700 hover:underline"
//                     }`}
//                   >
//                     {selectedEntity.contact_number || "No phone number"}
//                   </a>
//                 </div>
//                 <div className="flex items-center">
//                   <Mail
//                     className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 ${
//                       entityType === "farmer"
//                         ? "text-green-600"
//                         : "text-blue-600"
//                     }`}
//                   />
//                   <a
//                     href={`mailto:${selectedEntity.email}`}
//                     className={`text-sm sm:text-base ${
//                       entityType === "farmer"
//                         ? "text-green-700 hover:underline"
//                         : "text-blue-700 hover:underline"
//                     } break-all`}
//                   >
//                     {selectedEntity.email}
//                   </a>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-2 sm:space-x-3">
//               <button
//                 onClick={closeContactModal}
//                 className="py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm sm:text-base"
//               >
//                 Cancel
//               </button>
//               <a
//                 href={`tel:${selectedEntity.contact_number}`}
//                 className={`py-2 ${
//                   entityType === "farmer"
//                     ? "bg-green-600 hover:bg-green-700"
//                     : "bg-blue-600 hover:bg-blue-700"
//                 } text-white rounded-md transition-colors text-center text-sm sm:text-base`}
//               >
//                 Call Now
//               </a>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Map;

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
  Tooltip,
} from "react-leaflet";
import {
  Phone,
  Mail,
  User,
  MapPin,
  X,
  Star,
  Wifi,
  WifiOff,
  Navigation,
  Clock,
  Truck,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import CustomNavigation from "../UI/navigation";
import { fetchFarmers } from "../Redux/slice/userSlice";
import { getAllSuppliers } from "../Redux/slice/supplierSlice";
import { Link } from "react-router-dom";
import locationService from "./webSocketLocationService";

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

// Custom marker icon for active suppliers (green to show they're online)
const activeSupplierIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Custom marker icon for delivery in progress
const deliveryIcon = new L.Icon({
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
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Component to auto-follow a supplier's location
function SupplierTracker({ supplierId, realtimeSuppliers, autoFollow }) {
  const map = useMap();
  const supplierData = realtimeSuppliers[supplierId];

  useEffect(() => {
    if (autoFollow && supplierData && supplierData.isActive) {
      const location = [
        Number(supplierData.latitude),
        Number(supplierData.longitude),
      ];
      map.setView(location, map.getZoom());
    }
  }, [supplierData, autoFollow, map, supplierId]);

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
  } = useSelector((state) => state.supplier);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [entityType, setEntityType] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [mapCenter, setMapCenter] = useState([26.660944, 87.280769]); // Default center (Itahari)
  const [zoom, setZoom] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [realtimeSuppliers, setRealtimeSuppliers] = useState({});
  const [showRealtimeOnly, setShowRealtimeOnly] = useState(false);
  const [autoFollowSupplier, setAutoFollowSupplier] = useState(null);
  const [showLiveIndicators, setShowLiveIndicators] = useState(true);
  const [deliveryStatuses, setDeliveryStatuses] = useState({});
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);

  // Ref for the sidebar to handle clicks outside it
  const sidebarRef = useRef(null);

  useEffect(() => {
    dispatch(fetchFarmers());
    dispatch(getAllSuppliers({ page: 1, limit: 100 }));
  }, [dispatch]);

  // Initialize WebSocket connection for real-time location updates
  useEffect(() => {
    const service = locationService
      .connect()
      .onConnect(() => {
        console.log("WebSocket connected for real-time supplier tracking");
        setWsConnected(true);
        // ask server for the full active list immediately
        service.getActiveSuppliers();
      })
      .onDisconnect(() => {
        console.log("WebSocket disconnected");
        setWsConnected(false);
      })
      // initialize map of all active suppliers
      .onActiveSuppliersList((suppliersArray) => {
        const mapObj = {};
        suppliersArray.forEach((sup) => {
          mapObj[sup.supplierId] = {
            latitude: sup.latitude,
            longitude: sup.longitude,
            username: sup.username,
            serviceArea: sup.serviceArea,
            heading: sup.heading,
            speed: sup.speed,
            lastUpdated: new Date(sup.lastUpdated || sup.timestamp),
            isActive: sup.isActive,
          };
        });
        setRealtimeSuppliers(mapObj);
      })
      // toggle individual supplier online/offline
      .onSupplierStatusChange((evt) => {
        setRealtimeSuppliers((prev) => {
          const next = { ...prev };
          if (evt.isActive) {
            // bring them back (if we have a last location)
            next[evt.supplierId] = {
              ...(next[evt.supplierId] || {}),
              username: evt.username,
              serviceArea: evt.serviceArea,
              isActive: true,
              lastUpdated: new Date(evt.timestamp),
            };
          } else {
            // Mark as inactive instead of removing
            if (next[evt.supplierId]) {
              next[evt.supplierId] = {
                ...next[evt.supplierId],
                isActive: false,
                lastUpdated: new Date(evt.timestamp),
              };
            }
          }
          return next;
        });
      })
      // existing per-supplier live‐location handler
      .onSupplierLocationUpdate((data) => {
        console.log("Received supplier location update:", data);
        setRealtimeSuppliers((prev) => ({
          ...prev,
          [data.supplierId]: {
            ...(prev[data.supplierId] || {}),
            latitude: data.latitude,
            longitude: data.longitude,
            heading: data.heading,
            speed: data.speed,
            lastUpdated: new Date(data.timestamp),
            isActive: true,
          },
        }));

        // If this is the supplier we're auto-following, update the map center
        if (autoFollowSupplier === data.supplierId) {
          setMapCenter([Number(data.latitude), Number(data.longitude)]);
        }
      })
      // Listen for delivery status updates
      .onDeliveryStatusUpdate((data) => {
        setDeliveryStatuses((prev) => ({
          ...prev,
          [data.supplierId]: {
            status: data.status,
            orderId: data.orderId,
            estimatedArrival: data.estimatedArrival
              ? new Date(data.estimatedArrival)
              : null,
            updatedAt: new Date(data.timestamp),
          },
        }));
      })
      .onError((error) => {
        console.error("WebSocket error:", error);
      });

    return () => {
      service.disconnect();
    };
  }, [autoFollowSupplier]);

  // Debug supplier data
  useEffect(() => {
    console.log("Suppliers fetched:", suppliers);
    console.log("Real-time suppliers:", realtimeSuppliers);
  }, [suppliers, realtimeSuppliers]);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Helper function to convert location string or object to an array of numbers
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

  // Check if a supplier has real-time location data
  const hasRealtimeLocation = (supplierId) =>
    Boolean(realtimeSuppliers[supplierId]?.isActive);

  // Get the most up-to-date location for a supplier (real-time if available, otherwise from DB)
  const getSupplierLocation = (supplier) => {
    // Check if we have real-time data for this supplier
    if (realtimeSuppliers[supplier.id]) {
      return [
        Number(realtimeSuppliers[supplier.id].latitude),
        Number(realtimeSuppliers[supplier.id].longitude),
      ];
    }

    // Fall back to the location from the database
    return parseLocation(supplier.SupplierDetail?.currentLocation);
  };

  // Check if a supplier's real-time data is recent (within the last 30 minutes)
  const isRealtimeRecent = (supplierId) => {
    const data = realtimeSuppliers[supplierId];
    if (!data || !data.lastUpdated) return false;
    return data.lastUpdated > new Date(Date.now() - 30 * 60 * 1000);
  };

  // Format time since last update
  const formatTimeSince = (date) => {
    if (!date) return "Unknown";

    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  // Format speed in km/h
  const formatSpeed = (speedMps) => {
    if (speedMps === null || speedMps === undefined) return "N/A";
    // Convert m/s to km/h
    const speedKmh = (speedMps * 3.6).toFixed(1);
    return `${speedKmh} km/h`;
  };

  // Get heading direction as text
  const getHeadingDirection = (heading) => {
    if (heading === null || heading === undefined) return "Unknown";

    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(heading / 45) % 8;
    return directions[index];
  };

  function handleMarkerClick(entity, type) {
    if (type === "supplier" && realtimeSuppliers[entity.id]) {
      setSelectedEntity({
        ...entity,
        liveLocation: realtimeSuppliers[entity.id],
      });

      // If auto-following was enabled for another supplier, disable it
      if (autoFollowSupplier && autoFollowSupplier !== entity.id) {
        setAutoFollowSupplier(null);
      }
    } else {
      setSelectedEntity(entity);
      // If clicking on a farmer, disable auto-follow
      if (type === "farmer" && autoFollowSupplier) {
        setAutoFollowSupplier(null);
      }
    }
    setEntityType(type);
    setShowDetails(true);
  }

  const handleViewOnMap = (entity, type) => {
    let locationArray;

    if (type === "supplier" && realtimeSuppliers[entity.id]) {
      // Use real-time location if available
      locationArray = [
        Number(realtimeSuppliers[entity.id].latitude),
        Number(realtimeSuppliers[entity.id].longitude),
      ];
    } else {
      // Fall back to stored location
      const location =
        type === "supplier"
          ? entity.SupplierDetail?.currentLocation || entity.location
          : entity.location;
      locationArray = parseLocation(location);
    }

    if (locationArray) {
      console.log(
        `Centering map on ${type} ${entity.username}:`,
        locationArray
      );
      setMapCenter(locationArray);
      setZoom(15);
      if (isMobile && showDetails) {
        setShowDetails(false);
      }
    } else {
      console.warn(
        `Cannot center map for ${type} ${entity.username}: Invalid location`
      );
    }
  };

  const toggleAutoFollow = (supplierId) => {
    if (autoFollowSupplier === supplierId) {
      setAutoFollowSupplier(null);
    } else {
      setAutoFollowSupplier(supplierId);
      // If we have real-time data for this supplier, center the map on their location
      if (realtimeSuppliers[supplierId]) {
        const location = [
          Number(realtimeSuppliers[supplierId].latitude),
          Number(realtimeSuppliers[supplierId].longitude),
        ];
        setMapCenter(location);
        setZoom(16); // Zoom in a bit more for tracking
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

  // Filter farmers and suppliers based on search term and real-time filter
  const filteredFarmers = farmersList?.filter(
    (farmer) =>
      farmer.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSuppliers = suppliers?.filter((supplier) => {
    const matchesSearch =
      supplier.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.SupplierDetail?.serviceArea
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    // Then apply real-time only filter if enabled
    if (showRealtimeOnly) {
      return matchesSearch && Boolean(realtimeSuppliers[supplier.id]?.isActive);
    }

    return matchesSearch;
  });

  // Auto-center map when there's only one matching search result
  useEffect(() => {
    const totalResults =
      (filteredFarmers?.length || 0) + (filteredSuppliers?.length || 0);
    if (searchTerm && totalResults === 1) {
      if (filteredFarmers?.length === 1) {
        handleViewOnMap(filteredFarmers[0], "farmer");
      } else if (filteredSuppliers?.length === 1) {
        handleViewOnMap(filteredSuppliers[0], "supplier");
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

  const live = realtimeSuppliers[selectedEntity?.id];
  const deliveryStatus = deliveryStatuses[selectedEntity?.id];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      <div className="fixed top-0 left-0 right-0 z-50">
        <CustomNavigation />
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

        {/* Search and filter controls */}
        <div className="mb-4 md:mb-6 flex flex-col md:flex-row gap-3 items-start md:items-center">
          <div className="relative max-w-full md:max-w-md">
            <input
              type="text"
              placeholder="Search by name, location, or service area..."
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

          {/* Real-time tracking status and filter */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm">
              <div
                className={`h-2 w-2 rounded-full ${
                  wsConnected ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-gray-600">
                {wsConnected
                  ? "Real-time tracking active"
                  : "Real-time tracking inactive"}
              </span>
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showRealtimeOnly}
                onChange={() => setShowRealtimeOnly(!showRealtimeOnly)}
                className="rounded text-green-600 focus:ring-green-500"
              />
              <span className="text-gray-700">Show active suppliers only</span>
            </label>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showLiveIndicators}
                onChange={() => setShowLiveIndicators(!showLiveIndicators)}
                className="rounded text-green-600 focus:ring-green-500"
              />
              <span className="text-gray-700">Show live indicators</span>
            </label>
          </div>
        </div>

        {/* Live suppliers stats */}
        {Object.keys(realtimeSuppliers).length > 0 && (
          <div className="mb-4 bg-white rounded-lg shadow-sm p-4 border">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Live Supplier Status
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {
                    Object.values(realtimeSuppliers).filter((s) => s.isActive)
                      .length
                  }
                </div>
                <div className="text-xs text-gray-500">Active Suppliers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {
                    Object.values(deliveryStatuses).filter(
                      (d) => d.status === "In_Transit"
                    ).length
                  }
                </div>
                <div className="text-xs text-gray-500">
                  Deliveries In Progress
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {
                    Object.values(deliveryStatuses).filter(
                      (d) => d.status === "Pickup_In_Progress"
                    ).length
                  }
                </div>
                <div className="text-xs text-gray-500">Pickups In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {suppliers.length -
                    Object.values(realtimeSuppliers).filter((s) => s.isActive)
                      .length}
                </div>
                <div className="text-xs text-gray-500">Offline Suppliers</div>
              </div>
            </div>
          </div>
        )}

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
          ref={mapRef}
        >
          {!farmersLoading &&
            !suppliersLoading &&
            !farmersError &&
            !suppliersError && (
              <MapContainer
                center={mapCenter}
                zoom={zoom}
                style={{ height: "100%", width: "100%" }}
                ref={leafletMapRef}
                zoomControl={false}
              >
                <TileLayer
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Auto-follow component */}
                {autoFollowSupplier && (
                  <SupplierTracker
                    supplierId={autoFollowSupplier}
                    realtimeSuppliers={realtimeSuppliers}
                    autoFollow={true}
                  />
                )}

                {/* Farmer Markers */}
                {filteredFarmers?.map((farmer) => {
                  const locationArray = parseLocation(farmer.location);
                  if (!locationArray) {
                    return null;
                  }
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
                      <Tooltip
                        direction="top"
                        offset={[0, -20]}
                        opacity={0.9}
                        permanent
                      >
                        {farmer.username}
                      </Tooltip>
                    </Marker>
                  );
                })}

                {/* Supplier Markers */}
                {filteredSuppliers?.map((supplier) => {
                  // Get the most up-to-date location (real-time if available)
                  const locationArray = getSupplierLocation(supplier);

                  if (!locationArray) {
                    return null;
                  }

                  // Determine if this supplier has real-time data and if it's recent
                  const hasRealtime = hasRealtimeLocation(supplier.id);
                  const isRecent = isRealtimeRecent(supplier.id);
                  const supplierDeliveryStatus =
                    deliveryStatuses[supplier.id]?.status;

                  // Choose the appropriate icon based on real-time status and delivery status
                  let icon = supplierIcon;
                  if (hasRealtime && isRecent) {
                    if (
                      supplierDeliveryStatus === "In_Transit" ||
                      supplierDeliveryStatus === "Pickup_In_Progress"
                    ) {
                      icon = deliveryIcon;
                    } else {
                      icon = activeSupplierIcon;
                    }
                  }

                  return (
                    <Marker
                      key={`supplier-${supplier.id}`}
                      position={locationArray}
                      icon={icon}
                      eventHandlers={{
                        click: () => handleMarkerClick(supplier, "supplier"),
                      }}
                    >
                      <Popup>
                        <div className="text-center p-1">
                          <h3 className="font-semibold">{supplier.username}</h3>
                          <p className="text-xs text-gray-600">
                            Supplier
                            {hasRealtime && isRecent && (
                              <span className="ml-1 inline-flex items-center text-green-600">
                                <Wifi className="h-3 w-3 mr-1" />
                                Live
                              </span>
                            )}
                          </p>
                          {supplierDeliveryStatus && (
                            <p className="text-xs font-medium mt-1">
                              Status:{" "}
                              {supplierDeliveryStatus.replace(/_/g, " ")}
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            {hasRealtime && isRecent
                              ? `Updated: ${formatTimeSince(
                                  realtimeSuppliers[supplier.id].lastUpdated
                                )}`
                              : "Location from database"}
                          </p>
                          {hasRealtime &&
                            isRecent &&
                            realtimeSuppliers[supplier.id].speed !== null && (
                              <p className="text-xs text-gray-600 mt-1">
                                Speed:{" "}
                                {formatSpeed(
                                  realtimeSuppliers[supplier.id].speed
                                )}
                                {realtimeSuppliers[supplier.id].heading !==
                                  null && (
                                  <span className="ml-2">
                                    Direction:{" "}
                                    {getHeadingDirection(
                                      realtimeSuppliers[supplier.id].heading
                                    )}
                                  </span>
                                )}
                              </p>
                            )}
                          <div className="mt-2 flex gap-2">
                            <button
                              className="text-xs text-blue-600 hover:text-blue-800"
                              onClick={() =>
                                handleMarkerClick(supplier, "supplier")
                              }
                            >
                              View Details
                            </button>
                            {hasRealtime && isRecent && (
                              <button
                                className={`text-xs ${
                                  autoFollowSupplier === supplier.id
                                    ? "text-red-600 hover:text-red-800"
                                    : "text-green-600 hover:text-green-800"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleAutoFollow(supplier.id);
                                }}
                              >
                                {autoFollowSupplier === supplier.id
                                  ? "Stop Following"
                                  : "Follow Live"}
                              </button>
                            )}
                          </div>
                        </div>
                      </Popup>
                      {showLiveIndicators && hasRealtime && isRecent && (
                        <Tooltip
                          direction="top"
                          offset={[0, -20]}
                          opacity={0.9}
                          permanent
                        >
                          <div className="flex items-center">
                            <span className="font-medium">
                              {supplier.username}
                            </span>
                            <span className="ml-1 inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                            {supplierDeliveryStatus && (
                              <span className="ml-1 text-xs">
                                ({supplierDeliveryStatus.replace(/_/g, " ")})
                              </span>
                            )}
                          </div>
                        </Tooltip>
                      )}
                    </Marker>
                  );
                })}
                <ChangeMapView center={mapCenter} zoom={zoom} />
                <ZoomControl position="bottomright" />
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
                    to={`/farmer/${farmer.id}`}
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
                    <Phone className="h-3 w-3 sm:h-4 sm:h-4 mr-2 text-green-600" />
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
                    onClick={() => handleViewOnMap(farmer, "farmer")}
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
                </div>
              </div>
            </div>
          ))}

          {/* Suppliers List */}
          {filteredSuppliers?.map((supplier) => {
            // Check if this supplier has real-time location data
            const hasRealtime = hasRealtimeLocation(supplier.id);
            const isRecent = isRealtimeRecent(supplier.id);
            const supplierDeliveryStatus =
              deliveryStatuses[supplier.id]?.status;

            return (
              <div
                key={`supplier-${supplier.id}`}
                className={`bg-white rounded-lg shadow-md overflow-hidden border transition-all duration-300 ${
                  selectedEntity?.id === supplier.id &&
                  entityType === "supplier"
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-200 hover:shadow-lg"
                }`}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-start">
                    <Link
                      to={`/supplier/${supplier.id}`}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100 flex items-center justify-center mr-3 sm:mr-4 border-2 border-blue-500 flex-shrink-0 hover:border-blue-600 transition-colors"
                    >
                      {supplier.profileImage ? (
                        <img
                          src={`${SERVER_URL}${supplier.profileImage}`}
                          alt={supplier.username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
                      )}
                    </Link>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        {supplier.username}
                      </h3>
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          Supplier
                        </p>
                        {hasRealtime && isRecent && (
                          <span className="inline-flex items-center text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs">
                            <Wifi className="h-3 w-3 mr-1" />
                            Live
                          </span>
                        )}
                        {supplierDeliveryStatus && (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                              supplierDeliveryStatus === "In_Transit"
                                ? "bg-blue-50 text-blue-600"
                                : supplierDeliveryStatus ===
                                  "Pickup_In_Progress"
                                ? "bg-yellow-50 text-yellow-600"
                                : "bg-gray-50 text-gray-600"
                            }`}
                          >
                            <Truck className="h-3 w-3 mr-1" />
                            {supplierDeliveryStatus.replace(/_/g, " ")}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={`${
                              i <
                              (supplier.SupplierDetail?.rating
                                ? Math.round(supplier.SupplierDetail.rating)
                                : 0)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-xs sm:text-sm text-gray-600">
                          {supplier.SupplierDetail?.rating
                            ? supplier.SupplierDetail.rating.toFixed(1)
                            : "N/A"}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-blue-600" />
                        {hasRealtime && isRecent
                          ? `${realtimeSuppliers[supplier.id].latitude.toFixed(
                              6
                            )}, ${realtimeSuppliers[
                              supplier.id
                            ].longitude.toFixed(6)}`
                          : supplier.SupplierDetail?.currentLocation
                          ? `${supplier.SupplierDetail.currentLocation.latitude}, ${supplier.SupplierDetail.currentLocation.longitude}`
                          : supplier.location || "Location not available"}
                      </p>
                      {hasRealtime && isRecent && (
                        <p className="text-xs text-green-600 mt-1">
                          Updated:{" "}
                          {formatTimeSince(
                            realtimeSuppliers[supplier.id].lastUpdated
                          )}
                        </p>
                      )}
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
                      onClick={() => handleViewOnMap(supplier, "supplier")}
                    >
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      View on Map
                    </button>
                    <Link
                      to={`/supplier/${supplier.id}`}
                      className="px-3 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-xs sm:text-sm flex items-center justify-center"
                    >
                      View Profile
                    </Link>
                    {hasRealtime && isRecent && (
                      <button
                        className={`px-3 py-2 border ${
                          autoFollowSupplier === supplier.id
                            ? "border-red-600 text-red-600 hover:bg-red-50"
                            : "border-green-600 text-green-600 hover:bg-green-50"
                        } rounded-md transition-colors text-xs sm:text-sm flex items-center justify-center`}
                        onClick={() => toggleAutoFollow(supplier.id)}
                      >
                        {autoFollowSupplier === supplier.id ? (
                          <>
                            <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            Stop Following
                          </>
                        ) : (
                          <>
                            <Navigation className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            Follow Live
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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
            <style>{`
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

                {/* Live status badge */}
                {entityType === "supplier" && (
                  <div className="mt-2">
                    {live ? (
                      <span className="inline-flex items-center text-green-600">
                        <Wifi className="h-4 w-4 mr-1" /> Live Tracking Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-gray-600">
                        <WifiOff className="h-4 w-4 mr-1" /> No Live Data
                      </span>
                    )}
                  </div>
                )}

                {/* Delivery status */}
                {entityType === "supplier" && deliveryStatus && (
                  <div
                    className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm ${
                      deliveryStatus.status === "In_Transit"
                        ? "bg-blue-50 text-blue-700"
                        : deliveryStatus.status === "Pickup_In_Progress"
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    <Truck className="h-4 w-4 mr-1" />
                    {deliveryStatus.status.replace(/_/g, " ")}
                  </div>
                )}

                {/* Live location details */}
                {entityType === "supplier" && live && (
                  <div className="mt-3 text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span>
                        {live.latitude.toFixed(6)}, {live.longitude.toFixed(6)}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <div>
                        <Clock className="h-4 w-4 inline mr-1 text-blue-600" />
                        {formatTimeSince(live.lastUpdated)}
                      </div>
                      {live.speed !== null && (
                        <div>
                          <Truck className="h-4 w-4 inline mr-1 text-blue-600" />
                          {formatSpeed(live.speed)}
                        </div>
                      )}
                    </div>
                    {entityType === "supplier" && live && (
                      <div className="mt-2">
                        <button
                          className={`px-3 py-1 text-sm rounded-md ${
                            autoFollowSupplier === selectedEntity.id
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                          onClick={() => toggleAutoFollow(selectedEntity.id)}
                        >
                          {autoFollowSupplier === selectedEntity.id
                            ? "Stop Following"
                            : "Follow on Map"}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-sm text-gray-600 flex items-center justify-center mt-2">
                  <MapPin
                    className={`h-4 w-4 mr-1 ${
                      entityType === "farmer"
                        ? "text-green-600"
                        : "text-blue-600"
                    }`}
                  />
                  {entityType === "farmer"
                    ? selectedEntity.location
                    : hasRealtimeLocation(selectedEntity.id) &&
                      isRealtimeRecent(selectedEntity.id)
                    ? `${realtimeSuppliers[selectedEntity.id].latitude.toFixed(
                        6
                      )}, ${realtimeSuppliers[
                        selectedEntity.id
                      ].longitude.toFixed(6)}`
                    : selectedEntity.SupplierDetail?.currentLocation
                    ? `${selectedEntity.SupplierDetail.currentLocation.latitude}, ${selectedEntity.SupplierDetail.currentLocation.longitude}`
                    : selectedEntity.location || "Location not available"}
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
            <style>{`
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
