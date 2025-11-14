"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_repository_1 = __importDefault(require("./user-repository"));
const user_service_1 = __importDefault(require("./user-service"));
const user_controller_1 = __importDefault(require("./user-controller"));
const create_user_usecase_1 = __importDefault(require("./user-usecases/create-user-usecase"));
const get_user_usecase_1 = __importDefault(require("./user-usecases/get-user-usecase"));
const get_users_usecase_1 = __importDefault(require("./user-usecases/get-users-usecase"));
const get_roles_usecase_1 = __importDefault(require("./user-usecases/get-roles-usecase"));
const userRepo = new user_repository_1.default();
const userSvc = new user_service_1.default(userRepo);
const userController = new user_controller_1.default(new create_user_usecase_1.default(userSvc), new get_user_usecase_1.default(userSvc), new get_users_usecase_1.default(userSvc), new get_roles_usecase_1.default(userSvc));
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
userRouter.get("/roles", (req, res) => userController.getRoles(req, res));
userRouter.post(":userId", (req, res) => userController.getUser(req, res));
userRouter.get("/", (req, res) => userController.getUsers(req, res));
userRouter.post("/", (req, res) => userController.createUser(req, res));
//# sourceMappingURL=index.js.map