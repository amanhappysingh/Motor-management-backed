import { MotorAnalyticsDTO } from "../motor-dtos";
import MotorService from "../motor-service";

export default class MotorAnalyticsUC {
     private readonly motorSvc: MotorService;

     constructor(motorSvc: MotorService) {
        this.motorSvc = motorSvc;
     }

     async execute(userId: string): Promise<MotorAnalyticsDTO> {
        return await this.motorSvc.motorAnalytics(userId)
     }
}