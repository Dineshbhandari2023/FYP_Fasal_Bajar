import React, { useEffect } from "react";
import {
  Package,
  TrendingUp,
  MessageCircle,
  Check,
  XCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../Redux/slice/productSlice";
import {
  fetchPendingOrderItems,
  updateOrderItemStatus,
} from "../Redux/slice/orderSlice";

const Body = () => {
  const dispatch = useDispatch();

  // Fetch products and pending orders on mount
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchPendingOrderItems());
  }, [dispatch]);

  const {
    products,
    loading: prodLoading,
    error: prodError,
  } = useSelector((state) => state.products);
  // Get pending orders from the orders slice; ensure your store has orders mounted as "orders"
  const {
    pendingItems = [],
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.orders);

  // Function to handle order action: accept or decline
  const handleOrderAction = (itemId, action) => {
    const newStatus = action === "accept" ? "Accepted" : "Declined";
    dispatch(
      updateOrderItemStatus({ itemId, status: newStatus, farmerNotes: "" })
    );
  };

  return (
    <div className="p-6 mt-16 md:ml-64">
      {/* Featured Products Section */}
      <div className="bg-white border-b rounded-lg shadow-sm mb-6 p-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Featured Products
        </h1>
        {prodLoading && (
          <p className="mt-2 text-gray-600">Loading products...</p>
        )}
        {prodError && <div className="text-red-500">{prodError}</div>}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          {products.slice(0, 4).map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow">
              <img
                src={"http://localhost:8000/" + product.image}
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
      </div>

      {/* Overview and Recent Order Updates */}
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
              <p className="text-sm text-gray-500">In Transit</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Order Updates</h2>
          {ordersLoading && <p className="text-gray-600">Loading orders...</p>}
          {ordersError && <p className="text-red-500">Error: {ordersError}</p>}
          {pendingItems.length === 0 && !ordersLoading ? (
            <p className="text-gray-600">No pending orders</p>
          ) : (
            pendingItems.map((order) => (
              <div key={order.id} className="mb-4 p-3 border rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Order: {order.orderNumber || order.id}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.productName} – {order.quantity} unit(s) at{" "}
                      {order.price}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {order.status === "Pending" ? (
                      <>
                        <button
                          onClick={() => handleOrderAction(order.id, "accept")}
                          className="text-green-600 hover:text-green-800"
                          title="Accept Order"
                        >
                          <Check size={20} />
                        </button>
                        <button
                          onClick={() => handleOrderAction(order.id, "decline")}
                          className="text-red-600 hover:text-red-800"
                          title="Decline Order"
                        >
                          <XCircle size={20} />
                        </button>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">
                        {order.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Body;
