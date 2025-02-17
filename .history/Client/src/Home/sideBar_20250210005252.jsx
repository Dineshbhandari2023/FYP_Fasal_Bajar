import React from "react";
import { Link } from "react-router-dom"; // Use React Router for navigation in React
import {
  Home,
  ShoppingBag,
  Clock,
  MessageSquare,
  Settings,
} from "lucide-react"; // Ensure lucide-react is installed

const Sidebar = () => {
  return (
    <aside className="w-64 bg-[#2F4F2F] text-white min-h-screen p-4">
      <div className="text-2xl font-bold mb-8">FarmConnect</div>
      <nav className="space-y-2">
        <Link
          to="/"
          className="flex items-center space-x-3 p-3 rounded hover:bg-[#3a613a]"
        >
          <Home size={20} />
          <span>Home</span>
        </Link>
        <Link
          to="/products"
          className="flex items-center space-x-3 p-3 rounded hover:bg-[#3a613a]"
        >
          <ShoppingBag size={20} />
          <span>Browse Products</span>
        </Link>
        <Link
          to="/orders"
          className="flex items-center space-x-3 p-3 rounded hover:bg-[#3a613a]"
        >
          <Clock size={20} />
          <span>Order History</span>
        </Link>
        <Link
          to="/messages"
          className="flex items-center space-x-3 p-3 rounded hover:bg-[#3a613a]"
        >
          <MessageSquare size={20} />
          <span>Messages</span>
        </Link>
        <Link
          to="/settings"
          className="flex items-center space-x-3 p-3 rounded hover:bg-[#3a613a]"
        >
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
