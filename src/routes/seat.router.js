import { Router } from "express";
import { handleSingleSeat, handleGetSeats, handleChangeSeatState } from "../controllers/seat.controller.js";

const router = Router();

router.get("/single", handleSingleSeat);
router.patch("/change", handleChangeSeatState);
router.get("/all", handleGetSeats);

export default router;
