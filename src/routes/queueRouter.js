import { Router } from "express";
import { handleInsertQueue } from "../controllers/queueController.js"

const router = Router();

// 예매 시작
router.post("/insert", handleInsertQueue);

export default router;
