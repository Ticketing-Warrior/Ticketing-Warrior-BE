import { Router } from "express";

import ticketingRouter from "./ticketingRoutes.js";
const routers = Router();

routers.use("/api/ticketing", ticketingRouter);

export default routers;