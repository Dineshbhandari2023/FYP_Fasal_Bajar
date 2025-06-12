import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentLocation } from "../../Redux/slice/supplierSlice";
import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:8000";

const RealTimeLocationTracker = ({ children, trackingInterval = 30000 }) => {
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.supplier);
  const [isTracking, setIsTracking] = useState(false);
  const didAutoStart = useRef(false);
  const [lastPosition, setLastPosition] = useState(null);
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const watchIdRef = useRef(null);
  const intervalIdRef = useRef(null);

  const STORAGE_KEY = "supplierTrackingActive";

  // Initialize socket connection
  useEffect(() => {
    const token =
      localStorage.getItem("accessToken") ||
      JSON.parse(localStorage.getItem("user"))?.token;

    if (!token) {
      console.error("No authentication token found");
      return;
    }

    // Connect to the location namespace
    const socketInstance = io(`${SERVER_URL}/location`, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    socketInstance.on("connect", () => {
      console.log("Connected to location tracking socket");
      setSocketConnected(true);

      // Register as a supplier
      if (user?.id) {
        socketInstance.emit("supplier:register", {
          supplierId: user.id,
          username: user.username,
          serviceArea: user.SupplierDetail?.serviceArea,
        });
      }
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from location tracking socket");
      setSocketConnected(false);
    });

    socketInstance.on("error", (error) => {
      console.error("Socket error:", error);
    });

    setSocket(socketInstance);

    return () => {
      if (socketInstance) {
        // Tell server we're going offline before disconnecting
        if (user?.id) {
          socketInstance.emit("supplier:offline", { supplierId: user.id });
        }
        socketInstance.disconnect();
      }
    };
  }, [user]);

  // Function to get and update location
  const updateLocation = () => {
    if (navigator.geolocation) {
      // Get current position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, heading, speed } = position.coords;

          // Only update if position has changed significantly (more than 10 meters)
          if (
            !lastPosition ||
            calculateDistance(lastPosition, { latitude, longitude }) > 10
          ) {
            setLastPosition({ latitude, longitude });

            // Update location in Redux
            dispatch(updateCurrentLocation({ latitude, longitude }));

            // Send location update via WebSocket
            if (socket && socketConnected && user?.id) {
              socket.emit("supplier:location", {
                supplierId: user.id,
                latitude,
                longitude,
                heading,
                speed,
              });
            }

            // Also update location in database for persistence
            if (user?.id) {
              updateLocationInDatabase(user.id, latitude, longitude);
            }

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

  // Update location in database for persistence
  const updateLocationInDatabase = async (supplierId, latitude, longitude) => {
    try {
      const token =
        localStorage.getItem("accessToken") ||
        JSON.parse(localStorage.getItem("user"))?.token;

      if (!token) return;

      const response = await fetch(
        `${SERVER_URL}/api/supplier/location/${supplierId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ latitude, longitude }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        console.error("Failed to update location in database:", data.message);
      }
    } catch (error) {
      console.error("Error updating location in database:", error);
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
  useEffect(() => {
    if (
      socketConnected &&
      !didAutoStart.current &&
      localStorage.getItem(STORAGE_KEY) === "true"
    ) {
      // call your startTracking function
      startTracking();
      didAutoStart.current = true;
    }
  }, [socketConnected]);

  // Start tracking
  const startTracking = () => {
    if (isTracking) return;

    setIsTracking(true);
    localStorage.setItem(STORAGE_KEY, "true");

    // Update location immediately
    updateLocation();

    // Set up interval for periodic updates
    intervalIdRef.current = setInterval(updateLocation, trackingInterval);

    // Set up continuous watching for significant changes
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, heading, speed } = position.coords;

          // Only update if position has changed significantly (more than 20 meters)
          if (
            !lastPosition ||
            calculateDistance(lastPosition, { latitude, longitude }) > 20
          ) {
            setLastPosition({ latitude, longitude });

            // Update location in Redux
            dispatch(updateCurrentLocation({ latitude, longitude }));

            // Send location update via WebSocket
            if (socket && socketConnected && user?.id) {
              socket.emit("supplier:location", {
                supplierId: user.id,
                latitude,
                longitude,
                heading,
                speed,
              });
            }

            // Also update location in database for persistence
            if (user?.id) {
              updateLocationInDatabase(user.id, latitude, longitude);
            }

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

    // Tell server we're going offline
    if (socket && socketConnected && user?.id) {
      socket.emit("supplier:offline", { supplierId: user.id });
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
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  isTracking ? "bg-green-500 animate-pulse" : "bg-red-500"
                }`}
                title={isTracking ? "Tracking Active" : "Tracking Inactive"}
              ></div>
              <div
                className={`h-3 w-3 rounded-full ${
                  socketConnected ? "bg-blue-500" : "bg-gray-300"
                }`}
                title={
                  socketConnected ? "Socket Connected" : "Socket Disconnected"
                }
              ></div>
            </div>
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
              <div className="mt-1">
                <span className="font-medium">Lat:</span>{" "}
                {lastPosition.latitude.toFixed(6)},{" "}
                <span className="font-medium">Lng:</span>{" "}
                {lastPosition.longitude.toFixed(6)}
              </div>
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default RealTimeLocationTracker;
