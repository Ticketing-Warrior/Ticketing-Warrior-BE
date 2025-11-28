import { Router } from "express";
import { handleGetQueuePos, handleInsertQueue, handleGetOutQueue, handleSeedSeats, handleGetSeats } from "../controllers/queueController.js"

const router = Router();

// 예매 시작
router.post("/insert", handleInsertQueue);
router.get("/get-pos", handleGetQueuePos);
router.post("/pop", handleGetOutQueue);
router.post("/seed", handleSeedSeats);
router.get("/seats", handleGetSeats);

export default router;
