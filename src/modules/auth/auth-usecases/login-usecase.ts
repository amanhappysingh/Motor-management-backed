import { email } from "zod";
import UserRepository from "../../user/user-repository";
import { LoginRequestDTO, LoginResponseDTO } from "../auth-dtos";
import AuthService from "../auth-service";
import Jwt from "../../../utils/jwt";

export default class LoginUC {
  private readonly authSvc: AuthService;

  constructor(authSvc: AuthService) {
    this.authSvc = authSvc;
  }

  async execute(login: LoginRequestDTO): Promise<LoginResponseDTO> {
    const user = await this.authSvc.login(login);

    const authToken = Jwt.signAccessToken(user.id, user.role);
    const rfToken = Jwt.signRefreshToken(user.id, user.role);

    return { user, auth_token: authToken, rf_token: rfToken };
  }
}
