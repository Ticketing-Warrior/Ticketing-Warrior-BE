import { Router } from "express";
import { confirmBooking } from "../controllers/record.controller.js";

const router = Router();

// 예매 확정 및 기록 저장
router.post("/confirm", confirmBooking);

export default router;
