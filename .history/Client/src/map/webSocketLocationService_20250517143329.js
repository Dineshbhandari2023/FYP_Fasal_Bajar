import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:8000";

class WebSocketLocationService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.callbacks = {
      onConnect: () => {},
      onDisconnect: () => {},
      onSupplierLocationUpdate: () => {},
      onSupplierStatusChange: () => {},
      onActiveSuppliersList: () => {},
      onError: () => {},
    };
  }

  // Initialize the WebSocket connection
  connect() {
    if (this.socket) {
      this.disconnect();
    }

    // Connect to the location namespace
    this.socket = io(`${SERVER_URL}/location`, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    // Set up event listeners
    this.socket.on("connect", () => {
      console.log("Connected to location tracking socket");
      this.connected = true;
      this.callbacks.onConnect();

      // Request the current list of active suppliers
      this.socket.emit("supplier:get-active");
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Disconnected from location tracking socket:", reason);
      this.connected = false;
      this.callbacks.onDisconnect(reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      this.callbacks.onError(error);
    });

    // Listen for location updates from suppliers
    this.socket.on("supplier:location", (data) => {
      this.callbacks.onSupplierLocationUpdate(data);
    });

    // Listen for supplier status changes (online/offline)
    this.socket.on("supplier:status", (data) => {
      this.callbacks.onSupplierStatusChange(data);
    });

    // Listen for the list of active suppliers
    this.socket.on("supplier:active-list", (data) => {
      this.callbacks.onActiveSuppliersList(data);
    });

    return this;
  }

  // Disconnect the WebSocket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
    return this;
  }

  // Request the current list of active suppliers
  getActiveSuppliers() {
    if (!this.connected || !this.socket) {
      console.warn("Cannot get active suppliers: WebSocket not connected");
      return false;
    }

    this.socket.emit("supplier:get-active");
    return true;
  }

  // Set callback for when connection is established
  onConnect(callback) {
    this.callbacks.onConnect = callback;
    return this;
  }

  // Set callback for when connection is lost
  onDisconnect(callback) {
    this.callbacks.onDisconnect = callback;
    return this;
  }

  // Set callback for when a supplier location update is received
  onSupplierLocationUpdate(callback) {
    this.callbacks.onSupplierLocationUpdate = callback;
    return this;
  }

  // Set callback for when a supplier's status changes (online/offline)
  onSupplierStatusChange(callback) {
    this.callbacks.onSupplierStatusChange = callback;
    return this;
  }

  // Set callback for when the list of active suppliers is received
  onActiveSuppliersList(callback) {
    this.callbacks.onActiveSuppliersList = callback;
    return this;
  }

  // Set callback for when an error occurs
  onError(callback) {
    this.callbacks.onError = callback;
    return this;
  }

  // Check if the WebSocket is connected
  isConnected() {
    return this.connected;
  }
}

// Create a singleton instance
const locationService = new WebSocketLocationService();

export default locationService;
