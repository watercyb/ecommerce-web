import jwt from "jsonwebtoken";
import redis from "./redis.js";

export const generateTokens = (res, userId) => {
  generateAccessToken(res, userId);
  generateRefreshToken(res, userId);
};

export const generateAccessToken = (res, userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true, // prevent XSS attacks, cross site scripting attack
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
};

export const generateRefreshToken = (res, userId) => {
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  redis.set(`refresh_token:${userId}`, refreshToken, { ex: 7 * 24 * 60 * 60 });
};

export const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== "development",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/api/auth/refresh",
};
