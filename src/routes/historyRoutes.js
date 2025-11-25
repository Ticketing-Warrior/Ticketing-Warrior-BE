import { Router } from "express";
import historyController from "../controllers/historyController.js";

// 최종 예매 확정
router.post("/api/history/confirm", historyController.confirmBooking);

const routers = Router();

export default routers;
