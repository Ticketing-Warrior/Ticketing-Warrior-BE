import { CustomError, ExistsError } from '../errors.js';
import { addToQueue, getMyPosition } from "../services/redisService.js";

export async function insertQueue(nickname) {
  console.log(`대기열 진입`);

  const curPos = await getMyPosition(nickname);
  if(curPos){
    throw new ExistsError('해당 닉네임을 가진 사용자가 이미 대기열에 존재합니다.');
  }

  await addToQueue(nickname);

  const newPos = await getMyPosition(nickname);

  return newPos;
}