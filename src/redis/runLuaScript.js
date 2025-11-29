import { redisClient } from './redisClient.js';

const shaMap = new Map(); // script → sha 저장

export async function runLuaScript(script, keys = [], args = []) {
  const keyCount = keys.length;
  let sha = shaMap.get(script);

  if (sha) {
    try {
      return await redisClient.evalsha(sha, keyCount, ...keys, ...args);
    } catch (err) {
      if (!err.message.includes("NOSCRIPT")) throw err;
    }
  }

  const result = await redisClient.eval(script, keyCount, ...keys, ...args);

  sha = await redisClient.script("LOAD", script);

  shaMap.set(script, sha);

  return result;
}
