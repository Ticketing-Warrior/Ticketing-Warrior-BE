import { BadRequestError } from '../errors.js';
import { successHandler } from '../middlewares/responseHandler.js';
import { getSingleSeat, changeSeatState } from '../services/seat.service.js'

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

export async function handleChangeSeatState(req,res,next) {
    try{
        let seatId = req.query.seatId;
        const state = req.query.state;

        seatId = seatId.replace(/[^a-zA-Z0-9]/g, '');

        if(!seatId || !state){
            throw new BadRequestError("잘못된 요청값입니다. 파라미터를 확인해주세요. ");
        } 

        const seat = await changeSeatState(seatId, state);

        return successHandler(res, "좌석 상태를 변경했습니다.", {seat});

    }catch(err){
        next(err);
    }
}