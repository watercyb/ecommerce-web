import express from "express";
import { connectDB } from "./lib/db.js";
import authRoute from "./routes/auth_route.js";
import redis from "./lib/redis.js";
import cookieParser from "cookie-parser";

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);

app.listen(port, async () => {
  console.log("Running on port: " + port);
  connectDB();
  try {
    await redis.ping();
    console.log("Redis connected.");
    return redis;
  } catch (error) {
    console.log("Error connecting to Redis: ", error.message);
    process.exit(1);
  }
});
