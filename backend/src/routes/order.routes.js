import { Router } from "express";

import { createOrderController, getOrdersController } from "../controllers/order.controller.js";
import { createOrderValidator, getOrdersValidator } from "../validators/order.validator.js";
import validate from "../middlewares/validate.middleware.js";

const router = Router();

router.post("/", createOrderValidator, validate, createOrderController);

router.get("/", getOrdersValidator, validate, getOrdersController);

export default router;
