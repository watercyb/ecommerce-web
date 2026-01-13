import express from "express";
import { connectDB } from "./lib/db.js";
import { redisConfig } from "./lib/redis.js";
import cookieParser from "cookie-parser";
import { cloudinaryConfig } from "./lib/cloudinary.js";
import authRoute from "./routes/auth_route.js";
import productRoute from "./routes/product_route.js";
import cartRoutes from "./routes/cart_route.js";
import couponRoute from "./routes/coupon_route.js";
import paymentRoutes from "./routes/payment_route.js";
import analyticsRoutes from "./routes/analytics_route.js";

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoute);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

app.listen(port, async () => {
  console.log("Running on port: " + port);
  connectDB();
  redisConfig();
  cloudinaryConfig();
});
