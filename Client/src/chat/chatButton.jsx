// src/components/chatButton.jsx
import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function ChatButton() {
  const { conversations } = useSelector((state) => state.messages);
  const [unreadCount, setUnreadCount] = useState(0);

  // Calculate unread messages
  useEffect(() => {
    const conversationArray = Array.isArray(conversations) ? conversations : [];
    const count = conversationArray.reduce((total, conversation) => {
      return total + (conversation.unreadCount || 0);
    }, 0);
    setUnreadCount(count);
  }, [conversations]);

  return (
    <Link to="/messages" className="relative">
      <motion.button
        className="p-2 rounded-full hover:text-green-900 text-white hover:bg-gray-100 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageSquare className="h-5 w-5" />
        {unreadCount > 0 && (
          <motion.span
            className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            {unreadCount}
          </motion.span>
        )}
      </motion.button>
    </Link>
  );
}
