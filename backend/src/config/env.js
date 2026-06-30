const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI,
  schedulerSecret: process.env.SCHEDULER_SECRET,
};

export default env;