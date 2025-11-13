import { MotorMoveToTrialRequestDTO } from "../motor-dtos";
import MotorService from "../motor-service";

export default class MotorMoveToTrialUC {
  private readonly motorSvc: MotorService;

  constructor(motorSvc: MotorService) {
    this.motorSvc = motorSvc;
  }

  async execute(data: MotorMoveToTrialRequestDTO): Promise<void> {
    await this.motorSvc.motorMoveToTrial(data)
  }
}
