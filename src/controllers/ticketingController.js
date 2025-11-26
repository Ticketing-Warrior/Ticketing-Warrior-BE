import { successHandler } from '../middlewares/responseHandler.js';
import { startTicketing } from '../services/ticketingService.js';

export const handleStartTicketing = async (req, res, next) => {
    try {
        const nickname = req.body.nickname;

        const resposne = await startTicketing(nickname);
        return successHandler(res, `티켓팅 시작`, resposne )
    }catch(err) {
        next(err);
    }
}