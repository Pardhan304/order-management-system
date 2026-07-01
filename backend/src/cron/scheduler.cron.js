import cron from "node-cron";
import { runScheduler } from "../services/scheduler.service.js";

const startSchedulerCron = () => {
  cron.schedule("*/5 * * * *", async () => {
    console.log("Running scheduler cron...");

    try {
      const result = await runScheduler();

      console.log("Scheduler completed:", result);
    } catch (error) {
      console.error("Scheduler cron failed:", error.message);
    }
  });

  console.log("Scheduler cron started (every 5 minutes)");
};

export default startSchedulerCron;