import { Request, Response, Router } from "express";
import MotorRepository from "./motor-repository";
import MotorService from "./motor-service";
import MotorController from "./motor-controller";
import MotorInUC from "./motor-usecases/motor-in-usecase";
import GetMotorsUC from "./motor-usecases/get-motors-usecase";
import MotorMoveToOverhaulingUC from "./motor-usecases/motor-move-to-overhauling-usecase";
import MotorMoveToTrialUC from "./motor-usecases/motor-move-to-trail-usecase";
import MotorMoveToAvailableUC from "./motor-usecases/motor-move-to-available-usecase";
import MotorMoveToOutUC from "./motor-usecases/motor-move-to-out-usecase";
import MotorAnalyticsUC from "./motor-usecases/motor-analytics-usecase";
import { fileUploader } from "../../middleware/upload-file";
import MotorMoveToFaultUC from "./motor-usecases/motor-move-to-fault-usecase";
import GetMotorUC from "./motor-usecases/get-motor-usecase";

const motorRepo = new MotorRepository();
const motorSvc = new MotorService(motorRepo);
const motorController = new MotorController(
  new MotorInUC(motorSvc),
  new GetMotorsUC(motorSvc),
  new GetMotorUC(motorSvc),
  new MotorMoveToOverhaulingUC(motorSvc),
  new MotorMoveToTrialUC(motorSvc),
  new MotorMoveToAvailableUC(motorSvc),
  new MotorMoveToOutUC(motorSvc),
  new MotorMoveToFaultUC(motorSvc),
  new MotorAnalyticsUC(motorSvc)
);

const motorRouter = Router();

motorRouter.post("/in", (req: Request, res: Response) => motorController.motorIn(req, res));
motorRouter.patch("/:motor_id/move-to-overhauling", (req: Request, res: Response) => motorController.motorMoveToOverhauling(req, res));
motorRouter.patch("/:motor_id/move-to-trial", (req: Request, res: Response) => motorController.motorMoveToTrial(req, res));
motorRouter.patch("/:motor_id/move-to-fault", (req: Request, res: Response) => motorController.motorMoveToFault(req, res));
motorRouter.patch("/:motor_id/move-to-available", (req: Request, res: Response) => motorController.motorMoveToAvailable(req, res));
motorRouter.patch("/:motor_id/move-to-out", fileUploader.array("images", 4), (req: Request, res: Response) => motorController.motorMoveToOut(req, res));
motorRouter.get("/", (req: Request, res: Response) => motorController.getMotors(req, res));
motorRouter.get("/analytics", (req: Request, res: Response) => motorController.motorAnalytics(req, res));
motorRouter.get("/:motor_id", (req: Request, res: Response) => motorController.getMotor(req, res));

export { motorRouter };
