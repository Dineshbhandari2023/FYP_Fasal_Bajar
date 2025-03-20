import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyOrders,
  updateOrderItemStatus,
  getOrderById,
  fetchOrderStats,
  fetchPendingOrderItems,
} from "../Redux/slice/orderSlice";
import { Navigation } from "../UI/navigation";
import { Footer } from "../UI/footer";

const OrderPage = () => {
  const dispatch = useDispatch();
  const { orders, loading, error, stats, pendingItems, selectedOrder } =
    useSelector((state) => state.orders);

  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    dispatch(fetchMyOrders());
    dispatch(fetchOrderStats());
    dispatch(fetchPendingOrderItems());
  }, [dispatch]);

  const resultsPerPage = 10;

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter(
          (order) => order.status.toLowerCase() === activeTab.toLowerCase()
        );

  const totalPages = Math.ceil(filteredOrders.length / resultsPerPage);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
    if (!expandedOrders[orderId]) dispatch(getOrderById(orderId));
  };

  const handleUpdateStatus = (itemId, status) => {
    dispatch(updateOrderItemStatus({ itemId, status, farmerNotes: "" }));
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      <div className="flex-1">
        <Navigation />
        <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-green-600" />
              My Orders
            </h1>
            <div className="bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded-full border border-green-200">
              {orders.length} {orders.length === 1 ? "Order" : "Orders"}
            </div>
          </div>

          <div className="mb-8 border-b border-gray-200">
            <div className="flex overflow-x-auto space-x-2">
              {[
                "all",
                "pending",
                "accepted",
                "declined",
                "shipped",
                "delivered",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                  }}
                  className={`py-3 px-4 font-medium text-sm ${
                    activeTab === tab
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading && <p className="text-center">Loading orders...</p>}
          {error && <p className="text-center text-red-600">{error}</p>}
          {!loading && orders.length === 0 && (
            <p className="text-center text-gray-600">No orders found.</p>
          )}

          {!loading && orders.length > 0 && (
            <>
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="border-b">
                    {["Order ID", "Date", "Status", "Total", "Actions"].map(
                      (head) => (
                        <th
                          key={head}
                          className="py-3 px-4 text-left text-sm font-medium text-gray-600"
                        >
                          {head}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm text-blue-600">
                        {order.orderNumber || order.id}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-4 px-4 text-sm capitalize">
                        {order.status}
                      </td>
                      <td className="py-4 px-4 text-sm">₹{order.total}</td>
                      <td className="py-4 px-4 text-sm">
                        {order.status === "pending" ? (
                          <>
                            <button
                              onClick={() =>
                                handleUpdateStatus(order.id, "Accepted")
                              }
                              className="px-2 py-1 bg-green-100 text-green-600 rounded mr-2 text-xs"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatus(order.id, "Declined")
                              }
                              className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs"
                            >
                              Decline
                            </button>
                          </>
                        ) : (
                          <span className="text-xs capitalize text-gray-500">
                            {order.status}
                          </span>
                        )}
                        <button
                          onClick={() => toggleOrderExpansion(order.id)}
                          className="ml-2 text-xs text-gray-600"
                        >
                          {expandedOrders[order.id]
                            ? "Hide Details"
                            : "View Details"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-md"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded-md"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default OrderPage;
