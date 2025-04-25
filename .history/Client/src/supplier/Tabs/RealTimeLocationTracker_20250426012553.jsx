import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentLocation } from "../Redux/slice/supplierSlice";

const RealTimeLocationTracker = ({ children, trackingInterval = 30000 }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.supplier);
  const [isTracking, setIsTracking] = useState(false);
  const [lastPosition, setLastPosition] = useState(null);
  const watchIdRef = useRef(null);
  const intervalIdRef = useRef(null);

  // Function to get and update location
  const updateLocation = () => {
    if (navigator.geolocation) {
      // Get current position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Only update if position has changed significantly (more than 10 meters)
          if (
            !lastPosition ||
            calculateDistance(lastPosition, { latitude, longitude }) > 10
          ) {
            setLastPosition({ latitude, longitude });
            dispatch(updateCurrentLocation({ latitude, longitude }));
            console.log("Location updated:", { latitude, longitude });
          } else {
            console.log(
              "Location hasn't changed significantly, skipping update"
            );
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // Calculate distance between two points in meters using Haversine formula
  const calculateDistance = (pos1, pos2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (pos1.latitude * Math.PI) / 180;
    const φ2 = (pos2.latitude * Math.PI) / 180;
    const Δφ = ((pos2.latitude - pos1.latitude) * Math.PI) / 180;
    const Δλ = ((pos2.longitude - pos1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  // Start tracking
  const startTracking = () => {
    if (isTracking) return;

    setIsTracking(true);

    // Update location immediately
    updateLocation();

    // Set up interval for periodic updates
    intervalIdRef.current = setInterval(updateLocation, trackingInterval);

    // Set up continuous watching for significant changes
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Only update if position has changed significantly (more than 20 meters)
          if (
            !lastPosition ||
            calculateDistance(lastPosition, { latitude, longitude }) > 20
          ) {
            setLastPosition({ latitude, longitude });
            dispatch(updateCurrentLocation({ latitude, longitude }));
            console.log("Significant location change detected:", {
              latitude,
              longitude,
            });
          }
        },
        (error) => {
          console.error("Error watching location:", error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    }
  };

  // Stop tracking
  const stopTracking = () => {
    setIsTracking(false);

    // Clear interval
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }

    // Clear watch
    if (watchIdRef.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  return (
    <div>
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white rounded-lg shadow-lg p-4 border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-sm">Location Tracking</h3>
            <div
              className={`h-3 w-3 rounded-full ${
                isTracking ? "bg-green-500 animate-pulse" : "bg-red-500"
              }`}
            ></div>
          </div>

          <div className="text-xs text-gray-500 mb-3">
            {isTracking
              ? `Actively tracking your location (updates every ${
                  trackingInterval / 1000
                }s)`
              : "Location tracking is paused"}
          </div>

          <button
            onClick={isTracking ? stopTracking : startTracking}
            className={`w-full py-2 px-4 rounded-md text-white text-sm ${
              isTracking
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isTracking ? "Stop Tracking" : "Start Tracking"}
          </button>

          {error && (
            <div className="mt-2 text-xs text-red-500">
              Error:{" "}
              {typeof error === "string" ? error : "Failed to update location"}
            </div>
          )}

          {lastPosition && (
            <div className="mt-2 text-xs text-gray-500">
              Last update: {new Date().toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default RealTimeLocationTracker;
