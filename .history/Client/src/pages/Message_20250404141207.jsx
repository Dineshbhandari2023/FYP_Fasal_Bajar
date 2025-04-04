import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Menu,
  Phone,
  Video,
  MoreVertical,
  Search,
  Paperclip,
  Send,
} from "lucide-react";
import Sidebar from "./Sidebar";
import socket from "../sockets/messageSocket";
import { fetchConversations, fetchMessages } from "../Redux/slice/messageSlice";

const Message = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const currentUserId = Number(userInfo?.id);

  // Get conversations from Redux
  const { conversations, loading, error } = useSelector(
    (state) => state.messages
  );

  // Local state for active conversation and its messages
  // Here, activeConversation is the object representing the other party.
  const [activeConversation, setActiveConversation] = useState(null);
  const [activeMessages, setActiveMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);

  // Fetch conversations on mount
  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  // When a conversation is selected, fetch its messages using the other party’s id
  useEffect(() => {
    if (activeConversation) {
      // activeConversation is the other party object
      const receiverId = Number(activeConversation.id);
      dispatch(fetchMessages(receiverId))
        .unwrap()
        .then((fetchedMessages) => {
          setActiveMessages(fetchedMessages);
        })
        .catch((error) => {
          console.error("Failed to fetch messages:", error);
        });
    }
  }, [activeConversation, dispatch]);

  // Listen for new messages via Socket.IO
  useEffect(() => {
    const handleNewMessage = (data) => {
      if (activeConversation) {
        // Convert ids to numbers for accurate comparison.
        const otherPersonId = Number(activeConversation.id);
        const senderId = Number(data.sender.id || data.senderId);
        const receiverId = Number(data.receiver.id || data.receiverId);
        if (
          (senderId === otherPersonId && receiverId === currentUserId) ||
          (senderId === currentUserId && receiverId === otherPersonId)
        ) {
          setActiveMessages((prevMessages) => [...prevMessages, data]);
        }
      }
    };

    socket.on("new_message", handleNewMessage);
    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [activeConversation, currentUserId]);

  // Auto-scroll to the bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  // Handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && activeConversation) {
      // Convert the active conversation id to number to ensure consistency
      const receiverId = Number(activeConversation.id);
      socket.emit("send_message", {
        receiverId,
        content: message,
      });
      // Optimistically update local messages
      const newMsg = {
        id: Date.now(), // Temporary id for optimistic update
        sender: { id: currentUserId, username: userInfo.username },
        content: message,
        createdAt: new Date(),
      };
      setActiveMessages((prev) => [...prev, newMsg]);
      setMessage("");
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
    return (otherUser.username || "")
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
            return (
              <div
                key={conv.id}
                onClick={() => setActiveConversation(otherUser)}
                className={`flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                  activeConversation?.id === otherUser.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={otherUser.profileImage}
                    alt={otherUser.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {otherUser.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="ml-3 flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900">
                      {otherUser.username}
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
                      <img
                        src={otherUser.profileImage}
                        alt={otherUser.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {otherUser.online && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="ml-3">
                      <h2 className="font-medium text-gray-900">
                        {otherUser.username}
                      </h2>
                      <p className="text-xs text-green-500">
                        {otherUser.online ? "Online" : "Offline"}
                      </p>
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
            <div className="space-y-4">
              {activeMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    Number(msg.sender.id) === currentUserId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                      Number(msg.sender.id) === currentUserId
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                    }`}
                  >
                    <p>{msg.content || msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        Number(msg.sender.id) === currentUserId
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">
              Select a conversation to view messages
            </p>
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
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50"
                disabled={!message.trim()}
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
