import { MotorMoveToOverhaulingRequestDTO } from "../motor-dtos";
import MotorService from "../motor-service";

export default class MotorMoveToOverhaulingUC {
  private readonly motorSvc: MotorService;

  constructor(motorSvc: MotorService) {
    this.motorSvc = motorSvc;
  }

  async execute(data: MotorMoveToOverhaulingRequestDTO): Promise<void> {
    await this.motorSvc.motorMoveToOverhauling(data)
  }
}
