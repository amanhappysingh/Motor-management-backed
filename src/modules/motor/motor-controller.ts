import { Request, Response } from "express";
import MotorInUC from "./motor-usecases/motor-in-usecase";
import { StatusCodes } from "http-status-codes";
import ApiResponse from "../../core/base-response";
import { motorFilterSchema, motorInRequestSchema, motorMoveToAvailableSchema, motorMoveToFaultSchema, motorMoveToOutSchema, motorMoveToOverhaulingSchema, motorMoveToTrialSchema } from "./motor-validator";
import GetMotorsUC from "./motor-usecases/get-motors-usecase";
import { GetMotorFilterDTO } from "./motor-dtos";
import logger from "../../config/logger";
import MotorMoveToOverhaulingUC from "./motor-usecases/motor-move-to-overhauling-usecase";
import motorMoveToTrialUC from "./motor-usecases/motor-move-to-trail-usecase";
import motorMoveToAvailableUC from "./motor-usecases/motor-move-to-available-usecase";
import MotorMoveToOutUC from "./motor-usecases/motor-move-to-out-usecase";
import MotorAnalyticsUC from "./motor-usecases/motor-analytics-usecase";
import MotorMoveToFaultUC from "./motor-usecases/motor-move-to-fault-usecase";
import GetMotorUC from "./motor-usecases/get-motor-usecase";

export default class MotorController {
    private readonly motorInUC: MotorInUC;
    private readonly getMotorsUC: GetMotorsUC;
    private readonly getMotorUC: GetMotorUC;
    private readonly motorMoveToOverhaulingUC: MotorMoveToOverhaulingUC;
    private readonly motorMoveToTrialUC: motorMoveToTrialUC;
    private readonly motorMoveToAvailableUC: motorMoveToAvailableUC;
    private readonly motorMoveToOutUC: MotorMoveToOutUC;
    private readonly motorMoveToFaultUC: MotorMoveToFaultUC;
    private readonly motorAnalyticsUC: MotorAnalyticsUC;

    constructor(
        motorInUC: MotorInUC,
        getMotorsUC: GetMotorsUC,
        getMotorUC: GetMotorUC,
        motorMoveToOverhaulingUC: MotorMoveToOverhaulingUC,
        motorMoveToTrialUC: motorMoveToTrialUC,
        motorMoveToAvailableUC: motorMoveToAvailableUC,
        motorMoveToOutUC: MotorMoveToOutUC,
        motorMoveToFaultUC: MotorMoveToFaultUC,
        motorAnalytics: MotorAnalyticsUC) {

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

    async motorIn(req: Request, res: Response): Promise<void> {
        try {
            const data = motorInRequestSchema.parse(req.body)
            const userId = req.user?.userId as string
            await this.motorInUC.execute({...data, in_by: userId || "9fa6eb19-433b-48c6-9aaf-a01328c4eeec"})
            res.status(StatusCodes.CREATED).json(ApiResponse.created())
        } catch (error: any) {
            logger.error(error.message, error)
            switch (error.cause) {
                case 2:
                    res.status(StatusCodes.CONFLICT).json(ApiResponse.conflict({ message: error.message }))
                    break
                case 3:
                    res.status(StatusCodes.BAD_REQUEST).json(ApiResponse.conflict({ message: error.message }))
                    break
                case 4:
                    res.status(StatusCodes.CONFLICT).json(ApiResponse.conflict({ message: error.message }))
                    break
                default:
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ApiResponse.error({ error: error }));
                }
        }
    }

    async getMotors(req: Request, res: Response): Promise<void> {
        try {
            const filters: GetMotorFilterDTO = motorFilterSchema.parse(req.query)
            const result = await this.getMotorsUC.execute(filters)
            res.status(StatusCodes.OK).json(ApiResponse.ok({ data: result }))
        } catch (error: any) {
            logger.error(error.message, error)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ApiResponse.error({ error: error }));
        }
    }

    async getMotor(req: Request, res: Response): Promise<void> {
        try {
            const motorId = req.params?.motor_id 
            const result = await this.getMotorUC.execute(motorId)
            res.status(StatusCodes.OK).json(ApiResponse.ok({ data: result }))
        } catch (error: any) {
            logger.error(error.message, error)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ApiResponse.error({ error: error }));
        }
    }

    async motorMoveToOverhauling(req: Request, res: Response): Promise<void> {
        try {
            const data = motorMoveToOverhaulingSchema.parse(req.params)
            const userId = req.user?.userId as string
            await this.motorMoveToOverhaulingUC.execute({...data, overhauled_started_by: userId || "9fa6eb19-433b-48c6-9aaf-a01328c4eeec" })
            res.status(StatusCodes.OK).json(ApiResponse.ok({ message: "Motor is moved for overhauling"}))
        } catch (error:any) {
            logger.error(error.message, error)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ApiResponse.error({ error: error }));
        }
    }

    async motorMoveToTrial(req: Request, res: Response): Promise<void> {
        try {
            const data = motorMoveToTrialSchema.parse({ ...req.body, ...req.params })
            const userId: string = req.user?.userId as string;
            await this.motorMoveToTrialUC.execute({ ...data, overhauled_completed_by: userId || "9fa6eb19-433b-48c6-9aaf-a01328c4eeec", trial_started_by: userId || "9fa6eb19-433b-48c6-9aaf-a01328c4eeec" })
            res.status(StatusCodes.OK).json(ApiResponse.ok({ message: "Motor is moved for trial"}))
        } catch (error: any) {
            logger.error(error.message, error)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ApiResponse.error({ error: error }));
        }
    }

    async motorMoveToAvailable(req: Request, res: Response): Promise<void> {
        try {
            const data = motorMoveToAvailableSchema.parse({ ...req.body, ...req.params })
            const userId: string = req.user?.userId as string;
            await this.motorMoveToAvailableUC.execute({ ...data, trial_completed_by: userId || "9fa6eb19-433b-48c6-9aaf-a01328c4eeec", available_by: userId || "9fa6eb19-433b-48c6-9aaf-a01328c4eeec" })
            res.status(StatusCodes.OK).json(ApiResponse.ok({ message: "Motor is now available"}))
        } catch (error: any) {
            logger.error(error.message, error)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ApiResponse.error({ error: error }));
        }
    }

    async motorMoveToOut(req: Request, res: Response): Promise<void> {
        try {
            // @ts-ignore
            const images = (req.files || [])?.map((image: any) => image.destination.split("src")[1].replace(/\\/g, "/") + "/" +image.filename);
            const data = motorMoveToOutSchema.parse({ ...req.body, ...req.params, images })
            const userId: string = req.user?.userId as string;
            await this.motorMoveToOutUC.execute({ ...data, out_by: userId || "9fa6eb19-433b-48c6-9aaf-a01328c4eeec" })
            res.status(StatusCodes.OK).json(ApiResponse.ok({ message: "Motor is now available"}))
        } catch (error: any) {
            logger.error(error.message, error)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ApiResponse.error({ error: error }));
        }
    }

    async motorMoveToFault(req: Request, res: Response): Promise<void> {
        try {
            const data = motorMoveToFaultSchema.parse({ ...req.body, ...req.params })
            const userId: string = req.user?.userId as string;
            await this.motorMoveToFaultUC.execute({ ...data, fault_find_by: userId || "9fa6eb19-433b-48c6-9aaf-a01328c4eeec" })
            res.status(StatusCodes.OK).json(ApiResponse.ok({ message: "Motor is moved to fault"}))
        } catch (error: any) {
            logger.error(error.message, error)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ApiResponse.error({ error: error }));
        }
    }

    async motorAnalytics(req: Request, res: Response): Promise<void> {
        try {
            const userId: string = req.user?.userId as string;
            const result = await this.motorAnalyticsUC.execute(userId)
            res.status(StatusCodes.OK).json(ApiResponse.ok({ data: result }))
        } catch (error: any) {
            logger.error(error.message, error)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ApiResponse.error({ error: error }));
        }
    }
}