import { MotorMoveToAvailableRequestDTO } from "../motor-dtos";
import MotorService from "../motor-service";

export default class MotorMoveToAvailableUC {
  private readonly motorSvc: MotorService;

  constructor(motorSvc: MotorService) {
    this.motorSvc = motorSvc;
  }

  async execute(data: MotorMoveToAvailableRequestDTO): Promise<void> {
    await this.motorSvc.motorMoveToAvailable(data)
  }
}
