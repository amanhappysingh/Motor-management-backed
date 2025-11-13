import { Pool } from "pg";
import IBaseRepository from "../core/base-repository";
import env from "./env";

export default class PostgresRepository {
  readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: env.DB_HOST,
      database: env.DB_NAME,
      port: env.DB_PORT,
      password: env.DB_PASSWORD,
      user: env.DB_USER,
      max: 10,
      min: 2,
      connectionTimeoutMillis: 30 * 1000,
    });
  }
}
