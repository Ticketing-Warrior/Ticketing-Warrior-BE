import { Router } from "express";
import { confirmBooking } from "../controllers/recordController.js";

const router = Router();

router.post("/confirm", confirmBooking);

export default router;
