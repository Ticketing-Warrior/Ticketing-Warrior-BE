import { BadRequestError } from '../errors.js';
import { successHandler } from '../middlewares/responseHandler.js';
import { getQueuePos, insertQueue, getOutQueue, seedSeats, getAllSeats } from '../services/queueService.js';

export const handleInsertQueue = async (req, res, next) => {
    try {
        const nickname = req.body?.nickname;

        if(!nickname || nickname === undefined){
            throw new BadRequestError("닉네임을 확인 후, 다시 이용해주세요.");
        }
        const curPos = await insertQueue(nickname);
        return successHandler(res, `대기열 진입`, {curPos : curPos} )
    }catch(err) {
        next(err);
    }
}

export const handleGetQueuePos = async (req, res, next) => {
    try{
        const nickname = req.query?.nickname;
        if(!nickname || nickname === undefined){
            throw new BadRequestError("닉네임을 확인 후, 다시 이용해주세요.");
        }

        const curPos = await getQueuePos(nickname);
        return successHandler(res, `내 순번 조회`, {curPos: curPos});
    }catch(err) {
        next(err);
    }
}

export const handleGetOutQueue = async (req, res, next) => {
  try {
    const nickname = req.body?.nickname;

    if (!nickname || nickname === undefined) {
      throw new BadRequestError("닉네임을 확인 후, 다시 이용해주세요.");
    }

    await getOutQueue(nickname);
    return successHandler(res, `티켓팅 시작`, );
  } catch (err) {
    next(err);
  }
};

export const handleSeedSeats = async (req, res, next) => {
  try {
    await seedSeats();
    return successHandler(res, "좌석 초기화 완료 (A1~A100)");
  } catch (err) {
    next(err);
  }
};

export const handleGetSeats = async (req, res, next) => {
  try {
    const seats = await getAllSeats();
    return successHandler(res, "좌석 정보 조회", seats);
  } catch (err) {
    next(err);
  }
};
