"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GetUsersUC {
    userSvc;
    constructor(userSvc) {
        this.userSvc = userSvc;
    }
    async execute() {
        return await this.userSvc.getUsers();
    }
}
exports.default = GetUsersUC;
//# sourceMappingURL=get-users-usecase.js.map