import { redisClient } from "../config/redisConfig.js";

// 좌석 상태 조회
export async function getAllSeats() {
  // 모든 좌석 상태를 해시로 관리
  return await redisClient.hgetall("seats");
}

// 좌석 초기화 (sold 좌석은 유지)
export async function resetSeats() {
  const seats = await getAllSeats();
  const pipeline = redisClient.pipeline();

  for (const [seatId, status] of Object.entries(seats)) {
    if (status !== "sold" && status !== "locked") {
      pipeline.hset("seats", seatId, "available");
    }
  }

  await pipeline.exec();
}

// 좌석 점유 (TTL 적용)
export async function lockSeat(seatId, userId, ttlSeconds = 30) {
  const status = await redisClient.hget("seats", seatId);
  if (status !== "available") return false;

  await redisClient.hset("seats", seatId, "locked");
  await redisClient.set(`seat:lock:${seatId}`, userId, "EX", ttlSeconds);
  return true;
}

// 대기열 조회
export async function getQueue() {
  return await redisClient.lrange("ticketQueue", 0, -1);
}

// 대기열에서 자신 제거
export async function removeFromQueue(nickname) {
  await redisClient.lrem("ticketQueue", 0, nickname);
}

// 세션 시작 시간 기록
export async function setSessionStart(nickname) {
  await redisClient.set(`session:start:${nickname}`, Date.now());
}

// 세션 시작 시간 조회
export async function getSessionStart(nickname) {
  const startAt = await redisClient.get(`session:start:${nickname}`);
  return startAt ? Number(startAt) : null;
}

// 세션 시작 시간 삭제
export async function clearSessionStart(nickname) {
  await redisClient.del(`session:start:${nickname}`);
}
