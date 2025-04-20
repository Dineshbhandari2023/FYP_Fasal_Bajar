// OrderPage.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import {
  getAvailableDeliveries,
  acceptDelivery,
  updateDeliveryStatus,
  clearError,
} from "../../Redux/slice/supplierSlice";

export default function SupplierOrdersPage() {
  const dispatch = useDispatch();
  const { availableDeliveries, loading, error, success, message } = useSelector(
    (state) => state.supplier
  );

  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const statusConfig = {
    Pending: {
      key: "new",
      label: "New Booking",
      color: "bg-blue-100 text-blue-800",
      icon: Package,
    },
    Accepted: {
      key: "in_transit",
      label: "In Transit",
      color: "bg-amber-100 text-amber-800",
      icon: Truck,
    },
    InTransit: {
      key: "in_transit",
      label: "In Transit",
      color: "bg-amber-100 text-amber-800",
      icon: Truck,
    },
    Delivered: {
      key: "delivered",
      label: "Delivered",
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
    },
    Delayed: {
      key: "delayed",
      label: "Delayed",
      color: "bg-orange-100 text-orange-800",
      icon: Clock,
    },
    Cancelled: {
      key: "cancelled",
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
      icon: AlertCircle,
    },
    Failed: {
      key: "cancelled",
      label: "Failed",
      color: "bg-red-100 text-red-800",
      icon: AlertCircle,
    },
  };

  useEffect(() => {
    dispatch(getAvailableDeliveries());
  }, [dispatch]);

  // Clear any errors on unmount
  useEffect(() => {
    dispatch(getAvailableDeliveries());
  }, [dispatch]);

  // normalize directly from OrderItem
  const normalized = availableDeliveries.map((oi) => {
    const order = oi.Order;
    const product = oi.Product;
    return {
      id: order.orderNumber,
      customer: order.buyer.username,
      location: `${order.shippingAddress}, ${order.city}`,
      items: `${oi.quantity} ${product.unit} ${product.productName}`,
      rawStatus: oi.status,
      status: statusConfig[oi.status]?.key || "new",
      date: oi.createdAt,
      amount: `₹${oi.subtotal}`,
      orderItemId: oi.id,
      deliveryId: oi.id,
    };
  });

  // filtering & sorting (same as before)...
  const filtered = normalized
    .filter((o) => {
      if (filterStatus !== "all" && o.status !== filterStatus) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.location.toLowerCase().includes(q) ||
        o.items.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      if (sortBy === "amount") {
        const na = +a.amount.replace(/[₹,]/g, "");
        const nb = +b.amount.replace(/[₹,]/g, "");
        return sortOrder === "asc" ? na - nb : nb - na;
      }
      return sortOrder === "asc"
        ? a.id.localeCompare(b.id)
        : b.id.localeCompare(a.id);
    });

  const formatDate = (s) =>
    new Date(s).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <SupplierLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Orders</h1>

        {/* error / success banners */}
        {error && (
          <div className="p-2 bg-red-100 text-red-800 rounded">{error}</div>
        )}
        {success && message && (
          <div className="p-2 bg-green-100 text-green-800 rounded">
            {message}
          </div>
        )}

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded shadow-sm border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search…"
                className="pl-10 pr-4 py-2 border rounded w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <select
                  className="pl-4 pr-10 py-2 border rounded bg-white"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  {Object.values(statusConfig).map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              <div className="relative">
                <select
                  className="pl-4 pr-10 py-2 border rounded bg-white"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="id">ID</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              <button
                className="px-3 py-2 border rounded hover:bg-gray-50"
                onClick={() =>
                  setSortOrder((o) => (o === "asc" ? "desc" : "asc"))
                }
              >
                {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-medium">
              Orders {loading ? "(Loading…)" : `(${filtered.length})`}
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {!loading && filtered.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-gray-300" />
                <h3 className="mt-2 text-lg font-medium text-gray-500">
                  No orders found
                </h3>
                <p className="text-gray-400">Adjust your filters above</p>
              </div>
            )}

            {filtered.map((order) => {
              const cfg = Object.values(statusConfig).find(
                (c) => c.key === order.status
              );
              const Icon = cfg.icon;
              return (
                <div
                  key={order.orderItemId}
                  className="flex flex-col p-4 border rounded-lg"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-3">
                    <div className="flex items-start gap-3 mb-3 md:mb-0">
                      <div
                        className={`p-2 rounded-full ${
                          cfg.color.split(" ")[0]
                        } bg-opacity-20`}
                      >
                        <Icon
                          className={`h-5 w-5 ${cfg.color.split(" ")[1]}`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{order.id}</h4>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${cfg.color}`}
                          >
                            {cfg.label}
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
                      <button
                        className="px-3 py-1 border rounded text-sm hover:bg-gray-50 flex-1 md:flex-none"
                        onClick={() =>
                          dispatch(
                            updateDeliveryStatus({
                              deliveryId: order.deliveryId,
                              status: "Delivered",
                            })
                          )
                        }
                      >
                        Mark Delivered
                      </button>
                      {order.status === "new" && (
                        <button
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex-1 md:flex-none"
                          onClick={() =>
                            dispatch(acceptDelivery(order.orderItemId))
                          }
                        >
                          Accept
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SupplierLayout>
  );
}
