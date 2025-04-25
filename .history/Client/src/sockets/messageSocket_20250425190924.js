import io from "socket.io-client";
import { addNewMessage } from "../Redux/slice/messageSlice";
import store from "../Redux/store";

const SERVER_URL = "http://localhost:8000";
let socket = null;

// Initialize socket connection
const connect = () => {
  if (socket && socket.connected) {
    console.log("Socket already connected");
    return socket;
  }

  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.error("Cannot connect to socket: No auth token found");
    return null;
  }

  // Close existing socket if it exists
  if (socket) {
    socket.close();
  }

  // Connect to the message namespace with auth token
  socket = io(`${SERVER_URL}/messages`, {
    auth: { token },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  // Set up event listeners
  socket.on("connect", () => {
    console.log("Connected to message socket");
    const userId =
      localStorage.getItem("userId") || store.getState().user?.userInfo?.id;
    if (userId) {
      socket.emit("join_room", { roomId: `user:${userId}` });
    }
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  socket.on("new_message", (message) => {
    console.log("New message received via socket:", message);
    store.dispatch(addNewMessage(message));
  });

  socket.on("user_typing", ({ userId }) => {
    console.log(`User ${userId} is typing...`);
    // You can dispatch an action here to show typing indicator
  });

  socket.on("user_stop_typing", ({ userId }) => {
    console.log(`User ${userId} stopped typing`);
    // You can dispatch an action here to hide typing indicator
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from message socket");
  });

  return socket;
};

// Connect to socket and export the instance
export const connectMessageSocket = () => {
  return connect();
};

// Send typing indicator
export const sendTypingIndicator = (receiverId) => {
  if (!socket || !socket.connected) return;
  socket.emit("typing", { receiverId });
};

// Send stop typing indicator
export const sendStopTypingIndicator = (receiverId) => {
  if (!socket || !socket.connected) return;
  socket.emit("stop_typing", { receiverId });
};

// Mark messages as read
export const markMessagesAsReadSocket = (messageIds) => {
  if (!socket || !socket.connected) return;
  socket.emit("mark_read", { messageIds });
};

// Export the socket instance and functions
export default {
  connect,
  connectMessageSocket,
  sendTypingIndicator,
  sendStopTypingIndicator,
  markMessagesAsReadSocket,
  get connected() {
    return socket && socket.connected;
  },
  emit: (event, data) => {
    if (!socket || !socket.connected) {
      console.error(`Cannot emit ${event}: Socket not connected`);
      return false;
    }
    socket.emit(event, data);
    return true;
  },
  on: (event, callback) => {
    if (!socket) return;
    socket.on(event, callback);
  },
  off: (event, callback) => {
    if (!socket) return;
    socket.off(event, callback);
  },
  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },
};
