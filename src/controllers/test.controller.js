import { successHandler } from '../middlewares/responseHandler.js';
import { getAllSeats, seedSeats } from '../services/testService.js';

export const handleSeedSeats = async (req, res, next) => {
  try {
    await seedSeats();
    return successHandler(res, "좌석 초기화 완료 (A1~A100)");
  } catch (err) {
    next(err);
  }
};

export const handleGetSeats = async (req, res, next) => {
  try {
    const seats = await getAllSeats();
    return successHandler(res, "좌석 정보 조회", seats);
  } catch (err) {
    next(err);
  }
};
