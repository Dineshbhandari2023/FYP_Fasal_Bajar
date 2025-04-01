const { notifyUser, notifyRoom } = require("../Util/socketUtils");

/**
 * Review Socket Handler
 * Manages all socket events related to reviews
 */
function setupReviewSocket(io) {
  // Namespace for review-related events
  const reviewNamespace = io.of("/reviews");

  reviewNamespace.on("connection", (socket) => {
    console.log(`Client connected to reviews namespace: ${socket.id}`);

    // Join a farmer's review room
    socket.on("join_farmer_room", (farmerId) => {
      const room = `farmer:${farmerId}:reviews`;
      socket.join(room);
      console.log(`Client ${socket.id} joined room: ${room}`);
    });

    // Leave a farmer's review room
    socket.on("leave_farmer_room", (farmerId) => {
      const room = `farmer:${farmerId}:reviews`;
      socket.leave(room);
      console.log(`Client ${socket.id} left room: ${room}`);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`Client disconnected from reviews namespace: ${socket.id}`);
    });
  });

  return {
    // Emit new review to all clients in the farmer's review room
    emitNewReview: (farmerId, review) => {
      const room = `farmer:${farmerId}:reviews`;
      reviewNamespace.to(room).emit("new_review", review);
    },

    // Emit updated review to all clients in the farmer's review room
    emitUpdatedReview: (farmerId, review) => {
      const room = `farmer:${farmerId}:reviews`;
      reviewNamespace.to(room).emit("update_review", review);
    },

    // Emit deleted review to all clients in the farmer's review room
    emitDeletedReview: (farmerId, reviewId) => {
      const room = `farmer:${farmerId}:reviews`;
      reviewNamespace.to(room).emit("delete_review", reviewId);
    },

    // Notify a specific user about their review status
    notifyReviewAuthor: (userId, eventName, data) => {
      notifyUser(io, userId, eventName, data);
    },
  };
}

module.exports = setupReviewSocket;
