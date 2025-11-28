import { Router } from "express";

import queueRouter from "./queueRouter.js";
import recordRouter from "./recordRoutes.js";
const routers = Router();

routers.use("/api/queue", queueRouter);
routers.use("/api/record", recordRouter);

export default routers;
