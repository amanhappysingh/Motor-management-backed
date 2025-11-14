"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CreateUserUC {
    userSvc;
    constructor(userSvc) {
        this.userSvc = userSvc;
    }
    async execute(data) {
        await this.userSvc.createUser(data);
    }
}
exports.default = CreateUserUC;
//# sourceMappingURL=create-user-usecase.js.map