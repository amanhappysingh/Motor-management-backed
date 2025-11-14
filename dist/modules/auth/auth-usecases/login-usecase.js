"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = __importDefault(require("../../../utils/jwt"));
class LoginUC {
    authSvc;
    constructor(authSvc) {
        this.authSvc = authSvc;
    }
    async execute(login) {
        const user = await this.authSvc.login(login);
        const authToken = jwt_1.default.signAccessToken(user.id, user.role);
        const rfToken = jwt_1.default.signRefreshToken(user.id, user.role);
        return { user, auth_token: authToken, rf_token: rfToken };
    }
}
exports.default = LoginUC;
//# sourceMappingURL=login-usecase.js.map