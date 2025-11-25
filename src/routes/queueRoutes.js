import { Router } from "express";
import queueController from "../controllers/queueController.js";

// 닉네임 등록
router.post("/api/queue/nickname", queueController.registerNickname);

// 닉네임 조회
router.get("/api/queue/nickname", queueController.getNickname);

// 대기열 진입
router.post("/api/queue/enter", queueController.enterQueue);

// 대기열 상태 확인
router.get("/api/queue/status", queueController.getQueueStatus);

// 대기열 이탈
router.delete("/api/queue/exit", queueController.exitQueue);

const routers = Router();

export default routers;
