import { motion } from "framer-motion";
import { User, Clock } from "lucide-react";

export function MessageList({
  conversations,
  loading,
  error,
  selectedId,
  onSelectConversation,
}) {
  // Format timestamp to relative time (e.g., "2 hours ago")
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

  // Get the other person's details (could be farmer or supplier)
  const getOtherPerson = (conversation) => {
    // Check all possible fields where the other person's info might be stored
    return (
      conversation.user || conversation.farmer || conversation.supplier || {}
    );
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6 text-center">
        <p className="text-red-500">Error loading conversations: {error}</p>
        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No conversations yet</p>
          <div className="flex flex-col space-y-2">
            <a
              href="/map"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Find Farmers
            </a>
            <a
              href="/map"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Find Suppliers
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conversation) => {
        // Get the other person in the conversation
        const otherPerson = getOtherPerson(conversation);
        const lastMessage = conversation.lastMessage;
        const hasUnread = conversation.unreadCount > 0;
        const role = otherPerson.role || "User";

        // Determine badge color based on role
        const roleBadgeColor =
          role.toLowerCase() === "farmer"
            ? "bg-green-100 text-green-800"
            : role.toLowerCase() === "supplier"
            ? "bg-blue-100 text-blue-800"
            : "bg-gray-100 text-gray-800";

        return (
          <motion.div
            key={conversation.id}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedId === conversation.id ? "bg-green-50" : ""
            } ${hasUnread ? "bg-green-50/50" : ""}`}
            onClick={() => onSelectConversation(conversation)}
            whileHover={{ backgroundColor: "rgba(236, 253, 245, 0.6)" }}
            whileTap={{ backgroundColor: "rgba(236, 253, 245, 0.8)" }}
          >
            <div className="flex items-center">
              <div className="relative">
                {otherPerson?.profileImage ? (
                  <img
                    src={`http://localhost:8000${otherPerson.profileImage}`}
                    alt={otherPerson.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                )}
                {hasUnread && (
                  <span className="absolute -top-1 -right-1 bg-green-600 rounded-full w-4 h-4"></span>
                )}
              </div>

              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center">
                    <h3 className="font-medium text-gray-900 truncate">
                      {otherPerson?.username || "Unknown User"}
                    </h3>
                    <span
                      className={`ml-2 text-xs px-2 py-0.5 rounded-full ${roleBadgeColor}`}
                    >
                      {role}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatRelativeTime(lastMessage?.createdAt)}
                  </span>
                </div>
                <p
                  className={`text-sm truncate ${
                    hasUnread ? "font-medium text-gray-900" : "text-gray-500"
                  }`}
                >
                  {lastMessage?.content || "No messages yet"}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
