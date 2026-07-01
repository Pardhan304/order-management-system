import { Router } from "express";

import { runSchedulerController } from "../controllers/scheduler.controller.js";
import schedulerAuth from "../middlewares/schedulerAuth.middleware.js";

const router = Router();

router.post(
  "/run",
  schedulerAuth,
  runSchedulerController
);

export default router;