"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { StarIcon, Filter, ShoppingCart } from "lucide-react"
import { useState } from "react"

const crops = [
  {
    id: 1,
    title: "Organic Tomatoes",
    description: "Freshly harvested organic tomatoes grown without pesticides.",
    price: 80,
    unit: "kg",
    category: "Vegetables",
    rating: 4.8,
    farmer: "Rajesh Farms",
    image: "/placeholder.svg?height=200&width=300",
    stock: 50,
    harvestDate: "2023-06-15",
  },
  {
    id: 2,
    title: "Premium Basmati Rice",
    description: "Aromatic long-grain basmati rice from Punjab region.",
    price: 120,
    unit: "kg",
    category: "Grains",
    rating: 4.9,
    farmer: "Singh Agro",
    image: "/placeholder.svg?height=200&width=300",
    stock: 200,
    harvestDate: "2023-05-20",
  },
  {
    id: 3,
    title: "Fresh Alphonso Mangoes",
    description: "Sweet and juicy Alphonso mangoes, perfect for summer.",
    price: 350,
    unit: "dozen",
    category: "Fruits",
    rating: 4.7,
    farmer: "Konkan Orchards",
    image: "/placeholder.svg?height=200&width=300",
    stock: 30,
    harvestDate: "2023-06-10",
  },
  {
    id: 4,
    title: "Organic Spinach",
    description: "Fresh, leafy spinach grown using organic farming methods.",
    price: 40,
    unit: "bunch",
    category: "Vegetables",
    rating: 4.6,
    farmer: "Green Leaf Farms",
    image: "/placeholder.svg?height=200&width=300",
    stock: 45,
    harvestDate: "2023-06-18",
  },
  {
    id: 5,
    title: "Fresh Coconuts",
    description: "Sweet and refreshing coconuts, perfect for summer drinks.",
    price: 35,
    unit: "piece",
    category: "Fruits",
    rating: 4.5,
    farmer: "Coastal Growers",
    image: "/placeholder.svg?height=200&width=300",
    stock: 100,
    harvestDate: "2023-06-12",
  },
  {
    id: 6,
    title: "Organic Wheat Flour",
    description: "Stone-ground wheat flour from organically grown wheat.",
    price: 60,
    unit: "kg",
    category: "Grains",
    rating: 4.8,
    farmer: "Organic Mills",
    image: "/placeholder.svg?height=200&width=300",
    stock: 150,
    harvestDate: "2023-05-15",
  },
]

export default function BrowsePage() {
  const [priceRange, setPriceRange] = useState([0, 500])
  const [cart, setCart] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [sortOption, setSortOption] = useState("recent")

  const addToCart = (crop) => {
    setCart([...cart, crop])
    // In a real app, you would update this in a context or state management system
    alert(`Added ${crop.title} to cart!`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
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
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="grains">Grains</option>
                  <option value="dairy">Dairy</option>
                  <option value="spices">Spices</option>
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
                    onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
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

          {/* Crops Grid */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search crops..."
                className="flex-1 max-w-md rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                Search
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {crops.map((crop) => (
                <div key={crop.id} className="flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={crop.image || "/placeholder.svg"}
                      alt={crop.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-lg font-semibold">{crop.title}</h3>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        {crop.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{crop.description}</p>
                    <div className="mt-4 flex-1">
                      <div className="flex items-center gap-2">
                        <StarIcon className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm">{crop.rating}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Farmer: {crop.farmer}</p>
                      <p className="text-sm text-gray-600">
                        Harvested: {new Date(crop.harvestDate).toLocaleDateString()}
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
      </main>
      <Footer />
    </div>
  )
}

