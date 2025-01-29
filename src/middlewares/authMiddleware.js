const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodifică token-ul
    const user = await User.findById(decoded.user.id); // Găsește utilizatorul în baza de date

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Atașează utilizatorul validat la request
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Not authorized", error: error.message });
  }
};

module.exports = { authMiddleware };
