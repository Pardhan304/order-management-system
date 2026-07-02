import mongoose from "mongoose";

import Order from "../models/Order.js";
import OrderStatusHistory from "../models/OrderStatusHistory.js";
import SchedulerLog from "../models/SchedulerLog.js";

import { STATUS_TRANSITIONS } from "../constants/order.constants.js";
import { CHANGED_BY } from "../constants/history.constants.js";
import { SCHEDULER_STATUS } from "../constants/scheduler.constants.js";

const processOrder = async (order, fromStatus, toStatus) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Order.findByIdAndUpdate(
      order._id,
      {
        status: toStatus,
        statusChangedAt: new Date(),
      },
      { session },
    );

    await OrderStatusHistory.create(
      [
        {
          order: order._id,
          orderId: order.orderId,
          fromStatus,
          toStatus,
          changedBy: CHANGED_BY.SYSTEM,
          changedAt: new Date(),
        },
      ],
      { session },
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
    let totalOrders = 0;
    let successCount = 0;
    let failedCount = 0;
    const transitions = [];

    for (const rule of STATUS_TRANSITIONS) {
      const cutoff = new Date(Date.now() - rule.afterMinutes * 60 * 1000);

      const expiredOrders = await Order.find({
        status: rule.from,
        statusChangedAt: { $lte: cutoff },
      });

      let ruleSuccess = 0;
      let ruleFailed = 0;

      for (const order of expiredOrders) {
        try {
          await processOrder(order, rule.from, rule.to);
          ruleSuccess++;
        } catch (error) {
          ruleFailed++;
          console.error(
            `Failed to transition order ${order.orderId} (${rule.from} → ${rule.to}):`,
            error.message,
          );
        }
      }

      totalOrders += expiredOrders.length;
      successCount += ruleSuccess;
      failedCount += ruleFailed;

      transitions.push({
        from: rule.from,
        to: rule.to,
        processed: ruleSuccess,
        failed: ruleFailed,
      });
    }

    const finishedAt = new Date();

    await SchedulerLog.findByIdAndUpdate(schedulerLog._id, {
      finishedAt,
      duration: finishedAt.getTime() - startedAt.getTime(),
      totalOrders,
      successCount,
      failedCount,
      transitions,
      status: SCHEDULER_STATUS.SUCCESS,
    });

    return { totalOrders, successCount, failedCount, transitions };
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
