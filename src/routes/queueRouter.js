import { Router } from "express";
import { handleGetQueuePos, handleInsertQueue } from "../controllers/queueController.js"

const router = Router();

// 예매 시작
router.post("/insert", handleInsertQueue);
router.get("/get-pos", handleGetQueuePos)

export default router;
