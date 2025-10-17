// server/src/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

/* --------------------------- AUTHENTICATE --------------------------- */
exports.authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Expecting payload: { userId, role }
    if (!decoded?.userId) {
      return res.status(403).json({ message: "Invalid token payload" });
    }

    // Attach user info to request object
    req.user = { userId: decoded.userId, role: decoded.role };

    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

/* --------------------------- AUTHORIZE ROLES --------------------------- */
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: `Access denied: Requires one of [${roles.join(", ")}]`,
        });
      }

      next();
    } catch (err) {
      console.error("Authorization Error:", err.message);
      res.status(500).json({ message: "Internal authorization error" });
    }
  };
};


