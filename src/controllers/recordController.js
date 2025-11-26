import { processBookingConfirmation } from "../services/recordService.js";
import { BadRequestError } from "../errors.js";
import { successHandler } from "../middlewares/responseHandler.js";

// 예매 확정 및 기록 저장 핸들러
export async function confirmBooking(req, res, next) {
  try {
    const { duration } = req.body;

    if (duration === undefined || duration === null || duration < 0) {
      throw new BadRequestError("유효하지 않은 소요 시간입니다.");
    }

    const resultData = await processBookingConfirmation(duration);

    return successHandler(res, "예매가 성공적으로 확정되었습니다!", resultData);
  } catch (err) {
    next(err);
  }
}
