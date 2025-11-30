import { Router } from "express";
import {
  startBots,
  stopBots,
  getBotStatus,
} from "../controllers/bot.controller.js";

const router = Router();

// 봇 시스템 시작
router.post("/start", startBots);

// 봇 시스템 중지
router.post("/stop", stopBots);

// 봇 시스템 상태 조회
router.get("/status", getBotStatus);

export default router;
