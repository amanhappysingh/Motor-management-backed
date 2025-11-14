"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MotorService {
    motorRepo;
    constructor(motorRepo) {
        this.motorRepo = motorRepo;
    }
    async motorIn(data) {
        await this.motorRepo.motorIn(data);
    }
    async getMotors(data) {
        return await this.motorRepo.getMotors(data);
    }
    async getMotor(motorId) {
        return await this.motorRepo.getMotor(motorId);
    }
    async motorMoveToOverhauling(data) {
        await this.motorRepo.motorMoveToOverhauling(data);
    }
    async motorMoveToTrial(data) {
        await this.motorRepo.motorMoveToTrial(data);
    }
    async motorMoveToAvailable(data) {
        await this.motorRepo.motorMoveToAvailable(data);
    }
    async motorMoveToOut(data) {
        await this.motorRepo.motorMoveToOut(data);
    }
    async motorMoveToFault(data) {
        await this.motorRepo.motorMoveToFault(data);
    }
    async motorAnalytics(userId) {
        return await this.motorRepo.motorAnalytics(userId);
    }
}
exports.default = MotorService;
//# sourceMappingURL=motor-service.js.map