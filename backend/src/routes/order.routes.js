import { Router } from "express";

import { createOrderController } from "../controllers/order.controller.js";
import { createOrderValidator } from "../validators/order.validator.js";
import validate from "../middlewares/validate.middleware.js";

const router = Router();

router.post(
  "/",
  createOrderValidator,
  validate,
  createOrderController
);

export default router;