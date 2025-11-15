"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const base_response_1 = __importDefault(require("../../core/base-response"));
const motor_validator_1 = require("./motor-validator");
const logger_1 = __importDefault(require("../../config/logger"));
class MotorController {
    motorInUC;
    getMotorsUC;
    getMotorUC;
    motorMoveToOverhaulingUC;
    motorMoveToTrialUC;
    motorMoveToAvailableUC;
    motorMoveToOutUC;
    motorMoveToFaultUC;
    motorAnalyticsUC;
    constructor(motorInUC, getMotorsUC, getMotorUC, motorMoveToOverhaulingUC, motorMoveToTrialUC, motorMoveToAvailableUC, motorMoveToOutUC, motorMoveToFaultUC, motorAnalytics) {
        this.motorInUC = motorInUC;
        this.getMotorsUC = getMotorsUC;
        this.getMotorUC = getMotorUC;
        this.motorMoveToOverhaulingUC = motorMoveToOverhaulingUC;
        this.motorMoveToTrialUC = motorMoveToTrialUC;
        this.motorMoveToAvailableUC = motorMoveToAvailableUC;
        this.motorMoveToOutUC = motorMoveToOutUC;
        this.motorMoveToFaultUC = motorMoveToFaultUC;
        this.motorAnalyticsUC = motorAnalytics;
    }
    async motorIn(req, res) {
        try {
            const data = motor_validator_1.motorInRequestSchema.parse(req.body);
            const userId = req.user?.userId;
            await this.motorInUC.execute({ ...data, in_by: userId || "9fa6eb19-433b-48c6-9aaf-a01328c4eeec" });
            res.status(http_status_codes_1.StatusCodes.CREATED).json(base_response_1.default.created());
        }
        catch (error) {
            logger_1.default.error(error.message, error);
            switch (error.cause) {
                case 2:
                    res.status(http_status_codes_1.StatusCodes.CONFLICT).json(base_response_1.default.conflict({ message: error.message }));
                    break;
                case 3:
                    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(base_response_1.default.conflict({ message: error.message }));
                    break;
                case 4:
                    res.status(http_status_codes_1.StatusCodes.CONFLICT).json(base_response_1.default.conflict({ message: error.message }));
                    break;
                default:
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(base_response_1.default.error({ error: error }));
            }
        }
    }
    async getMotors(req, res) {
        try {
            const filters = motor_validator_1.motorFilterSchema.parse(req.query);
            const result = await this.getMotorsUC.execute(filters);
            res.status(http_status_codes_1.StatusCodes.OK).json(base_response_1.default.ok({ data: result }));
        }
        catch (error) {
            logger_1.default.error(error.message, error);
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(base_response_1.default.error({ error: error }));
        }
    }
    async getMotor(req, res) {
        try {
            const motorId = req.params?.motor_id;
            const result = await this.getMotorUC.execute(motorId);
            res.status(http_status_codes_1.StatusCodes.OK).json(base_response_1.default.ok({ data: result }));
        }
        catch (error) {
            logger_1.default.error(error.message, error);
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(base_response_1.default.error({ error: error }));
        }
    }
    async motorMoveToOverhauling(req, res) {
        try {
            const data = motor_validator_1.motorMoveToOverhaulingSchema.parse(req.params);
            const userId = req.user?.userId;
            await this.motorMoveToOverhaulingUC.execute({ ...data, overhauled_started_by: userId || "9fa6eb19-433b-48c6-9aaf-a01328c4eeec" });
            res.status(http_status_codes_1.StatusCodes.OK).json(base_response_1.default.ok({ message: "Motor is moved for overhauling" }));
        }
        catch (error) {
            logger_1.default.error(error.message, error);
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(base_response_1.default.error({ error: error }));
        }
    }
    async motorMoveToTrial(req, res) {
        try {
            const data = motor_validator_1.motorMoveToTrialSchema.parse({ ...req.body, ...req.params });
            const userId = req.user?.userId;
            await this.motorMoveToTrialUC.execute({ ...data, overhauled_completed_by: userId || "9fa6eb19-433b-48c6-9aaf-a01328c4eeec", trial_started_by: userId || "9fa6eb19-433b-48c6-9aaf-a01328c4eeec" });
            res.status(http_status_codes_1.StatusCodes.OK).json(base_response_1.default.ok({ message: "Motor is moved for trial" }));
        }
        catch (error) {
            logger_1.default.error(error.message, error);
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(base_response_1.default.error({ error: error }));
        }
    }
    async motorMoveToAvailable(req, res) {
        try {
            const data = motor_validator_1.motorMoveToAvailableSchema.parse({ ...req.body, ...req.params });
            const userId = req.user?.userId;
            await this.motorMoveToAvailableUC.execute({ ...data, trial_completed_by: userId || "9fa6eb19-433b-48c6-9aaf-a01328c4eeec", available_by: userId || "9fa6eb19-433b-48c6-9aaf-a01328c4eeec" });
            res.status(http_status_codes_1.StatusCodes.OK).json(base_response_1.default.ok({ message: "Motor is now available" }));
        }
        catch (error) {
            logger_1.default.error(error.message, error);
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(base_response_1.default.error({ error: error }));
        }
    }
    async motorMoveToOut(req, res) {
        try {
            // @ts-ignore
            const images = (req.files || [])?.map((image) => image.destination.split("src")[1].replace(/\\/g, "/") + "/" + image.filename);
            const data = motor_validator_1.motorMoveToOutSchema.parse({ ...req.body, ...req.params, images });
            const userId = req.user?.userId;
            await this.motorMoveToOutUC.execute({ ...data, out_by: userId || "9fa6eb19-433b-48c6-9aaf-a01328c4eeec" });
            res.status(http_status_codes_1.StatusCodes.OK).json(base_response_1.default.ok({ message: "Motor is now available" }));
        }
        catch (error) {
            logger_1.default.error(error.message, error);
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(base_response_1.default.error({ error: error }));
        }
    }
    async motorMoveToFault(req, res) {
        try {
            const data = motor_validator_1.motorMoveToFaultSchema.parse({ ...req.body, ...req.params });
            const userId = req.user?.userId;
            await this.motorMoveToFaultUC.execute({ ...data, fault_find_by: userId || "9fa6eb19-433b-48c6-9aaf-a01328c4eeec" });
            res.status(http_status_codes_1.StatusCodes.OK).json(base_response_1.default.ok({ message: "Motor is moved to fault" }));
        }
        catch (error) {
            logger_1.default.error(error.message, error);
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(base_response_1.default.error({ error: error }));
        }
    }
    async motorAnalytics(req, res) {
        try {
            const userId = req.user?.userId;
            const result = await this.motorAnalyticsUC.execute(userId);
            res.status(http_status_codes_1.StatusCodes.OK).json(base_response_1.default.ok({ data: result }));
        }
        catch (error) {
            logger_1.default.error(error.message, error);
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(base_response_1.default.error({ error: error }));
        }
    }
}
exports.default = MotorController;
//# sourceMappingURL=motor-controller.js.map