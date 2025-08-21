import jwt from "jsonwebtoken";
import TokenBlacklist from "../models/tokenblacklist.model.js";

export const protect = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const blacklistedToken = await TokenBlacklist.findOne({ token: token });
    if (blacklistedToken) {
      return res
        .status(401)
        .json({ message: "Token is blacklisted. Please log in again." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};
