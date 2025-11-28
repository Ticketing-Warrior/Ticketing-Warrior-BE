import { saveRecord, calculateRankPercentile } from "./db.service.js";
import { redisClient } from "../redis/redisClient.js";
import path from "path";
import { fileURLToPath } from "url";
import { BadRequestError } from "../errors.js";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const queueScriptPath = path.resolve(__dirname, "../redis/scripts/queue.lua");
const queueScript = fs.readFileSync(queueScriptPath, "utf8");

const seatScriptPath = path.resolve(__dirname, "../redis/scripts/seat.lua");
const seatScript = fs.readFileSync(seatScriptPath, "utf8");

/**
 * Lua 스크립트 실행 헬퍼
 */
function runQueueScript(keys = [], args = []) {
  return redisClient.eval(queueScript, keys.length, ...keys, ...args);
}

function runSeatScript(keys=[], args=[]){
  return redisClient.eval(seatScript, keys.length, ...keys, ...args);
}

/**
 * 티켓팅 확정 처리
 * @param {string} nickname
 * @param {string} seatId
 */
export async function processBookingConfirmation(nickname, seatId) {
  // 1) 좌석 락(lock) 시도
  const isLocked = await runSeatScript(["seats"], ["lockSeat", seatId, nickname, "30"]);
  if (isLocked === 0) {
    throw new BadRequestError("이미 선택되었거나 예매된 좌석입니다.");
  }

  // 2) 세션 시작 시간 조회
  const sessionStart = await runQueueScript([], ["getSessionStart", nickname]);
  if (!sessionStart) {
    throw new BadRequestError("세션 시작 정보가 없습니다.");
  }

  const duration = Date.now() - Number(sessionStart);
  if (duration < 0) {
    throw new BadRequestError("세션 시간 계산에 실패했습니다.");
  }

  // 3) DB에 기록 저장
  const savedRecord = await saveRecord(duration);

  // 4) 상위 퍼센트 계산
  const rankingPercent = await calculateRankPercentile(duration);

  // 5) 초 단위 변환
  const durationSeconds = Number((savedRecord.duration / 1000).toFixed(2));

  // 6) 세션 삭제
  await runQueueScript([], ["clearSessionStart", nickname]);

  return {
    recordId: savedRecord.id,
    duration: durationSeconds,
    rankingPercent: rankingPercent,
    createdAt: savedRecord.created_at,
  };
}