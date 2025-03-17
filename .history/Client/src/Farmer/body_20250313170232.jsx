import React, { useEffect } from "react";
import { Package, TrendingUp, MessageCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../Redux/slice/productSlice";

const Body = () => {
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const recentUpdates = [
    {
      id: 1,
      type: "order",
      message: "Pending order from customer",
    },
    {
      id: 2,
      type: "message",
      message: "Message from buyer",
    },
  ];

  return (
    <div className="p-6 mt-16 md:ml-64">
      <div className="bg-white border-b rounded-lg shadow-sm mb-6 p-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Featured Products
        </h1>
        {loading && <p className="mt-2 text-gray-600">Loading products...</p>}
        {error && <div className="text-red-500">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          {products.slice(0, 4).map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow">
              <img
                src={`http://localhost:8000/${product.image}`}
                alt={product.productName}
                className="h-48 w-full object-cover"
              />
              <div className="p-3">
                <h2 className="text-sm font-semibold">{product.productName}</h2>
                <p className="text-sm text-gray-500">{product.price}</p>
              </div>
            </div>
          ))}
        </div>

        {loading && <p>Loading products...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Order Overview</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-lg font-semibold">5</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-lg font-semibold">3</p>
              <p className="text-sm">In Transit</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Recent Updates</h2>
          {recentUpdates.map((update, index) => (
            <div key={index} className="mb-2">
              <p className="text-gray-600">{update.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Body;
