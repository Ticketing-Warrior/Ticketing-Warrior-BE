import { Router } from "express";
import { handleSingleSeat } from "../controllers/seatController.js";

const router = Router();

// 좌석 단일 조회
router.get("/single", handleSingleSeat);

export default router;
