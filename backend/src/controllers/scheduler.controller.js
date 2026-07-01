import { runScheduler } from "../services/scheduler.service.js";

export const runSchedulerController = async (req, res, next) => {
  try {
    const result = await runScheduler();

    return res.status(200).json({
      success: true,
      message: "Scheduler executed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};