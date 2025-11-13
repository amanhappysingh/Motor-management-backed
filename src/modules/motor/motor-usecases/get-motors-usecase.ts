import { GetMotorDTO, GetMotorFilterDTO } from "../motor-dtos";
import MotorService from "../motor-service";

export default class GetMotorsUC {
    private readonly motorSvc: MotorService;

    constructor(motorSvc: MotorService) {
        this.motorSvc = motorSvc;
    }

    async execute(data: GetMotorFilterDTO): Promise<GetMotorDTO[]> {
        return await this.motorSvc.getMotors(data)
    }
}