const express = require("express");
const {
  registerUser,
  loginUser,
} = require("../../controllers/auth-controller/index");
const { updateUserProfile } = require("../../controllers/auth-controller/profile-controller");
const { changePassword } = require("../../controllers/auth-controller/security-controller");
const { forgotPassword, resetPassword } = require("../../controllers/auth-controller/password-controller");
const authenticateMiddleware = require("../../middleware/auth-middleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/check-auth", authenticateMiddleware, (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    data: {
      user,
    },
  });
});

// Profile routes
router.put("/profile/:userId", authenticateMiddleware, updateUserProfile);

// Security routes
router.put("/security/change-password/:userId", authenticateMiddleware, changePassword);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
