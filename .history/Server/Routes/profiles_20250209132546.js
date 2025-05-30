const express = require("express");
const router = express.Router();
const {
  getProfile,
  followUser,
  unfollowUser,
} = require("../Controllers/profiles");
const { protect } = require("../Middlewares/auth");

router.route("/profiles/:username").get(protect, getProfile);
router
  .route("/profiles/:username/follow")
  .post(protect, followUser)
  .delete(protect, unfollowUser);

module.exports = router;
