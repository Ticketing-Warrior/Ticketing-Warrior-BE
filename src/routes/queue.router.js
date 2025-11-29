import { Router } from "express";
import {
  handleGetQueuePos,
  handleInsertQueue,
  handleGetOutQueue,
} from "../controllers/queue.controller.js";

const router = Router();

// 대기열 진입
router.post("/insert", handleInsertQueue);

// 내 순번 조회
router.get("/get-pos", handleGetQueuePos);

// 대기열 제거 (티켓팅 시작)
router.post("/pop", handleGetOutQueue);

export default router;
