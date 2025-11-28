import { Router } from "express";

import queueRouter from "./queue.router.js";
import recordRouter from "./record.router.js";
import seatRouter from "./seat.router.js";
import testRouter from "./test.router.js";

const routers = Router();

// Health Check 라우트 추가
routers.get("/health", (req, res) => {
  res.status(200).send("OK");
});

routers.use("/api/queue", queueRouter);
routers.use("/api/record", recordRouter);
routers.use("/api/seat", seatRouter);
routers.use("/api/test", testRouter);

export default routers;
