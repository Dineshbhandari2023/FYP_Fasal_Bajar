import io from "socket.io-client";

// Create a socket instance that connects to your backend server
const socket = io("http://localhost:8000", {
  autoConnect: false, // Don't connect automatically
  withCredentials: true, // Include credentials if needed
});

// Add authentication when connecting
socket.on("connect", () => {
  console.log("Socket connected");

  // Get token from localStorage
  const token = localStorage.getItem("accessToken");

  // If token exists, authenticate the socket
  if (token) {
    socket.emit("authenticate", { token });
    console.log("Socket authenticated with token");
  }
});

// Handle connection errors
socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

// Export the socket instance
export default socket;
