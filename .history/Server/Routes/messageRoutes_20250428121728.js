const express = require("express");
const router = express.Router();
const { authMiddleWare } = require("../Util/jwt");
const {
  getMessages,
  sendMessage,
  getConversations,
  markMessagesAsRead,
} = require("../Controllers/messageController");

router.get("/conversations", authMiddleWare, getConversations);
router.get("/:userId", authMiddleWare, getMessages);
router.post("/", authMiddleWare, sendMessage);
router.put("/read/:userId", authMiddleWare, markMessagesAsRead);

module.exports = router;
