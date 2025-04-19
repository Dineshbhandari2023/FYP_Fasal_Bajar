import { useState, useEffect } from "react";
import { MapPin, Navigation, Truck, LocateFixed, Route } from "lucide-react";

export function MapPreview() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("current");

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border col-span-1 md:col-span-2">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">Delivery Map</h2>
            <p className="text-sm text-gray-500">
              Active deliveries in your service area
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 flex items-center gap-2">
              <LocateFixed className="h-4 w-4" />
              <span>My Location</span>
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              <span>Navigate</span>
            </button>
          </div>
        </div>

        <div className="flex mt-4 border-b">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "current"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("current")}
          >
            Current Delivery
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "all"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Active Orders
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "optimize"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("optimize")}
          >
            Route Optimization
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-gray-100">
          {!isLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
            </div>
          ) : (
            <>
              <div
                className="h-full w-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('/assets/delhi-road-landmarks.png')`,
                }}
              ></div>
              <div className="absolute inset-0">
                {/* Pickup Location - Farmer */}
                <div className="absolute top-[30%] left-[25%] transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="p-1 bg-white rounded-full shadow-md">
                      <MapPin className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap">
                      <span className="px-2 py-1 bg-white border rounded-full text-xs shadow-sm">
                        Pickup: Farmer Market
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dropoff Location - Buyer */}
                <div className="absolute top-[40%] left-[65%] transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="p-1 bg-white rounded-full shadow-md">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap">
                      <span className="px-2 py-1 bg-white border rounded-full text-xs shadow-sm">
                        Dropoff: City Center
                      </span>
                    </div>
                  </div>
                </div>

                {/* Current Location - Supplier */}
                <div className="absolute top-[60%] left-[45%] transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="p-1 bg-white rounded-full shadow-md">
                      <Truck className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap">
                      <span className="px-2 py-1 bg-amber-500 text-white rounded-full text-xs shadow-sm">
                        Your Location
                      </span>
                    </div>
                  </div>
                </div>

                {/* Route line visualization */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  style={{ pointerEvents: "none" }}
                >
                  <path
                    d="M 120,150 Q 250,100 270,300 T 420,200"
                    stroke="#16a34a"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="5,5"
                  />
                  <path
                    d="M 270,300 Q 350,350 420,200"
                    stroke="#2563eb"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
              </div>
            </>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-3 border rounded-lg">
            <div className="text-sm font-medium text-gray-500">
              Estimated Time
            </div>
            <div className="text-lg font-bold">35 mins</div>
          </div>
          <div className="p-3 border rounded-lg">
            <div className="text-sm font-medium text-gray-500">Distance</div>
            <div className="text-lg font-bold">12.5 km</div>
          </div>
          <div className="p-3 border rounded-lg">
            <div className="text-sm font-medium text-gray-500">
              Active Orders
            </div>
            <div className="text-lg font-bold">3 orders</div>
          </div>
          <div className="p-3 border rounded-lg">
            <div className="text-sm font-medium text-gray-500">Next Pickup</div>
            <div className="text-lg font-bold">15 mins</div>
          </div>
        </div>

        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Route className="h-4 w-4 text-green-600" />
            Suggested Route
          </h3>
          <ol className="space-y-2 pl-6 list-decimal">
            <li className="text-sm">
              <span className="font-medium">Pickup:</span> Farmer Market (Ramesh
              Patel) - 10:45 AM
            </li>
            <li className="text-sm">
              <span className="font-medium">Delivery:</span> City Center (Amit
              Sharma) - 11:20 AM
            </li>
            <li className="text-sm">
              <span className="font-medium">Next Pickup:</span> Vegetable
              Wholesale Market - 11:45 AM
            </li>
          </ol>
          <div className="mt-3 flex justify-end">
            <button className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700">
              Start Navigation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
