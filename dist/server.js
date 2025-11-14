"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = __importDefault(require("./config/env"));
const logger_1 = __importDefault(require("./config/logger"));
const init_server = async () => {
    const port = env_1.default.PORT;
    app_1.default.listen(port, "0.0.0.0", () => {
        logger_1.default.info("Env varibales - ", { env: env_1.default });
        logger_1.default.info(`Server is running on http://0.0.0.0:${port}`);
    });
};
const shutdown = async (signal) => {
    logger_1.default.info("Turning off the server...");
    process.exit(0);
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("uncaughtException", shutdown);
process.on("beforeExit", shutdown);
init_server().catch((error) => {
    logger_1.default.error("Error occured", error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map