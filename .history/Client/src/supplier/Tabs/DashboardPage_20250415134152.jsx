import { useState, useEffect } from "react";
import { SupplierLayout } from "../SupplierLayout";
import {
  Truck,
  Package,
  BarChart3,
  DollarSign,
  Calendar,
  Clock,
} from "lucide-react";

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
const RecentOrders = () => {
  const orders = [
    {
      id: "ORD-001",
      customer: "Amit Sharma",
      location: "Chandni Chowk, Delhi",
      items: "Wheat (50kg), Rice (25kg)",
      status: "new",
      date: "Today, 10:30 AM",
      amount: "₹2,500",
    },
    {
      id: "ORD-002",
      customer: "Priya Patel",
      location: "Andheri West, Mumbai",
      items: "Vegetables Assorted (30kg)",
      status: "in_transit",
      date: "Today, 9:15 AM",
      amount: "₹1,800",
    },
    {
      id: "ORD-003",
      customer: "Suresh Kumar",
      location: "Jayanagar, Bangalore",
      items: "Fruits (20kg), Pulses (10kg)",
      status: "delivered",
      date: "Yesterday, 4:45 PM",
      amount: "₹3,200",
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
          {orders.map((order) => {
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
                        <span>{order.date}</span>
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="p-6 border-t">
        <button className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
          View All Orders
        </button>
      </div>
    </div>
  );
};

// Notifications Component
const NotificationList = () => {
  const notifications = [
    {
      id: "notif-1",
      type: "order",
      title: "New Order Received",
      description: "You have received a new order from Amit Sharma",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: "notif-2",
      type: "delivery",
      title: "Delivery Completed",
      description: "Order #ORD-003 has been successfully delivered",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "notif-3",
      type: "message",
      title: "New Message",
      description: "Priya Patel: When will my order arrive?",
      time: "3 hours ago",
      read: true,
    },
  ];

  const typeConfig = {
    order: { icon: Package, color: "text-blue-500 bg-blue-100" },
    delivery: { icon: Truck, color: "text-green-500 bg-green-100" },
    message: { icon: Calendar, color: "text-purple-500 bg-purple-100" },
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h2 className="text-md font-medium">Recent Notifications</h2>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          {notifications.map((notification) => {
            const TypeIcon = typeConfig[notification.type].icon;

            return (
              <div
                key={notification.id}
                className={`flex items-start space-x-3 p-3 rounded-lg ${
                  !notification.read ? "bg-gray-50" : ""
                }`}
              >
                <div
                  className={`p-2 rounded-full ${
                    typeConfig[notification.type].color
                  }`}
                >
                  <TypeIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {notification.description}
                  </p>
                </div>
                {!notification.read && (
                  <div className="h-2 w-2 rounded-full bg-green-600"></div>
                )}
              </div>
            );
          })}
        </div>
        <button className="w-full text-sm text-gray-600 hover:text-gray-900 mt-4 py-2">
          View All Notifications
        </button>
      </div>
    </div>
  );
};

// Map Preview Component
const MapPreview = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 flex items-center gap-2">
            <Truck className="h-4 w-4" />
            <span>Navigate</span>
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
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500">Map view with active deliveries</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 border rounded-lg">
            <div className="text-sm font-medium text-gray-500">
              Estimated Time
            </div>
            <div className="text-lg font-bold">35 mins</div>
          </div>
          <div className="p-3 border rounded-lg">
            <div className="text-sm font-medium text-gray-500">Distance</div>
            <div className="text-lg font-bold">12.5 km</div>
          </div>
          <div className="p-3 border rounded-lg">
            <div className="text-sm font-medium text-gray-500">
              Active Orders
            </div>
            <div className="text-lg font-bold">3 orders</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  return (
    <SupplierLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Deliveries"
            value="128"
            icon={Truck}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Pending Orders"
            value="5"
            icon={Package}
            trend={{ value: 2, isPositive: false }}
          />
          <StatsCard
            title="Earnings"
            value="₹24,500"
            icon={DollarSign}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Completion Rate"
            value="96%"
            icon={BarChart3}
            trend={{ value: 3, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RecentOrders />
          <NotificationList />
        </div>

        <MapPreview />
      </div>
    </SupplierLayout>
  );
}
