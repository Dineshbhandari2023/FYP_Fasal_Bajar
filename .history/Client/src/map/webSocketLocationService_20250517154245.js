import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:8000";

class WebSocketLocationService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.authenticated = false;
    this.callbacks = {
      onConnect: () => {},
      onDisconnect: () => {},
      onSupplierLocationUpdate: () => {},
      onSupplierStatusChange: () => {},
      onActiveSuppliersList: () => {},
      onError: () => {},
    };
  }

  connect(token) {
    if (!token) {
      this.callbacks.onError(new Error("Authentication token required"));
      return this;
    }

    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(`${SERVER_URL}/location`, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
      auth: { token },
    });

    this.socket.on("connect", () => {
      console.log("Connected to location tracking socket");
      this.connected = true;
      this.authenticated = true;
      this.callbacks.onConnect();
      this.socket.emit("supplier:get-active");
    });

   59        this.socket.on("disconnect", (reason) => {
      console.log("Disconnected from location tracking socket:", reason);
      this.connected = false;
      this.authenticated = false;
      this.callbacks.onDisconnect(reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      this.authenticated = false;
      this.callbacks.onError({
        type: "connection",
        message: error.message || "Connection failed",
      });
    });

    this.socket.on("error", (data) => {
      console.error("Socket error:", data);
      this.callbacks.onError({
        type: "server",
        message: data.message || "Server error",
      });
    });

    this.socket.on("supplier:location", (data) => {
      this.callbacks.onSupplierLocationUpdate(data);
    });

    this.socket.on("supplier:status", (data) => {
      this.callbacks.onSupplierStatusChange(data);
    });

    this.socket.on("supplier:active-list", (data) => {
      this.callbacks.onActiveSuppliersList(data);
    });

    return this;
  }

  registerAsSupplier(supplierId, username, serviceArea) {
    if (!this.connected || !this.authenticated) {
      console.warn("Cannot register: WebSocket not connected or not authenticated");
      this.callbacks.onError({
        type: "auth",
        message: "Not authenticated or socket not connected",
      });
      return false;
    }

    if (!supplierId || !username) {
      console.warn("Invalid supplier data");
      this.callbacks.onError({
        type: "validation",
        message: "Supplier ID and username are required",
      });
      return false;
    }

    this.socket.emit("supplier:register", {
      supplierId,
      username,
      serviceArea: serviceArea || "Not specified",
    });
    return true;
  }

  updateLocation(supplierId, latitude, longitude, heading = null, speed = null) {
    if (!this.connected || !this.authenticated) {
      console.warn("Cannot update location: WebSocket not connected or not authenticated");
      this.callbacks.onError({
        type: "auth",
        message: "Not authenticated or socket not connected",
      });
      return false;
    }

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      console.warn("Invalid location data");
      this.callbacks.onError({
        type: "validation",
        message: "Invalid latitude or longitude",
      });
      return false;
    }

    this.socket.emit("supplier:location", {
      supplierId,
      latitude,
      longitude,
      heading,
      speed,
    });
    return true;
  }

  setSupplierOffline(supplierId) {
    if (!this.connected || !this.authenticated) {
      console.warn("Cannot set offline: WebSocket not connected or not authenticated");
      return false;
    }

    this.socket.emit("supplier:offline", { supplierId });
    return true;
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.authenticated = false;
    }
    return this;
  }

  getActiveSuppliers() {
    if (!this.connected || !this.authenticated) {
      console.warn("Cannot get active suppliers: WebSocket not connected or not authenticated");
      return false;
    }

    this.socket.emit("supplier:get-active");
    return true;
  }

  onConnect(callback) {
    this.callbacks.onConnect = callback;
    return this;
  }

  onDisconnect(callback) {
    this.callbacks.onDisconnect = callback;
    return this;
  }

  onSupplierLocationUpdate(callback) {
    this.callbacks.onSupplierLocationUpdate = callback;
    return this;
  }

  onSupplierStatusChange(callback) {
    this.callbacks.onSupplierStatusChange = callback;
    return this;
  }

  onActiveSuppliersList(callback) {
    this.callbacks.onActiveSuppliersList = callback;
    return this;
  }

  onError(callback) {
    this.callbacks.onError = callback;
    return this;
  }

  isConnected() {
    return this.connected && this.authenticated;
  }
}

const locationService = new WebSocketLocationService();
export default locationService;