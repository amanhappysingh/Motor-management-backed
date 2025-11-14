"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthService {
    authRepo;
    constructor(authRepo) {
        this.authRepo = authRepo;
    }
    async login(data) {
        const user = await this.authRepo.getUserByEmail(data.email);
        if (user === null)
            throw new Error("User not found", { cause: 404 });
        if (user.password === data.password)
            return user;
        throw new Error("Invalid credentials", { cause: 400 });
    }
}
exports.default = AuthService;
//# sourceMappingURL=auth-service.js.map