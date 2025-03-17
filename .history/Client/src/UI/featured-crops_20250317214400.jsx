import { StarIcon } from "lucide-react";

const featuredCrops = [
  {
    id: 1,
    title: "Organic Tomatoes",
    description: "Freshly harvested organic tomatoes grown without pesticides.",
    price: "₹80/kg",
    category: "Vegetables",
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=300",
    farmer: "Rajesh Farms",
  },
  {
    id: 2,
    title: "Premium Basmati Rice",
    description: "Aromatic long-grain basmati rice from Punjab region.",
    price: "₹120/kg",
    category: "Grains",
    rating: 4.9,
    image: "/placeholder.svg?height=200&width=300",
    farmer: "Singh Agro",
  },
  {
    id: 3,
    title: "Fresh Alphonso Mangoes",
    description: "Sweet and juicy Alphonso mangoes, perfect for summer.",
    price: "₹350/dozen",
    category: "Fruits",
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=300",
    farmer: "Konkan Orchards",
  },
];

export function FeaturedCrops() {
  return (
    <section className="py-16 px-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
          Featured Crops
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCrops.map((crop) => (
            <div
              key={crop.id}
              className="group relative overflow-hidden transition-all hover:shadow-lg bg-white rounded-lg border border-gray-200"
            >
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={crop.image || "/placeholder.svg"}
                  alt={crop.title}
                  className="h-full w-full object-cover transition-all group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{crop.title}</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {crop.description}
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    {crop.category}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <StarIcon className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">{crop.rating}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      Farmer: {crop.farmer}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-lg font-bold">{crop.price}</span>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
