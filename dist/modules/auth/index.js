"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("./auth-controller"));
const auth_repository_1 = __importDefault(require("./auth-repository"));
const auth_service_1 = __importDefault(require("./auth-service"));
const login_usecase_1 = __importDefault(require("./auth-usecases/login-usecase"));
const authRepo = new auth_repository_1.default();
const authSvc = new auth_service_1.default(authRepo);
const authController = new auth_controller_1.default(new login_usecase_1.default(authSvc));
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/login", (req, res) => authController.login(req, res));
//# sourceMappingURL=index.js.map