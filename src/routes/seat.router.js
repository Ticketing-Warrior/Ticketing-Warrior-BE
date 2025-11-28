import { Router } from "express";
import { handleSingleSeat, handleGetSeats } from "../controllers/seat.controller.js";

const router = Router();

// 좌석 단일 조회
router.get("/single", handleSingleSeat);
router.get("/all", handleGetSeats);

export default router;
