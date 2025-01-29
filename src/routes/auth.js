const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verifyUserEmail,
  getCurrentUser,
  logout,
  handleResendVerificationEmail,
  updateAvatar,
  updateUser,
} = require("../controllers/auth");
const { authMiddleware } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);

router.get("/verify/:verificationToken", verifyUserEmail);
router.post("/resend-verification", handleResendVerificationEmail);

router.get("/current", authMiddleware, getCurrentUser);
router.patch("/user", authMiddleware, updateUser);

router.post("/avatars", authMiddleware, upload.single("avatar"), updateAvatar);

module.exports = router;
