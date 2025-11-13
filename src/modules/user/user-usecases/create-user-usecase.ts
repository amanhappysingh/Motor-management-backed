import { CreateUserDTO } from "../user-dtos";
import UserService from "../user-service";

export default class CreateUserUC {
  private readonly userSvc: UserService;

  constructor(userSvc: UserService) {
    this.userSvc = userSvc;
  }

  async execute(data: CreateUserDTO): Promise<void> {
    await this.userSvc.createUser(data);
  }
}
