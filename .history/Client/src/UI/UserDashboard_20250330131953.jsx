import { Navigation } from "./navigation";
import { Hero } from "./hero";
import { FeaturedCrops } from "./featured-crops";
import { Footer } from "./footer";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navigation />
      <main className="flex-1">
        <Hero />
        <FeaturedCrops />
      </main>
      <Footer />
    </motion.div>
  );
}
