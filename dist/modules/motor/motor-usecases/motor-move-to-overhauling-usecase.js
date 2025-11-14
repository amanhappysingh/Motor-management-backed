"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MotorMoveToOverhaulingUC {
    motorSvc;
    constructor(motorSvc) {
        this.motorSvc = motorSvc;
    }
    async execute(data) {
        await this.motorSvc.motorMoveToOverhauling(data);
    }
}
exports.default = MotorMoveToOverhaulingUC;
//# sourceMappingURL=motor-move-to-overhauling-usecase.js.map