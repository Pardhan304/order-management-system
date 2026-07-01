import { body } from "express-validator";
import { PAYMENT_STATUS } from "../constants/order.constants.js";

export const createOrderValidator = [
  body("customerName")
    .trim()
    .notEmpty()
    .withMessage("Customer name is required"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("any")
    .withMessage("Invalid phone number"),
  body("productName").trim().notEmpty().withMessage("Product name is required"),
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater then 0"),
  body("paymentStatus")
    .optional()
    .isIn(Object.values(PAYMENT_STATUS))
    .withMessage("Amount must be greater then 0"),
];
