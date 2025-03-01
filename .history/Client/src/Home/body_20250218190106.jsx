import { Package, TrendingUp, MessageCircle } from "lucide-react";

const Body = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Organic Tomatoes",
      price: "$2.99/kg",
      image: "/api/placeholder/300/300",
    },
    {
      id: 2,
      name: "Fresh Carrots",
      price: "$1.99/kg",
      image: "/api/placeholder/300/300",
    },
    {
      id: 3,
      name: "Premium Potatoes",
      price: "$3.49/kg",
      image: "/api/placeholder/300/300",
    },
    {
      id: 4,
      name: "Fresh Lettuce",
      price: "$2.49/piece",
      image: "/api/placeholder/300/300",
    },
  ];

  const recentUpdates = [
    {
      id: 1,
      type: "order",
      message: "Order #12345 has been delivered",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "product",
      message: "New products available from Organic Farms",
      time: "5 hours ago",
    },
    {
      id: 3,
      type: "message",
      message: "New message from Green Valley Farms",
      time: "1 day ago",
    },
  ];

  return (
    <div className="p-6 mt-16 md:ml-64">
      <div className="bg-[#2A3B2A] text-white p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-semibold mb-2">Welcome back, John!</h1>
        <p>Ready to explore today's fresh products from our trusted farmers?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <button className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <Package className="h-6 w-6 text-green-600" />
          <span className="font-bold tracking-wide">Browse Products</span>
        </button>
        <button className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <TrendingUp className="h-6 w-6 text-green-600" />
          <span>View Orders</span>
        </button>
        <button className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <MessageCircle className="h-6 w-6 text-green-600" />
          <span>Contact Supplier</span>
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {featuredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-gray-600">From {product.price}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Order Overview</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">5</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-sm text-gray-600">In Transit</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">12</div>
              <div className="text-sm text-gray-600">Delivered</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Recent Updates</h2>
          <div className="space-y-4">
            {recentUpdates.map((update) => (
              <div key={update.id} className="flex items-start">
                <div className="flex-1">
                  <p className="text-sm">{update.message}</p>
                  <p className="text-xs text-gray-500">{update.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
