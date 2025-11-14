"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GetMotorsUC {
    motorSvc;
    constructor(motorSvc) {
        this.motorSvc = motorSvc;
    }
    async execute(data) {
        return await this.motorSvc.getMotors(data);
    }
}
exports.default = GetMotorsUC;
//# sourceMappingURL=get-motors-usecase.js.map