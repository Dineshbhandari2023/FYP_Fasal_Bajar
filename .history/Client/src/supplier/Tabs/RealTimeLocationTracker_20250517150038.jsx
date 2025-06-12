import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentLocation } from "../../Redux/slice/supplierSlice";
import locationService from "../../map/webSocketLocationService";

const STORAGE_KEY = "supplierTrackingActive";
const MIN_DISTANCE_THRESHOLD = 20; // meters

// Calculate distance between two coordinates in meters using the Haversine formula
const calculateDistance = (pos1, pos2) => {
  if (!pos1 || !pos2) return 0;

  const R = 6371e3; // Earth's radius in meters
  const φ1 = (pos1.latitude * Math.PI) / 180;
  const φ2 = (pos2.latitude * Math.PI) / 180;
  const Δφ = ((pos2.latitude - pos1.latitude) * Math.PI) / 180;
  const Δλ = ((pos2.longitude - pos1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

const RealTimeLocationTracker = ({
  children,
  trackingInterval = 30000, // Default to 30 seconds
  minDistanceChange = MIN_DISTANCE_THRESHOLD, // Default to 20 meters
}) => {
  const dispatch = useDispatch();
  // const { user, supplierDetails } = useSelector((state) => state.supplier);
  const { userInfo } = useSelector((state) => state.user);
  const [isTracking, setIsTracking] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [lastPosition, setLastPosition] = useState(null);
  const [error, setError] = useState(null);

  const trackingInitialized = useRef(false);
  const watchIdRef = useRef(null);
  const intervalRef = useRef(null);
  const { user, supplierDetails } = userInfo;
  // Get auth token
  const getAuthToken = () => {
    return (
      localStorage.getItem("accessToken") ||
      JSON.parse(localStorage.getItem("user"))?.token ||
      null
    );
  };

  // Initialize WebSocket connection
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setError("Authentication required for location tracking");
      return;
    }

    // Connect to the WebSocket server
    locationService
      .connect(token)
      .onConnect(() => {
        setSocketConnected(true);
        setError(null);

        // Register as a supplier if we have user data
        if (user?.id) {
          locationService.registerAsSupplier(
            user.id,
            user.username,
            supplierDetails?.serviceArea
          );
        }
      })
      .onDisconnect((reason) => {
        setSocketConnected(false);
        setError(`Disconnected: ${reason}`);
      })
      .onError((err) => {
        setError(`Connection error: ${err.message || "Unknown error"}`);
      });

    // Cleanup on unmount
    return () => {
      if (user?.id) {
        locationService.setSupplierOffline(user.id);
      }
      locationService.disconnect();
    };
  }, [user?.id, user?.username, supplierDetails?.serviceArea]);

  // Check if tracking was active before page reload
  useEffect(() => {
    if (socketConnected && localStorage.getItem(STORAGE_KEY) === "true") {
      startTracking();
    }
  }, [socketConnected]);

  // Send location to server and Redux store
  const sendLocation = (latitude, longitude, heading, speed) => {
    if (!user?.id) {
      setError("User ID is undefined");
      return;
    }

    // Update Redux store
    dispatch(updateCurrentLocation({ latitude, longitude }))
      .unwrap()
      .then(() => {
        setError(null);
      })
      .catch((err) => {
        setError(
          `Failed to update location in database: ${
            err.message || "Unknown error"
          }`
        );
      });

    // Send to WebSocket for real-time updates
    locationService.updateLocation(
      user.id,
      latitude,
      longitude,
      heading,
      speed
    );

    // Update last position state
    setLastPosition({ latitude, longitude });
  };

  // Get current position and send it
  const updateLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, heading, speed } = position.coords;
        sendLocation(latitude, longitude, heading, speed);
      },
      (err) => {
        setError(`Geolocation error: ${err.message}`);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 15000,
      }
    );
  };

  // Start tracking location
  const startTracking = () => {
    if (!socketConnected) {
      setError("Cannot start tracking: Socket not connected");
      return;
    }

    setIsTracking(true);
    localStorage.setItem(STORAGE_KEY, "true");

    if (!trackingInitialized.current) {
      trackingInitialized.current = true;

      // Initial location update
      updateLocation();

      // Set up periodic updates
      intervalRef.current = setInterval(updateLocation, trackingInterval);

      // Set up continuous watching with movement threshold
      if (navigator.geolocation) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude, heading, speed } = position.coords;

            // Only update if we've moved more than the threshold distance
            if (
              !lastPosition ||
              calculateDistance(lastPosition, { latitude, longitude }) >
                minDistanceChange
            ) {
              sendLocation(latitude, longitude, heading, speed);
            }
          },
          (err) => {
            setError(`Watch position error: ${err.message}`);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 15000,
          }
        );
      }
    }
  };

  // Stop tracking location
  const stopTracking = () => {
    setIsTracking(false);
    localStorage.removeItem(STORAGE_KEY);

    // Clear interval and watch
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (watchIdRef.current && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    // Notify server that supplier is offline
    if (user?.id && socketConnected) {
      locationService.setSupplierOffline(user.id);
    }

    trackingInitialized.current = false;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isTracking) {
        stopTracking();
      }
    };
  }, []);

  return (
    <div>
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-800">Location Tracking</span>
            <div className="flex gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isTracking ? "bg-green-500 animate-pulse" : "bg-red-500"
                }`}
                title={isTracking ? "Tracking Active" : "Tracking Paused"}
              />
              <div
                className={`w-3 h-3 rounded-full ${
                  socketConnected ? "bg-blue-500" : "bg-gray-300"
                }`}
                title={socketConnected ? "Socket Connected" : "Socket Offline"}
              />
            </div>
          </div>

          <button
            disabled={!socketConnected}
            onClick={isTracking ? stopTracking : startTracking}
            className={`w-full py-2 rounded text-white font-medium ${
              isTracking
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-600 hover:bg-green-700"
            } ${!socketConnected ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isTracking ? "Stop Tracking" : "Start Tracking"}
          </button>

          {lastPosition && (
            <div className="mt-2 text-xs text-gray-600">
              Last: {lastPosition.latitude.toFixed(6)},{" "}
              {lastPosition.longitude.toFixed(6)}
            </div>
          )}

          {error && (
            <div className="mt-1 text-xs text-red-500">Error: {error}</div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default RealTimeLocationTracker;
