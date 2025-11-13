import { Router } from "express";
import { authRouter } from "../modules/auth";
import { userRouter } from "../modules/user";
import { motorRouter } from "../modules/motor";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/motors", motorRouter);

export { apiRouter };
