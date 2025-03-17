/**
 * Socket.IO Utility Functions
 *
 * This file contains helper functions for Socket.IO integration
 */

// Send notification to a specific user
const notifyUser = (io, userId, eventName, data) => {
  io.to(`user:${userId}`).emit(eventName, data);
};

// Send notification to multiple users
const notifyUsers = (io, userIds, eventName, data) => {
  userIds.forEach((userId) => {
    io.to(`user:${userId}`).emit(eventName, data);
  });
};

// Send notification to all connected clients
const notifyAll = (io, eventName, data) => {
  io.emit(eventName, data);
};

// Send notification to all clients in a room
const notifyRoom = (io, room, eventName, data) => {
  io.to(room).emit(eventName, data);
};

module.exports = {
  notifyUser,
  notifyUsers,
  notifyAll,
  notifyRoom,
};
