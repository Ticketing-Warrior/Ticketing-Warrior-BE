import { Router } from "express";
import {
  handleSingleSeat,
  handleGetSeats,
  handleChangeSeatState,
} from "../controllers/seat.controller.js";

const router = Router();

// 단일 좌석 상태 조회
router.get("/single", handleSingleSeat);

// 좌석 상태 변경
// router.patch("/change", handleChangeSeatState);

// 모든 좌석 상태 조회
router.get("/all", handleGetSeats);

export default router;
