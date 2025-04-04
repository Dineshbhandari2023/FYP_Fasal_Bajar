const express = require("express");
const router = express.Router();
const { protect } = require("../Util/jwt");
const {
  getMessages,
  sendMessage,
  getConversations,
  markMessagesAsRead,
} = require("../Controllers/messageController");

// Get all conversations for the current user
router.get("/conversations", protect, getConversations);

// Get messages between current user and another user
router.get("/:userId", protect, getMessages);

// Send a new message
router.post("/", protect, sendMessage);

// Mark messages as read
router.put("/read/:userId", protect, markMessagesAsRead);

module.exports = router;
