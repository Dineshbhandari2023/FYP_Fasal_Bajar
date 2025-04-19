import { useState } from "react";
import { SupplierLayout } from "../SupplierLayout";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  DollarSign,
  Truck,
  MapPin,
  Clock,
} from "lucide-react";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("month");

  // Sample analytics data
  const analyticsData = {
    earnings: {
      total: "₹24,500",
      trend: "+12%",
      breakdown: [
        { date: "Jan", amount: 1800 },
        { date: "Feb", amount: 2200 },
        { date: "Mar", amount: 1900 },
        { date: "Apr", amount: 2800 },
        { date: "May", amount: 3100 },
        { date: "Jun", amount: 2700 },
        { date: "Jul", amount: 3400 },
        { date: "Aug", amount: 3800 },
        { date: "Sep", amount: 4200 },
        { date: "Oct", amount: 3900 },
        { date: "Nov", amount: 4500 },
        { date: "Dec", amount: 4800 },
      ],
    },
    deliveries: {
      total: 128,
      trend: "+8%",
      breakdown: [
        { date: "Jan", count: 8 },
        { date: "Feb", count: 10 },
        { date: "Mar", count: 9 },
        { date: "Apr", count: 12 },
        { date: "May", count: 14 },
        { date: "Jun", count: 11 },
        { date: "Jul", count: 15 },
        { date: "Aug", count: 16 },
        { date: "Sep", count: 18 },
        { date: "Oct", count: 17 },
        { date: "Nov", count: 19 },
        { date: "Dec", count: 21 },
      ],
    },
    ratings: {
      average: 4.8,
      total: 96,
      breakdown: [
        { rating: 5, count: 72 },
        { rating: 4, count: 18 },
        { rating: 3, count: 4 },
        { rating: 2, count: 1 },
        { rating: 1, count: 1 },
      ],
    },
    topLocations: [
      { name: "Delhi", count: 45, percentage: 35 },
      { name: "Gurgaon", count: 32, percentage: 25 },
      { name: "Noida", count: 28, percentage: 22 },
      { name: "Faridabad", count: 15, percentage: 12 },
      { name: "Ghaziabad", count: 8, percentage: 6 },
    ],
    deliveryTimes: {
      average: "32 mins",
      trend: "-5%",
      breakdown: [
        { time: "<20 mins", count: 18 },
        { time: "20-30 mins", count: 42 },
        { time: "30-45 mins", count: 35 },
        { time: "45-60 mins", count: 22 },
        { time: ">60 mins", count: 11 },
      ],
    },
  };

  // Filter data based on selected time range
  const getFilteredData = (data, range) => {
    if (range === "week") {
      // Return last 7 days (for simplicity, just return last 7 items)
      return data.slice(-7);
    } else if (range === "month") {
      // Return last 30 days (for simplicity, just return last 4 items)
      return data.slice(-4);
    } else if (range === "quarter") {
      // Return last 90 days (for simplicity, just return last 3 months)
      return data.slice(-3);
    } else {
      // Return all data for year
      return data;
    }
  };

  // Get max value for chart scaling
  const getMaxValue = (data, key) => {
    return Math.max(...data.map((item) => item[key])) * 1.2; // Add 20% padding
  };

  // Filtered data for charts
  const filteredEarnings = getFilteredData(
    analyticsData.earnings.breakdown,
    timeRange
  );
  const filteredDeliveries = getFilteredData(
    analyticsData.deliveries.breakdown,
    timeRange
  );
  const maxEarnings = getMaxValue(filteredEarnings, "amount");
  const maxDeliveries = getMaxValue(filteredDeliveries, "count");

  return (
    <SupplierLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <div className="flex gap-2">
            <select
              className="px-4 py-2 border rounded-md bg-white"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 3 Months</option>
              <option value="year">Last 12 Months</option>
            </select>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">
                Total Earnings
              </h3>
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold">
              {analyticsData.earnings.total}
            </div>
            <p className="text-sm text-green-500 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {analyticsData.earnings.trend} from previous period
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">
                Total Deliveries
              </h3>
              <Truck className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold">
              {analyticsData.deliveries.total}
            </div>
            <p className="text-sm text-green-500 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {analyticsData.deliveries.trend} from previous period
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">
                Average Rating
              </h3>
              <BarChart3 className="h-5 w-5 text-amber-500" />
            </div>
            <div className="text-3xl font-bold">
              {analyticsData.ratings.average}/5
            </div>
            <p className="text-sm text-gray-500">
              Based on {analyticsData.ratings.total} ratings
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Earnings Chart */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium">Earnings Overview</h2>
              <p className="text-sm text-gray-500">Your earnings over time</p>
            </div>
            <div className="p-6">
              <div className="h-64 relative">
                <div className="absolute inset-0 flex items-end justify-around">
                  {filteredEarnings.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center w-full"
                    >
                      <div
                        className="w-2/3 bg-green-500 rounded-t-md transition-all duration-500 ease-in-out"
                        style={{
                          height: `${(item.amount / maxEarnings) * 100}%`,
                        }}
                      ></div>
                      <div className="mt-2 text-xs text-gray-500">
                        {item.date}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 py-2">
                  <div>₹{maxEarnings}</div>
                  <div>₹{Math.round(maxEarnings * 0.75)}</div>
                  <div>₹{Math.round(maxEarnings * 0.5)}</div>
                  <div>₹{Math.round(maxEarnings * 0.25)}</div>
                  <div>₹0</div>
                </div>
              </div>
            </div>
          </div>

          {/* Deliveries Chart */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium">Deliveries Overview</h2>
              <p className="text-sm text-gray-500">
                Your delivery count over time
              </p>
            </div>
            <div className="p-6">
              <div className="h-64 relative">
                <div className="absolute inset-0 flex items-end justify-around">
                  {filteredDeliveries.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center w-full"
                    >
                      <div
                        className="w-2/3 bg-blue-500 rounded-t-md transition-all duration-500 ease-in-out"
                        style={{
                          height: `${(item.count / maxDeliveries) * 100}%`,
                        }}
                      ></div>
                      <div className="mt-2 text-xs text-gray-500">
                        {item.date}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 py-2">
                  <div>{maxDeliveries}</div>
                  <div>{Math.round(maxDeliveries * 0.75)}</div>
                  <div>{Math.round(maxDeliveries * 0.5)}</div>
                  <div>{Math.round(maxDeliveries * 0.25)}</div>
                  <div>0</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ratings Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium">Ratings Breakdown</h2>
              <p className="text-sm text-gray-500">
                Distribution of your customer ratings
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analyticsData.ratings.breakdown.map((item) => (
                  <div key={item.rating} className="flex items-center">
                    <div className="w-12 text-sm font-medium">
                      {item.rating} stars
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-amber-500 h-2.5 rounded-full"
                          style={{
                            width: `${
                              (item.count / analyticsData.ratings.total) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-12 text-sm text-gray-500 text-right">
                      {item.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Locations */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium">Top Delivery Locations</h2>
              <p className="text-sm text-gray-500">
                Areas where you deliver most frequently
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analyticsData.topLocations.map((location) => (
                  <div key={location.name} className="flex items-center">
                    <div className="w-24 text-sm font-medium flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      {location.name}
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-500 h-2.5 rounded-full"
                          style={{ width: `${location.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-20 text-sm text-gray-500 text-right">
                      {location.count} ({location.percentage}%)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Time Analysis */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium">Delivery Time Analysis</h2>
                <p className="text-sm text-gray-500">
                  Breakdown of your delivery times
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="text-sm font-medium">Average Time</div>
                  <div className="text-lg font-bold">
                    {analyticsData.deliveryTimes.average}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {analyticsData.deliveryTimes.breakdown.map((item) => (
                <div
                  key={item.time}
                  className="bg-gray-50 p-4 rounded-lg text-center"
                >
                  <div className="text-sm font-medium">{item.time}</div>
                  <div className="text-2xl font-bold mt-2">{item.count}</div>
                  <div className="text-xs text-gray-500 mt-1">deliveries</div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-green-500 flex items-center justify-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Your average delivery time improved by{" "}
              {analyticsData.deliveryTimes.trend} compared to previous period
            </p>
          </div>
        </div>
      </div>
    </SupplierLayout>
  );
}
