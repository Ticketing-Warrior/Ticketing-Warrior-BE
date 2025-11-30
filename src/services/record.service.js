import { saveRecord, calculateRankPercentile } from "./db.service.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { runLuaScript } from "../redis/runLuaScript.js";
import { redisClient } from "../redis/redisClient.js";
import { BadRequestError } from "../errors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seatScriptPath = path.resolve(__dirname, "../redis/scripts/seat.lua");
const seatScript = fs.readFileSync(seatScriptPath, "utf8");

const queueScriptPath = path.resolve(__dirname, "../redis/scripts/queue.lua");
const queueScript = fs.readFileSync(queueScriptPath, "utf8");

async function runSeatScript(keys = [], args = []) {
  return redisClient.eval(seatScript, keys.length, ...keys, ...args);
}

// 예매 확정 처리 및 기록 저장
export async function processBookingConfirmation(seatId) {
  // 1) 좌석 락(lock) 시도
  const isLocked = await runSeatScript(["seats"], ["lockSeat", seatId]);
  if (isLocked === 0) {
    throw new BadRequestError("이미 선택되었거나 예매된 좌석입니다.");
  }
  // 2) 사이클 시작 시간 조회 (초기화 시간)
  const cycleStartTime = await runLuaScript(
    queueScript,
    [],
    ["getCycleStartTime"]
  );

  if (!cycleStartTime) {
    throw new BadRequestError("사이클 시작 정보가 없습니다.");
  }
  // 3) 예매 소요 시간 계산 (현재 시간 - 초기화 시간)
  const duration = Date.now() - Number(cycleStartTime);
  if (duration < 0) {
    throw new BadRequestError("예매 시간 계산에 실패했습니다.");
  }

  // 2) DB에 기록 저장
  const savedRecord = await saveRecord(duration);

  // 3) 상위 퍼센트 계산
  const rankingPercent = await calculateRankPercentile(duration);

  // 4) 초 단위 변환
  const durationSeconds = Number((savedRecord.duration / 1000).toFixed(2));

  return {
    recordId: savedRecord.id,
    duration: durationSeconds,
    rankingPercent: rankingPercent,
    createdAt: savedRecord.created_at,
  };
}
