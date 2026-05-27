import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StarIcon } from "lucide-react";
import { fetchProducts } from "../Redux/slice/productSlice";
import { motion } from "framer-motion";

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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        </motion.div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Error loading products: {error}
        </motion.p>
      </section>
    );
  }

  if (!products.length) {
    return (
      <section className="py-16 px-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          No featured products available.
        </motion.p>
      </section>
    );
  }

  // Display only the first three products as featured items
  const featuredProducts = products.slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
    hover: {
      y: -10,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
      },
    },
  };

  return (
    <section className="py-16 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          className="text-3xl font-bold tracking-tight text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Featured Crops
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id || index}
              className="group relative overflow-hidden transition-all bg-white rounded-lg border border-gray-200"
              variants={itemVariants}
              whileHover="hover"
            >
              <div className="aspect-video w-full overflow-hidden">
                <motion.img
                  src={
                    product.image.startsWith("http")
                      ? product.image
                      : `${apiBaseUrl}/${product.image}`
                  }
                  alt={product.productName}
                  className="h-full w-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
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
                  <motion.span
                    className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
                    whileHover={{ scale: 1.1 }}
                  >
                    {product.productType}
                  </motion.span>
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
                  <motion.button
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturedCrops;
