import cron from "node-cron";
import { runLuaScript } from "../redis/runLuaScript.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { botManager } from "./bot.service.js";
import { getAllSeats, seedSeats, resetAllSeats } from "./seat.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const queueScriptPath = path.resolve(__dirname, "../redis/scripts/queue.lua");
const queueScript = fs.readFileSync(queueScriptPath, "utf8");

// 모든 좌석 초기화, 대기열 초기화, 사이클 시작 시간 설정, 봇 재시작
async function resetAllSeatsAndSessions() {
  try {
    const resetTime = Date.now();
    console.log("[스케줄러] 매분 00초 초기화 작업 시작...");

    // 1. 동작 중인 봇 모두 중지
    if (botManager.isEnabled) {
      botManager.stop();
      console.log("[스케줄러] 동작 중인 봇 초기화");
    }

    // 2. 사이클 시작 시간 설정 (초기화 시간)
    await runLuaScript(
      queueScript,
      [],
      ["setCycleStartTime", String(resetTime)]
    );
    console.log(
      `[스케줄러] 사이클 시작 시간 설정: ${new Date(resetTime).toISOString()}`
    );

    // 3. 좌석 초기화 또는 재생성
    const seats = await getAllSeats();
    const seatCount = Object.keys(seats).length;
    const expectedSeatCount = 100; // 10x10 = 100개

    if (seatCount === 0 || seatCount !== expectedSeatCount) {
      // 좌석이 없거나 개수가 맞지 않으면 완전히 삭제 후 재생성
      await seedSeats(10, 10);
      console.log(
        `[스케줄러] 좌석 재생성 완료 (기존: ${seatCount}개 → 새로 생성: ${expectedSeatCount}개)`
      );
    } else {
      // 좌석이 정확히 100개면 상태만 초기화
      await resetAllSeats();
      console.log("[스케줄러] 모든 좌석 상태 초기화 완료");
    }

    // 4. 대기열 초기화
    await runLuaScript(queueScript, ["ticketQueue"], ["clearQueue"]);
    console.log("[스케줄러] 대기열 초기화 완료");

    // 5. 봇 시스템 자동 시작
    botManager.start();
    console.log("[스케줄러] 봇 시스템 자동 시작 완료");

    console.log("[스케줄러] 초기화 작업 완료");
  } catch (error) {
    console.error("[스케줄러] 초기화 작업 실패:", error.message);
  }
}

// 스케줄러 시작
export function startScheduler() {
  // 서버 시작 시 초기화 및 봇 시작
  resetAllSeatsAndSessions();

  // 매분 00초에 실행
  cron.schedule("0 * * * * *", () => {
    resetAllSeatsAndSessions();
  });

  console.log("[스케줄러] 시작: 매분 00초에 좌석, 대기열 초기화, 봇 재시작");
}
