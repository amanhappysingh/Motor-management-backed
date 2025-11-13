import { GetUserDTO } from "../user-dtos";
import UserService from "../user-service";

export default class GetUsersUC {
  private readonly userSvc: UserService;

  constructor(userSvc: UserService) {
    this.userSvc = userSvc;
  }

  async execute(): Promise<GetUserDTO[]> {
    return await this.userSvc.getUsers();
  }
}
