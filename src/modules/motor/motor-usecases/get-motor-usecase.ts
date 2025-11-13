import { GetMotorDTO, GetMotorFilterDTO } from "../motor-dtos";
import MotorService from "../motor-service";

export default class GetMotorUC {
    private readonly motorSvc: MotorService;

    constructor(motorSvc: MotorService) {
        this.motorSvc = motorSvc;
    }

    async execute(motorId: string): Promise<GetMotorDTO> {
        return await this.motorSvc.getMotor(motorId)
    }
}