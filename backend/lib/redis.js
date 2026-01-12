import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const redisConfig = async () => {
  try {
    await redis.ping();
    console.log("Redis connected.");
  } catch (error) {
    console.log("Error connecting to Redis: ", error.message);
    process.exit(1);
  }
};
