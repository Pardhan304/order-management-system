import Order from "../models/Order.js";
import generateOrderId from "../utils/generateOrderId.js";

export const createOrder = async (orderData) => {
    const orderId = await generateOrderId();

  const order = await Order.create({
    ...orderData,
    orderId,
  });
  return order;
};
