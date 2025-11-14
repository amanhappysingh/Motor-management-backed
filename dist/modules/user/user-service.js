"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async createUser(data) {
        await this.repo.createUser(data);
    }
    async getUser(userId) {
        return this.repo.getUser(userId);
    }
    async getUsers() {
        return this.repo.getUsers();
    }
    async getRoles() {
        return this.repo.getRoles();
    }
}
exports.default = UserService;
//# sourceMappingURL=user-service.js.map