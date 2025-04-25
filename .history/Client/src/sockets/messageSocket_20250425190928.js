// messageSocket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:8000", {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  withCredentials: true,
  transports: ["websocket", "polling"],
});

socket.on("connect", () => {
  console.log("Connected to message socket:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("Message socket connection error:", error);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected from message socket:", reason);
});

// Add this to connect the socket when needed
export const connectMessageSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export default socket;
