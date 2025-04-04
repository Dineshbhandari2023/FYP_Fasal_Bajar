"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Menu,
  Phone,
  Video,
  MoreVertical,
  Search,
  Paperclip,
  Send,
  MessageSquare,
} from "lucide-react";
import Sidebar from "./Sidebar";
import socket from "../sockets/messageSocket";
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  markMessagesAsRead,
  addNewMessage,
} from "../Redux/slice/messageSlice";

const Message = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const currentUserId = Number(userInfo?.id);

  // Get conversations and messages from Redux
  const { conversations, messages, loading, error } = useSelector(
    (state) => state.messages
  );

  // Local state for active conversation and its messages
  const [activeConversation, setActiveConversation] = useState(null);
  const [activeMessages, setActiveMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

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
      socket.disconnect();
    };
  }, []);

  // Fetch conversations on mount
  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  // When a conversation is selected, fetch its messages using the other party's id
  useEffect(() => {
    if (activeConversation) {
      // activeConversation is the other party object
      const receiverId = Number(activeConversation.id);
      dispatch(fetchMessages(receiverId))
        .unwrap()
        .then((fetchedMessages) => {
          console.log("Fetched messages:", fetchedMessages);
          setActiveMessages(fetchedMessages);
          // Mark messages as read when conversation is opened
          if (activeConversation.unreadCount > 0) {
            dispatch(markMessagesAsRead(receiverId));
          }
        })
        .catch((error) => {
          console.error("Failed to fetch messages:", error);
        });
    }
  }, [activeConversation, dispatch]);

  // Listen for new messages via Socket.IO
  useEffect(() => {
    const handleNewMessage = (data) => {
      console.log("New message received via socket:", data);

      if (activeConversation) {
        // Convert ids to numbers for accurate comparison
        const otherPersonId = Number(activeConversation.id);
        const senderId = Number(
          data.senderId || (data.sender && data.sender.id)
        );
        const receiverId = Number(
          data.receiverId || (data.receiver && data.receiver.id)
        );

        if (
          (senderId === otherPersonId && receiverId === currentUserId) ||
          (senderId === currentUserId && receiverId === otherPersonId)
        ) {
          // Add the new message to the active conversation
          setActiveMessages((prevMessages) => {
            // Check if message already exists to avoid duplicates
            const messageExists = prevMessages.some(
              (msg) =>
                msg.id === data.id || (msg.tempId && msg.tempId === data.tempId)
            );

            if (messageExists) {
              return prevMessages.map((msg) =>
                msg.tempId && msg.tempId === data.tempId
                  ? { ...data, tempId: msg.tempId }
                  : msg
              );
            }

            return [...prevMessages, data];
          });

          // Mark message as read if it's from the other person
          if (senderId === otherPersonId) {
            dispatch(markMessagesAsRead(otherPersonId));
          }
        }
      }

      // Add message to Redux store
      dispatch(addNewMessage(data));

      // Refresh conversations list to update last message
      dispatch(fetchConversations());
    };

    socket.on("new_message", handleNewMessage);
    socket.on("message_sent", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("message_sent", handleNewMessage);
    };
  }, [activeConversation, currentUserId, dispatch]);

  // Auto-scroll to the bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  // Handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && activeConversation && !isSending) {
      setIsSending(true);

      // Convert the active conversation id to number to ensure consistency
      const receiverId = Number(activeConversation.id);

      // Create a temporary message for immediate display
      const tempId = Date.now();
      const tempMessage = {
        tempId,
        senderId: currentUserId,
        receiverId,
        content: message.trim(),
        createdAt: new Date().toISOString(),
        sender: {
          id: currentUserId,
          username: userInfo.username,
          profileImage: userInfo.profileImage,
        },
      };

      // Add temporary message to UI immediately
      setActiveMessages((prev) => [...prev, tempMessage]);

      // Clear input
      setMessage("");

      // Use Redux action to send message
      const messageData = {
        receiverId,
        content: tempMessage.content,
      };

      dispatch(sendMessage(messageData))
        .unwrap()
        .then((sentMessage) => {
          console.log("Message sent successfully:", sentMessage);

          // Replace temporary message with actual message
          setActiveMessages((prev) =>
            prev.map((msg) =>
              msg.tempId === tempId ? { ...sentMessage, tempId } : msg
            )
          );
        })
        .catch((error) => {
          console.error("Failed to send message:", error);
          // Mark the message as failed
          setActiveMessages((prev) =>
            prev.map((msg) =>
              msg.tempId === tempId ? { ...msg, failed: true } : msg
            )
          );
        })
        .finally(() => {
          setIsSending(false);
        });
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Filter conversations by search term using the other party's username
  const filteredConversations = (
    Array.isArray(conversations) ? conversations : []
  ).filter((conv) => {
    const otherUser = conv.user || conv.farmer;
    return (otherUser?.username || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} />

      {/* Conversations List */}
      <div
        className={`hidden md:block w-64 bg-white border-r border-gray-200 ml-64`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-80px)]">
          {loading && <p className="p-4">Loading conversations...</p>}
          {error && <p className="p-4 text-red-500">{error}</p>}
          {filteredConversations.map((conv) => {
            // The conversation object includes either a "user" or "farmer" field for the other party.
            const otherUser = conv.user || conv.farmer;
            if (!otherUser) return null;

            return (
              <div
                key={conv.id}
                onClick={() => setActiveConversation(otherUser)}
                className={`flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                  activeConversation?.id === otherUser.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="relative">
                  {otherUser.profileImage ? (
                    <img
                      src={`http://localhost:8000${otherUser.profileImage}`}
                      alt={otherUser.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {otherUser.username?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                  {conv.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conv.unreadCount}
                    </div>
                  )}
                </div>
                <div className="ml-3 flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900">
                      {otherUser.username || "Unknown User"}
                    </h3>
                    {conv.lastMessage && (
                      <span className="text-xs text-gray-500">
                        {new Date(
                          conv.lastMessage.createdAt
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                  {conv.lastMessage && (
                    <p className="text-sm text-gray-500 truncate">
                      {conv.lastMessage.content}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col md:ml-0">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center">
            <button
              className="md:hidden mr-4 text-gray-600"
              onClick={toggleMobileMenu}
            >
              <Menu size={24} />
            </button>
            {activeConversation ? (
              (() => {
                const otherUser = activeConversation;
                return (
                  <div className="flex items-center">
                    <div className="relative">
                      {otherUser.profileImage ? (
                        <img
                          src={`http://localhost:8000${otherUser.profileImage}`}
                          alt={otherUser.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {otherUser.username?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <h2 className="font-medium text-gray-900">
                        {otherUser.username || "Unknown User"}
                      </h2>
                    </div>
                  </div>
                );
              })()
            ) : (
              <p className="text-lg text-gray-900">Select a conversation</p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <Phone size={20} />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <Video size={20} />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Messages Display */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {activeConversation ? (
            activeMessages.length > 0 ? (
              <div className="space-y-4">
                {activeMessages.map((msg, index) => {
                  const senderId = Number(
                    msg.senderId || (msg.sender && msg.sender.id)
                  );
                  const isCurrentUser = senderId === currentUserId;

                  return (
                    <div
                      key={msg.id || msg.tempId || index}
                      className={`flex ${
                        isCurrentUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                          isCurrentUser
                            ? msg.failed
                              ? "bg-red-100 text-red-800 border border-red-200 rounded-br-none"
                              : "bg-blue-500 text-white rounded-br-none"
                            : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
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
                                setActiveMessages((prev) =>
                                  prev.filter((m) => m.tempId !== msg.tempId)
                                );
                                // Set the message content back in the input
                                setMessage(msg.content);
                              }}
                            >
                              Retry
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Send className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No messages yet
                </h3>
                <p className="text-gray-500 max-w-xs">
                  Send a message to start the conversation with{" "}
                  {activeConversation.username}.
                </p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Select a conversation
              </h3>
              <p className="text-gray-500 max-w-md">
                Choose a conversation from the list to start chatting.
              </p>
            </div>
          )}
        </div>

        {/* Message Input */}
        {activeConversation && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <form onSubmit={handleSendMessage} className="flex items-center">
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <Paperclip size={20} />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 mx-2 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className={`p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 ${
                  isSending ? "opacity-70" : ""
                }`}
                disabled={!message.trim() || isSending}
              >
                {isSending ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send size={20} />
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
