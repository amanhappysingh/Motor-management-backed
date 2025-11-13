// src/config/logger.ts
import pino, { Logger as PinoLogger, LoggerOptions } from "pino";
import IBaseLogger from "../core/base-logger";

class Logger implements IBaseLogger {
  private logger: PinoLogger;

  constructor() {
    const isDev = process.env.NODE_ENV === "development";

    const options: LoggerOptions = {
      level: process.env.LOG_LEVEL || "info",
      base: undefined,
      transport: isDev
        ? {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "SYS:standard",
              ignore: "pid,hostname",
            },
          }
        : undefined,
    };

    this.logger = pino(options);
  }

  info(message: string, meta?: Record<string, any>): void {
    meta ? this.logger.info(meta, message) : this.logger.info(message);
  }

  warn(message: string, meta?: Record<string, any>): void {
    meta ? this.logger.warn(meta, message) : this.logger.warn(message);
  }

  error(message: string | Error, meta?: Record<string, any>): void {
    if (message instanceof Error) {
      this.logger.error({ err: message, ...meta }, message.message);
    } else if (meta) {
      this.logger.error(meta, message);
    } else {
      this.logger.error(message);
    }
  }
}

export default new Logger();
