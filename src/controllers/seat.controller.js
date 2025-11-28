import { successHandler } from '../middlewares/responseHandler.js';
import { getSingleSeat } from '../services/seat.service.js'

export async function handleSingleSeat(req,res,next) {
    try{
        const seatId = req.query.seatId;

        if (!seatId || seatId === undefined) {
        throw new BadRequestError("닉네임을 확인 후, 다시 이용해주세요.");
        }
        const seatState = await getSingleSeat(seatId);
        return successHandler(res, "단일 좌석 상태 조회에 성공했습니다.", {seatState} );

    }catch(err){
        next(err);
    }
}