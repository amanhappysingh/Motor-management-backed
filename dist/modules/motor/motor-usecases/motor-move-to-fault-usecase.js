"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MotorMoveToFaultUC {
    motorSvc;
    constructor(motorSvc) {
        this.motorSvc = motorSvc;
    }
    async execute(data) {
        await this.motorSvc.motorMoveToFault(data);
    }
}
exports.default = MotorMoveToFaultUC;
//# sourceMappingURL=motor-move-to-fault-usecase.js.map