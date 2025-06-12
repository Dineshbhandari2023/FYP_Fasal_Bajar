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

    socket.join(`user:${userId}`);

    socket.on("join_room", ({ roomId }) => {
      if (roomId) {
        console.log(`User ${userId} joining room: ${roomId}`);
        socket.join(roomId);
      }
    });

    socket.on("leave_room", ({ roomId }) => {
      if (roomId) {
        console.log(`User ${userId} leaving room: ${roomId}`);
        socket.leave(roomId);
      }
    });

    socket.on("send_message", async (data) => {
      try {
        const { receiverId, content, roomId } = data;

        if (!receiverId || !content) {
          socket.emit("error", { message: "Missing required fields" });
          return;
        }

        const message = await Message.create({
          senderId: userId,
          receiverId,
          content,
        });

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
        
        if (roomId) {
          socket.to(roomId).emit("new_message", completeMessage);
        } else {
          socket.to(`user:${receiverId}`).emit("new_message", completeMessage);
        }

        socket.emit("message_sent", completeMessage);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("typing", (data) => {
      const { receiverId, roomId } = data;

      if (roomId) {
        socket.to(roomId).emit("user_typing", { userId });
      } else {
        socket.to(`user:${receiverId}`).emit("user_typing", { userId });
      }
    });

    socket.on("stop_typing", (data) => {
      const { receiverId, roomId } = data;

      if (roomId) {
        socket.to(roomId).emit("user_stop_typing", { userId });
      } else {
        socket.to(`user:${receiverId}`).emit("user_stop_typing", { userId });
      }
    });

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

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected from message socket`);
    });
  });

  return messageNamespace;
};

module.exports = setupMessageSocket;
