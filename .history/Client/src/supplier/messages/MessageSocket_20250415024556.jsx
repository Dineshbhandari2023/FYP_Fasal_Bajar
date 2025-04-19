import { useEffect, useState, useContext, createContext } from "react";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContext"; // Adjust path as needed

// Create a context for the socket
const MessageSocketContext = createContext();

export const useMessageSocket = () => {
  return useContext(MessageSocketContext);
};

export const MessageSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const { user, token } = useAuth();

  useEffect(() => {
    if (!user || !token) return;

    // Connect to the socket server
    const socketInstance = io(`${process.env.REACT_APP_API_URL}/messages`, {
      auth: {
        token,
      },
    });

    // Socket event handlers
    socketInstance.on("connect", () => {
      console.log("Connected to message socket");
      setConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from message socket");
      setConnected(false);
    });

    socketInstance.on("new_message", (message) => {
      console.log("New message received:", message);
      setMessages((prev) => [...prev, message]);

      // Update conversations list
      updateConversationWithMessage(message);
    });

    socketInstance.on("user_typing", ({ userId }) => {
      // Handle typing indicator
      setConversations((prev) =>
        prev.map((conv) =>
          conv.user.id === userId ? { ...conv, isTyping: true } : conv
        )
      );
    });

    socketInstance.on("user_stop_typing", ({ userId }) => {
      // Handle stop typing
      setConversations((prev) =>
        prev.map((conv) =>
          conv.user.id === userId ? { ...conv, isTyping: false } : conv
        )
      );
    });

    socketInstance.on("messages_read", ({ reader, messageIds }) => {
      // Update read status for messages
      setMessages((prev) =>
        prev.map((msg) =>
          messageIds.includes(msg.id) ? { ...msg, is_read: true } : msg
        )
      );
    });

    socketInstance.on("error", (error) => {
      console.error("Socket error:", error);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [user, token]);

  // Fetch conversations when component mounts
  useEffect(() => {
    if (user && token) {
      fetchConversations();
    }
  }, [user, token]);

  // Function to fetch conversations
  const fetchConversations = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/messages/conversations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  // Function to fetch messages for a specific conversation
  const fetchMessages = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/messages/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data);

        // Mark messages as read
        markMessagesAsRead(userId);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Function to send a message
  const sendMessage = (receiverId, content, roomId = null) => {
    if (!socket || !connected) return;

    socket.emit("send_message", {
      receiverId,
      content,
      roomId,
    });
  };

  // Function to join a room
  const joinRoom = (roomId) => {
    if (!socket || !connected) return;
    socket.emit("join_room", { roomId });
  };

  // Function to leave a room
  const leaveRoom = (roomId) => {
    if (!socket || !connected) return;
    socket.emit("leave_room", { roomId });
  };

  // Function to send typing indicator
  const sendTyping = (receiverId, roomId = null) => {
    if (!socket || !connected) return;
    socket.emit("typing", { receiverId, roomId });
  };

  // Function to send stop typing
  const sendStopTyping = (receiverId, roomId = null) => {
    if (!socket || !connected) return;
    socket.emit("stop_typing", { receiverId, roomId });
  };

  // Function to mark messages as read
  const markMessagesAsRead = async (senderId) => {
    try {
      await fetch(
        `${process.env.REACT_APP_API_URL}/messages/read/${senderId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update local messages
      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderId === senderId ? { ...msg, is_read: true } : msg
        )
      );

      // Update conversations
      setConversations((prev) =>
        prev.map((conv) =>
          conv.user.id === senderId ? { ...conv, unreadCount: 0 } : conv
        )
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  // Helper function to update conversations when a new message is received
  const updateConversationWithMessage = (message) => {
    const otherUserId =
      message.senderId === user.id ? message.receiverId : message.senderId;
    const otherUser =
      message.senderId === user.id ? message.receiver : message.sender;

    setConversations((prev) => {
      // Check if conversation exists
      const existingConvIndex = prev.findIndex(
        (conv) => conv.id === otherUserId
      );

      if (existingConvIndex !== -1) {
        // Update existing conversation
        const updatedConversations = [...prev];
        updatedConversations[existingConvIndex] = {
          ...updatedConversations[existingConvIndex],
          lastMessage: message,
          unreadCount:
            message.senderId !== user.id && !message.is_read
              ? updatedConversations[existingConvIndex].unreadCount + 1
              : updatedConversations[existingConvIndex].unreadCount,
        };
        return updatedConversations;
      } else {
        // Add new conversation
        return [
          ...prev,
          {
            id: otherUserId,
            user: otherUser,
            lastMessage: message,
            unreadCount:
              message.senderId !== user.id && !message.is_read ? 1 : 0,
          },
        ];
      }
    });
  };

  const value = {
    socket,
    connected,
    messages,
    conversations,
    sendMessage,
    fetchMessages,
    fetchConversations,
    joinRoom,
    leaveRoom,
    sendTyping,
    sendStopTyping,
    markMessagesAsRead,
  };

  return (
    <MessageSocketContext.Provider value={value}>
      {children}
    </MessageSocketContext.Provider>
  );
};
