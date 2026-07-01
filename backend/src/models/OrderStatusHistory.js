import mongoose from "mongoose";
import { ORDER_STATUS } from "../constants/order.constants.js";
import { CHANGED_BY } from "../constants/history.constants.js";

const orderStatusHistorySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    orderId: {
      type: String,
      required: true,
      trim: true,
    },

    fromStatus: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      required: true,
    },

    toStatus: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      required: true,
    },

    changedBy: {
      type: String,
      enum: Object.values(CHANGED_BY),
      default: CHANGED_BY.SYSTEM,
    },

    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

// Indexes
orderStatusHistorySchema.index({ order: 1 });
orderStatusHistorySchema.index({ orderId: 1 });
orderStatusHistorySchema.index({ changedAt: -1 });

const OrderStatusHistory = mongoose.model(
  "OrderStatusHistory",
  orderStatusHistorySchema
);

export default OrderStatusHistory;