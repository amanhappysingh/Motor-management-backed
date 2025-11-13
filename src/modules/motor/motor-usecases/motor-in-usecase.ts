import env from "../../../config/env";
import { generateQR } from "../../../utils/qr-code";
import { MotorInRequestDTO } from "../motor-dtos";
import MotorService from "../motor-service";

export default class MotorInUC {
  private readonly motorSvc: MotorService;

  constructor(motorSvc: MotorService) {
    this.motorSvc = motorSvc;
  }

  async execute(data: Omit<MotorInRequestDTO, "qr">): Promise<void> {
    const qrImagePath: string = `${process.cwd()}/src/uploads/qr-code/qr-${data.motor_id}.png`
    await generateQR(`${env.CLIENT_URL}/motors/${data.motor_id}`, qrImagePath)
    await this.motorSvc.motorIn({ ...data, qr: `/uploads/qr-code/qr-${data.motor_id}.png` });
  }
}
