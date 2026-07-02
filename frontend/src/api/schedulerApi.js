import axiosInstance from "./axios";

export const runScheduler = async (secret) => {
  const response = await axiosInstance.post(
    "/scheduler/run",
    {},
    {
      headers: {
        "x-scheduler-secret": secret,
      },
    }
  );
  return response.data;
};
