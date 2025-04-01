import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Bell, X, CheckCircle, AlertCircle, MessageSquare } from "lucide-react";
import { io } from "socket.io-client";

// Notification component to add to your Settings page
const ReviewNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { userInfo, accessToken } = useSelector((state) => state.user);

  // Server URL - make sure it matches your server configuration
  const SERVER_URL = "http://localhost:8000";

  useEffect(() => {
    if (!userInfo || !accessToken) return;

    // Connect to the main socket
    const socket = io(SERVER_URL, {
      auth: {
        token: accessToken,
      },
    });

    // Connect to the reviews namespace
    const reviewSocket = io(`${SERVER_URL}/reviews`, {
      auth: {
        token: accessToken,
      },
    });

    // If the user is a farmer, join their own review room to listen for new reviews
    if (userInfo.role === "Farmer") {
      reviewSocket.emit("join_farmer_room", userInfo.id);
    }

    // Listen for new reviews (for farmers)
    reviewSocket.on("new_review", (review) => {
      const newNotification = {
        id: Date.now(),
        type: "new_review",
        message: `${review.user.username} left you a new review`,
        details: review,
        read: false,
        time: new Date(),
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    // Listen for user-specific notifications about their reviews
    socket.on("review_submitted", (data) => {
      const newNotification = {
        id: Date.now(),
        type: "review_submitted",
        message: "Your review was submitted successfully",
        details: data.review,
        read: false,
        time: new Date(),
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    socket.on("review_updated", (data) => {
      const newNotification = {
        id: Date.now(),
        type: "review_updated",
        message: "Your review was updated successfully",
        details: data.review,
        read: false,
        time: new Date(),
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    socket.on("review_deleted", (data) => {
      const newNotification = {
        id: Date.now(),
        type: "review_deleted",
        message: "Your review was deleted successfully",
        details: { reviewId: data.reviewId },
        read: false,
        time: new Date(),
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    // Clean up
    return () => {
      if (userInfo.role === "Farmer") {
        reviewSocket.emit("leave_farmer_room", userInfo.id);
      }
      reviewSocket.disconnect();
      socket.disconnect();
    };
  }, [userInfo, accessToken]);

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const dismissNotification = (notificationId) => {
    const notification = notifications.find((n) => n.id === notificationId);
    if (notification && !notification.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "new_review":
        return <MessageSquare size={16} className="text-[#2A3B2A]" />;
      case "review_submitted":
      case "review_updated":
        return <CheckCircle size={16} className="text-green-500" />;
      case "review_deleted":
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={toggleNotifications}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell size={20} className="text-[#2A3B2A]" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-lg shadow-lg z-50 border">
          <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
            <h3 className="font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-[#2A3B2A] hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 hover:bg-gray-50 ${
                    !notification.read ? "bg-blue-50" : ""
                  } relative`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start">
                    <div className="mt-1 mr-3">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTime(notification.time)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissNotification(notification.id);
                      }}
                      className="text-gray-400 hover:text-gray-600 ml-2"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewNotifications;
