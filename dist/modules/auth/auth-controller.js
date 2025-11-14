"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const base_response_1 = __importDefault(require("../../core/base-response"));
class AuthController {
    loginUC;
    constructor(loginUC) {
        this.loginUC = loginUC;
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await this.loginUC.execute({ email, password });
            res.status(http_status_codes_1.StatusCodes.OK).json(base_response_1.default.ok({ message: "Login successfully", data: result }));
        }
        catch (error) {
            switch (error.cause) {
                case 404:
                    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json(base_response_1.default.notFound({ message: error.message }));
                    break;
                case 400:
                    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(base_response_1.default.badRequest({ message: error.message }));
                    break;
                default:
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(base_response_1.default.error({ message: error.message }));
            }
        }
    }
    async logout(req, res) {
        res.status(204);
    }
}
exports.default = AuthController;
//# sourceMappingURL=auth-controller.js.map