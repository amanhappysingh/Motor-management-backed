"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MotorMoveToAvailableUC {
    motorSvc;
    constructor(motorSvc) {
        this.motorSvc = motorSvc;
    }
    async execute(data) {
        await this.motorSvc.motorMoveToAvailable(data);
    }
}
exports.default = MotorMoveToAvailableUC;
//# sourceMappingURL=motor-move-to-available-usecase.js.map