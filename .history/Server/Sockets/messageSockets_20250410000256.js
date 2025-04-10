const { Message, User } = require("../Models/index");

const setupMessageSocket = (io) => {
  const messageNamespace = io.of("/messages");

  messageNamespace.use((socket, next) => {
    if (socket.user?.user_id || socket.user?.id) {
      next();
    } else {
      next(new Error("Authentication error"));
    }
  });

  messageNamespace.on("connection", (socket) => {
    const userId = socket.user.user_id || socket.user.id;
    console.log(`User ${userId} connected to message socket`);

    // Join user's personal room
    socket.join(`user:${userId}`);

    // Handle joining a conversation room
    socket.on("join_room", ({ roomId }) => {
      if (roomId) {
        console.log(`User ${userId} joining room: ${roomId}`);
        socket.join(roomId);
      }
    });

    // Handle leaving a conversation room
    socket.on("leave_room", ({ roomId }) => {
      if (roomId) {
        console.log(`User ${userId} leaving room: ${roomId}`);
        socket.leave(roomId);
      }
    });

    // Handle sending messages
    socket.on("send_message", async (data) => {
      try {
        const { receiverId, content, roomId } = data;

        if (!receiverId || !content) {
          socket.emit("error", { message: "Missing required fields" });
          return;
        }

        // Create message in database
        const message = await Message.create({
          senderId: userId,
          receiverId,
          content,
        });

        // Fetch complete message with user details
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

        // If roomId is provided, emit to the room
        if (roomId) {
          socket.to(roomId).emit("new_message", completeMessage);
        } else {
          // Fallback to user's personal room
          socket.to(`user:${receiverId}`).emit("new_message", completeMessage);
        }

        // Send back to sender for confirmation
        socket.emit("message_sent", completeMessage);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Handle typing indicators
    socket.on("typing", (data) => {
      const { receiverId, roomId } = data;

      if (roomId) {
        socket.to(roomId).emit("user_typing", { userId });
      } else {
        socket.to(`user:${receiverId}`).emit("user_typing", { userId });
      }
    });

    // Handle stop typing
    socket.on("stop_typing", (data) => {
      const { receiverId, roomId } = data;

      if (roomId) {
        socket.to(roomId).emit("user_stop_typing", { userId });
      } else {
        socket.to(`user:${receiverId}`).emit("user_stop_typing", { userId });
      }
    });

    // Handle read receipts
    socket.on("mark_read", async (data) => {
      try {
        const { messageIds } = data;

        if (!messageIds || !Array.isArray(messageIds)) {
          return;
        }

        await Message.update(
          { is_read: true },
          {
            where: {
              id: messageIds,
              receiverId: userId,
            },
          }
        );

        // Notify the sender that messages were read
        const messages = await Message.findAll({
          where: { id: messageIds },
        });

        const senderIds = [...new Set(messages.map((msg) => msg.senderId))];

        senderIds.forEach((senderId) => {
          const readMessageIds = messages
            .filter((msg) => msg.senderId === senderId)
            .map((msg) => msg.id);

          socket.to(`user:${senderId}`).emit("messages_read", {
            reader: userId,
            messageIds: readMessageIds,
          });
        });
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected from message socket`);
    });
  });

  return messageNamespace;
};

module.exports = setupMessageSocket;
