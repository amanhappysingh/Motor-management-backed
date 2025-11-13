import PostgresRepository from "../../config/postgres-repository";
import { User } from "../user/user-entity";
import { UserWithRoleDTO } from "./auth-dtos";

export default class AuthReposistory extends PostgresRepository {
    
    constructor() {
        super()
    }

    async getUserByEmail(email: string): Promise<UserWithRoleDTO | null> {
        const result = await this.pool.query(
            `SELECT 
            u.id,
            u.email,
            u.phone,
            u.password,
            r.role,
            up.display_name
            FROM users u
            LEFT JOIN user_role ur ON ur.user_id = u.id
            LEFT JOIN user_profile up ON up.id = ur.user_profile_id
            LEFT JOIN roles r ON r.id = ur.role_id
            WHERE u.email = $1
            `,
            [email])
         return result.rowCount ? (result.rows[0] as UserWithRoleDTO) : null;
    }
}
