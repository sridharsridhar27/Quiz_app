// server/src/controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const ACCESS_EXPIRES = "15m";
const REFRESH_EXPIRES = "7d";
const REFRESH_COOKIE_NAME = "refreshToken";

/* --------------------------- TOKEN HELPERS --------------------------- */
function signAccessToken(user) {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES }
  );
}

/* --------------------------- REGISTER --------------------------- */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ----------------------------- LOGIN ----------------------------- */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required." });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res
        .status(401)
        .json({ message: "User not found. Please register first." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ message: "Invalid credentials. Please check your password." });

    if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
      console.error("Missing JWT secrets");
      return res.status(500).json({ message: "Server misconfiguration" });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt },
    });

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      accessToken,
      refreshToken, // Optional: primarily handled by cookie
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Internal server error during login" });
  }
};

/* --------------------------- REFRESH TOKEN --------------------------- */
exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies[REFRESH_COOKIE_NAME];
    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token provided" });

    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!stored)
      return res.status(403).json({ message: "Invalid refresh token" });

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, decoded) => {
        if (err) {
          console.warn("Refresh token verify error:", err.message);
          return res.status(403).json({ message: "Token expired or invalid" });
        }

        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
        });
        if (!user) return res.status(404).json({ message: "User not found" });

        const newAccessToken = jwt.sign(
          { userId: user.id, role: user.role },
          process.env.JWT_ACCESS_SECRET,
          { expiresIn: ACCESS_EXPIRES }
        );

        res.json({ accessToken: newAccessToken });
      }
    );
  } catch (error) {
    console.error("REFRESH TOKEN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ------------------------------ LOGOUT ------------------------------ */
exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies[REFRESH_COOKIE_NAME];
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }

    res.clearCookie(REFRESH_COOKIE_NAME);
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("LOGOUT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ------------------------------ GET ME ------------------------------ */
exports.getMe = async (req, res) => {
  try {
    if (!req.user?.userId)
      return res.status(401).json({ message: "Not authenticated" });

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");

    res.status(200).json(user);
  } catch (err) {
    console.error("GET /me ERROR:", err);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
};






