import { ExistsError, NotFoundUserError } from "../errors.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { runLuaScript } from "../redis/runLuaScript.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const queueScriptPath = path.resolve(__dirname, "../redis/scripts/queue.lua");
const queueScript = fs.readFileSync(queueScriptPath, "utf8");

// 대기열 진입
export async function insertQueue(nickname) {
  console.log(`대기열 진입: ${nickname}`);

  const prevPos = await runLuaScript(
    queueScript,
    ["ticketQueue"],
    ["getMyPosition", nickname]
  );

  if (prevPos !== -1) {
    throw new ExistsError(
      "해당 닉네임을 가진 사용자가 이미 대기열에 존재합니다."
    );
  }

  // 대기열에 추가
  await runLuaScript(queueScript, ["ticketQueue"], ["addToQueue", nickname]);

  // 새 순번 확인
  const curPos = await runLuaScript(
    queueScript,
    ["ticketQueue"],
    ["getMyPosition", nickname]
  );

  return curPos + 1; // 사람이 보는 번호(1부터)
}

// 대기열에서 제거
export async function getOutQueue(nickname) {
  const curPos = await runLuaScript(
    queueScript,
    ["ticketQueue"],
    ["getMyPosition", nickname]
  );

  if (curPos === -1) {
    throw new NotFoundUserError(
      "해당 닉네임을 가진 사용자가 대기열에 존재하지 않습니다."
    );
  }
  await runLuaScript(
    queueScript,
    ["ticketQueue"],
    ["removeFromQueue", nickname]
  );
}

// 순번 조회
export async function getQueuePos(nickname) {
  const curPos = await runLuaScript(
    queueScript,
    ["ticketQueue"],
    ["getMyPosition", nickname]
  );

  if (curPos === -1) {
    throw new NotFoundUserError(
      `해당 닉네임을 가진 사용자가 대기열에 존재하지 않습니다.`
    );
  }

  return curPos + 1;
}
