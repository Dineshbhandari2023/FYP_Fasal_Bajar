import React, { useState, useEffect } from "react";
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
import { useSelector } from "react-redux";

const Message = () => {
  // Get current user info from Redux (ensure your user slice stores an id field)
  const { userInfo } = useSelector((state) => state.user);
  const currentUserId = userInfo?.id;

  // Sample data for conversations list (replace with your dynamic data)
  const conversations = [
    {
      id: 1,
      name: "Sarah Wilson",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      lastMessage: "Sure, let's meet at 3 PM tomorrow...",
      time: "2m ago",
      online: true,
    },
    {
      id: 2,
      name: "Mike Johnson",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      lastMessage: "Did you check the latest design ...",
      time: "1h ago",
      online: false,
    },
  ];

  // For demonstration we assume conversation with Sarah Wilson is active.
  // In your production app, activeConversation should be set dynamically.
  const activeConversation =
    conversations.find((c) => c.id === 1) || conversations[0];

  // Manage messages locally for the active conversation.
  const [activeMessages, setActiveMessages] = useState([
    {
      id: 1,
      sender: "Sarah Wilson",
      text: "Hi! How are you doing today?",
      time: "10:30 AM",
      isSentByMe: false,
    },
    {
      id: 2,
      sender: "Me",
      text: "Hey! I'm doing great, thanks for asking!",
      time: "10:31 AM",
      isSentByMe: true,
    },
  ]);

  const [message, setMessage] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Listen for incoming messages from Socket.IO
  useEffect(() => {
    const handleNewMessage = (data) => {
      // Check if the incoming message is between the current user and the active conversation partner.
      // This assumes that currentUserId is the logged-in user's id and activeConversation.id is the other party's id.
      if (
        (data.sender.id === activeConversation.id &&
          data.receiver.id === currentUserId) ||
        (data.receiver.id === activeConversation.id &&
          data.sender.id === currentUserId)
      ) {
        setActiveMessages((prevMessages) => [
          ...prevMessages,
          {
            id: data.id,
            sender: data.sender.username,
            text: data.content,
            time: new Date(data.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isSentByMe: data.sender.id === currentUserId,
          },
        ]);
      }
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [activeConversation.id, currentUserId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Emit the send_message event with receiverId and content
      socket.emit("send_message", {
        receiverId: activeConversation.id,
        content: message,
      });
      // Optimistically update the local state with the sent message
      setActiveMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now(), // Temporary id for optimistic update
          sender: "Me",
          text: message,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isSentByMe: true,
        },
      ]);
      setMessage("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} />

      {/* Conversations list - visible on desktop */}
      <div className="hidden md:block w-64 bg-white border-r border-gray-200 ml-64">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-80px)]">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                activeConversation.id === conversation.id ? "bg-blue-50" : ""
              }`}
            >
              <div className="relative">
                <img
                  src={conversation.avatar}
                  alt={conversation.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {conversation.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="ml-3 flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900">
                    {conversation.name}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {conversation.time}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {conversation.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col md:ml-0">
        {/* Chat header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center">
            <button
              className="md:hidden mr-4 text-gray-600"
              onClick={toggleMobileMenu}
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center">
              <div className="relative">
                <img
                  src={activeConversation.avatar}
                  alt={activeConversation.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {activeConversation.online && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="ml-3">
                <h2 className="font-medium text-gray-900">
                  {activeConversation.name}
                </h2>
                <p className="text-xs text-green-500">
                  {activeConversation.online ? "Online" : "Offline"}
                </p>
              </div>
            </div>
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

        {/* Messages display area */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <div className="space-y-4">
            {activeMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.isSentByMe ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                    msg.isSentByMe
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.isSentByMe ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message input area */}
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
      </div>
    </div>
  );
};

export default Message;
