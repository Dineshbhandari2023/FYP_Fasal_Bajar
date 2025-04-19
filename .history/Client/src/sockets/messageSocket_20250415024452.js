import { io } from "socket.io-client";

// Function to create a socket instance with the current token
const createSocket = (token) => {
  const socket = io("http://localhost:8000", {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    withCredentials: true,
    transports: ["websocket", "polling"],
    auth: {
      token: token,
    },
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

  return socket;
};

// Create a socket instance (will be initialized with token when needed)
let socket = null;

// Function to initialize or update the socket with a token
export const initializeSocket = (token) => {
  if (socket) {
    // Disconnect existing socket if it exists
    socket.disconnect();
  }

  // Create new socket with token
  socket = createSocket(token);
  return socket;
};

// Function to get the current socket instance
export const getSocket = () => {
  return socket;
};

// Function to connect the socket if it exists
export const connectSocket = () => {
  if (socket) {
    socket.connect();
  }
};

// Function to disconnect the socket if it exists
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export default {
  initializeSocket,
  getSocket,
  connectSocket,
  disconnectSocket,
};
