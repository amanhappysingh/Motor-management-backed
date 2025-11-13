import { GetMotorDTO, GetMotorFilterDTO, MotorMoveToAvailableRequestDTO, MotorInRequestDTO, MotorMoveToOverhaulingRequestDTO, MotorMoveToTrialRequestDTO, MotorMoveToOutRequestDTO, MotorAnalyticsDTO, MotorMoveToFaultRequestDTO } from "./motor-dtos";
import MotorRepository from "./motor-repository";

export default class MotorService {
    private readonly motorRepo: MotorRepository;

    constructor(motorRepo: MotorRepository) {
        this.motorRepo = motorRepo;
    }

    async motorIn(data: MotorInRequestDTO): Promise<void> {
        await this.motorRepo.motorIn(data)
    }

    async getMotors(data: GetMotorFilterDTO): Promise<GetMotorDTO[]> {
        return await this.motorRepo.getMotors(data)
    }

    async getMotor(motorId: string): Promise<GetMotorDTO> {
        return await this.motorRepo.getMotor(motorId)
    }

    async motorMoveToOverhauling(data: MotorMoveToOverhaulingRequestDTO): Promise<void> {
        await this.motorRepo.motorMoveToOverhauling(data)
    }

    async motorMoveToTrial(data: MotorMoveToTrialRequestDTO): Promise<void> {
        await this.motorRepo.motorMoveToTrial(data)
    }

    async motorMoveToAvailable(data: MotorMoveToAvailableRequestDTO): Promise<void> {
        await this.motorRepo.motorMoveToAvailable(data)
    }

    async motorMoveToOut(data: MotorMoveToOutRequestDTO): Promise<void> {
        await this.motorRepo.motorMoveToOut(data)
    }

    async motorMoveToFault(data: MotorMoveToFaultRequestDTO): Promise<void> {
        await this.motorRepo.motorMoveToFault(data)
    }

    async motorAnalytics(userId: string): Promise<MotorAnalyticsDTO> {
        return await this.motorRepo.motorAnalytics(userId)
    }
}
