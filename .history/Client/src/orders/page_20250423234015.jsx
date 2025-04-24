import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  CreditCard,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../Redux/slice/orderSlice";
import { Navigation } from "../UI/navigation";
import { Footer } from "../UI/footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const OrderPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const { userInfo: user } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [isProcessingPayment, setIsProcessingPayment] = useState(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status");
    const message = params.get("message");
    const productId = params.get("pid");

    if (status && productId) {
      const verifyPayment = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          await axios.post(
            "http://localhost:8000/payment/check-status",
            { productId },
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
          toast.success(message || "Payment completed successfully!");
        } catch (error) {
          toast.error(
            error.response?.data?.error || "Failed to verify payment"
          );
        }
      };
      verifyPayment();
      navigate("/orders", { replace: true });
      dispatch(fetchMyOrders());
    } else if (status) {
      toast[status === "success" ? "success" : "error"](
        message || `Payment ${status === "success" ? "completed" : "failed"}`
      );
      navigate("/orders", { replace: true });
      dispatch(fetchMyOrders());
    } else {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, location, navigate]);

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) =>
          (order.OrderItems || order.items || []).some(
            (item) => item.status.toLowerCase() === activeTab.toLowerCase()
          )
        );

  const resultsPerPage = 10;
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
  };

  const handlePayment = async (order) => {
    try {
      const hasAcceptedItems = (order.OrderItems || order.items || []).some(
        (item) => item.status === "Accepted"
      );

      if (
        hasAcceptedItems &&
        order.paymentMethod === "Online Payment" &&
        order.paymentStatus === "Pending"
      ) {
        setIsProcessingPayment(order.id);
        const token = localStorage.getItem("accessToken");
        const response = await axios.post(
          `http://localhost:8000/orders/${order.id}/payment`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        const { paymentUrl } = response.data.Result;
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          toast.error("Failed to initiate payment: No payment URL provided");
        }
      } else {
        toast.error("This order is not eligible for payment at this time");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error(
        `Payment initiation failed: ${
          error.response?.data?.ErrorMessage || error.message
        }`
      );
    } finally {
      setIsProcessingPayment(null);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  console.log("User state:", user);
  const isBuyer = user?.role === "Buyer";
  console.log("Is Buyer:", isBuyer);

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

          {loading && <p className="text-center">Loading orders...</p>}
          {error && <p className="text-center text-red-600">{error}</p>}
          {!loading && orders.length === 0 && (
            <p className="text-center text-gray-600">No orders found.</p>
          )}

          {!loading && orders.length > 0 && (
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
                        Payment
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map((order) => {
                      const totalAmount =
                        order.totalAmount ||
                        (order.OrderItems || order.items || []).reduce(
                          (sum, item) =>
                            sum + (item.subtotal || item.price * item.quantity),
                          0
                        );

                      const hasAcceptedItems = (
                        order.OrderItems ||
                        order.items ||
                        []
                      ).some((item) => item.status === "Accepted");

                      const needsPayment =
                        isBuyer &&
                        hasAcceptedItems &&
                        order.paymentMethod === "Online Payment" &&
                        order.paymentStatus === "Pending";

                      console.log(
                        "Order Data for",
                        order.orderNumber,
                        {
                          isBuyer,
                          hasAcceptedItems,
                          paymentMethod: order.paymentMethod,
                          paymentStatus: order.paymentStatus,
                          orderItems: order.OrderItems || order.items,
                        },
                        "Needs Payment:",
                        needsPayment
                      );

                      return (
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
                            <div className="flex flex-col gap-1">
                              <span>
                                {order.status.charAt(0).toUpperCase() +
                                  order.status.slice(1)}
                              </span>
                              {(order.OrderItems || order.items || []).some(
                                (item) => item.status === "Delivered"
                              ) && (
                                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full inline-block w-fit">
                                  Some items delivered
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm">
                            NPR {totalAmount}
                          </td>
                          <td className="py-4 px-4 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                order.paymentStatus === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : order.paymentStatus === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {order.paymentStatus}
                            </span>
                            <div className="text-xs mt-1">
                              {order.paymentMethod}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm space-x-2">
                            {needsPayment && (
                              <button
                                onClick={() => handlePayment(order)}
                                disabled={isProcessingPayment === order.id}
                                className="px-3 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isProcessingPayment === order.id ? (
                                  "Processing..."
                                ) : (
                                  <>
                                    <CreditCard className="h-3 w-3" />
                                    Pay Now
                                  </>
                                )}
                              </button>
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
                      );
                    })}
                  </tbody>
                </table>
              </div>

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

              {Object.entries(expandedOrders).map(([orderId, isOpen]) => {
                if (!isOpen) return null;
                const order = orders.find((o) => o.id.toString() === orderId);
                if (!order) return null;

                const orderItems = order.OrderItems || order.items || [];

                const itemsToShow =
                  activeTab === "all"
                    ? orderItems
                    : orderItems.filter(
                        (item) =>
                          item.status.toLowerCase() === activeTab.toLowerCase()
                      );

                return (
                  <div
                    key={orderId}
                    className="mt-4 p-4 bg-white border border-gray-200 rounded-md"
                  >
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {activeTab === "all"
                        ? `Items for ${order.orderNumber || order.id}`
                        : `${
                            activeTab.charAt(0).toUpperCase() +
                            activeTab.slice(1)
                          } Items for ${order.orderNumber || order.id}`}
                    </h3>

                    {itemsToShow.length > 0 ? (
                      itemsToShow.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 py-2 border-b border-gray-100"
                        >
                          <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                            <img
                              src={item.Product?.image || "/placeholder.svg"}
                              alt={item.Product?.productName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.Product?.productName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.quantity} {item.Product?.unit} × NPR{" "}
                              {item.price}
                            </p>
                            <div className="mt-1">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  item.status === "Delivered"
                                    ? "bg-green-100 text-green-800"
                                    : item.status === "Accepted"
                                    ? "bg-blue-100 text-blue-800"
                                    : item.status === "Declined"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>
                          </div>
                          <div className="ml-auto font-medium text-gray-900">
                            NPR {item.subtotal || item.quantity * item.price}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No {activeTab === "all" ? "" : activeTab} items in this
                        order.
                      </p>
                    )}
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
