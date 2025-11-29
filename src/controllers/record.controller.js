import { processBookingConfirmation } from "../services/record.service.js";
import { BadRequestError } from "../errors.js";
import { successHandler } from "../middlewares/responseHandler.js";

// 예매 확정 및 기록 저장 핸들러
export async function confirmBooking(req, res, next) {
  try {
    const { seatId } = req.body;

    if (!seatId || typeof seatId !== "string") {
      throw new BadRequestError("좌석 번호를 확인 후, 다시 이용해주세요.");
    }

    const resultData = await processBookingConfirmation(seatId);

    return successHandler(res, "예매가 성공적으로 확정되었습니다!", resultData);
  } catch (err) {
    next(err);
  }
}
