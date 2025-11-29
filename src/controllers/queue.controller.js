import { BadRequestError } from "../errors.js";
import { successHandler } from "../middlewares/responseHandler.js";
import {
  getQueuePos,
  insertQueue,
  getOutQueue,
} from "../services/queue.service.js";

// 대기열 진입
export const handleInsertQueue = async (req, res, next) => {
  try {
    const nickname = req.body?.nickname;

    if (!nickname || nickname === undefined) {
      throw new BadRequestError("닉네임을 확인 후, 다시 이용해주세요.");
    }
    const curPos = await insertQueue(nickname);
    return successHandler(res, `대기열 진입`, { curPos: curPos });
  } catch (err) {
    next(err);
  }
};

// 내 순번 조회
export const handleGetQueuePos = async (req, res, next) => {
  try {
    const nickname = req.query?.nickname;
    if (!nickname || nickname === undefined) {
      throw new BadRequestError("닉네임을 확인 후, 다시 이용해주세요.");
    }

    const curPos = await getQueuePos(nickname);
    return successHandler(res, `내 순번 조회`, { curPos: curPos });
  } catch (err) {
    next(err);
  }
};

// 대기열 제거 (티켓팅 시작)
export const handleGetOutQueue = async (req, res, next) => {
  try {
    const nickname = req.body?.nickname;

    if (!nickname || nickname === undefined) {
      throw new BadRequestError("닉네임을 확인 후, 다시 이용해주세요.");
    }

    await getOutQueue(nickname);
    return successHandler(res, `티켓팅 시작`);
  } catch (err) {
    next(err);
  }
};
