import { Router } from "express";
import { handleGetQueuePos, handleInsertQueue, handleGetOutQueue } from "../controllers/queue.controller.js"

const router = Router();

// 예매 시작
router.post("/insert", handleInsertQueue);
router.get("/get-pos", handleGetQueuePos);
router.post("/pop", handleGetOutQueue);

export default router;
