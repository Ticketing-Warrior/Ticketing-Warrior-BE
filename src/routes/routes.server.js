import { Router } from "express";

import ticketingRouter from "./ticketingRoutes.js";
import recordRouter from "./recordRoutes.js";
const routers = Router();

routers.use("/api/ticketing", ticketingRouter);
routers.use("/api/record", recordRouter);

export default routers;
