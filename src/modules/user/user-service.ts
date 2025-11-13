import { CreateUserDTO, GetRolesDTO, GetUserDTO } from "./user-dtos";
import UserRepository from "./user-repository";

export default class UserService {
  private readonly repo: UserRepository;

  constructor(repo: UserRepository) {
    this.repo = repo;
  }

  async createUser(data: CreateUserDTO): Promise<void> {
    await this.repo.createUser(data);
  }

  async getUser(userId: string): Promise<GetUserDTO | null> {
    return this.repo.getUser(userId);
  }

  async getUsers(): Promise<GetUserDTO[]> {
    return this.repo.getUsers();
  }

  async getRoles(): Promise<GetRolesDTO[]> {
    return this.repo.getRoles();
  }
}
