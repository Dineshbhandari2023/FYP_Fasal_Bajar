import { io } from "socket.io-client";

class WebSocketLocationService {
  constructor(baseUrl = "http://localhost:8000") {
    this.socket = null;
    this.baseUrl = baseUrl;
    this.connected = false;
    this.callbacks = {
      onConnect: () => {},
      onDisconnect: () => {},
      onSupplierLocationUpdate: () => {},
      onError: () => {},
    };
  }

  // Initialize the WebSocket connection
  connect() {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(this.baseUrl, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    // Set up event listeners
    this.socket.on("connect", () => {
      console.log("WebSocket connected");
      this.connected = true;
      this.callbacks.onConnect();
    });

    this.socket.on("disconnect", (reason) => {
      console.log("WebSocket disconnected:", reason);
      this.connected = false;
      this.callbacks.onDisconnect(reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      this.callbacks.onError(error);
    });

    // Listen for location updates from suppliers
    this.socket.on("supplier:location", (data) => {
      this.callbacks.onSupplierLocationUpdate(data);
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
