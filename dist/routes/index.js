"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../modules/auth");
const user_1 = require("../modules/user");
const motor_1 = require("../modules/motor");
const apiRouter = (0, express_1.Router)();
exports.apiRouter = apiRouter;
apiRouter.use("/auth", auth_1.authRouter);
apiRouter.use("/users", user_1.userRouter);
apiRouter.use("/motors", motor_1.motorRouter);
//# sourceMappingURL=index.js.map