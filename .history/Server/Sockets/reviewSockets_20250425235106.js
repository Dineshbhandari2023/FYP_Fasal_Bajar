const { Review, User } = require("../Models/index");

class ReviewSocket {
  constructor(io) {
    this.io = io.of("/reviews");
    this.setupSocket();
  }

  setupSocket() {
    this.io.use((socket, next) => {
      if (socket.handshake.auth && socket.handshake.auth.token) {
        // Add your token validation logic here if needed
        next();
      } else {
        next(new Error("Authentication error"));
      }
    });

    this.io.on("connection", (socket) => {
      console.log("User connected to review socket:", socket.id);

      socket.on("join_farmer_room", (farmerId) => {
        socket.join(`farmer:${farmerId}`);
        console.log(`User joined farmer room: farmer:${farmerId}`);
      });

      socket.on("leave_farmer_room", (farmerId) => {
        socket.leave(`farmer:${farmerId}`);
        console.log(`User left farmer room: farmer:${farmerId}`);
      });

      socket.on("join_supplier_room", (supplierId) => {
        socket.join(`supplier:${supplierId}`);
        console.log(`User joined supplier room: supplier:${supplierId}`);
      });

      socket.on("leave_supplier_room", (supplierId) => {
        socket.leave(`supplier:${supplierId}`);
        console.log(`User left supplier room: supplier:${supplierId}`);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected from review socket:", socket.id);
      });
    });
  }

  emitNewReview(entityId, review) {
    const room = review.farmerId
      ? `farmer:${entityId}`
      : `supplier:${entityId}`;
    this.io.to(room).emit("new_review", review);
  }

  emitUpdatedReview(entityId, review) {
    const room = review.farmerId
      ? `farmer:${entityId}`
      : `supplier:${entityId}`;
    this.io.to(room).emit("update_review", review);
  }

  emitDeletedReview(entityId, entityType, reviewId) {
    const room =
      entityType === "Farmer" ? `farmer:${entityId}` : `supplier:${entityId}`;
    this.io.to(room).emit("delete_review", reviewId);
  }

  notifyReviewAuthor(userId, eventName, data) {
    this.io.to(`user:${userId}`).emit(eventName, data);
  }
}

module.exports = (io) => new ReviewSocket(io);
