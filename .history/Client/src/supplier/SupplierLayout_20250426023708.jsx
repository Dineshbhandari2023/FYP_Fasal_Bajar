"use client";

import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Truck,
  Home,
  Package,
  MessageSquare,
  Bell,
  User,
  LogOut,
  Map,
  BarChart3,
  Menu,
} from "lucide-react";
import { fetchCurrentUser, logoutUser } from "../Redux/slice/userSlice";
import { Logo } from "./Logo";

export function SupplierLayout({ children, profileComplete = true }) {
  const location = useLocation();
  const pathname = location.pathname;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchCurrentUser()); // Fetch user on mount
  }, [dispatch]);

  if (!mounted) return null;

  // Handle logout function
  const handleLogout = async (e) => {
    e.preventDefault();
    await dispatch(logoutUser());
    navigate("/login");
  };

  const NavItem = ({ to, icon: Icon, label, isActive, onClick }) => {
    // If onClick is provided, use it instead of Link
    if (onClick) {
      return (
        <li className="mb-1">
          <button
            onClick={onClick}
            className={`flex w-full items-center gap-2 px-4 py-2 rounded-md text-left hover:bg-gray-100`}
          >
            <Icon className="h-5 w-5" />
            {sidebarOpen && <span>{label}</span>}
          </button>
        </li>
      );
    }

    return (
      <li className="mb-1">
        <Link
          to={to}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            isActive
              ? "bg-green-100 text-green-700 font-medium"
              : "hover:bg-gray-100"
          }`}
        >
          <Icon className="h-5 w-5" />
          {sidebarOpen && <span>{label}</span>}
        </Link>
      </li>
    );
  };

  // If profile is not complete, only allow profile page
  if (!profileComplete && pathname !== "/profile") {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 border-b bg-white">
          <div className="container flex h-16 items-center px-4">
            <Logo />
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 transform bg-white border-r shadow-sm transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-64" : "w-16"
        } hidden md:block`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            {sidebarOpen ? <Logo /> : <div className="w-8 h-8" />}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            <nav>
              <ul className="px-2">
                <NavItem
                  to="/supplier/dashboard"
                  icon={Home}
                  label="Dashboard"
                  isActive={pathname === "/supplier/dashboard"}
                />
                <NavItem
                  to="/supplier/orders"
                  icon={Package}
                  label="Orders"
                  isActive={pathname === "/supplier/orders"}
                />
                <NavItem
                  to="/supplier/deliveries"
                  icon={Truck}
                  label="Deliveries"
                  isActive={pathname === "/supplier/deliveries"}
                />
                <NavItem
                  to="/supplier/map"
                  icon={Map}
                  label="Map View"
                  isActive={pathname === "/supplier/map"}
                />
                <NavItem
                  to="/supplier/messages"
                  icon={MessageSquare}
                  label="Messages"
                  isActive={pathname === "/supplier/messages"}
                />
                {/* <NavItem
                  to="/supplier/analytics"
                  icon={BarChart3}
                  label="Analytics"
                  isActive={pathname === "/supplier/analytics"}
                /> */}
              </ul>
            </nav>
          </div>
          <div className="border-t p-4">
            <ul>
              <NavItem
                to="/supplier/profile"
                icon={User}
                label="Profile"
                isActive={pathname === "/supplier/profile"}
              />
              <NavItem icon={LogOut} label="Logout" onClick={handleLogout} />
            </ul>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <Logo />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-md hover:bg-gray-100"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="px-2">
                <NavItem
                  to="/supplier/dashboard"
                  icon={Home}
                  label="Dashboard"
                  isActive={pathname === "/supplier/dashboard"}
                />
                <NavItem
                  to="/supplier/orders"
                  icon={Package}
                  label="Orders"
                  isActive={pathname === "/supplier/orders"}
                />
                <NavItem
                  to="/supplier/deliveries"
                  icon={Truck}
                  label="Deliveries"
                  isActive={pathname === "/supplier/deliveries"}
                />
                <NavItem
                  to="/supplier/map"
                  icon={Map}
                  label="Map View"
                  isActive={pathname === "/supplier/map"}
                />
                <NavItem
                  to="/supplier/messages"
                  icon={MessageSquare}
                  label="Messages"
                  isActive={pathname === "/supplier/messages"}
                />
                {/* <NavItem
                  to="/supplier/analytics"
                  icon={BarChart3}
                  label="Analytics"
                  isActive={pathname === "/supplier/analytics"}
                /> */}
                <NavItem
                  to="/supplier/profile"
                  icon={User}
                  label="Profile"
                  isActive={pathname === "/supplier/profile"}
                />
                <NavItem icon={LogOut} label="Logout" onClick={handleLogout} />
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Main */}
      <div
        className={`flex-1 ${
          sidebarOpen ? "md:ml-64" : "md:ml-16"
        } transition-all duration-300 ease-in-out`}
      >
        <header className="sticky top-0 z-10 border-b bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-md hover:bg-gray-100 md:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button className="p-2 rounded-full hover:bg-gray-100 relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
                    3
                  </span>
                </button>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100">
                {userInfo?.profileImage && (
                  <img
                    src={userInfo.profileImage || "/placeholder.svg"}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                )}
                <span>{userInfo?.username || "Loading..."}</span>
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
