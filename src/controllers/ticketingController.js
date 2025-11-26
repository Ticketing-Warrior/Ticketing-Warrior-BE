import { BadRequestError } from '../errors.js';
import { successHandler } from '../middlewares/responseHandler.js';
import { startTicketing } from '../services/ticketingService.js';

export const handleStartTicketing = async (req, res, next) => {
    try {
        const nickname = req.body?.nickname;

        if(!nickname || nickname === undefined){
            throw new BadRequestError("닉네임을 확인 후, 다시 이용해주세요.");
        }

        const resposne = await startTicketing(nickname);
        return successHandler(res, `티켓팅 시작`, resposne )
    }catch(err) {
        next(err);
    }
}