import io from "socket.io-client";

// Create a socket instance that connects to your backend server
const socket = io("http://localhost:8000/messages", {
  autoConnect: false, // Don't connect automatically
  withCredentials: true, // Include credentials if needed
});

// Add authentication when connecting
socket.on("connect", () => {
  console.log("Message socket connected");

  // Get token from localStorage
  const token = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");

  // If token exists, authenticate the socket
  if (token) {
    socket.auth = { token };
    console.log("Socket authenticated with token");

    // Join user's personal room
    if (userId) {
      socket.emit("join", { userId });
      console.log(`Joined personal room for user ${userId}`);
    }
  }
});

// Handle connection errors
socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

// Export the socket instance
export default socket;
