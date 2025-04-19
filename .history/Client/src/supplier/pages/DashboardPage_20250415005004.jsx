import { Truck, Package, BarChart3, DollarSign } from "lucide-react";

import { SupplierLayout } from "../SupplierLayout";
import { StatsCard } from "../dashboard/stats-card";
import { OrderList } from "../dashboard/order-list";
import { MapPreview } from "../dashboard/map-preview";
import { NotificationList } from "../dashboard/notification-list";

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
          <OrderList />
          <NotificationList />
        </div>

        <MapPreview />
      </div>
    </SupplierLayout>
  );
}
