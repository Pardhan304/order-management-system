import mongoose from "mongoose";
import { SCHEDULER_STATUS } from "../constants/scheduler.constants.js";

const schedulerLogSchema = new mongoose.Schema(
  {
    startedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    finishedAt: {
      type: Date,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
      min: 0,
    },

    ordersScanned: {
      type: Number,
      default: 0,
      min: 0,
    },

    ordersUpdated: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: Object.values(SCHEDULER_STATUS),
      required: true,
    },

    error: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// Indexes
schedulerLogSchema.index({ startedAt: -1 });
schedulerLogSchema.index({ status: 1 });

const SchedulerLog = mongoose.model(
  "SchedulerLog",
  schedulerLogSchema
);

export default SchedulerLog;