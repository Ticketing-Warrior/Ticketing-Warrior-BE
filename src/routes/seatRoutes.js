import { Router } from "express";
import seatController from "../controllers/seatController.js";

// 예매 페이지 진입 및 30초 타이머 시작
router.post("/api/lock/init", seatController.initializeLock);

// 보안 문자 확인
router.post("/api/lock/verify", seatController.verifyCaptcha);

// 좌석 정보 조회
router.get("/api/seat/info", seatController.getSeatInfo);

// 좌석 선점/잠금
router.post("/api/seat/lock", seatController.lockSeat);

// 좌석 잠금 해제
router.delete("/api/seat/unlock", seatController.unlockSeat);

const routers = Router();

export default routers;
