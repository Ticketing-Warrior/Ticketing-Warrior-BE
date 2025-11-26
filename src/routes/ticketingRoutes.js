import { Router } from "express";
import { handleStartTicketing } from "../controllers/ticketingController.js";

const router = Router();

// 예매 시작
router.post("/start", handleStartTicketing);


export default router;
