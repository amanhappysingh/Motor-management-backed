import { Request, Response, Router } from "express";
import UserRepository from "./user-repository";
import UserService from "./user-service";
import Usercontroller from "./user-controller";
import CreateUserUC from "./user-usecases/create-user-usecase";
import GetUserUC from "./user-usecases/get-user-usecase";
import GetUsersUC from "./user-usecases/get-users-usecase";
import getRolesUC from "./user-usecases/get-roles-usecase";

const userRepo = new UserRepository()
const userSvc = new UserService(userRepo)
const userController = new Usercontroller(new CreateUserUC(userSvc), new GetUserUC(userSvc), new GetUsersUC(userSvc), new getRolesUC(userSvc))

const userRouter = Router()

userRouter.get("/roles", (req: Request, res: Response) => userController.getRoles(req, res))
userRouter.post(":userId", (req: Request, res: Response) => userController.getUser(req, res))
userRouter.get("/", (req: Request, res: Response) => userController.getUsers(req, res))
userRouter.post("/", (req: Request, res: Response) => userController.createUser(req, res))

export { userRouter }