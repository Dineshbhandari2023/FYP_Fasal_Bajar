import { Navigation } from "../UI/navigation";
import { Hero } from "../UI/hero";
import { FeaturedCrops } from "../UI/featured-crops";
import { Footer } from "../UI/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Hero />
        <FeaturedCrops />
      </main>
      <Footer />
    </div>
  );
}
