const jwt = require("jsonwebtoken");
const User = require("../models/user");

const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const key = process.env.JWT_SECRET;

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, key);
    const userId = decodedToken.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = isAuthenticated;
