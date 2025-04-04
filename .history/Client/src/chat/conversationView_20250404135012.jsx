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
  const messagesEndRef = useRef(null);

  // Determine the other party – conversation may include either a "farmer" or "user"
  const otherPerson = conversation.farmer || conversation.user;
  const otherPersonId = Number(otherPerson?.id);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (otherPersonId) {
      setLoading(true);
      dispatch(fetchMessages(otherPersonId))
        .unwrap()
        .then((fetchedMessages) => {
          console.log("Fetched messages:", fetchedMessages);
          setMessages(fetchedMessages);
          setLoading(false);

          // Mark messages as read if there are any unread ones
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

  // Listen for new messages via socket
  useEffect(() => {
    const handleNewMessage = (message) => {
      console.log("Received new message via socket:", message);
      // Cast IDs to numbers for accurate comparisons
      const senderId = Number(message.senderId);
      const receiverId = Number(message.receiverId);
      const currentUserId = Number(currentUser.id);

      if (
        (senderId === otherPersonId && receiverId === currentUserId) ||
        (senderId === currentUserId && receiverId === otherPersonId)
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);

        // Mark as read if the message is from the other person
        if (senderId === otherPersonId) {
          dispatch(markMessagesAsRead(otherPersonId));
        }
      }
    };

    socket.on("new_message", handleNewMessage);
    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [dispatch, otherPersonId, currentUser.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      receiverId: otherPersonId,
      content: newMessage.trim(),
    };

    dispatch(sendMessage(messageData))
      .unwrap()
      .then((sentMessage) => {
        setMessages((prevMessages) => [...prevMessages, sentMessage]);
        setNewMessage("");
      })
      .catch((error) => {
        console.error("Failed to send message:", error);
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

      {/* Messages */}
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
            {messages.map((message, index) => {
              const isCurrentUser =
                Number(message.senderId) === Number(currentUser.id);
              return (
                <motion.div
                  key={message.id || index}
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
                        ? "bg-green-600 text-white"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isCurrentUser ? "text-green-100" : "text-gray-500"
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
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
            disabled={!newMessage.trim()}
            className="bg-green-600 text-white rounded-r-lg px-4 py-2 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
