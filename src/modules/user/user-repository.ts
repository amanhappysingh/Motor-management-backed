import { PoolClient, QueryResult } from "pg";
import PostgresRepository from "../../config/postgres-repository";
import { CreateUserDTO, GetRolesDTO, GetUserDTO } from "./user-dtos";
import { Roles } from "../../core/types";

export default class UserRepository extends PostgresRepository {
  constructor() {
    super();
  }

  async createUser(data: CreateUserDTO): Promise<void> {
    const client: PoolClient = await this.pool.connect();
    try {
      await client.query("BEGIN");

      const result_user: QueryResult = await client.query(
        "INSERT INTO users (email, phone, password) VALUES ($1, $2, $3) RETURNING id",
        [data.email, data.phone, data.password]
      );

      if (!result_user.rowCount) {
        throw new Error("Failed to create user");
      }

      const userId: string = result_user.rows[0].id;

      const result_user_profile: QueryResult = await client.query(
        "INSERT INTO user_profile (display_name, user_id) VALUES ($1, $2) RETURNING id",
        [data.display_name, userId]
      );

      if (!result_user_profile.rowCount) {
        throw new Error("Failed to create user profile");
      }

      const userProfileId: string = result_user_profile.rows[0].id;

      await client.query(
        "INSERT INTO user_role (role_id, user_id, user_profile_id) VALUES ($1, $2, $3)",
        [data.role_id, userId, userProfileId]
      );

      await client.query("COMMIT");
    } catch (error: any) {
      await client.query("ROLLBACK");
      switch (error.code) {
        case "23505":
          throw new Error(error.detail, { cause: 2 });
        case "22P02":
          throw new Error("Incorrect UUID", { cause: 3 });
        case "23503":
          throw new Error(error.detail, { cause: 4 });
        default:
          throw error;
      }
    } finally {
      client.release();
    }
  }

  async getUser(id: string): Promise<GetUserDTO | null> {
    const result: QueryResult = await this.pool.query(
      "SELECT u.email, u.phone, up.display_name, ur.role FROM users u LEFT JOIN user_profile up ON u.id = up.user_id LEFT JOIN user_role ur ON u.id = ur.user_id WHERE id = $1",
      [id]
    );
    return result.rows[0] as GetUserDTO;
  }

  async getUsers(): Promise<GetUserDTO[]> {
    const result: QueryResult = await this.pool.query(
      `SELECT
      u.email,
      u.phone,
      up.display_name,
      r.role
      FROM users u
      LEFT JOIN user_role ur ON ur.user_id = u.id
      LEFT JOIN user_profile up ON up.user_id = u.id
      LEFT JOIN roles r ON r.id = ur.role_id
      WHERE role in ($1, $2)
      `, 
      [Roles.Workshop_Engineer, Roles.Technician]
    );
    return result.rows as GetUserDTO[];
  }

  async getRoles(): Promise<GetRolesDTO[]> {
    const result: QueryResult = await this.pool.query("SELECT * from roles");
    return result.rows as GetRolesDTO[];
  }
}
