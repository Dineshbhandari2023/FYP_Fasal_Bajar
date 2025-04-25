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
  ArrowLeft,
} from "lucide-react";
import Sidebar from "./Sidebar";
import socket from "../sockets/messageSocket";
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  markMessagesAsRead,
} from "../Redux/slice/messageSlice";

const Message = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const currentUserId = Number(userInfo?.id);

  // Get conversations from Redux
  const { conversations, loading, error } = useSelector(
    (state) => state.messages
  );

  // Local state for active conversation and its messages
  const [activeConversation, setActiveConversation] = useState(null);
  const [activeMessages, setActiveMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showMobileConversation, setShowMobileConversation] = useState(false);
  const messagesEndRef = useRef(null);

  // Check if device is mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

    // Listen for socket connection events
    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
    };

    const handleDisconnect = (reason) => {
      console.log("Socket disconnected:", reason);
    };

    const handleConnectError = (error) => {
      console.error("Socket connection error:", error);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    // Disconnect socket when component unmounts
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
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

      // Join room for this conversation
      const roomId = createRoomId(currentUserId, receiverId);
      socket.emit("join_room", { roomId });

      dispatch(fetchMessages(receiverId))
        .unwrap()
        .then((fetchedMessages) => {
          console.log("Fetched messages:", fetchedMessages);
          setActiveMessages(fetchedMessages);
          // Mark messages as read when conversation is opened
          if (activeConversation.unreadCount > 0) {
            dispatch(markMessagesAsRead(receiverId));
          }

          // Show conversation on mobile
          if (isMobile) {
            setShowMobileConversation(true);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch messages:", error);
        });
    }
  }, [activeConversation, dispatch, currentUserId, isMobile]);

  // Create a consistent room ID for two users
  const createRoomId = (user1Id, user2Id) => {
    // Always put the smaller ID first to ensure consistency
    return [Math.min(user1Id, user2Id), Math.max(user1Id, user2Id)].join("-");
  };

  // Listen for new messages via Socket.IO
  useEffect(() => {
    const handleNewMessage = (message) => {
      console.log("New message received via socket:", message);

      if (activeConversation) {
        // Convert ids to numbers for accurate comparison
        const otherPersonId = Number(activeConversation.id);
        const senderId = Number(message.senderId);
        const receiverId = Number(message.receiverId);

        if (
          (senderId === otherPersonId && receiverId === currentUserId) ||
          (senderId === currentUserId && receiverId === otherPersonId)
        ) {
          // Add the new message to the active conversation
          setActiveMessages((prevMessages) => [...prevMessages, message]);

          // Mark message as read if it's from the other person
          if (senderId === otherPersonId) {
            dispatch(markMessagesAsRead(otherPersonId));
          }
        }
      }

      // Refresh conversations list to update last message
      dispatch(fetchConversations());
    };

    const handleMessageSent = (message) => {
      console.log("Message sent confirmation:", message);

      if (activeConversation) {
        const otherPersonId = Number(activeConversation.id);
        const receiverId = Number(message.receiverId);

        if (receiverId === otherPersonId) {
          // Update the sending status of the message
          setActiveMessages((prevMessages) => {
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
      }
    };

    socket.on("new_message", handleNewMessage);
    socket.on("message_sent", handleMessageSent);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("message_sent", handleMessageSent);
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

      // Create room ID for this conversation
      const roomId = createRoomId(currentUserId, receiverId);

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

      // Use socket to send message for real-time delivery
      socket.emit("send_message", {
        roomId,
        receiverId,
        content: tempMessage.content,
      });

      // Also use Redux action as a fallback
      dispatch(
        sendMessage({
          receiverId,
          content: tempMessage.content,
        })
      )
        .unwrap()
        .catch((error) => {
          console.error("Failed to send message via API:", error);
          // Mark the message as failed if both socket and API fail
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

  // Handle back button on mobile
  const handleBackToList = () => {
    setShowMobileConversation(false);
    setActiveConversation(null);
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

  // Format timestamp to relative time
  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return "";

    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - messageTime) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return messageTime.toLocaleDateString();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} />

      {/* Conversations List */}
      <div
        className={`${
          isMobile && showMobileConversation ? "hidden" : "block"
        } w-full md:w-64 bg-white border-r border-gray-200 md:ml-64`}
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
          {loading && (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
          )}

          {error && (
            <div className="p-4 text-center">
              <p className="text-red-500 mb-2">Error loading conversations</p>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                onClick={() => dispatch(fetchConversations())}
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && filteredConversations.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No conversations yet
              </h3>
              <p className="text-gray-500 mb-4">
                Start chatting with farmers or buyers
              </p>
            </div>
          )}

          {filteredConversations.map((conv) => {
            // The conversation object includes either a "user" or "farmer" field for the other party.
            const otherUser = conv.user || conv.farmer;
            if (!otherUser) return null;

            return (
              <div
                key={conv.id}
                onClick={() => setActiveConversation(otherUser)}
                className={`flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                  activeConversation?.id === otherUser.id ? "bg-green-50" : ""
                } ${conv.unreadCount > 0 ? "bg-green-50/50" : ""}`}
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
                    <div className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
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
                        {formatRelativeTime(conv.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  {conv.lastMessage && (
                    <p
                      className={`text-sm truncate ${
                        conv.unreadCount > 0
                          ? "font-medium text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
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
      <div
        className={`${
          isMobile && !showMobileConversation ? "hidden" : "flex"
        } flex-1 flex-col md:ml-0`}
      >
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center">
            {isMobile && (
              <button className="mr-4 text-gray-600" onClick={handleBackToList}>
                <ArrowLeft size={24} />
              </button>
            )}
            {!isMobile && (
              <button
                className="md:hidden mr-4 text-gray-600"
                onClick={toggleMobileMenu}
              >
                <Menu size={24} />
              </button>
            )}
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
                      <p className="text-xs text-gray-500">
                        {otherUser.role || "User"}
                      </p>
                    </div>
                  </div>
                );
              })()
            ) : (
              <p className="text-lg text-gray-900">Select a conversation</p>
            )}
          </div>
          {/* {activeConversation && (
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
          )} */}
        </div>

        {/* Messages Display */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {activeConversation ? (
            activeMessages.length > 0 ? (
              <div className="space-y-4">
                {activeMessages.map((msg, index) => {
                  // Convert IDs to numbers to ensure consistent comparison
                  const senderId = Number(
                    msg.senderId || (msg.sender && msg.sender.id)
                  );
                  // Check if the message is from the current user
                  const isCurrentUser = senderId === currentUserId;

                  return (
                    <div
                      key={msg.id || msg.tempId || index}
                      className={`flex ${
                        isCurrentUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      {/* Message bubble with different styling for sent vs received */}
                      <div
                        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                          isCurrentUser
                            ? msg.failed
                              ? "bg-red-100 text-red-800 border border-red-200 rounded-br-none"
                              : "bg-green-600 text-white rounded-br-none"
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
                                  : "text-green-100"
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
                className="flex-1 mx-2 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className={`p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 ${
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
