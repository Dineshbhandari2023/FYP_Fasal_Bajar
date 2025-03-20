import { Navigation } from "../UI/navigation";
import { Footer } from "../UI/footer";
import { StarIcon, Filter, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../Redux/slice/productSlice";

export default function BrowsePage() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Apply filtering, sorting and search
  let filteredProducts = products;
  if (selectedCategory) {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.category &&
        p.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }
  filteredProducts = filteredProducts.filter((p) => p.price <= priceRange[1]);
  if (searchQuery.trim() !== "") {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  if (sortOption === "price-low") {
    filteredProducts = filteredProducts
      .slice()
      .sort((a, b) => a.price - b.price);
  } else if (sortOption === "price-high") {
    filteredProducts = filteredProducts
      .slice()
      .sort((a, b) => b.price - a.price);
  } else if (sortOption === "popular") {
    filteredProducts = filteredProducts
      .slice()
      .sort((a, b) => b.rating - a.rating);
  } else if (sortOption === "recent") {
    filteredProducts = filteredProducts
      .slice()
      .sort((a, b) => new Date(b.harvestDate) - new Date(a.harvestDate));
  }

  const addToCart = (crop) => {
    setCart([...cart, crop]);
    alert(`Added ${crop.title} to cart!`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600">Error: {error}</div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="w-full md:w-64 space-y-6">
              <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </h2>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Select category</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains">Grains</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Spices">Spices</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Range (₹)</label>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="500"
                      step="10"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <select
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Search crops..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 max-w-md rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                  Search
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((crop) => (
                  <div
                    key={crop.id}
                    className="flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden"
                  >
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={crop.image || "/placeholder.svg"}
                        alt={crop.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-lg font-semibold">{crop.title}</h3>
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          {crop.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {crop.description}
                      </p>
                      <div className="mt-4 flex-1">
                        <div className="flex items-center gap-2">
                          <StarIcon className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <span className="text-sm">{crop.rating}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Farmer: {crop.farmer}
                        </p>
                        <p className="text-sm text-gray-600">
                          Harvested:{" "}
                          {new Date(crop.harvestDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Stock: {crop.stock} {crop.unit}
                        </p>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-lg font-bold">
                          ₹{crop.price}/{crop.unit}
                        </span>
                        <button
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                          onClick={() => addToCart(crop)}
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Add to Cart
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
      <Footer />
    </div>
  );
}
