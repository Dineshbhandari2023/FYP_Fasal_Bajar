import { io } from "socket.io-client";

// Create a socket instance for messages
const socket = io("http://localhost:8000", {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  withCredentials: true,
  transports: ["websocket", "polling"],
});

// Set up event listeners for debugging
socket.on("connect", () => {
  console.log("Connected to message socket:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("Message socket connection error:", error);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected from message socket:", reason);
});

// Export the socket instance
export default socket;
