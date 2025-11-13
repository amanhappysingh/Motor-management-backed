import { MotorMoveToFaultRequestDTO } from "../motor-dtos";
import MotorService from "../motor-service";

export default class MotorMoveToFaultUC {
  private readonly motorSvc: MotorService;

  constructor(motorSvc: MotorService) {
    this.motorSvc = motorSvc;
  }

  async execute(data: MotorMoveToFaultRequestDTO): Promise<void> {
    await this.motorSvc.motorMoveToFault(data)
  }
}
