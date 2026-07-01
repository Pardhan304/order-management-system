import mongoose from "mongoose";

import Order from "../models/Order.js";
import OrderStatusHistory from "../models/OrderStatusHistory.js";
import SchedulerLog from "../models/SchedulerLog.js";

import { ORDER_STATUS } from "../constants/order.constants.js";
import { CHANGED_BY } from "../constants/history.constants.js";
import { SCHEDULER_STATUS } from "../constants/scheduler.constants.js";

const processOrder = async (order) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    await Order.findByIdAndUpdate(
      order._id,
      {
        status: ORDER_STATUS.PROCESSING,
        statusChangedAt: new Date(),
      },
      {
        session,
      },
    );

    await OrderStatusHistory.create(
      [
        {
          order: order._id,
          orderId: order.orderId,
          fromStatus: ORDER_STATUS.PLACED,
          toStatus: ORDER_STATUS.PROCESSING,
          changedBy: CHANGED_BY.SYSTEM,
          changedAt: new Date(),
        },
      ],
      {
        session,
      },
    );

    await session.commitTransaction();

    return true;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const runScheduler = async () => {
  const startedAt = new Date();

  const schedulerLog = await SchedulerLog.create({
    startedAt,
    status: SCHEDULER_STATUS.RUNNING,
  });

  try {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const expiredOrders = await Order.find({
      status: ORDER_STATUS.PLACED,
      statusChangedAt: { $lte: tenMinutesAgo },
    });

    let successCount = 0;
    let failedCount = 0;

    for (const order of expiredOrders) {
      try {
        await processOrder(order);
        successCount++;
      } catch (error) {
        failedCount++;

        console.error(
          `Failed to process order ${order.orderId}:`,
          error.message,
        );
      }
    }

    const finishedAt = new Date();

    await SchedulerLog.findByIdAndUpdate(schedulerLog._id, {
      finishedAt,
      duration: finishedAt.getTime() - startedAt.getTime(),
      totalOrders: expiredOrders.length,
      successCount,
      failedCount,
      status: SCHEDULER_STATUS.SUCCESS,
    });

    return {
      totalOrders: expiredOrders.length,
      successCount,
      failedCount,
    };
  } catch (error) {
    const finishedAt = new Date();

    await SchedulerLog.findByIdAndUpdate(schedulerLog._id, {
      finishedAt,
      duration: finishedAt.getTime() - startedAt.getTime(),
      status: SCHEDULER_STATUS.FAILED,
      error: error.message,
    });

    throw error;
  }
};
