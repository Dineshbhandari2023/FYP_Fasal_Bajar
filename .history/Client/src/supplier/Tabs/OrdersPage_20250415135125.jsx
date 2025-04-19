import { useState } from "react";
import { SupplierLayout } from "../SupplierLayout";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react";

export default function SupplierOrdersPage() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Sample orders data
  const allOrders = [
    {
      id: "ORD-001",
      customer: "Amit Sharma",
      location: "Chandni Chowk, Delhi",
      items: "Wheat (50kg), Rice (25kg)",
      status: "new",
      date: "2023-06-15T10:30:00",
      amount: "₹2,500",
    },
    {
      id: "ORD-002",
      customer: "Priya Patel",
      location: "Andheri West, Mumbai",
      items: "Vegetables Assorted (30kg)",
      status: "in_transit",
      date: "2023-06-15T09:15:00",
      amount: "₹1,800",
    },
    {
      id: "ORD-003",
      customer: "Suresh Kumar",
      location: "Jayanagar, Bangalore",
      items: "Fruits (20kg), Pulses (10kg)",
      status: "delivered",
      date: "2023-06-14T16:45:00",
      amount: "₹3,200",
    },
    {
      id: "ORD-004",
      customer: "Meena Reddy",
      location: "Gachibowli, Hyderabad",
      items: "Organic Rice (100kg)",
      status: "delayed",
      date: "2023-06-14T13:30:00",
      amount: "₹4,500",
    },
    {
      id: "ORD-005",
      customer: "Rajesh Singh",
      location: "Sector 18, Noida",
      items: "Potatoes (30kg), Onions (20kg)",
      status: "cancelled",
      date: "2023-06-13T11:00:00",
      amount: "₹1,200",
    },
    {
      id: "ORD-006",
      customer: "Anita Desai",
      location: "Koramangala, Bangalore",
      items: "Organic Vegetables (25kg)",
      status: "delivered",
      date: "2023-06-12T14:20:00",
      amount: "₹2,800",
    },
    {
      id: "ORD-007",
      customer: "Vikram Mehta",
      location: "Bandra, Mumbai",
      items: "Premium Fruits Assortment (15kg)",
      status: "new",
      date: "2023-06-15T11:45:00",
      amount: "₹3,500",
    },
  ];

  const statusConfig = {
    new: {
      label: "New Booking",
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

  // Filter and sort orders
  const filteredOrders = allOrders
    .filter((order) => {
      // Filter by status
      if (filterStatus !== "all" && order.status !== filterStatus) {
        return false;
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          order.id.toLowerCase().includes(query) ||
          order.customer.toLowerCase().includes(query) ||
          order.location.toLowerCase().includes(query) ||
          order.items.toLowerCase().includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else if (sortBy === "amount") {
        const aAmount = Number.parseFloat(
          a.amount.replace("₹", "").replace(",", "")
        );
        const bAmount = Number.parseFloat(
          b.amount.replace("₹", "").replace(",", "")
        );
        return sortOrder === "asc" ? aAmount - bAmount : bAmount - aAmount;
      } else {
        // Sort by ID as default
        return sortOrder === "asc"
          ? a.id.localeCompare(b.id)
          : b.id.localeCompare(a.id);
      }
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
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 inline-flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>Export Orders</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 border rounded-md w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <select
                  className="appearance-none pl-4 pr-10 py-2 border rounded-md bg-white"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="new">New Booking</option>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="delayed">Delayed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              <div className="relative">
                <select
                  className="appearance-none pl-4 pr-10 py-2 border rounded-md bg-white"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Sort by Date</option>
                  <option value="amount">Sort by Amount</option>
                  <option value="id">Sort by ID</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              <button
                className="px-3 py-2 border rounded-md hover:bg-gray-50"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-medium">
              Orders ({filteredOrders.length})
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const StatusIcon = statusConfig[order.status].icon;

                  return (
                    <div
                      key={order.id}
                      className="flex flex-col p-4 border rounded-lg"
                    >
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-3">
                        <div className="flex items-start gap-3 mb-3 md:mb-0">
                          <div
                            className={`p-2 rounded-full ${
                              statusConfig[order.status].color.split(" ")[0]
                            } bg-opacity-20`}
                          >
                            <StatusIcon
                              className={`h-5 w-5 ${
                                statusConfig[order.status].color.split(" ")[1]
                              }`}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{order.id}</h4>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  statusConfig[order.status].color
                                }`}
                              >
                                {statusConfig[order.status].label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {order.customer} • {order.location}
                            </p>
                            <p className="text-sm mt-1">{order.items}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              <span>{formatDate(order.date)}</span>
                              <span>{order.amount}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 flex-1 md:flex-none">
                            Details
                          </button>
                          {order.status === "new" && (
                            <button className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 flex-1 md:flex-none">
                              Accept
                            </button>
                          )}
                          {order.status === "in_transit" && (
                            <button className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 flex-1 md:flex-none">
                              Complete
                            </button>
                          )}
                          {order.status === "delayed" && (
                            <button className="px-3 py-1 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700 flex-1 md:flex-none">
                              Update
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto text-gray-300" />
                  <h3 className="mt-2 text-lg font-medium text-gray-500">
                    No orders found
                  </h3>
                  <p className="text-gray-400">
                    Try adjusting your filters or search query
                  </p>
                </div>
              )}
            </div>
          </div>
          {filteredOrders.length > 0 && (
            <div className="p-6 border-t flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing {filteredOrders.length} of {allOrders.length} orders
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
