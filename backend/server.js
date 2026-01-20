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
import path from "path";

const port = process.env.PORT || 5000;
const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoute);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./frontend/dist")));
  app.get(new RegExp(".*"), (req, res) => {
    res.sendFile(path.resolve(__dirname, "./frontend", "dist", "index.html"));
  });
}

app.listen(port, async () => {
  console.log("Running on port: " + port);
  connectDB();
  redisConfig();
  cloudinaryConfig();
});
