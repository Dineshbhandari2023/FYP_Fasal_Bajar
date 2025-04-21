// OrdersPage.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAvailableDeliveries,
  acceptDelivery,
} from "../../Redux/slice/supplierSlice";
import { SupplierLayout } from "./SupplierLayout";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Loader,
  Search,
} from "lucide-react";

const statusConfig = {
  Pending: {
    label: "Pending",
    color: "bg-amber-100 text-amber-800",
    icon: Clock,
  },
  Accepted: {
    label: "Accepted",
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircle,
  },
  Shipped: {
    label: "Shipped",
    color: "bg-green-100 text-green-800",
    icon: Truck,
  },
  Delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  Cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: AlertCircle,
  },
};

export default function SupplierOrdersPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { availableDeliveries, loading, error } = useSelector(
    (s) => s.supplier
  );

  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [processingOrderItem, setProcessingOrderItem] = useState(null);

  useEffect(() => {
    dispatch(getAvailableDeliveries());
  }, [dispatch]);

  // Normalize into a flat array of deliveries
  const deliveries = availableDeliveries.map((oi) => {
    const { Order: order, Product: product, farmer } = oi;
    const buyer = order.buyer;
    return {
      orderNumber: order.orderNumber,
      quantity: oi.quantity,
      itemName: product.productName,
      subtotal: oi.subtotal,
      status: oi.status,
      createdAt: oi.createdAt,
      shippingAddress: order.shippingAddress,
      city: order.city,
      state: order.state,
      pinCode: order.pinCode,
      buyer,
      farmer,
      orderItemId: oi.id,
      product,
    };
  });

  // Simple filter + search
  const filtered = deliveries.filter((d) => {
    if (filterStatus !== "all" && d.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        d.orderNumber.toLowerCase().includes(q) ||
        d.itemName.toLowerCase().includes(q) ||
        d.buyer.username.toLowerCase().includes(q) ||
        d.farmer.username.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const formatDate = (iso) =>
    new Date(iso).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleAcceptDelivery = (orderItemId) => {
    setProcessingOrderItem(orderItemId);
    dispatch(acceptDelivery(orderItemId))
      .unwrap()
      .then(() => {
        // Refresh the list after accepting
        dispatch(getAvailableDeliveries());
        // Navigate to active deliveries page
        navigate("/supplier/deliveries");
      })
      .catch((error) => {
        console.error("Failed to accept delivery:", error);
        alert("Failed to accept delivery. Please try again.");
      })
      .finally(() => {
        setProcessingOrderItem(null);
      });
  };

  if (loading && !processingOrderItem)
    return (
      <SupplierLayout>
        <div className="flex items-center justify-center h-64">
          <Loader className="h-8 w-8 text-green-500 animate-spin" />
          <span className="ml-2 text-lg">Loading available orders...</span>
        </div>
      </SupplierLayout>
    );

  if (error)
    return (
      <SupplierLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <h2 className="text-lg font-semibold flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Error Loading Orders
          </h2>
          <p>{error}</p>
        </div>
      </SupplierLayout>
    );

  return (
    <SupplierLayout>
      <div className="space-y-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Available Orders</h1>
            <p className="text-gray-500 mt-1">
              Orders ready for pickup and delivery
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search orders..."
                className="border px-3 py-2 rounded-md w-full pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <select
              className="border px-3 py-2 rounded-md bg-white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              {Object.keys(statusConfig).map((s) => (
                <option key={s} value={s}>
                  {statusConfig[s].label}
                </option>
              ))}
            </select>
          </div>
        </header>

        <div className="grid gap-4">
          {filtered.length === 0 && (
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
              <Package className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No orders available
              </h3>
              <p className="mt-1 text-gray-500">
                {searchQuery || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "There are no orders ready for delivery at this time"}
              </p>
            </div>
          )}

          {filtered.map((d) => {
            const { color, icon: StatusIcon } = statusConfig[d.status] || {};
            const isProcessing = processingOrderItem === d.orderItemId;

            return (
              <div
                key={d.orderItemId}
                className="border rounded-lg p-0 shadow-sm overflow-hidden"
              >
                <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold">Order #{d.orderNumber}</h2>
                    <span className={`px-2 py-1 rounded-full text-xs ${color}`}>
                      <StatusIcon className="inline-block h-3 w-3 mr-1" />
                      {statusConfig[d.status].label}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(d.createdAt)}
                  </div>
                </div>

                <div className="p-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-start gap-3 mb-4">
                        {d.product.image ? (
                          <img
                            src={d.product.image || "/placeholder.svg"}
                            alt={d.itemName}
                            className="w-16 h-16 object-cover rounded-md border"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium">{d.itemName}</h3>
                          <div className="text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Package className="h-3 w-3" /> Quantity:{" "}
                              {d.quantity}
                            </span>
                            <span className="flex items-center gap-1 mt-1">
                              <DollarSign className="h-3 w-3" /> ₹{d.subtotal}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <h4 className="font-medium text-gray-700">
                          Pickup From:
                        </h4>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-medium">{d.farmer.username}</p>
                            <p className="text-gray-500">{d.farmer.location}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <a
                                href={`tel:${d.farmer.contact_number}`}
                                className="text-blue-600"
                              >
                                {d.farmer.contact_number}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <h4 className="font-medium text-gray-700">
                          Deliver To:
                        </h4>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-blue-500 mt-0.5" />
                          <div>
                            <p className="font-medium">{d.buyer.username}</p>
                            <p className="text-gray-500">
                              {d.shippingAddress}, {d.city}, {d.state} -{" "}
                              {d.pinCode}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <a
                                href={`tel:${d.buyer.contact_number}`}
                                className="text-blue-600"
                              >
                                {d.buyer.contact_number}
                              </a>
                            </div>
                            {d.buyer.email && (
                              <div className="flex items-center gap-2 mt-1">
                                <Mail className="h-3 w-3 text-gray-400" />
                                <a
                                  href={`mailto:${d.buyer.email}`}
                                  className="text-blue-600"
                                >
                                  {d.buyer.email}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 flex flex-col sm:flex-row gap-2 mt-auto">
                        <button
                          onClick={() => handleAcceptDelivery(d.orderItemId)}
                          disabled={isProcessing}
                          className={`px-4 py-2 rounded-md text-white font-medium flex items-center justify-center ${
                            isProcessing
                              ? "bg-green-400"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {isProcessing ? (
                            <>
                              <Loader className="animate-spin h-4 w-4 mr-2" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Truck className="h-4 w-4 mr-2" />
                              Accept Delivery
                            </>
                          )}
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/supplier/messages/${d.farmer.id}`)
                          }
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Message Farmer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SupplierLayout>
  );
}
