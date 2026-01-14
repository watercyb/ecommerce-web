import {
  generateAccessToken,
  generateTokens,
  refreshCookieOptions,
} from "../lib/jwt.js";
import { redis } from "../lib/redis.js";
import User from "../models/user_model.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  if (!req.body) return res.status(400).json("Missing required data");
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).populate("cartItems.product");

    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ message: "Invalid email or password" });

    generateTokens(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      cartItems: user.cartItems,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const signup = async (req, res) => {
  if (!req.body) return res.status(400).json("Missing required data");
  const { email, password, name } = req.body;
  try {
    const existUser = await User.findOne({ email });
    if (existUser)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });

    generateTokens(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refresh_token:${decoded.userId}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken", refreshCookieOptions);
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token provided" });

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    if (storedToken !== refreshToken)
      return res.status(401).json({ message: "Invalid refresh token" });

    generateAccessToken(res, decoded.userId);

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("Error in refreshToken controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const user = async (req, res) => {
  try {
    const id = req.user?._id;
    const user = await User.findById(id)
      .populate("cartItems.product")
      .select("-password");
    if (!user) return res.status(400).json({ message: "User not found" });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      cartItems: user.cartItems,
    });
  } catch (error) {
    console.log("Error in user controller", error.message);
    res.status(500).json({ message: error.message });
  }
};
