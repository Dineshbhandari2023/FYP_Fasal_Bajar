const express = require("express");
const router = express.Router();
const { authMiddleWare } = require("../Util/jwt");
const {
  getMessages,
  sendMessage,
  getConversations,
  markMessagesAsRead,
} = require("../Controllers/messageController");

// Get all conversations for the current user
router.get("/conversations", authMiddleWare, getConversations);

// Get messages between current user and another user
router.get("/:userId", authMiddleWare, getMessages);

// Send a new message
router.post("/", authMiddleWare, sendMessage);

// Mark messages as read
router.put("/read/:userId", authMiddleWare, markMessagesAsRead);

module.exports = router;
