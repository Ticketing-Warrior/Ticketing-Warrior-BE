import Redis from "ioredis";

export const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  // password: process.env.REDIS_PASSWORD || undefined, // 로컬에선 주석처리 
  maxRetriesPerRequest: 3, // 재시도 옵션 설정
  // tls: {} // 로컬에선 주석처리
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});

redisClient.on("error", (err) => {
  console.error("Redis error", err);
});

