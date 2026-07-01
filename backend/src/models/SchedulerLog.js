import mongoose from "mongoose";
import { SCHEDULER_STATUS } from "../constants/scheduler.constants.js";

const schedulerLogSchema = new mongoose.Schema(
  {
    startedAt: {
      type: Date,
      required: true,
    },

    finishedAt: {
      type: Date,
      default: null,
    },

    duration: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalOrders: {
      type: Number,
      default: 0,
      min: 0,
    },

    successCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    failedCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: Object.values(SCHEDULER_STATUS),
      required: true,
      index: true,
    },

    error: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    versionKey: false,
  },
);

schedulerLogSchema.index({ startedAt: -1 });

const SchedulerLog = mongoose.model("SchedulerLog", schedulerLogSchema);

export default SchedulerLog;
