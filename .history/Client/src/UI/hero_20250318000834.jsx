import Link from "react-router-dom";

export function Hero() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-lime-100" />
      <div className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Fresh Farm Produce Delivered to Your Doorstep
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Connect directly with local farmers and get fresh, seasonal crops
            delivered straight to your home. Support local agriculture and enjoy
            the freshest produce.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/browse">
              <button className="px-6 py-3 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                Browse Crops
              </button>
            </Link>
            <Link href="/sell">
              <button className="px-6 py-3 rounded-full border border-green-600 text-green-600 font-medium hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                Sell Your Crops
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
