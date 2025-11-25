import Redis from "ioredis";

export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD || undefined,
  tls: {} // 퍼블릭 접근이 아니면 필요 없음
});

redis.on("connect", () => {
  console.log("🔥 Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error", err);
});
