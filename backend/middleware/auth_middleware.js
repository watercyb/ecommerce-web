import jwt from "jsonwebtoken";
import User from "../models/user_model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized - No access token provided" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid access token" });
  }
};

export const adminRoute = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied - Admin only" });
  }
};
