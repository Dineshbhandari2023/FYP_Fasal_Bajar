import Link from "next/link";
import {
  Home,
  ShoppingBag,
  History,
  MessageSquare,
  Settings,
} from "lucide-react";
import type React from "react"; // Added import for React

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-green-900 text-white p-4">
        <div className="text-xl font-bold mb-8">FarmConnect</div>
        <nav className="space-y-2">
          <NavItem href="/" icon={<Home className="w-5 h-5" />} text="Home" />
          <NavItem
            href="/products"
            icon={<ShoppingBag className="w-5 h-5" />}
            text="Browse Products"
          />
          <NavItem
            href="/history"
            icon={<History className="w-5 h-5" />}
            text="Order History"
          />
          <NavItem
            href="/messages"
            icon={<MessageSquare className="w-5 h-5" />}
            text="Messages"
          />
          <NavItem
            href="/settings"
            icon={<Settings className="w-5 h-5" />}
            text="Settings"
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <header className="border-b p-4 flex items-center justify-between">
          <div className="flex-1 max-w-xl">
            <input
              type="search"
              placeholder="Search products, suppliers..."
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex items-center gap-4 ml-4">
            <div className="relative">
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                2
              </span>
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2">
              <img
                src={`${
                  process.env.NEXT_PUBLIC_AVATAR_URL ||
                  "https://avatar.vercel.sh/user"
                }`}
                alt="User avatar"
                className="w-8 h-8 rounded-full"
              />
              <div className="text-sm">
                <div>John Smith</div>
                <div className="text-gray-500 text-xs">Buyer</div>
              </div>
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

function NavItem({
  href,
  icon,
  text,
}: {
  href: string,
  icon: React.ReactNode,
  text: string,
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
}
