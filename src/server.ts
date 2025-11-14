import app from "./app";
import env from "./config/env";
import logger from "./config/logger";

const init_server = async () => {
  const port = env.PORT;
  
  app.listen(port, "0.0.0.0", () => {
    logger.info("Env varibales - ", { env })
    logger.info(`Server is running on http://0.0.0.0:${port}`);
  });
};

const shutdown = async (signal?: string) => {
  logger.info("Turning off the server...")
  process.exit(0)
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("uncaughtException", shutdown);
process.on("beforeExit", shutdown);

init_server().catch((error) => {
  logger.error("Error occured", error);
  process.exit(1);
});
