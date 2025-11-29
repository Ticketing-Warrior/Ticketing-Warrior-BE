import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { redisClient } from '../redis/redisClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seatScriptPath = path.resolve(__dirname, "../redis/scripts/seat.lua");
const seatScript = fs.readFileSync(seatScriptPath, "utf8");

async function runSeatScript(keys = [], args = []) {
  return redisClient.eval(seatScript, keys.length, ...keys, ...args);
}

/**
 * 모든 좌석 상태 조회
 */
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

/**
 * 좌석 초기 데이터 생성 (seed)
 * @param {number} count
 */
export async function seedSeats(count = 100) {
  await runSeatScript(["seats"], ["seedSeats", count]);
  return "OK";
}