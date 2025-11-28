import { Router } from "express";
import { handleSingleSeat, handleChangeSeatState } from "../controllers/seat.controller.js";

const router = Router();

// 좌석 단일 조회
router.get("/single", handleSingleSeat);
router.patch("/change", handleChangeSeatState);

export default router;
