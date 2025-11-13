import { Request, Response } from "express";
import LoginUC from "./auth-usecases/login-usecase";
import { StatusCodes } from "http-status-codes";
import ApiResponse from "../../core/base-response";

export default class AuthController {
  private readonly loginUC: LoginUC;

  constructor(loginUC: LoginUC) {
    this.loginUC = loginUC;
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this.loginUC.execute({ email, password });
      res.status(StatusCodes.OK).json(ApiResponse.ok({ message: "Login successfully", data: result }))
    } catch (error: any) {
      switch(error.cause) {
        case 404:
          res.status(StatusCodes.NOT_FOUND).json(ApiResponse.notFound({ message: error.message }))
          break
        case 400:
          res.status(StatusCodes.BAD_REQUEST).json(ApiResponse.badRequest({ message: error.message }))
          break
        default:
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ApiResponse.error({ message: error.message }))
      }
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    res.status(204);
  }
}
