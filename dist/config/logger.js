"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/config/logger.ts
const pino_1 = __importDefault(require("pino"));
class Logger {
    logger;
    constructor() {
        const isDev = process.env.NODE_ENV === "development";
        const options = {
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
        this.logger = (0, pino_1.default)(options);
    }
    info(message, meta) {
        meta ? this.logger.info(meta, message) : this.logger.info(message);
    }
    warn(message, meta) {
        meta ? this.logger.warn(meta, message) : this.logger.warn(message);
    }
    error(message, meta) {
        if (message instanceof Error) {
            this.logger.error({ err: message, ...meta }, message.message);
        }
        else if (meta) {
            this.logger.error(meta, message);
        }
        else {
            this.logger.error(message);
        }
    }
}
exports.default = new Logger();
//# sourceMappingURL=logger.js.map