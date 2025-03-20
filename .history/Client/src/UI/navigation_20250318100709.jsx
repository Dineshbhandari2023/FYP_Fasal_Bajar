import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Menu, Search, ShoppingCart } from "lucide-react";
import { logoutUser } from "../Redux/slice/userSlice"; // Adjust the import path as needed

export function Navigation() {
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItems = 0; // Replace with your dynamic cart count if needed

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link
            to="/user-dashboard"
            className="mr-6 flex items-center space-x-2"
          >
            <span className="hidden font-bold text-green-600 text-xl sm:inline-block">
              FasalBajar
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium ml-8">
            <Link
              to="/browse"
              className="transition-colors hover:text-green-600"
            >
              Browse Crops
            </Link>
            {/* <Link to="/sell" className="transition-colors hover:text-green-600">
              Sell Crops
            </Link> */}
            <Link
              to="/orders"
              className="transition-colors hover:text-green-600"
            >
              Orders
            </Link>
          </nav>
        </div>

        {/* Mobile menu button */}
        <button
          className="mr-2 p-2 rounded-md text-gray-500 hover:bg-gray-100 md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </button>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white border-b shadow-lg md:hidden">
            <nav className="flex flex-col px-4 py-2">
              <Link to="/browse" className="py-2 hover:text-green-600">
                Browse Crops
              </Link>
              {/* <Link to="/sell" className="py-2 hover:text-green-600">
                Sell Crops
              </Link> */}
              <Link to="/orders" className="py-2 hover:text-green-600">
                Orders
              </Link>
              <Link to="/profile" className="py-2 hover:text-green-600">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="py-2 text-left hover:text-green-600"
              >
                Logout
              </button>
            </nav>
          </div>
        )}

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search crops..."
                className="w-full rounded-md border border-gray-300 py-2 pl-8 pr-3 md:w-[300px] lg:w-[400px] focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/cart">
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems}
                  </span>
                )}
              </button>
            </Link>
            {/* Profile and Logout buttons for desktop */}
            <Link
              to="/profile"
              className="hidden md:flex px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 font-medium"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="hidden md:flex px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navigation;
