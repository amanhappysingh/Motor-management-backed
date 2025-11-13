import { CreateUserDTO, GetUserDTO } from "../user-dtos";
import UserService from "../user-service";

export default class GetUserUC {
  private readonly userSvc: UserService;

  constructor(userSvc: UserService) {
    this.userSvc = userSvc;
  }

  async execute(userId: string): Promise<GetUserDTO | null> {
    return await this.userSvc.getUser(userId);
  }
}
