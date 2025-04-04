import io from "socket.io-client";

// Create a socket instance that connects to your backend server
const socket = io("http://localhost:8000/messages", {
  autoConnect: false, // Don't connect automatically
  withCredentials: true, // Include credentials if needed
});

// Export the socket instance
export default socket;
