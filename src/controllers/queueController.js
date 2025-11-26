import { BadRequestError } from '../errors.js';
import { successHandler } from '../middlewares/responseHandler.js';
import { insertQueue } from '../services/queueService.js';

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