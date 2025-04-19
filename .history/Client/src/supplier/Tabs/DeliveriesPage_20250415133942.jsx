import { useState } from "react";
import { SupplierLayout } from "..//SupplierLayout";
import {
  Truck,
  Package,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";

export default function DeliveriesPage() {
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Sample deliveries data
  const allDeliveries = [
    {
      id: "DEL-001",
      orderId: "ORD-001",
      customer: {
        name: "Amit Sharma",
        phone: "+91 98765 43210",
        location: "Chandni Chowk, Delhi",
      },
      farmer: {
        name: "Ramesh Patel",
        phone: "+91 87654 32109",
        location: "Farmer's Market, Delhi",
      },
      items: "Wheat (50kg), Rice (25kg)",
      status: "assigned",
      pickupTime: "2023-06-15T10:30:00",
      deliveryTime: "2023-06-15T12:30:00",
      distance: "12.5 km",
      amount: "₹2,500",
      earnings: "₹250",
    },
    {
      id: "DEL-002",
      orderId: "ORD-002",
      customer: {
        name: "Priya Patel",
        phone: "+91 76543 21098",
        location: "Andheri West, Mumbai",
      },
      farmer: {
        name: "Sunil Kumar",
        phone: "+91 65432 10987",
        location: "Vegetable Wholesale Market, Mumbai",
      },
      items: "Vegetables Assorted (30kg)",
      status: "in_transit",
      pickupTime: "2023-06-15T09:15:00",
      deliveryTime: "2023-06-15T11:00:00",
      distance: "8.3 km",
      amount: "₹1,800",
      earnings: "₹180",
    },
    {
      id: "DEL-003",
      orderId: "ORD-003",
      customer: {
        name: "Suresh Kumar",
        phone: "+91 54321 09876",
        location: "Jayanagar, Bangalore",
      },
      farmer: {
        name: "Anita Singh",
        phone: "+91 43210 98765",
        location: "Organic Farm Collective, Bangalore",
      },
      items: "Fruits (20kg), Pulses (10kg)",
      status: "delivered",
      pickupTime: "2023-06-14T14:45:00",
      deliveryTime: "2023-06-14T16:30:00",
      distance: "15.2 km",
      amount: "₹3,200",
      earnings: "₹320",
    },
    {
      id: "DEL-004",
      orderId: "ORD-004",
      customer: {
        name: "Meena Reddy",
        phone: "+91 32109 87654",
        location: "Gachibowli, Hyderabad",
      },
      farmer: {
        name: "Vijay Reddy",
        phone: "+91 21098 76543",
        location: "Rice Growers Association, Hyderabad",
      },
      items: "Organic Rice (100kg)",
      status: "delayed",
      pickupTime: "2023-06-14T11:30:00",
      deliveryTime: "2023-06-14T14:30:00",
      distance: "18.7 km",
      amount: "₹4,500",
      earnings: "₹450",
    },
    {
      id: "DEL-005",
      orderId: "ORD-005",
      customer: {
        name: "Rajesh Singh",
        phone: "+91 10987 65432",
        location: "Sector 18, Noida",
      },
      farmer: {
        name: "Mohan Lal",
        phone: "+91 09876 54321",
        location: "Vegetable Market, Noida",
      },
      items: "Potatoes (30kg), Onions (20kg)",
      status: "cancelled",
      pickupTime: "2023-06-13T09:00:00",
      deliveryTime: "2023-06-13T11:00:00",
      distance: "7.2 km",
      amount: "₹1,200",
      earnings: "₹0",
    },
  ];

  const statusConfig = {
    assigned: {
      label: "Assigned",
      color: "bg-blue-100 text-blue-800",
      icon: Package,
    },
    in_transit: {
      label: "In Transit",
      color: "bg-amber-100 text-amber-800",
      icon: Truck,
    },
    delivered: {
      label: "Delivered",
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
    },
    delayed: {
      label: "Delayed",
      color: "bg-orange-100 text-orange-800",
      icon: Clock,
    },
    cancelled: {
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
      icon: AlertCircle,
    },
  };

  // Filter deliveries based on active tab, search query, and status filter
  const filteredDeliveries = allDeliveries.filter((delivery) => {
    // Filter by tab
    if (
      activeTab === "active" &&
      ["delivered", "cancelled"].includes(delivery.status)
    ) {
      return false;
    }
    if (
      activeTab === "completed" &&
      !["delivered", "cancelled"].includes(delivery.status)
    ) {
      return false;
    }

    // Filter by status
    if (filterStatus !== "all" && delivery.status !== filterStatus) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        delivery.id.toLowerCase().includes(query) ||
        delivery.orderId.toLowerCase().includes(query) ||
        delivery.customer.name.toLowerCase().includes(query) ||
        delivery.farmer.name.toLowerCase().includes(query) ||
        delivery.customer.location.toLowerCase().includes(query) ||
        delivery.items.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <SupplierLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Deliveries</h1>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 inline-flex items-center gap-2">
            <Truck className="h-4 w-4" />
            <span>Update Location</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="flex border-b">
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "active"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("active")}
            >
              Active Deliveries
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "completed"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("completed")}
            >
              Completed Deliveries
            </button>
          </div>

          {/* Filters and Search */}
          <div className="p-4 border-b">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search deliveries..."
                  className="pl-10 pr-4 py-2 border rounded-md w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative">
                <select
                  className="appearance-none pl-4 pr-10 py-2 border rounded-md bg-white"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="delayed">Delayed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Deliveries List */}
          <div className="p-6">
            <div className="space-y-6">
              {filteredDeliveries.length > 0 ? (
                filteredDeliveries.map((delivery) => {
                  const StatusIcon = statusConfig[delivery.status].icon;

                  return (
                    <div
                      key={delivery.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      {/* Delivery Header */}
                      <div className="bg-gray-50 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              statusConfig[delivery.status].color.split(" ")[0]
                            } bg-opacity-20`}
                          >
                            <StatusIcon
                              className={`h-5 w-5 ${
                                statusConfig[delivery.status].color.split(
                                  " "
                                )[1]
                              }`}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{delivery.id}</h4>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  statusConfig[delivery.status].color
                                }`}
                              >
                                {statusConfig[delivery.status].label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              Order: {delivery.orderId}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <div className="text-sm">
                            <span className="text-gray-500">Distance:</span>{" "}
                            {delivery.distance}
                          </div>
                          <div className="text-sm ml-4">
                            <span className="text-gray-500">Earnings:</span>{" "}
                            <span className="font-medium text-green-600">
                              {delivery.earnings}
                            </span>
                          </div>
                          {delivery.status === "assigned" && (
                            <button className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 ml-4">
                              Start Pickup
                            </button>
                          )}
                          {delivery.status === "in_transit" && (
                            <button className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 ml-4">
                              Complete Delivery
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Delivery Details */}
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Pickup Details */}
                          <div className="border rounded-md p-3">
                            <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-green-600" />
                              Pickup from Farmer
                            </h5>
                            <div>
                              <p className="text-sm font-medium">
                                {delivery.farmer.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {delivery.farmer.location}
                              </p>
                              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(delivery.pickupTime)}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <a
                                  href={`tel:${delivery.farmer.phone}`}
                                  className="px-2 py-1 text-xs border border-gray-300 rounded flex items-center gap-1"
                                >
                                  <span>{delivery.farmer.phone}</span>
                                </a>
                              </div>
                            </div>
                          </div>

                          {/* Delivery Details */}
                          <div className="border rounded-md p-3">
                            <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-blue-600" />
                              Deliver to Customer
                            </h5>
                            <div>
                              <p className="text-sm font-medium">
                                {delivery.customer.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {delivery.customer.location}
                              </p>
                              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(delivery.deliveryTime)}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <a
                                  href={`tel:${delivery.customer.phone}`}
                                  className="px-2 py-1 text-xs border border-gray-300 rounded flex items-center gap-1"
                                >
                                  <span>{delivery.customer.phone}</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="mt-4 p-3 bg-gray-50 rounded-md">
                          <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                            <Package className="h-4 w-4 text-gray-500" />
                            Items
                          </h5>
                          <p className="text-sm">{delivery.items}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Order Value: {delivery.amount}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <Truck className="h-12 w-12 mx-auto text-gray-300" />
                  <h3 className="mt-2 text-lg font-medium text-gray-500">
                    No deliveries found
                  </h3>
                  <p className="text-gray-400">
                    Try adjusting your filters or search query
                  </p>
                </div>
              )}
            </div>
          </div>

          {filteredDeliveries.length > 0 && (
            <div className="p-6 border-t flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing {filteredDeliveries.length} of{" "}
                {activeTab === "active"
                  ? allDeliveries.filter(
                      (d) => !["delivered", "cancelled"].includes(d.status)
                    ).length
                  : allDeliveries.filter((d) =>
                      ["delivered", "cancelled"].includes(d.status)
                    ).length}{" "}
                deliveries
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </SupplierLayout>
  );
}
