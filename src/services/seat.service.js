import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { redisClient } from "../redis/redisClient.js";
import { ExistsError, NotFoundError } from "../errors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seatScriptPath = path.resolve(__dirname, "../redis/scripts/seat.lua");
const seatScript = fs.readFileSync(seatScriptPath, "utf8");

async function runSeatScript(keys = [], args = []) {
  return redisClient.eval(seatScript, keys.length, ...keys, ...args);
}

export async function getSingleSeat(seatId) {
  const result = await runSeatScript(["seats"], ["getSingleSeat", seatId]);

  if (!result) {
    throw new NotFoundError("존재하지 않는 좌석입니다.");
  }

  return result;
}

export async function changeSeatState(seatId, state) {
  console.log(seatId, state);
  console.log(`seatId = ${seatId}`, typeof seatId);
  const isExist = await runSeatScript(["seats"], ["getSingleSeat", seatId]);

  console.log(isExist);
  if (!isExist) {
    throw new NotFoundError("존재하지 않는 좌석입니다.");
  }

  let result = null;
  if (state === "lock") {
    result = await runSeatScript(["seats"], ["lockSeat", seatId]);

    if (!result) {
      throw new ExistsError("이미 예매된 좌석입니다.");
    }
  } else if (state === "available") {
    result = await runSeatScript(["seats"], ["ableSeat", seatId]);

    if (!result) {
      throw new ExistsError("이미 선택 해제된 좌석입니다.");
    }
  } else {
    throw new NotFoundError("존재하지 않는 상태값입니다.");
  }

  return { seatId, state };
}

export async function getAllSeats() {
  // KEYS[1] = "seats", ARGV[1] = "getAllSeats"
  const result = await runSeatScript(["seats"], ["getAllSeats"]);

  // Lua HGETALL 반환 형식: [key1, value1, key2, value2, ...]
  const seats = {};
  for (let i = 0; i < result.length; i += 2) {
    seats[result[i]] = result[i + 1];
  }

  return seats;
}

// 전체 좌석 초기화 (모든 좌석을 available로 변경)
export async function resetAllSeats() {
  await runSeatScript(["seats"], ["resetAllSeats"]);
  return "OK";
}

// 좌석 초기 데이터 생성 (기존 좌석 삭제 후 새로 생성)
export async function seedSeats(rows = 10, cols = 10) {
  await runSeatScript(["seats"], ["seedSeats", String(rows), String(cols)]);
  return "OK";
}
