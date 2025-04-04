import { io } from "socket.io-client";
import {
  addSocketReview,
  updateSocketReview,
  deleteSocketReview,
} from "../Redux/slice/reviewSlice";

// Socket.IO service for managing connections and event handlers
class SocketService {
  constructor() {
    this.socket = null;
    this.reviewSocket = null;
    this.store = null;
  }

  // Initialize the main socket connection
  initializeSocket(store) {
    this.store = store;

    const token = localStorage.getItem("accessToken");
    const serverUrl = "http://localhost:8000"; // Hardcode the server URL for now

    // Socket.IO client options
    const socketOptions = {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      withCredentials: true,
      transports: ["websocket", "polling"], // Try websocket first, then polling
    };

    console.log("Connecting to Socket.IO server at:", serverUrl);

    this.socket = io(serverUrl, socketOptions);

    this.socket.on("connect", () => {
      console.log("Connected to main socket server with ID:", this.socket.id);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      console.error("Socket connection error details:", error.message);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Disconnected from socket server:", reason);
    });

    // Initialize the reviews namespace
    this.initializeReviewSocket(token, serverUrl);

    return this.socket;
  }

  // Initialize the reviews namespace socket
  initializeReviewSocket(token, serverUrl) {
    // Socket.IO client options for review namespace
    const socketOptions = {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      withCredentials: true,
      transports: ["websocket", "polling"], // Try websocket first, then polling
    };

    console.log("Connecting to reviews namespace at:", `${serverUrl}/reviews`);

    this.reviewSocket = io(`${serverUrl}/reviews`, socketOptions);

    this.reviewSocket.on("connect", () => {
      console.log(
        "Connected to reviews socket namespace with ID:",
        this.reviewSocket.id
      );
    });

    this.reviewSocket.on("connect_error", (error) => {
      console.error("Reviews socket connection error:", error);
      console.error("Reviews socket connection error details:", error.message);
    });

    // Set up review event listeners
    this.setupReviewEventListeners();

    return this.reviewSocket;
  }

  // Set up event listeners for review-related events
  setupReviewEventListeners() {
    if (!this.reviewSocket) return;

    this.reviewSocket.on("new_review", (review) => {
      console.log("New review received:", review);
      if (this.store) {
        this.store.dispatch(addSocketReview(review));
      }
    });

    this.reviewSocket.on("update_review", (review) => {
      console.log("Review updated:", review);
      if (this.store) {
        this.store.dispatch(updateSocketReview(review));
      }
    });

    this.reviewSocket.on("delete_review", (reviewId) => {
      console.log("Review deleted:", reviewId);
      if (this.store) {
        this.store.dispatch(deleteSocketReview(reviewId));
      }
    });
  }

  // Join a farmer's review room to receive updates
  joinFarmerReviewRoom(farmerId) {
    if (this.reviewSocket && this.reviewSocket.connected) {
      this.reviewSocket.emit("join_farmer_room", farmerId);
      console.log(`Joined farmer ${farmerId} review room`);
    } else {
      console.warn("Cannot join room: review socket not connected");
    }
  }

  // Leave a farmer's review room
  leaveFarmerReviewRoom(farmerId) {
    if (this.reviewSocket && this.reviewSocket.connected) {
      this.reviewSocket.emit("leave_farmer_room", farmerId);
      console.log(`Left farmer ${farmerId} review room`);
    }
  }

  // Disconnect all sockets
  disconnect() {
    if (this.reviewSocket) {
      this.reviewSocket.disconnect();
    }

    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

// Create a singleton instance
const socketService = new SocketService();
export default socketService;
