import React from "react";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SupplierLayout } from "../SupplierLayout";
import { Truck, Package, Calendar, Clock, Navigation } from "lucide-react";
import { getActiveDeliveries } from "../../Redux/slice/supplierSlice";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, trend, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <Icon className="h-4 w-4 text-gray-400" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {trend && (
        <p
          className={`text-xs ${
            trend.isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {trend.isPositive ? "+" : ""}
          {trend.value}% from last month
        </p>
      )}
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );
};

// Recent Orders Component
const RecentOrders = ({ orders, onViewAllClick }) => {
  const statusConfig = {
    Assigned: {
      label: "New Booking",
      color: "bg-blue-100 text-blue-800",
      icon: Package,
    },
    Pickup_In_Progress: {
      label: "Pickup In Progress",
      color: "bg-purple-100 text-purple-800",
      icon: Package,
    },
    Picked_Up: {
      label: "Picked Up",
      color: "bg-yellow-100 text-yellow-800",
      icon: Package,
    },
    In_Transit: {
      label: "In Transit",
      color: "bg-amber-100 text-amber-800",
      icon: Truck,
    },
    Delivered: {
      label: "Delivered",
      color: "bg-green-100 text-green-800",
      icon: Clock,
    },
    Failed: {
      label: "Failed",
      color: "bg-red-100 text-red-800",
      icon: Clock,
    },
    Cancelled: {
      label: "Cancelled",
      color: "bg-gray-100 text-gray-800",
      icon: Clock,
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border col-span-1 md:col-span-2">
      <div className="p-6 border-b">
        <h2 className="text-lg font-medium">Recent Orders</h2>
        <p className="text-sm text-gray-500">
          You have {orders.length} orders in the system
        </p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => {
              const StatusIcon = statusConfig[order.status]?.icon || Package;
              const statusColor =
                statusConfig[order.status]?.color ||
                "bg-gray-100 text-gray-800";

              return (
                <div
                  key={order.id}
                  className="flex flex-col p-4 border rounded-lg"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-3">
                    <div className="flex items-start gap-3 mb-3 md:mb-0">
                      <div
                        className={`p-2 rounded-full ${
                          statusColor.split(" ")[0]
                        } bg-opacity-20`}
                      >
                        <StatusIcon
                          className={`h-5 w-5 ${statusColor.split(" ")[1]}`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">
                            {order.deliveryNumber || order.id}
                          </h4>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${statusColor}`}
                          >
                            {statusConfig[order.status]?.label || order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {order.OrderItem?.Order?.buyer?.username ||
                            "Customer"}{" "}
                          •{" "}
                          {order.deliveryLocation?.address ||
                            order.OrderItem?.Order?.buyer?.location ||
                            "Location not available"}
                        </p>
                        <p className="text-sm mt-1">
                          {order.OrderItem?.Product?.productName || "Product"}
                          {order.OrderItem?.quantity &&
                            ` (${order.OrderItem.quantity})`}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span>
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleString([], {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Date not available"}
                          </span>
                          <span>
                            {order.OrderItem?.totalPrice
                              ? `₹${order.OrderItem.totalPrice}`
                              : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <Link
                        to={`/supplier/deliveries/${order.id}`}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 flex-1 md:flex-none text-center"
                      >
                        Details
                      </Link>
                      {order.status === "Assigned" && (
                        <button className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 flex-1 md:flex-none">
                          Accept
                        </button>
                      )}
                      {order.status === "In_Transit" && (
                        <button className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 flex-1 md:flex-none">
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
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
      <div className="p-6 border-t">
        <button
          className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          onClick={onViewAllClick}
        >
          View All Orders
        </button>
      </div>
    </div>
  );
};

// Notifications Component
// const NotificationList = ({ notifications = [] }) => {
//   const typeConfig = {
//     order: { icon: Package, color: "text-blue-500 bg-blue-100" },
//     delivery: { icon: Truck, color: "text-green-500 bg-green-100" },
//     message: { icon: Calendar, color: "text-purple-500 bg-purple-100" },
//     default: { icon: Calendar, color: "text-gray-500 bg-gray-100" },
//   };

//   // If no notifications are provided, show some default ones
//   const displayNotifications =
//     notifications.length > 0
//       ? notifications
//       : [
//           {
//             id: "notif-1",
//             type: "order",
//             title: "New Order Received",
//             description: "You have received a new order",
//             time: "10 minutes ago",
//             read: false,
//           },
//           {
//             id: "notif-2",
//             type: "delivery",
//             title: "Delivery Completed",
//             description: "An order has been successfully delivered",
//             time: "2 hours ago",
//             read: false,
//           },
//           {
//             id: "notif-3",
//             type: "message",
//             title: "New Message",
//             description: "You have a new message from a customer",
//             time: "3 hours ago",
//             read: true,
//           },
//         ];

//   return (
//     <div className="bg-white rounded-lg shadow-sm border">
//       <div className="p-4 border-b">
//         <h2 className="text-md font-medium">Recent Notifications</h2>
//       </div>
//       <div className="p-4">
//         <div className="space-y-4">
//           {displayNotifications.map((notification) => {
//             const config = typeConfig[notification.type] || typeConfig.default;
//             const TypeIcon = config.icon;

//             return (
//               <div
//                 key={notification.id}
//                 className={`flex items-start space-x-3 p-3 rounded-lg ${
//                   !notification.read ? "bg-gray-50" : ""
//                 }`}
//               >
//                 <div className={`p-2 rounded-full ${config.color}`}>
//                   <TypeIcon className="h-4 w-4" />
//                 </div>
//                 <div className="flex-1 space-y-1">
//                   <div className="flex items-center justify-between">
//                     <p className="text-sm font-medium">{notification.title}</p>
//                     <p className="text-xs text-gray-500">{notification.time}</p>
//                   </div>
//                   <p className="text-sm text-gray-500">
//                     {notification.description}
//                   </p>
//                 </div>
//                 {!notification.read && (
//                   <div className="h-2 w-2 rounded-full bg-green-600"></div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//         <button className="w-full text-sm text-gray-600 hover:text-gray-900 mt-4 py-2">
//           View All Notifications
//         </button>
//       </div>
//     </div>
//   );
// };

// Map Preview Component
const MapPreview = ({ deliveries, currentLocation }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState([26.660944, 87.280769]); // Default center
  const [zoom, setZoom] = useState(12);

  // Set map center to current location if available
  useEffect(() => {
    if (currentLocation) {
      setMapCenter([currentLocation.latitude, currentLocation.longitude]);
      setIsLoaded(true);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setIsLoaded(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoaded(true); // Still mark as loaded even if we couldn't get location
        }
      );
    } else {
      setIsLoaded(true); // Still mark as loaded even if geolocation is not supported
    }
  }, [currentLocation]);

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

  // Navigate to map page
  const navigateToMap = () => {
    window.location.href = "/supplier/map";
  };

  // Calculate estimated time and distance
  const getEstimatedInfo = () => {
    if (deliveries.length === 0) {
      return { time: "N/A", distance: "N/A" };
    }

    // In a real app, you would calculate this based on actual route data
    // For now, we'll just return some placeholder values
    return {
      time: "35 mins",
      distance: "12.5 km",
    };
  };

  const { time, distance } = getEstimatedInfo();

  return (
    <div className="bg-white rounded-lg shadow-sm border col-span-1 md:col-span-3">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">Delivery Map</h2>
            <p className="text-sm text-gray-500">
              Active deliveries in your service area
            </p>
          </div>
          <button
            className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 flex items-center gap-2"
            onClick={navigateToMap}
          >
            <Navigation className="h-4 w-4" />
            <span>Navigate</span>
          </button>
        </div>
      </div>
      <div className="p-6">
        <div
          className="relative w-full overflow-hidden rounded-lg border"
          style={{ height: "300px" }}
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
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Current location marker */}
              {currentLocation && (
                <Marker
                  position={[
                    currentLocation.latitude,
                    currentLocation.longitude,
                  ]}
                >
                  <Popup>
                    <div className="text-center">
                      <strong>Your Current Location</strong>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Delivery markers */}
              {deliveries.map((delivery) => {
                // Try to get pickup location
                const pickupLocationArray = delivery.pickupLocation
                  ? parseLocation(delivery.pickupLocation)
                  : delivery.OrderItem?.farmer?.location
                  ? parseLocation(delivery.OrderItem.farmer.location)
                  : null;

                // Try to get delivery location
                const deliveryLocationArray = delivery.deliveryLocation
                  ? parseLocation(delivery.deliveryLocation)
                  : delivery.OrderItem?.Order?.buyer?.location
                  ? parseLocation(delivery.OrderItem.Order.buyer.location)
                  : null;

                return (
                  <React.Fragment key={delivery.id}>
                    {pickupLocationArray && (
                      <Marker position={pickupLocationArray} icon={pickupIcon}>
                        <Popup>
                          <div className="text-center">
                            <strong>Pickup Location</strong>
                            <p className="text-xs text-gray-600">
                              {delivery.pickupLocation?.address ||
                                delivery.OrderItem?.farmer?.location ||
                                "Address not available"}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    )}

                    {deliveryLocationArray && (
                      <Marker
                        position={deliveryLocationArray}
                        icon={deliveryIcon}
                      >
                        <Popup>
                          <div className="text-center">
                            <strong>Delivery Location</strong>
                            <p className="text-xs text-gray-600">
                              {delivery.deliveryLocation?.address ||
                                delivery.OrderItem?.Order?.buyer?.location ||
                                "Address not available"}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    )}
                  </React.Fragment>
                );
              })}

              <ChangeMapView center={mapCenter} zoom={zoom} />
            </MapContainer>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 border rounded-lg">
            <div className="text-sm font-medium text-gray-500">
              Estimated Time
            </div>
            <div className="text-lg font-bold">{time}</div>
          </div>
          <div className="p-3 border rounded-lg">
            <div className="text-sm font-medium text-gray-500">Distance</div>
            <div className="text-lg font-bold">{distance}</div>
          </div>
          <div className="p-3 border rounded-lg">
            <div className="text-sm font-medium text-gray-500">
              Active Orders
            </div>
            <div className="text-lg font-bold">{deliveries.length} orders</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SupplierDashboardPage() {
  const dispatch = useDispatch();
  const { activeDeliveries, loading, error, supplierDetails } = useSelector(
    (state) => state.supplier
  );

  // Load active deliveries when component mounts
  useEffect(() => {
    dispatch(getActiveDeliveries());
  }, [dispatch]);

  // Calculate stats based on active deliveries
  const calculateStats = () => {
    if (!activeDeliveries) return { totalDeliveries: 0, pendingOrders: 0 };

    const totalDeliveries = activeDeliveries.length;
    const pendingOrders = activeDeliveries.filter((delivery) =>
      ["Assigned", "Pickup_In_Progress", "Picked_Up", "In_Transit"].includes(
        delivery.status
      )
    ).length;

    return {
      totalDeliveries,
      pendingOrders,
    };
  };

  const { totalDeliveries, pendingOrders } = calculateStats();

  // Handle view all orders click
  const handleViewAllOrders = () => {
    window.location.href = "/supplier/deliveries";
  };

  // Get recent orders (limit to 3)
  const recentOrders = activeDeliveries ? activeDeliveries.slice(0, 3) : [];

  return (
    <SupplierLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
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
                  {typeof error === "string" ? error : "Failed to load data"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatsCard
                title="Total Deliveries"
                value={totalDeliveries.toString()}
                icon={Truck}
                trend={{ value: 12, isPositive: true }}
              />
              <StatsCard
                title="Pending Orders"
                value={pendingOrders.toString()}
                icon={Package}
                trend={{ value: 2, isPositive: false }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <RecentOrders
                orders={recentOrders}
                onViewAllClick={handleViewAllOrders}
              />
              <NotificationList />
            </div>

            <MapPreview
              deliveries={activeDeliveries || []}
              currentLocation={supplierDetails?.currentLocation}
            />
          </>
        )}
      </div>
    </SupplierLayout>
  );
}
