import { Request, Response, Router } from "express";
import AuthController from "./auth-controller";
import AuthReposistory from "./auth-repository";
import AuthService from "./auth-service";
import LoginUC from "./auth-usecases/login-usecase";

const authRepo = new AuthReposistory()
const authSvc = new AuthService(authRepo)
const authController = new AuthController(new LoginUC(authSvc))

export const authRouter = Router()

authRouter.post("/login", (req: Request, res: Response) => authController.login(req, res))
