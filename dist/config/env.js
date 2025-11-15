"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
const dotenv_1 = __importDefault(require("dotenv"));
const path = require("path");
dotenv_1.default.config({
    path: path.resolve(__dirname, "../../.env"),
});
const env = (0, envalid_1.cleanEnv)(process.env, {
    NODE_ENV: (0, envalid_1.str)({
        choices: ["development", "production", "test"],
        default: "development",
    }),
    PORT: (0, envalid_1.port)({ default: 9080 }),
    ALLOWED_ORIGIN: (0, envalid_1.str)({
        default: "http://localhost:5173,http://127.0.0.1:5173",
        desc: "Comma-separated list of allowed origins for CORS",
    }),
    DB_USER: (0, envalid_1.str)({ desc: "PostgreSQL username" }),
    DB_PASSWORD: (0, envalid_1.str)({ desc: "PostgreSQL password" }),
    DB_NAME: (0, envalid_1.str)({ desc: "PostgreSQL database name" }),
    DB_HOST: (0, envalid_1.str)({ default: "localhost", desc: "Database host" }),
    DB_PORT: (0, envalid_1.port)({ default: 5432, desc: "Database port" }),
    AUTH_TOKEN: (0, envalid_1.str)({ desc: "Auth token" }),
    RF_TOKEN: (0, envalid_1.str)({ desc: "Refresh token" }),
    API_URL: (0, envalid_1.str)({ desc: "Api Url" }),
    CLIENT_URL: (0, envalid_1.str)({ desc: "Client Url" })
});
exports.default = env;
//# sourceMappingURL=env.js.map