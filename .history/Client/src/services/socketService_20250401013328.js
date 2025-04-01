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

    this.socket = io("http://localhost:8000", {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      console.log("Connected to main socket server");
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Disconnected from socket server:", reason);
    });

    // Initialize the reviews namespace
    this.initializeReviewSocket(token);

    return this.socket;
  }

  // Initialize the reviews namespace socket
  initializeReviewSocket(token) {
    this.reviewSocket = io("http://localhost:8000/reviews", {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.reviewSocket.on("connect", () => {
      console.log("Connected to reviews socket namespace");
    });

    this.reviewSocket.on("connect_error", (error) => {
      console.error("Reviews socket connection error:", error);
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
    if (this.reviewSocket) {
      this.reviewSocket.emit("join_farmer_room", farmerId);
      console.log(`Joined farmer ${farmerId} review room`);
    }
  }

  // Leave a farmer's review room
  leaveFarmerReviewRoom(farmerId) {
    if (this.reviewSocket) {
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
