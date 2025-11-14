"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MotorMoveToOutUC {
    motorSvc;
    constructor(motorSvc) {
        this.motorSvc = motorSvc;
    }
    async execute(data) {
        await this.motorSvc.motorMoveToOut(data);
    }
}
exports.default = MotorMoveToOutUC;
//# sourceMappingURL=motor-move-to-out-usecase.js.map