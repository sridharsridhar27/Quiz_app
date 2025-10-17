const express = require("express");
const router = express.Router();
const {
  register,
  login,
  refresh,
  logout,
  getMe,
} = require("../controllers/authController");
const { authenticate } = require("../middlewares/authMiddleware");

// 🧾 Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

// 👤 Authenticated route — returns logged-in user details
router.get("/me", authenticate, (req, res) => {
  // Prevent cached response from confusing frontend
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.status(200).json(req.user);
});


module.exports = router;


