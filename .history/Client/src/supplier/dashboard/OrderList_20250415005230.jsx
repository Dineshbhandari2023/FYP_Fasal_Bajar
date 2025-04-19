import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  MapPin,
} from "lucide-react";

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

const orders = [
  {
    id: "ORD-001",
    customer: {
      name: "Amit Sharma",
      phone: "+91 98765 43210",
      type: "Buyer",
    },
    farmer: {
      name: "Ramesh Patel",
      phone: "+91 87654 32109",
      location: "Farmer's Market, Delhi",
    },
    location: "Chandni Chowk, Delhi",
    items: "Wheat (50kg), Rice (25kg)",
    status: "new",
    date: "Today, 10:30 AM",
    amount: "₹2,500",
    distance: "12.5 km",
    estimatedTime: "35 mins",
  },
  {
    id: "ORD-002",
    customer: {
      name: "Priya Patel",
      phone: "+91 76543 21098",
      type: "Buyer",
    },
    farmer: {
      name: "Sunil Kumar",
      phone: "+91 65432 10987",
      location: "Vegetable Wholesale Market, Mumbai",
    },
    location: "Andheri West, Mumbai",
    items: "Vegetables Assorted (30kg)",
    status: "in_transit",
    date: "Today, 9:15 AM",
    amount: "₹1,800",
    distance: "8.3 km",
    estimatedTime: "25 mins",
  },
  {
    id: "ORD-003",
    customer: {
      name: "Suresh Kumar",
      phone: "+91 54321 09876",
      type: "Buyer",
    },
    farmer: {
      name: "Anita Singh",
      phone: "+91 43210 98765",
      location: "Organic Farm Collective, Bangalore",
    },
    location: "Jayanagar, Bangalore",
    items: "Fruits (20kg), Pulses (10kg)",
    status: "delivered",
    date: "Yesterday, 4:45 PM",
    amount: "₹3,200",
    distance: "15.2 km",
    estimatedTime: "45 mins",
  },
  {
    id: "ORD-004",
    customer: {
      name: "Meena Reddy",
      phone: "+91 32109 87654",
      type: "Buyer",
    },
    farmer: {
      name: "Vijay Reddy",
      phone: "+91 21098 76543",
      location: "Rice Growers Association, Hyderabad",
    },
    location: "Gachibowli, Hyderabad",
    items: "Organic Rice (100kg)",
    status: "delayed",
    date: "Yesterday, 1:30 PM",
    amount: "₹4,500",
    distance: "18.7 km",
    estimatedTime: "55 mins",
  },
];

export function OrderList() {
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
                        {order.date} • {order.amount}
                      </p>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 p-3 bg-gray-50 rounded-md">
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium flex items-center gap-1">
                      <Package className="h-4 w-4 text-gray-500" />
                      Order Items
                    </h5>
                    <p className="text-sm">{order.items}</p>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-sm font-medium flex items-center gap-1">
                      <Truck className="h-4 w-4 text-gray-500" />
                      Delivery Details
                    </h5>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Distance:</span>
                      <span>{order.distance}</span>
                      <span className="text-gray-500 ml-2">Est. Time:</span>
                      <span>{order.estimatedTime}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  {/* Farmer Information */}
                  <div className="border rounded-md p-3">
                    <h5 className="text-sm font-medium mb-2">
                      Pickup from Farmer
                    </h5>
                    <div className="flex items-start gap-2">
                      <div className="p-2 bg-green-100 rounded-full">
                        <MapPin className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {order.farmer.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.farmer.location}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button className="px-2 py-1 text-xs bg-green-600 text-white rounded flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" /> Message
                          </button>
                          <a
                            href={`tel:${order.farmer.phone}`}
                            className="px-2 py-1 text-xs border border-gray-300 rounded"
                          >
                            {order.farmer.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="border rounded-md p-3">
                    <h5 className="text-sm font-medium mb-2">
                      Deliver to Buyer
                    </h5>
                    <div className="flex items-start gap-2">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <MapPin className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {order.customer.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.location}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button className="px-2 py-1 text-xs bg-blue-600 text-white rounded flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" /> Message
                          </button>
                          <a
                            href={`tel:${order.customer.phone}`}
                            className="px-2 py-1 text-xs border border-gray-300 rounded"
                          >
                            {order.customer.phone}
                          </a>
                        </div>
                      </div>
                    </div>
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
}
