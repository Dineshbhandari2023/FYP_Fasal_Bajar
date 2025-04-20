// SupplierDashboardPage.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SupplierLayout } from "../SupplierLayout";
import { Truck, Package, BarChart3, DollarSign, Clock } from "lucide-react";
import {
  getActiveDeliveries,
  getDeliveryHistory,
} from "../../Redux/slice/supplierSlice";

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, trend }) => (
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
  </div>
);

// Recent Deliveries Component
const RecentDeliveries = ({ deliveries }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border col-span-1 md:col-span-2">
      <div className="p-6 border-b">
        <h2 className="text-lg font-medium">Recent Deliveries</h2>
        <p className="text-sm text-gray-500">
          You have {deliveries.length} delivered items
        </p>
      </div>
      <div className="p-6 space-y-4">
        {deliveries.slice(0, 3).map((d) => (
          <div
            key={d.id}
            className="flex justify-between items-center border-b pb-3"
          >
            <div>
              <h4 className="font-medium">Order #{d.Order.orderNumber}</h4>
              <p className="text-sm text-gray-500">
                {d.quantity} × {d.Product.productName} — ₹{d.subtotal}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {new Date(d.updatedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))}
      </div>
      {deliveries.length > 3 && (
        <div className="p-6 border-t">
          <button className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            View All
          </button>
        </div>
      )}
    </div>
  );
};

// Dashboard Page
export default function SupplierDashboardPage() {
  const dispatch = useDispatch();
  const { activeDeliveries, deliveryHistory, pagination, loading, error } =
    useSelector((s) => s.supplier);

  useEffect(() => {
    dispatch(getActiveDeliveries());
    // get last 10 items of history
    dispatch(getDeliveryHistory({ page: 1, limit: 10 }));
  }, [dispatch]);

  if (loading) {
    return (
      <SupplierLayout>
        <div>Loading…</div>
      </SupplierLayout>
    );
  }
  if (error) {
    return (
      <SupplierLayout>
        <div className="text-red-500">Error: {error}</div>
      </SupplierLayout>
    );
  }

  // Stats calculations
  const totalDeliveries = pagination.totalDeliveries || deliveryHistory.length;
  const pendingOrders = activeDeliveries.filter(
    (d) => d.status === "Pending"
  ).length;
  const deliveredHistory = deliveryHistory.filter(
    (d) => d.status === "Delivered"
  );
  const earnings = deliveredHistory.reduce((sum, d) => sum + d.subtotal, 0);
  const completionRate =
    totalDeliveries > 0
      ? Math.round((deliveredHistory.length / totalDeliveries) * 100)
      : 0;

  return (
    <SupplierLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Deliveries"
            value={totalDeliveries}
            icon={Truck}
            trend={{ value: 0, isPositive: true }}
          />
          <StatsCard
            title="Pending Orders"
            value={pendingOrders}
            icon={Package}
            trend={{ value: pendingOrders, isPositive: false }}
          />
          <StatsCard
            title="Earnings"
            value={`₹${earnings}`}
            icon={DollarSign}
            trend={{ value: 0, isPositive: true }}
          />
          <StatsCard
            title="Completion Rate"
            value={`${completionRate}%`}
            icon={BarChart3}
            trend={{ value: 0, isPositive: true }}
          />
        </div>

        {/* Recent and Notifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RecentDeliveries deliveries={deliveredHistory} />
          {/* You can keep your static NotificationList here or hook it up similarly */}
        </div>
      </div>
    </SupplierLayout>
  );
}
