import { Router } from "express";
import { handleSeedSeats, handleGetSeats } from "../controllers/test.controller.js"

const router = Router();

router.post("/seed", handleSeedSeats);
router.get("/seats", handleGetSeats);

export default router;
