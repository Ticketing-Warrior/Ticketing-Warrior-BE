import { Router } from "express";

import ticketingRouter from "./ticketingRoutes.js";
import queueRouter from "./queueRouter.js"
const routers = Router();

routers.use("/api/ticketing", ticketingRouter);
routers.use("/api/queue", queueRouter)

export default routers;