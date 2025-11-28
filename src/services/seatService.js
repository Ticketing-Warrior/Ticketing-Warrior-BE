import { NotFoundError } from '../errors.js';
import { getASeat } from './redisService.js';

export async function getSingleSeat (seatId) {
    console.log("단일 좌석 상태 조회 성공");
    const seatState = await getASeat(seatId);

    if(!seatState){
        throw new NotFoundError("존재하지 않는 좌석입니다.");
    }

    return seatState;
}