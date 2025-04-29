const notifyUser = (io, userId, eventName, data) => {
  io.to(`user:${userId}`).emit(eventName, data);
};

const notifyUsers = (io, userIds, eventName, data) => {
  userIds.forEach((userId) => {
    io.to(`user:${userId}`).emit(eventName, data);
  });
};

const notifyAll = (io, eventName, data) => {
  io.emit(eventName, data);
};

const notifyRoom = (io, room, eventName, data) => {
  io.to(room).emit(eventName, data);
};

module.exports = {
  notifyUser,
  notifyUsers,
  notifyAll,
  notifyRoom,
};
