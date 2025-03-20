import React, { useEffect, useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Check,
  XCircle,
  Menu,
  ShoppingBag,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyOrders,
  updateOrderItemStatus,
} from "../Redux/slice/orderSlice";
import { Navigation } from "../UI/navigation";
import { Footer } from "../UI/footer";
// import Sidebar from "../pages/Sidebar";

const OrderPage = () => {
  const dispatch = useDispatch();

  // Get orders slice from Redux (ensure your store is configured with orders: ordersReducer)
  const { orders, loading, error } = useSelector((state) => state.orders);

  // Local state for filtering, pagination, and expanded order details
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  // Update windowWidth on resize (for responsive design)
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch orders on component mount
  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  // Filter orders by active tab (all, pending, accepted, declined, shipped, delivered)
  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter(
          (order) => order.status.toLowerCase() === activeTab.toLowerCase()
        );

  // Pagination: fixed results per page
  const resultsPerPage = 10;
  const totalPages = Math.ceil(filteredOrders.length / resultsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  // Toggle expansion for an order (to view order items/details)
  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // Handle order action (Accept or Decline)
  // Note: Here we assume each order's id corresponds to a unique order item for updating status.
  // Adjust accordingly if your API expects an order item id.
  const handleUpdateStatus = (orderId, action) => {
    const newStatus = action === "accept" ? "Accepted" : "Declined";
    dispatch(
      updateOrderItemStatus({
        itemId: orderId,
        status: newStatus,
        farmerNotes: "",
      })
    );
  };

  // Helper function to format date strings
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* <Sidebar isMobileMenuOpen={false} /> */}
      <div className="flex-1 md:ml-64">
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

          {/* Order Status Tabs */}
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
                  className={`py-3 px-4 font-medium text-sm transition-colors duration-200 relative ${
                    activeTab === tab
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Loading/Error States */}
          {loading && <p className="text-center">Loading orders...</p>}
          {error && <p className="text-center text-red-600">{error}</p>}
          {!loading && orders && orders.length === 0 && (
            <p className="text-center text-gray-600">No orders found.</p>
          )}

          {/* Orders Table */}
          {!loading && orders && orders.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                        Order ID
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                        Date
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                        Status
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                        Total
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4 text-sm text-blue-600">
                          {order.orderNumber || order.id}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </td>
                        <td className="py-4 px-4 text-sm">₹{order.total}</td>
                        <td className="py-4 px-4 text-sm space-x-2">
                          {order.status.toLowerCase() === "pending" ? (
                            <>
                              <button
                                onClick={() =>
                                  handleUpdateStatus(order.id, "accept")
                                }
                                className="px-3 py-1 rounded bg-green-50 text-green-600 hover:bg-green-100 text-xs"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() =>
                                  handleUpdateStatus(order.id, "decline")
                                }
                                className="px-3 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 text-xs"
                              >
                                Decline
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-gray-500">
                              {order.status}
                            </span>
                          )}
                          <button
                            onClick={() => toggleOrderExpansion(order.id)}
                            className="ml-2 text-xs text-gray-600 hover:text-gray-800"
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
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}

              {/* Expanded Order Details */}
              {Object.keys(expandedOrders).map((orderId) => {
                if (!expandedOrders[orderId]) return null;
                const order = orders.find((o) => o.id === orderId);
                if (!order) return null;
                return (
                  <div
                    key={orderId}
                    className="mt-4 p-4 bg-white border border-gray-200 rounded-md"
                  >
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Order Details for {order.orderNumber || order.id}
                    </h3>
                    {order.items &&
                      order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 py-2 border-b border-gray-100"
                        >
                          <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.quantity} {item.unit} × ₹{item.price}
                            </p>
                          </div>
                          <div className="ml-auto font-medium text-gray-900">
                            ₹{item.subtotal}
                          </div>
                        </div>
                      ))}
                  </div>
                );
              })}
            </>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default OrderPage;
