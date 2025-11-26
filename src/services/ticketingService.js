import {
  getAllSeats,
  resetSeats,
  removeFromQueue,
  setSessionStart,
} from "../services/redisService.js";

export async function startTicketing(nickname) {
  // 1. 좌석 초기화 (sold 좌석 유지, locked 좌석 TTL 확인)
  await resetSeats();

  // 2. 대기열에서 자신 제거
  await removeFromQueue(nickname);

  // 3. 세션 시작 시간 기록
  await setSessionStart(nickname);

  // 4. 현재 좌석 상태 조회
  const seats = await getAllSeats();

  return seats;

}