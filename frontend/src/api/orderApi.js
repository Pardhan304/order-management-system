import axiosInstance from "./axios";

export const getOrders = async (status) => {
  const params = {};
  if (status && status !== "All") {
    params.status = status;
  }
  const response = await axiosInstance.get("/orders", { params });
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await axiosInstance.post("/orders", orderData);
  return response.data;
};
