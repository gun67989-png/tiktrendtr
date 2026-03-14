import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug"),
  ...(process.env.NODE_ENV !== "production" && {
    transport: {
      target: "pino-pretty",
      options: { colorize: true, translateTime: "SYS:HH:MM:ss" },
    },
  }),
});

// Named loggers for different modules
export const authLogger = logger.child({ module: "auth" });
export const paymentLogger = logger.child({ module: "payment" });
export const aiLogger = logger.child({ module: "ai" });
export const cronLogger = logger.child({ module: "cron" });
export const apiLogger = logger.child({ module: "api" });

export default logger;
