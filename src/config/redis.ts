import Redis from "ioredis";
import { config } from "./env";

const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
});

redis.on("connect", () => {
  console.log("✅ Connected to Redis");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

export default redis;
