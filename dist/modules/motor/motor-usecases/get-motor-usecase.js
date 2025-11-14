"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GetMotorUC {
    motorSvc;
    constructor(motorSvc) {
        this.motorSvc = motorSvc;
    }
    async execute(motorId) {
        return await this.motorSvc.getMotor(motorId);
    }
}
exports.default = GetMotorUC;
//# sourceMappingURL=get-motor-usecase.js.map