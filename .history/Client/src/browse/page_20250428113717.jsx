import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  StarIcon,
  Filter,
  ShoppingCart,
  Search,
  X,
  ChevronDown,
  Leaf,
  SlidersHorizontal,
} from "lucide-react";
import { fetchProducts } from "../Redux/slice/productSlice";
import { Navigation } from "../UI/navigation";
import { Footer } from "../UI/footer";

export default function BrowsePage() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Initialize cart state from localStorage
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const apiBaseUrl = "http://localhost:8000";

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Apply filtering, sorting, and search
  let filteredProducts = products || [];

  if (selectedCategory) {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.productType &&
        p.productType.toLowerCase() === selectedCategory.toLowerCase()
    );
  }

  filteredProducts = filteredProducts.filter((p) => p.price <= priceRange[1]);

  if (searchQuery.trim() !== "") {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description &&
          p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  // Sort products based on selected option
  if (sortOption === "price-low") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortOption === "price-high") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortOption === "popular") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.rating - a.rating
    );
  } else if (sortOption === "recent") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => new Date(b.harvestDate) - new Date(a.harvestDate)
    );
  }

  // Add to cart function
  const addToCart = (product) => {
    const itemExists = cart.find((item) => item.id === product.id);

    if (itemExists) {
      const updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      const newItem = { ...product, quantity: 1 };
      const updatedCart = [...cart, newItem];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }

    // Show toast notification instead of alert
    showToast(`Added ${product.productName} to cart!`);
  };

  // Toast notification
  const [toast, setToast] = useState({ visible: false, message: "" });

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: "" }), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile search and filter buttons */}
        <div className="lg:hidden flex flex-col space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search crops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-gray-300 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="h-5 w-5" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
            <div className="text-red-600 font-medium">Error: {error}</div>
            <button
              onClick={() => dispatch(fetchProducts())}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Desktop (always visible) and Mobile (conditionally visible) */}
            <aside
              className={`${
                showFilters ? "block" : "hidden"
              } lg:block w-full lg:w-72 space-y-6 lg:sticky lg:top-24 lg:self-start`}
            >
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Filter className="h-5 w-5 text-green-600" />
                    Filters
                  </h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden p-1 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-5">
                  {/* Category Filter */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        className="w-full appearance-none rounded-lg border border-gray-300 py-2.5 pl-4 pr-10 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="">All Categories</option>
                        <option value="Vegetables">Vegetables</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Grains">Grains</option>
                        <option value="Dairy">Dairy</option>
                        <option value="Spices">Spices</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-700">
                        Price Range
                      </label>
                      <span className="text-sm font-medium text-green-600">
                        ₹{priceRange[1]}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      step="10"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([0, Number(e.target.value)])
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>₹0</span>
                      <span>₹500</span>
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                      Sort By
                    </label>
                    <div className="relative">
                      <select
                        className="w-full appearance-none rounded-lg border border-gray-300 py-2.5 pl-4 pr-10 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                      >
                        <option value="recent">Most Recent</option>
                        <option value="popular">Most Popular</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Reset Filters Button - Mobile Only */}
                  <button
                    onClick={() => {
                      setSelectedCategory("");
                      setPriceRange([0, 500]);
                      setSortOption("recent");
                      setSearchQuery("");
                    }}
                    className="lg:hidden w-full py-2.5 mt-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1 space-y-6">
              {/* Desktop Search and Results Count */}
              <div className="hidden lg:flex items-center justify-between">
                <div className="relative w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search crops..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-medium">{filteredProducts.length}</span>{" "}
                  products
                </p>
              </div>

              {/* No Results Message */}
              {filteredProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-xl border border-gray-200">
                  <Leaf className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No crops found
                  </h3>
                  <p className="text-gray-500 text-center max-w-md mb-6">
                    We couldn't find any crops matching your current filters.
                    Try adjusting your search or filters.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory("");
                      setPriceRange([0, 500]);
                      setSortOption("recent");
                      setSearchQuery("");
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              )}

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((crop) => (
                  <div
                    key={crop.id}
                    className="flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                      <img
                        src={
                          crop.image.startsWith("http")
                            ? crop.image
                            : `${apiBaseUrl}/${crop.image}`
                        }
                        alt={crop.productName}
                        className="h-full w-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                          {crop.productType}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                          {crop.productName}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {crop.description}
                        </p>
                      </div>

                      <div className="mt-3 flex-1 space-y-2">
                        <div className="flex items-center gap-1">
                          <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">
                            {crop.rating}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            rating
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">Farmer:</span>
                            <span className="font-medium truncate">
                              {crop.farmer}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">Stock:</span>
                            <span className="font-medium">
                              {crop.quantity} {crop.unit}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 col-span-2">
                            <span className="text-gray-500">Harvested:</span>
                            <span className="font-medium">
                              {new Date(crop.harvestDate).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-xl font-bold text-green-600">
                          NPR{crop.price}
                          <span className="text-sm font-normal text-gray-500">
                            /{crop.unit}
                          </span>
                        </span>

                        <button
                          className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                          onClick={() => addToCart(crop)}
                        >
                          <ShoppingCart className="mr-1.5 h-4 w-4" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed bottom-4 right-4 z-50 animate-slideIn">
          <div className="bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <p>{toast.message}</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
