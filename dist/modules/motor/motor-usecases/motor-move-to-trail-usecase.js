"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MotorMoveToTrialUC {
    motorSvc;
    constructor(motorSvc) {
        this.motorSvc = motorSvc;
    }
    async execute(data) {
        await this.motorSvc.motorMoveToTrial(data);
    }
}
exports.default = MotorMoveToTrialUC;
//# sourceMappingURL=motor-move-to-trail-usecase.js.map