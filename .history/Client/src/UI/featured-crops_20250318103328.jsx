import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StarIcon } from "lucide-react";
import { fetchProducts } from "../Redux/slice/productSlice";

export function FeaturedCrops() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  const apiBaseUrl = "http://localhost:8000";

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return (
      <section className="py-16 px-6 text-center">
        <p>Loading featured products...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-6 text-center">
        <p>Error loading products: {error}</p>
      </section>
    );
  }

  if (!products.length) {
    return (
      <section className="py-16 px-6 text-center">
        <p>No featured products available.</p>
      </section>
    );
  }

  // Display only the first three products as featured items
  const featuredProducts = products.slice(0, 3);

  return (
    <section className="py-16 px-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
          Featured Crops
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id || index}
              className="group relative overflow-hidden transition-all hover:shadow-lg bg-white rounded-lg border border-gray-200"
            >
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={
                    product.image.startsWith("http")
                      ? product.image
                      : `${apiBaseUrl}/${product.image}`
                  }
                  alt={product.productName}
                  className="h-full w-full object-cover transition-all group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {product.productName}
                    </h3>
                    {/* Optionally display description if available */}
                    {product.description && (
                      <p className="mt-2 text-sm text-gray-600">
                        {product.description}
                      </p>
                    )}
                  </div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    {product.productType}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <StarIcon className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">
                        {product.rating || "4.5"}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      location:{" "}
                      {product.farmer || product.location || "Unknown"}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-lg font-bold">{product.price}</span>
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

export default FeaturedCrops;
