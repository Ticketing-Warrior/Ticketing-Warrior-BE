import { Router } from "express";
import { confirmBooking } from "../controllers/record.controller.js";

const router = Router();

router.post("/confirm", confirmBooking);

export default router;
