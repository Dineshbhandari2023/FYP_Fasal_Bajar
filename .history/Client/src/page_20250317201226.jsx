import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { FeaturedCrops } from "@/components/featured-crops"
import { Footer } from "@/components/footer"

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
  )
}

