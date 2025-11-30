import Redis from "ioredis";

const isProduction = process.env.NODE_ENV === 'production';

export const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  // password: process.env.REDIS_PASSWORD || undefined, //로컬에서는 주석 처리
  maxRetriesPerRequest: 3, // 재시도 옵션 설정
	// TLS 설정 자동 처리
  tls: isProduction ? {} : undefined
});

redisClient.on("connect", () => {
  console.log("✅ Redis connected");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis error", err);
});
