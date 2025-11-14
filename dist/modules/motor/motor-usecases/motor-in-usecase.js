"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __importDefault(require("../../../config/env"));
const qr_code_1 = require("../../../utils/qr-code");
class MotorInUC {
    motorSvc;
    constructor(motorSvc) {
        this.motorSvc = motorSvc;
    }
    async execute(data) {
        const qrImagePath = `${process.cwd()}/src/uploads/qr-code/qr-${data.motor_id}.png`;
        await (0, qr_code_1.generateQR)(`${env_1.default.CLIENT_URL}/motors/${data.motor_id}`, qrImagePath);
        await this.motorSvc.motorIn({ ...data, qr: `/uploads/qr-code/qr-${data.motor_id}.png` });
    }
}
exports.default = MotorInUC;
//# sourceMappingURL=motor-in-usecase.js.map