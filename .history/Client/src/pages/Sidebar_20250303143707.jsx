import React from "react";
import {
  Home,
  History,
  MessageSquare,
  Settings,
  CircleFadingPlus,
} from "lucide-react";

const Sidebar = ({ isMobileMenuOpen }) => {
  const menuItems = [
    { icon: Home, text: "Dashboard", path: "/dashboard" },
    { icon: CircleFadingPlus, text: "Create Product", path: "/product" },
    { icon: History, text: "Order History", path: "/orders" },
    { icon: MessageSquare, text: "Messages", path: "/messages" },
    { icon: Settings, text: "Settings", path: "/settings" },
  ];

  return (
    <div
      className={`bg-[#2A3B2A] h-screen w-64 fixed left-0 top-0 text-white transition-transform duration-300 ease-in-out z-30
      ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:block`}
    >
      <div className="p-4">
        <h1 className="text-xl font-bold mb-8">Fasal Bajar</h1>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.path}
                  className="flex items-center p-3 hover:bg-[#3A4D3A] rounded-lg transition-colors"
                >
                  <item.icon className="h-5 w-5 mr-3" />
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
