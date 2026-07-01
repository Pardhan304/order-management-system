import { createOrder, getOrders } from "../services/order.service.js";

export const createOrderController = async (req, res, next) => {
  try {
    const order = await createOrder(req.body);

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrdersController = async (req, res, next) => {
  try {
    const { status } = req.query;

    const orders = await getOrders(status);

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};
