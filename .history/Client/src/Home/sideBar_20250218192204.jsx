import React from "react";
import {
  Home,
  ShoppingBag,
  History,
  MessageSquare,
  Settings,
  CircleFadingPlus,
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { icon: Home, text: "Home", path: "/" },
    { icon: CircleFadingPlus, text: "Create Product", path: "/products" },
    { icon: History, text: "Order History", path: "/orders" },
    { icon: MessageSquare, text: "Messages", path: "/messages" },
    { icon: Settings, text: "Settings", path: "/settings" },
  ];

  return (
    <div className="w-64 fixed left-64 top-0 h-screen flex flex-col bg-[#2A3B2A]">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-8">Fasal Bajar</h1>
        <nav>
          <ul className="flex-1 space-y-2 p-0">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.path}
                  className="flex items-center px-4 py-3 hover:bg-[#333] text-white"
                  onClick={() => (window.location.href = item.path)}
                >
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
