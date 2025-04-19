import { useState, useEffect } from "react";
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

export default function MapPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("current");
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  // Sample deliveries data
  const deliveries = [
    {
      id: "DEL-001",
      orderId: "ORD-001",
      customer: {
        name: "Amit Sharma",
        location: "Chandni Chowk, Delhi",
        coordinates: { lat: 28.6508, lng: 77.2334 },
      },
      farmer: {
        name: "Ramesh Patel",
        location: "Farmer's Market, Delhi",
        coordinates: { lat: 28.6339, lng: 77.219 },
      },
      status: "assigned",
      distance: "12.5 km",
      estimatedTime: "35 mins",
      items: "Wheat (50kg), Rice (25kg)",
    },
    {
      id: "DEL-002",
      orderId: "ORD-002",
      customer: {
        name: "Priya Patel",
        location: "Andheri West, Mumbai",
        coordinates: { lat: 19.1362, lng: 72.8296 },
      },
      farmer: {
        name: "Sunil Kumar",
        location: "Vegetable Wholesale Market, Mumbai",
        coordinates: { lat: 19.076, lng: 72.8777 },
      },
      status: "in_transit",
      distance: "8.3 km",
      estimatedTime: "25 mins",
      items: "Vegetables Assorted (30kg)",
    },
    {
      id: "DEL-003",
      orderId: "ORD-003",
      customer: {
        name: "Suresh Kumar",
        location: "Jayanagar, Bangalore",
        coordinates: { lat: 12.9299, lng: 77.5823 },
      },
      farmer: {
        name: "Anita Singh",
        location: "Organic Farm Collective, Bangalore",
        coordinates: { lat: 12.9716, lng: 77.5946 },
      },
      status: "in_transit",
      distance: "15.2 km",
      estimatedTime: "45 mins",
      items: "Fruits (20kg), Pulses (10kg)",
    },
  ];

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
      // Set the first delivery as selected by default
      if (deliveries.length > 0) {
        setSelectedDelivery(deliveries[0]);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "in_transit":
        return "bg-amber-100 text-amber-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "delayed":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <SupplierLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Map View</h1>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 inline-flex items-center gap-2">
              <LocateFixed className="h-4 w-4" />
              <span>My Location</span>
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 inline-flex items-center gap-2">
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
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-gray-100">
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
                                  Pickup: {selectedDelivery.farmer.name}
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
                                  Dropoff: {selectedDelivery.customer.name}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Current Location - Supplier */}
                          <div className="absolute top-[60%] left-[45%] transform -translate-x-1/2 -translate-y-1/2">
                            <div className="relative">
                              <div className="p-1 bg-white rounded-full shadow-md">
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
                    {selectedDelivery?.estimatedTime || "N/A"}
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-sm font-medium text-gray-500">
                    Distance
                  </div>
                  <div className="text-lg font-bold">
                    {selectedDelivery?.distance || "N/A"}
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-sm font-medium text-gray-500">
                    Active Orders
                  </div>
                  <div className="text-lg font-bold">
                    {deliveries.length} orders
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-sm font-medium text-gray-500">
                    Next Pickup
                  </div>
                  <div className="text-lg font-bold">15 mins</div>
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
                      {selectedDelivery.farmer.location} (
                      {selectedDelivery.farmer.name})
                    </li>
                    <li className="text-sm">
                      <span className="font-medium">Delivery:</span>{" "}
                      {selectedDelivery.customer.location} (
                      {selectedDelivery.customer.name})
                    </li>
                    {deliveries.length > 1 && (
                      <li className="text-sm">
                        <span className="font-medium">Next Pickup:</span>{" "}
                        {deliveries[1].farmer.location}
                      </li>
                    )}
                  </ol>
                  <div className="mt-3 flex justify-end">
                    <button className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700">
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
                {deliveries.map((delivery) => (
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
                          <h4 className="font-medium text-sm">{delivery.id}</h4>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(
                              delivery.status
                            )}`}
                          >
                            {delivery.status === "assigned"
                              ? "Assigned"
                              : delivery.status === "in_transit"
                              ? "In Transit"
                              : delivery.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Order: {delivery.orderId}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {delivery.distance}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-1 text-xs text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span>{delivery.estimatedTime}</span>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div className="text-xs">
                        <div className="flex items-center gap-1 text-green-600">
                          <MapPin className="h-3 w-3" />
                          <span className="font-medium">Pickup</span>
                        </div>
                        <p className="truncate">{delivery.farmer.location}</p>
                      </div>
                      <div className="text-xs">
                        <div className="flex items-center gap-1 text-blue-600">
                          <MapPin className="h-3 w-3" />
                          <span className="font-medium">Delivery</span>
                        </div>
                        <p className="truncate">{delivery.customer.location}</p>
                      </div>
                    </div>

                    <div className="mt-2 text-xs flex items-center gap-1">
                      <Package className="h-3 w-3 text-gray-500" />
                      <span className="truncate">{delivery.items}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SupplierLayout>
  );
}
