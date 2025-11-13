import { cleanEnv, port, str } from "envalid";
import dotenv from "dotenv";
import path = require("path");

dotenv.config({
  path: path.resolve(__dirname, "../../.env.example"),
});

const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["development", "production", "test"],
    default: "development",
  }),
  PORT: port({ default: 9080 }),
  ALLOWED_ORIGIN: str({
    default: "http://localhost:5173,http://127.0.0.1:5173",
    desc: "Comma-separated list of allowed origins for CORS",
  }),
  DB_USER: str({ desc: "PostgreSQL username" }),
  DB_PASSWORD: str({ desc: "PostgreSQL password" }),
  DB_NAME: str({ desc: "PostgreSQL database name" }),
  DB_HOST: str({ default: "localhost", desc: "Database host" }),
  DB_PORT: port({ default: 5432, desc: "Database port" }),
  AUTH_TOKEN: str({ desc: "Auth token" }),
  RF_TOKEN: str({ desc: "Refresh token" }),
  API_URL: str({ desc: "Api Url" }),
  CLIENT_URL: str({ desc: "Client Url"})
});

export default env;
