"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_repository_1 = __importDefault(require("../../config/postgres-repository"));
class AuthReposistory extends postgres_repository_1.default {
    constructor() {
        super();
    }
    async getUserByEmail(email) {
        const result = await this.pool.query(`SELECT 
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
            `, [email]);
        return result.rowCount ? result.rows[0] : null;
    }
}
exports.default = AuthReposistory;
//# sourceMappingURL=auth-repository.js.map