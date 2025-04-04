const asyncHandler = require("express-async-handler");
const { Message, User } = require("../Models/index");
const { Op } = require("sequelize");

// @desc    Get all messages between two users
// @route   GET /api/messages/:userId
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.user_id;

  // Validate that both users exist
  const [currentUser, otherUser] = await Promise.all([
    User.findByPk(currentUserId),
    User.findByPk(userId),
  ]);

  if (!currentUser || !otherUser) {
    res.status(404);
    throw new Error("User not found");
  }

  // Get messages between the two users
  const messages = await Message.findAll({
    where: {
      [Op.or]: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId },
      ],
    },
    order: [["createdAt", "ASC"]],
    include: [
      {
        model: User,
        as: "sender",
        attributes: ["id", "username", "profileImage"],
      },
      {
        model: User,
        as: "receiver",
        attributes: ["id", "username", "profileImage"],
      },
    ],
  });

  res.status(200).json(messages);
});

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, content } = req.body;
  const senderId = req.user.user_id;

  if (!receiverId || !content) {
    res.status(400);
    throw new Error("Please provide receiverId and content");
  }

  // Check if receiver exists
  const receiver = await User.findByPk(receiverId);
  if (!receiver) {
    res.status(404);
    throw new Error("Receiver not found");
  }

  // Create the message
  const message = await Message.create({
    senderId,
    receiverId,
    content,
  });

  // Fetch the complete message with sender and receiver info
  const completeMessage = await Message.findByPk(message.id, {
    include: [
      {
        model: User,
        as: "sender",
        attributes: ["id", "username", "profileImage"],
      },
      {
        model: User,
        as: "receiver",
        attributes: ["id", "username", "profileImage"],
      },
    ],
  });

  // Emit the message via Socket.IO
  const io = req.app.get("io");
  io.to(`user:${receiverId}`).emit("new_message", completeMessage);

  res.status(201).json(completeMessage);
});

// @desc    Get user conversations
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = asyncHandler(async (req, res) => {
  const userId = req.user.user_id;

  // Get all messages where the user is either sender or receiver
  const messages = await Message.findAll({
    where: {
      [Op.or]: [{ senderId: userId }, { receiverId: userId }],
    },
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: User,
        as: "sender",
        attributes: ["id", "username", "profileImage"],
      },
      {
        model: User,
        as: "receiver",
        attributes: ["id", "username", "profileImage"],
      },
    ],
  });

  // Extract unique conversations
  const conversations = {};
  messages.forEach((message) => {
    const otherUserId =
      message.senderId === userId ? message.receiverId : message.senderId;
    const otherUser =
      message.senderId === userId ? message.receiver : message.sender;

    if (!conversations[otherUserId]) {
      conversations[otherUserId] = {
        user: otherUser,
        lastMessage: message,
        unreadCount: message.senderId !== userId && !message.read ? 1 : 0,
      };
    } else if (
      message.createdAt > conversations[otherUserId].lastMessage.createdAt
    ) {
      conversations[otherUserId].lastMessage = message;
      if (message.senderId !== userId && !message.read) {
        conversations[otherUserId].unreadCount += 1;
      }
    } else if (message.senderId !== userId && !message.read) {
      conversations[otherUserId].unreadCount += 1;
    }
  });

  res.status(200).json(Object.values(conversations));
});

// @desc    Mark messages as read
// @route   PUT /api/messages/read/:userId
// @access  Private
const markMessagesAsRead = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.user_id;

  await Message.update(
    { read: true },
    {
      where: {
        senderId: userId,
        receiverId: currentUserId,
        read: false,
      },
    }
  );

  res.status(200).json({ success: true });
});

module.exports = {
  getMessages,
  sendMessage,
  getConversations,
  markMessagesAsRead,
};
