import Link from "next/link";
import {
  Home,
  ShoppingBag,
  Clock,
  MessageSquare,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#2F4F2F] text-white min-h-screen p-4">
      <div className="text-2xl font-bold mb-8">FarmConnect</div>
      <nav className="space-y-2">
        <Link
          href="/"
          className="flex items-center space-x-3 p-3 rounded hover:bg-[#3a613a]"
        >
          <Home size={20} />
          <span>Home</span>
        </Link>
        <Link
          href="/products"
          className="flex items-center space-x-3 p-3 rounded hover:bg-[#3a613a]"
        >
          <ShoppingBag size={20} />
          <span>Browse Products</span>
        </Link>
        <Link
          href="/orders"
          className="flex items-center space-x-3 p-3 rounded hover:bg-[#3a613a]"
        >
          <Clock size={20} />
          <span>Order History</span>
        </Link>
        <Link
          href="/messages"
          className="flex items-center space-x-3 p-3 rounded hover:bg-[#3a613a]"
        >
          <MessageSquare size={20} />
          <span>Messages</span>
        </Link>
        <Link
          href="/settings"
          className="flex items-center space-x-3 p-3 rounded hover:bg-[#3a613a]"
        >
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </nav>
    </aside>
  );
}
