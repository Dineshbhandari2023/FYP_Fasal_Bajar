import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentLocation } from "../../Redux/slice/supplierSlice";
import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:8000";
const STORAGE_KEY = "supplierTrackingActive";

const RealTimeLocationTracker = ({ children, trackingInterval = 30000 }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.supplier);
  const [isTracking, setIsTracking] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [lastPosition, setLastPosition] = useState(null);

  const didStartOnce = useRef(false);
  const watchIdRef = useRef(null);
  const intervalRef = useRef(null);

  // 1) Bootstrap socket
  useEffect(() => {
    const token =
      localStorage.getItem("accessToken") ||
      JSON.parse(localStorage.getItem("user"))?.token;
    if (!token) return console.error("No token");

    const sock = io(`${SERVER_URL}/location`, {
      auth: { token },
      transports: ["websocket"],
    });
    setSocket(sock);

    sock.on("connect", () => {
      setSocketConnected(true);
      if (user?.id) {
        sock.emit("supplier:register", {
          supplierId: user.id,
          username: user.username,
          serviceArea: user.SupplierDetail?.serviceArea,
        });
      }
    });
    sock.on("disconnect", () => setSocketConnected(false));
    sock.on("error", (e) => console.error("Socket error", e));

    return () => {
      if (sock) {
        user?.id && sock.emit("supplier:offline", { supplierId: user.id });
        sock.disconnect();
      }
    };
  }, [user]);

  // 2) Auto-resume after reload if localStorage says so
  useEffect(() => {
    if (
      socketConnected &&
      !didStartOnce.current &&
      localStorage.getItem(STORAGE_KEY) === "true"
    ) {
      setIsTracking(true);
    }
  }, [socketConnected]);

  // 3) When both tracking + socket are ready, do the one-time setup
  useEffect(() => {
    if (socketConnected && isTracking && !didStartOnce.current) {
      didStartOnce.current = true;

      // one-off first ping
      updateLocation();

      // periodic pings
      intervalRef.current = setInterval(updateLocation, trackingInterval);

      // continuous watch
      if (navigator.geolocation) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (pos) => {
            const { latitude, longitude, heading, speed } = pos.coords;
            if (
              !lastPosition ||
              calculateDistance(lastPosition, { latitude, longitude }) > 20
            ) {
              setLastPosition({ latitude, longitude });
              sendLocation(latitude, longitude, heading, speed);
            }
          },
          console.error,
          { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
        );
      }
    }
  }, [socketConnected, isTracking]);

  const sendLocation = (latitude, longitude, heading, speed) => {
    dispatch(updateCurrentLocation({ latitude, longitude }));
    socket?.emit("supplier:location", {
      supplierId: user.id,
      latitude,
      longitude,
      heading,
      speed,
    });
    // persist in DB too
    fetch(`${SERVER_URL}/api/supplier/location/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ latitude, longitude }),
    }).catch(console.error);
  };

  const updateLocation = () => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        sendLocation(
          coords.latitude,
          coords.longitude,
          coords.heading,
          coords.speed
        ),
      console.error,
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );
  };

  // 4) Controls
  const startTracking = () => {
    if (!socketConnected) return;
    setIsTracking(true);
    localStorage.setItem(STORAGE_KEY, "true");
  };
  const stopTracking = () => {
    setIsTracking(false);
    localStorage.removeItem(STORAGE_KEY);
    clearInterval(intervalRef.current);
    navigator.geolocation.clearWatch(watchIdRef.current);
    socket?.emit("supplier:offline", { supplierId: user.id });
    didStartOnce.current = false;
  };

  // cleanup on unmount
  useEffect(() => () => stopTracking(), []);

  // rendering...
  return (
    <div>
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Location Tracking</span>
            <div className="flex gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isTracking ? "bg-green-500 animate-pulse" : "bg-red-500"
                }`}
                title={isTracking ? "Tracking" : "Paused"}
              />
              <div
                className={`w-3 h-3 rounded-full ${
                  socketConnected ? "bg-blue-500" : "bg-gray-300"
                }`}
                title={socketConnected ? "Socket" : "Offline"}
              />
            </div>
          </div>
          <button
            disabled={!socketConnected}
            onClick={isTracking ? stopTracking : startTracking}
            className={`w-full py-2 rounded text-white ${
              isTracking ? "bg-red-500" : "bg-green-600"
            }`}
          >
            {isTracking ? "Stop Tracking" : "Start Tracking"}
          </button>
          {lastPosition && (
            <div className="mt-2 text-xs text-gray-600">
              Last: {lastPosition.latitude.toFixed(6)},
              {lastPosition.longitude.toFixed(6)}
            </div>
          )}
          {error && (
            <div className="mt-1 text-xs text-red-500">
              Error:{" "}
              {typeof error === "string" ? error : "Something went wrong"}
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default RealTimeLocationTracker;
