"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GetUserUC {
    userSvc;
    constructor(userSvc) {
        this.userSvc = userSvc;
    }
    async execute(userId) {
        return await this.userSvc.getUser(userId);
    }
}
exports.default = GetUserUC;
//# sourceMappingURL=get-user-usecase.js.map