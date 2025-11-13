import { Request, Response } from "express";
import UserService from "./user-service";
import ApiResponse from "../../core/base-response";
import { StatusCodes } from "http-status-codes";
import CreateUserUC from "./user-usecases/create-user-usecase";
import GetUserUC from "./user-usecases/get-user-usecase";
import GetUsersUC from "./user-usecases/get-users-usecase";
import getRolesUC from "./user-usecases/get-roles-usecase";

export default class Usercontroller {
  private readonly createUserUC: CreateUserUC;
  private readonly getUserUC: GetUserUC;
  private readonly getUsersUC: GetUsersUC;
  private readonly getRolesUC: getRolesUC;

  constructor(
    createUserUC: CreateUserUC,
    getUserUC: GetUserUC,
    getUsersUC: GetUsersUC,
    getRolesUC: getRolesUC
  ) {
    this.createUserUC = createUserUC;
    this.getUserUC = getUserUC;
    this.getUsersUC = getUsersUC;
    this.getRolesUC = getRolesUC;
  }

  async getRoles(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.getRolesUC.execute()
      res.status(StatusCodes.OK).json(ApiResponse.ok({ data: result }));
    } catch (error) {
       res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ApiResponse.error({ error: error }));
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      await this.createUserUC.execute(req.body);
      res.status(StatusCodes.CREATED).json(ApiResponse.created({ message: "User created successfully" }));
    } catch (error: any) {
      switch (error.cause) {
        case 2:
          res.status(StatusCodes.CONFLICT).json(ApiResponse.conflict({ message: error.message }))
          break
        case 3:
          res.status(StatusCodes.BAD_REQUEST).json(ApiResponse.conflict({ message: error.message }))
          break
        case 4:
          res.status(StatusCodes.CONFLICT).json(ApiResponse.conflict({ message: error.message }))
          break
        default:
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ApiResponse.error({ error: error }));
      }
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const userId: string = req.user?.userId as string;
      if (!userId) {
        res.status(StatusCodes.BAD_REQUEST).json(ApiResponse.badRequest());
      }

      const user = await this.getUserUC.execute(userId);
      if (user === null) {
        res.status(StatusCodes.NOT_FOUND).json(ApiResponse.notFound({ message: "User not found" }));
      }

      res.status(StatusCodes.OK).json(ApiResponse.ok({ data: user }));
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ApiResponse.error({ error: error }));
    }
  }

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.getUsersUC.execute()
      res.status(StatusCodes.OK).json(ApiResponse.ok({ data: result }));
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ApiResponse.error({ error: error }));
    }
  }


  async updateUser(req: Request, res: Response): Promise<void> {}

  async deleteUser(req: Request, res: Response): Promise<void> {}
}
