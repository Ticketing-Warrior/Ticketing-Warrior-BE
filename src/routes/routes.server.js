import { Router } from "express";

import queueRouter from "./queueRouter.js";
import recordRouter from "./recordRoutes.js";
import seatRouter from "./seatRouter.js";

const routers = Router();

// Health Check 라우트 추가
routers.get("/health", (req, res) => {
  res.status(200).send("OK");
});

routers.use("/api/queue", queueRouter);
routers.use("/api/record", recordRouter);
routers.use("/api/seat", seatRouter)

export default routers;
