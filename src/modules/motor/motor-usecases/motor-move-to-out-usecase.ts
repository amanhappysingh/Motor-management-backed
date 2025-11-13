import { MotorMoveToOutRequestDTO } from "../motor-dtos";
import MotorService from "../motor-service";

export default class MotorMoveToOutUC {
  private readonly motorSvc: MotorService;

  constructor(motorSvc: MotorService) {
    this.motorSvc = motorSvc;
  }

  async execute(data: MotorMoveToOutRequestDTO): Promise<void> {
    await this.motorSvc.motorMoveToOut(data)
  }
}
