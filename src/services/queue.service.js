import { ExistsError, NotFoundUserError } from '../errors.js';
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { redisClient } from '../redis/redisClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const queueScriptPath = path.resolve(__dirname, "../redis/scripts/queue.lua");
const queueScript = fs.readFileSync(queueScriptPath, "utf8");

function runQueueScript(keys, args) {
  return redisClient.eval(queueScript, keys.length, ...keys, ...args);
}

// 대기열 진입
export async function insertQueue(nickname) {
  console.log(`대기열 진입: ${nickname}`);

  // 이미 있는지 확인
  const curPos = await runQueueScript(["ticketQueue"], ["getMyPosition", nickname]);

  if (curPos !== -1) {
    throw new ExistsError("해당 닉네임을 가진 사용자가 이미 대기열에 존재합니다.");
  }

  // 세션 시작 시간 기록
  await runQueueScript([], ["setSessionStart", nickname, Date.now()]);

  // 대기열에 추가
  await runQueueScript(["ticketQueue"], ["addToQueue", nickname]);

  // 새 순번 확인
  const newPos = await runQueueScript(["ticketQueue"], ["getMyPosition", nickname]);

  return newPos + 1; // 사람이 보는 번호(1부터)
}

// 대기열에서 제거
export async function getOutQueue(nickname) {
  const curPos = await runQueueScript(["ticketQueue"], ["getMyPosition", nickname]);

  if (curPos === -1) {
    throw new NotFoundUserError("해당 닉네임을 가진 사용자가 대기열에 존재하지 않습니다.");
  }

  await runQueueScript(["ticketQueue"], ["removeFromQueue", nickname]);
}

// 순번 조회
export async function getQueuePos(nickname) {
  const curPos = await runQueueScript(["ticketQueue"], ["getMyPosition", nickname]);

  if (curPos === -1) {
    throw new NotFoundUserError(
      `해당 닉네임을 가진 사용자가 대기열에 존재하지 않습니다.`
    );
  }

  return curPos + 1;
}