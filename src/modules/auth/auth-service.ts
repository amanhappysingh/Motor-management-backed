
import { LoginRequestDTO } from "./auth-dtos";
import AuthReposistory from "./auth-repository";

export default class AuthService {
  private readonly authRepo: AuthReposistory;

  constructor(authRepo: AuthReposistory) {
    this.authRepo = authRepo;
  }

  async login(data: LoginRequestDTO) {
    const user = await this.authRepo.getUserByEmail(data.email);
    if (user === null) throw new Error("User not found", { cause: 404 });
    if (user.password === data.password) return user;
    throw new Error("Invalid credentials", { cause: 400 });
  }
}
