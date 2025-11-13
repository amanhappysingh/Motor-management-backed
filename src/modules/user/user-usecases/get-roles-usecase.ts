import { GetRolesDTO } from "../user-dtos";
import UserService from "../user-service";

export default class getRolesUC {
    private readonly userSvc: UserService;

    constructor(userSvc: UserService) {
        this.userSvc = userSvc;
    }

    async execute(): Promise<GetRolesDTO[]> {
        return this.userSvc.getRoles()
    }
}