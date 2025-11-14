"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class getRolesUC {
    userSvc;
    constructor(userSvc) {
        this.userSvc = userSvc;
    }
    async execute() {
        return this.userSvc.getRoles();
    }
}
exports.default = getRolesUC;
//# sourceMappingURL=get-roles-usecase.js.map