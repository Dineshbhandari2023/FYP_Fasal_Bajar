import { io } from "socket.io-client";
import {
  addSocketReview,
  updateSocketReview,
  deleteSocketReview,
} from "../Redux/slice/reviewSlice";

class SocketService {
  constructor() {
    this.socket = null;
    this.reviewSocket = null;
    this.store = null;
  }

  initializeSocket(store) {
    this.store = store;

    const token = localStorage.getItem("accessToken");
    const serverUrl = "http://localhost:8000";

    const socketOptions = {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      withCredentials: true,
      transports: ["websocket", "polling"],
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

    this.initializeReviewSocket(token, serverUrl);

    return this.socket;
  }

  initializeReviewSocket(token, serverUrl) {
    const socketOptions = {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      withCredentials: true,
      transports: ["websocket", "polling"],
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

    this.setupReviewEventListeners();

    return this.reviewSocket;
  }

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

  joinFarmerReviewRoom(farmerId) {
    if (this.reviewSocket && this.reviewSocket.connected) {
      this.reviewSocket.emit("join_farmer_room", farmerId);
      console.log(`Joined farmer ${farmerId} review room`);
    } else {
      console.warn("Cannot join room: review socket not connected");
    }
  }

  leaveFarmerReviewRoom(farmerId) {
    if (this.reviewSocket && this.reviewSocket.connected) {
      this.reviewSocket.emit("leave_farmer_room", farmerId);
      console.log(`Left farmer ${farmerId} review room`);
    }
  }

  joinSupplierReviewRoom(supplierId) {
    if (this.reviewSocket && this.reviewSocket.connected) {
      this.reviewSocket.emit("join_supplier_room", supplierId);
      console.log(`Joined supplier ${supplierId} review room`);
    } else {
      console.warn("Cannot join room: review socket not connected");
    }
  }

  leaveSupplierReviewRoom(supplierId) {
    if (this.reviewSocket && this.reviewSocket.connected) {
      this.reviewSocket.emit("leave_supplier_room", supplierId);
      console.log(`Left supplier ${supplierId} review room`);
    }
  }

  disconnect() {
    if (this.reviewSocket) {
      this.reviewSocket.disconnect();
    }

    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

const socketService = new SocketService();
export default socketService;
