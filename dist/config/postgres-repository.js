"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const env_1 = __importDefault(require("./env"));
class PostgresRepository {
    pool;
    constructor() {
        this.pool = new pg_1.Pool({
            host: env_1.default.DB_HOST,
            database: env_1.default.DB_NAME,
            port: env_1.default.DB_PORT,
            password: env_1.default.DB_PASSWORD,
            user: env_1.default.DB_USER,
            max: 10,
            min: 2,
            connectionTimeoutMillis: 30 * 1000,
        });
    }
}
exports.default = PostgresRepository;
//# sourceMappingURL=postgres-repository.js.map