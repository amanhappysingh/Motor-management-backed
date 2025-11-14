"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_response_1 = __importDefault(require("../../core/base-response"));
const http_status_codes_1 = require("http-status-codes");
class Usercontroller {
    createUserUC;
    getUserUC;
    getUsersUC;
    getRolesUC;
    constructor(createUserUC, getUserUC, getUsersUC, getRolesUC) {
        this.createUserUC = createUserUC;
        this.getUserUC = getUserUC;
        this.getUsersUC = getUsersUC;
        this.getRolesUC = getRolesUC;
    }
    async getRoles(req, res) {
        try {
            const result = await this.getRolesUC.execute();
            res.status(http_status_codes_1.StatusCodes.OK).json(base_response_1.default.ok({ data: result }));
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(base_response_1.default.error({ error: error }));
        }
    }
    async createUser(req, res) {
        try {
            await this.createUserUC.execute(req.body);
            res.status(http_status_codes_1.StatusCodes.CREATED).json(base_response_1.default.created({ message: "User created successfully" }));
        }
        catch (error) {
            switch (error.cause) {
                case 2:
                    res.status(http_status_codes_1.StatusCodes.CONFLICT).json(base_response_1.default.conflict({ message: error.message }));
                    break;
                case 3:
                    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(base_response_1.default.conflict({ message: error.message }));
                    break;
                case 4:
                    res.status(http_status_codes_1.StatusCodes.CONFLICT).json(base_response_1.default.conflict({ message: error.message }));
                    break;
                default:
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(base_response_1.default.error({ error: error }));
            }
        }
    }
    async getUser(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(base_response_1.default.badRequest());
            }
            const user = await this.getUserUC.execute(userId);
            if (user === null) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json(base_response_1.default.notFound({ message: "User not found" }));
            }
            res.status(http_status_codes_1.StatusCodes.OK).json(base_response_1.default.ok({ data: user }));
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(base_response_1.default.error({ error: error }));
        }
    }
    async getUsers(req, res) {
        try {
            const result = await this.getUsersUC.execute();
            res.status(http_status_codes_1.StatusCodes.OK).json(base_response_1.default.ok({ data: result }));
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(base_response_1.default.error({ error: error }));
        }
    }
    async updateUser(req, res) { }
    async deleteUser(req, res) { }
}
exports.default = Usercontroller;
//# sourceMappingURL=user-controller.js.map