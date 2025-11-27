import { saveRecord, calculateRankPercentile } from "../models/recordModel.js";
import { getSessionStart, clearSessionStart } from "./redisService.js";
import { BadRequestError } from "../errors.js";

export async function processBookingConfirmation(nickname) {
  const sessionStart = await getSessionStart(nickname);

  if (!sessionStart) {
    throw new BadRequestError("세션 시작 정보가 없습니다.");
  }

  const duration = Date.now() - sessionStart;

  if (duration < 0) {
    throw new BadRequestError("세션 시간 계산에 실패했습니다.");
  }

  // 기록 저장
  const savedRecord = await saveRecord(duration);
  // 상위 퍼센트 계산
  const rankingPercent = await calculateRankPercentile(duration);
  // 기록 시간 초 단위로 변환
  const durationSeconds = Number((savedRecord.duration / 1000).toFixed(2));
  // 세션 삭제(티켓팅 종료)
  await clearSessionStart(nickname);

  return {
    recordId: savedRecord.id,
    duration: durationSeconds,
    rankingPercent: rankingPercent,
    createdAt: savedRecord.created_at,
  };
}
