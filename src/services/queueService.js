import { ExistsError, NotFoundUserError } from '../errors.js';
import { addToQueue, getMyPosition, resetSeats, removeFromQueue, getAllSeats, setSessionStart, seedSeats } from "../services/redisService.js";

export { seedSeats, getAllSeats };

export async function insertQueue(nickname) {
  console.log(`대기열 진입`);

  const curPos = await getMyPosition(nickname);
  if(curPos){
    throw new ExistsError('해당 닉네임을 가진 사용자가 이미 대기열에 존재합니다.');
  }

  await setSessionStart(nickname); // 타이머 시작
  await addToQueue(nickname); // 대기열에 넣기

  const newPos = await getMyPosition(nickname);

  return newPos;
}

// 대기열 존재 X 호출되는 API
export async function getOutQueue(nickname) { 

  const curPos = await getMyPosition(nickname);
  if(!curPos){
    throw new NotFoundUserError('해당 닉네임을 가진 사용자가 대기열에 존재하지 않습니다.');
  }

  // 대기열에서 자신 제거
  await removeFromQueue(nickname);
}

export async function getQueuePos(nickname){
  const curPos = await getMyPosition(nickname);

  if(!curPos){
    throw new NotFoundUserError(`해당 닉네임을 가진 사용자가 대기열에 존재하지 않습니다.`);
  }

  return curPos;
}