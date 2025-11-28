import { successHandler } from '../middlewares/responseHandler.js';
import { getSingleSeat, getAllSeats } from '../services/seat.service.js'

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

export const handleGetSeats = async (req, res, next) => {
  try {
    const seats = await getAllSeats();
    return successHandler(res, "좌석 정보 조회", seats);
  } catch (err) {
    next(err);
  }
};
