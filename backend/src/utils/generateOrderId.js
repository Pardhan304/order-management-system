import Counter from "../models/Counter.js";

const generateOrderId = async (session) => {
  const counter = await Counter.findByIdAndUpdate(
    "orderId",
    {
      $inc: { sequence: 1 },
    },
    {
      new: true,
      upsert: true,
      session,
    },
  );
  return `ORD${counter.sequence.toString().padStart(6, "0")}`;
};
export default generateOrderId;
