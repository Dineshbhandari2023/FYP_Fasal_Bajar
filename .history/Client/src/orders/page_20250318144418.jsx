import { useState, useEffect } from "react";
import { Navigation } from "../UI/navigation";
import { Footer } from "../UI/footer";
import {
  Truck,
  Package,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  Calendar,
  MapPin,
  CreditCard,
  ShoppingBag,
} from "lucide-react";

// Sample order data (in a real app, this would come from an API)
const orders = [
  {
    id: "ORD12345",
    date: "2023-06-15",
    status: "Delivered",
    total: 560,
    items: [
      {
        id: 1,
        name: "Organic Tomatoes",
        quantity: 3,
        unit: "kg",
        price: 80,
        subtotal: 240,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: 2,
        name: "Premium Basmati Rice",
        quantity: 2,
        unit: "kg",
        price: 120,
        subtotal: 240,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: 3,
        name: "Fresh Spinach",
        quantity: 2,
        unit: "bunch",
        price: 40,
        subtotal: 80,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    address: "123 Main St, Bangalore, Karnataka",
    paymentMethod: "Cash on Delivery",
    trackingNumber: "TRK9876543210",
  },
  {
    id: "ORD12346",
    date: "2023-06-18",
    status: "Processing",
    total: 350,
    items: [
      {
        id: 3,
        name: "Fresh Alphonso Mangoes",
        quantity: 1,
        unit: "dozen",
        price: 350,
        subtotal: 350,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    address: "456 Park Ave, Mumbai, Maharashtra",
    paymentMethod: "Online Payment",
    trackingNumber: null,
  },
  {
    id: "ORD12347",
    date: "2023-06-10",
    status: "Shipped",
    total: 200,
    items: [
      {
        id: 6,
        name: "Organic Wheat Flour",
        quantity: 2,
        unit: "kg",
        price: 60,
        subtotal: 120,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: 5,
        name: "Fresh Coconuts",
        quantity: 2,
        unit: "piece",
        price: 35,
        subtotal: 70,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    address: "789 Rural Road, Kochi, Kerala",
    paymentMethod: "Online Payment",
    trackingNumber: "TRK1234567890",
  },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [expandedOrders, setExpandedOrders] = useState({});
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  // Track window width for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Filter orders based on active tab
  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter(
          (order) => order.status.toLowerCase() === activeTab.toLowerCase()
        );

  // Toggle order expansion
  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // Get status icon and color
  const getStatusDetails = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          borderColor: "border-green-200",
        };
      case "shipped":
        return {
          icon: <Truck className="h-4 w-4" />,
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          borderColor: "border-blue-200",
        };
      case "processing":
        return {
          icon: <Package className="h-4 w-4" />,
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          borderColor: "border-yellow-200",
        };
      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          borderColor: "border-gray-200",
        };
    }
  };

  // Format date in a more readable way
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-green-600" />
            My Orders
          </h1>

          {/* Order count badge */}
          <div className="bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded-full border border-green-200">
            {orders.length} {orders.length === 1 ? "Order" : "Orders"}
          </div>
        </div>

        {/* Order status tabs */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex overflow-x-auto scrollbar-hide space-x-1 sm:space-x-2">
            {["all", "processing", "shipped", "delivered"].map((tab) => (
              <button
                key={tab}
                className={`py-3 px-4 sm:px-6 font-medium whitespace-nowrap text-sm sm:text-base transition-colors duration-200 relative ${
                  activeTab === tab
                    ? "text-green-600"
                    : "text-gray-500 hover:text-gray-800"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* No orders message */}
        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {activeTab === "all"
                ? "You haven't placed any orders yet. Browse our products and place your first order!"
                : `You don't have any ${activeTab} orders at the moment.`}
            </p>
            <button
              onClick={() => setActiveTab("all")}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              {activeTab === "all" ? "Browse Products" : "View All Orders"}
            </button>
          </div>
        )}

        {/* Orders list */}
        <div className="grid gap-6">
          {filteredOrders.map((order) => {
            const { icon, bgColor, textColor, borderColor } = getStatusDetails(
              order.status
            );
            const isExpanded = expandedOrders[order.id] || false;

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Order header */}
                <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.id}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(order.date)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${bgColor} ${textColor} border ${borderColor}`}
                    >
                      {icon}
                      {order.status}
                    </span>

                    <button
                      onClick={() => toggleOrderExpansion(order.id)}
                      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label={
                        isExpanded
                          ? "Collapse order details"
                          : "Expand order details"
                      }
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Order summary (always visible) */}
                <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-x-8 gap-y-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Items</div>
                      <div className="font-medium">{order.items.length}</div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Total Amount
                      </div>
                      <div className="font-medium text-green-600">
                        ₹{order.total}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-1">Payment</div>
                      <div className="font-medium">{order.paymentMethod}</div>
                    </div>

                    {order.trackingNumber && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1">
                          Tracking
                        </div>
                        <div className="font-medium">
                          {order.trackingNumber}
                        </div>
                      </div>
                    )}
                  </div>

                  {windowWidth >= 640 && !isExpanded && (
                    <button
                      onClick={() => toggleOrderExpansion(order.id)}
                      className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors flex items-center gap-1"
                    >
                      View Details
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Expanded order details */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 space-y-6 animate-fadeIn">
                    {/* Order items */}
                    <div>
                      <h4 className="font-medium mb-3 text-gray-900 flex items-center gap-1.5">
                        <ShoppingBag className="h-4 w-4 text-gray-500" />
                        Order Items
                      </h4>

                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-gray-100"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-16 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
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
                                <p className="text-sm text-gray-500 mt-1">
                                  {item.quantity} {item.unit} × ₹{item.price}/
                                  {item.unit}
                                </p>
                              </div>
                            </div>

                            <div className="text-right sm:text-left">
                              <span className="font-medium text-gray-900">
                                ₹{item.subtotal}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                      <div>
                        <h4 className="font-medium mb-2 text-gray-900 flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          Shipping Address
                        </h4>
                        <p className="text-gray-600">{order.address}</p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 text-gray-900 flex items-center gap-1.5">
                          <CreditCard className="h-4 w-4 text-gray-500" />
                          Payment Information
                        </h4>
                        <p className="text-gray-600">{order.paymentMethod}</p>
                        <p className="text-gray-600 mt-1">
                          Total:{" "}
                          <span className="font-medium text-green-600">
                            ₹{order.total}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                      <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                        Track Order
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                        Download Invoice
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                        Contact Support
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
