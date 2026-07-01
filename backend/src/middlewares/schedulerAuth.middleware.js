const schedulerAuth = (req, res, next) => {
  const secret = req.header("x-scheduler-secret");

  if (!secret) {
    return res.status(401).json({
      success: false,
      message: "Scheduler secret is missing",
    });
  }

  if (secret !== process.env.SCHEDULER_SECRET) {
    return res.status(401).json({
      success: false,
      message: "Invalid scheduler secret",
    });
  }

  next();
};

export default schedulerAuth;