import mongoose from "mongoose";

import Order from "../models/Order.js";
import OrderStatusHistory from "../models/OrderStatusHistory.js";

import generateOrderId from "../utils/generateOrderId.js";

import { ORDER_STATUS } from "../constants/order.constants.js";
import { CHANGED_BY } from "../constants/history.constants.js";

export const createOrder = async (orderData) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const orderId = await generateOrderId(session);

    const order = await Order.create(
      [
        {
          ...orderData,
          orderId,
        },
      ],
      { session },
    );

    await OrderStatusHistory.create(
      [
        {
          order: order[0]._id,
          orderId: order[0].orderId,
          fromStatus: null,
          toStatus: ORDER_STATUS.PLACED,
          changedBy: CHANGED_BY.SYSTEM,
          changedAt: new Date(),
        },
      ],
      { session },
    );

    await session.commitTransaction();

    return order[0];
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

export const getOrders = async (status) => {
  const filter = status ? { status } : {};

  if (status) {
    filter.status = status;
  }

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .select(
      "orderId customerName phone productName amount paymentStatus status createdAt",
    );

  return orders;
};
