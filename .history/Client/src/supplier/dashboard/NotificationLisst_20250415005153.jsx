import {
  Bell,
  Package,
  Truck,
  MessageSquare,
  Star,
  AlertCircle,
} from "lucide-react";

const typeConfig = {
  order: {
    icon: Package,
    color: "text-blue-500 bg-blue-100",
  },
  delivery: {
    icon: Truck,
    color: "text-green-500 bg-green-100",
  },
  message: {
    icon: MessageSquare,
    color: "text-purple-500 bg-purple-100",
  },
  review: {
    icon: Star,
    color: "text-amber-500 bg-amber-100",
  },
  alert: {
    icon: AlertCircle,
    color: "text-red-500 bg-red-100",
  },
};

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
  {
    id: "notif-4",
    type: "review",
    title: "New Review",
    description: "You received a 5-star rating from Suresh Kumar",
    time: "Yesterday",
    read: true,
  },
  {
    id: "notif-5",
    type: "alert",
    title: "Delivery Delayed",
    description: "Order #ORD-004 is running behind schedule",
    time: "Yesterday",
    read: true,
  },
];

export function NotificationList() {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-md font-medium">Recent Notifications</h2>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell className="h-4 w-4" />
          <span className="sr-only">View notifications</span>
        </button>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          {notifications.slice(0, 3).map((notification) => {
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
}
