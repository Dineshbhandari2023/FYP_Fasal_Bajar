export function StatsCard({ title, value, description, icon: Icon, trend }) {
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
}
