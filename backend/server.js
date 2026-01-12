import express from "express";
import { connectDB } from "./lib/db.js";
import { redisConfig } from "./lib/redis.js";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth_route.js";
import productRoute from "./routes/product_route.js";
import { cloudinaryConfig } from "./lib/cloudinary.js";

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);

app.listen(port, async () => {
  console.log("Running on port: " + port);
  connectDB();
  redisConfig();
  cloudinaryConfig();
});
