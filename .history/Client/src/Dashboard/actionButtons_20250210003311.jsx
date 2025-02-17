import { ShoppingBag, ClipboardList, MessageCircle } from "lucide-react";

export default function ActionButtons() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <button className="flex items-center justify-center space-x-2 bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
        <ShoppingBag className="text-green-600" />
        <span>Browse Products</span>
      </button>
      <button className="flex items-center justify-center space-x-2 bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
        <ClipboardList className="text-green-600" />
        <span>View Orders</span>
      </button>
      <button className="flex items-center justify-center space-x-2 bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
        <MessageCircle className="text-green-600" />
        <span>Contact Supplier</span>
      </button>
    </div>
  );
}
