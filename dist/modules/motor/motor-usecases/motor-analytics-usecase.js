"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MotorAnalyticsUC {
    motorSvc;
    constructor(motorSvc) {
        this.motorSvc = motorSvc;
    }
    async execute(userId) {
        return await this.motorSvc.motorAnalytics(userId);
    }
}
exports.default = MotorAnalyticsUC;
//# sourceMappingURL=motor-analytics-usecase.js.map