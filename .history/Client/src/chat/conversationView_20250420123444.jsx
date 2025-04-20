import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { ArrowLeft, Send, User } from "lucide-react";
import {
  sendMessage,
  fetchMessages,
  markMessagesAsRead,
} from "../Redux/slice/messageSlice";
import socket from "../sockets/messageSocket";

export function ConversationView({ conversation, currentUser, onBack }) {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Use the conversation's "user" field if available; otherwise fallback to "farmer"
  const otherPerson = conversation.user || conversation.farmer;
  const otherPersonId = Number(otherPerson?.id);
  const currentUserId = Number(currentUser.id);

  // Connect to socket when component mounts
  useEffect(() => {
    // Make sure socket is connected
    if (!socket.connected) {
      // Set auth token before connecting
      const token = localStorage.getItem("accessToken");
      if (token) {
        socket.auth = { token };
      }
      socket.connect();
    }

    // Disconnect socket when component unmounts
    return () => {
      // Don't disconnect as it might be used elsewhere
      // Just remove listeners
    };
  }, []);

  // Fetch messages when the conversation changes
  useEffect(() => {
    if (otherPersonId) {
      setLoading(true);
      dispatch(fetchMessages(otherPersonId))
        .unwrap()
        .then((fetchedMessages) => {
          console.log("Fetched messages:", fetchedMessages);
          setMessages(fetchedMessages);
          setLoading(false);
          // Mark as read if there are unread messages
          if (conversation.unreadCount > 0) {
            dispatch(markMessagesAsRead(otherPersonId));
          }
        })
        .catch((error) => {
          console.error("Failed to fetch messages:", error);
          setLoading(false);
        });
    }
  }, [dispatch, otherPersonId, conversation]);

  // Listen for new messages via Socket.IO
  useEffect(() => {
    const handleNewMessage = (message) => {
      console.log("Received new message:", message);
      const senderId = Number(message.senderId);
      const receiverId = Number(message.receiverId);
      if (
        (senderId === otherPersonId && receiverId === currentUserId) ||
        (senderId === currentUserId && receiverId === otherPersonId)
      ) {
        // Check if message already exists to avoid duplicates
        setMessages((prev) => {
          const messageExists = prev.some(
            (msg) =>
              msg.id === message.id ||
              (msg.tempId && msg.tempId === message.tempId)
          );

          if (messageExists) {
            return prev.map((msg) =>
              msg.tempId && msg.tempId === message.tempId
                ? { ...message, tempId: msg.tempId }
                : msg
            );
          }

          return [...prev, message];
        });

        // Mark as read if message comes from the other party
        if (senderId === otherPersonId) {
          dispatch(markMessagesAsRead(otherPersonId));
        }
      }
    };

    const handleMessageSent = (message) => {
      console.log("Message sent confirmation:", message);

      const receiverId = Number(message.receiverId);

      if (receiverId === otherPersonId) {
        // Update the sending status of the message
        setMessages((prevMessages) => {
          // Find if we have a temporary version of this message
          const tempIndex = prevMessages.findIndex(
            (msg) => msg.tempId && msg.content === message.content
          );

          if (tempIndex >= 0) {
            // Replace the temp message with the confirmed one
            const newMessages = [...prevMessages];
            newMessages[tempIndex] = {
              ...message,
              tempId: prevMessages[tempIndex].tempId,
            };
            return newMessages;
          } else {
            // Just add the new message
            return [...prevMessages, message];
          }
        });
      }
    };

    socket.on("new_message", handleNewMessage);
    socket.on("message_sent", handleMessageSent);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("message_sent", handleMessageSent);
    };
  }, [dispatch, otherPersonId, currentUserId]);

  // Auto-scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);

    // Create a temporary message for immediate display
    const tempId = Date.now();
    const tempMessage = {
      tempId,
      senderId: currentUserId,
      receiverId: otherPersonId,
      content: newMessage.trim(),
      createdAt: new Date().toISOString(),
      sender: {
        id: currentUserId,
        username: currentUser.username,
        profileImage: currentUser.profileImage,
      },
    };

    // Add temporary message to UI immediately
    setMessages((prev) => [...prev, tempMessage]);

    // Clear input
    setNewMessage("");

    // Use socket to send message for real-time delivery
    socket.emit("send_message", {
      receiverId: otherPersonId,
      content: tempMessage.content,
    });

    // Also use Redux action as a fallback
    dispatch(
      sendMessage({
        receiverId: otherPersonId,
        content: tempMessage.content,
      })
    )
      .unwrap()
      .catch((error) => {
        console.error("Failed to send message via API:", error);
        // Mark the message as failed if both socket and API fail
        setMessages((prev) =>
          prev.map((msg) =>
            msg.tempId === tempId ? { ...msg, failed: true } : msg
          )
        );
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center">
        {onBack && (
          <button
            onClick={onBack}
            className="mr-2 p-1 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        {otherPerson?.profileImage ? (
          <img
            src={`http://localhost:8000${otherPerson.profileImage}`}
            alt={otherPerson.username}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <User className="h-5 w-5 text-green-600" />
          </div>
        )}
        <div className="ml-3">
          <h3 className="font-medium text-gray-900">
            {otherPerson?.username || "Unknown User"}
          </h3>
          <p className="text-xs text-gray-500">{otherPerson?.role || "User"}</p>
        </div>
      </div>

      {/* Messages Display */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Send className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No messages yet
            </h3>
            <p className="text-gray-500 max-w-xs">
              Send a message to start the conversation with{" "}
              {otherPerson?.username}.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, index) => {
              const isCurrentUser = Number(msg.senderId) === currentUserId;
              return (
                <motion.div
                  key={msg.id || msg.tempId || index}
                  className={`flex ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      isCurrentUser
                        ? msg.failed
                          ? "bg-red-100 text-red-800 border border-red-200 rounded-br-none"
                          : "bg-blue-500 text-white rounded-br-none"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <div className="flex items-center justify-end mt-1">
                      <p
                        className={`text-xs ${
                          isCurrentUser
                            ? msg.failed
                              ? "text-red-500"
                              : "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {msg.failed ? "Failed to send - " : ""}
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {msg.failed && (
                        <button
                          className="ml-2 text-xs text-red-700 hover:text-red-900"
                          onClick={() => {
                            // Remove failed message
                            setMessages((prev) =>
                              prev.filter((m) => m.tempId !== msg.tempId)
                            );
                            // Set the message content back in the input
                            setNewMessage(msg.content);
                          }}
                        >
                          Retry
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-200"
      >
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-l-lg border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="bg-green-600 text-white rounded-r-lg px-4 py-2 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ConversationView;
