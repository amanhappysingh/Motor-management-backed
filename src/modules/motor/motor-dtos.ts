import { MotorStatus } from "../../core/types";
import { Motor, MotorFault, MotorIn, MotorOut, MotorOverhauling, MotorTrial } from "./motor-entity";

export type MotorInRequestDTO = Omit<Motor & MotorIn & { qr?: string },  "current_status" >;

export type MotorMoveToTrialRequestDTO = Omit<MotorOverhauling & { trial_started_by: string }, "status" | "overhauled_started_by" | "overhauled_started_at" | "overhauled_completed_at">;

export type MotorMoveToOutRequestDTO = Omit<MotorOut, "out_at">;

export type MotorMoveToFaultRequestDTO = Omit<MotorFault, "fault_find_at" | "old_status">;

export type MotorMoveToAvailableRequestDTO = Omit<MotorTrial & { available_by: string }, "trial_started_at" | "trial_started_by" | "trial_completed_at" | "status">;

export type GetMotorFilterDTO = {
    search?: string;
    status?: MotorStatus;
    from?: string;
    to?: string;
}

export type GetMotorDTO = Omit<Motor & { email: string, role: string, display_name: string, in_at: string }, "created_at" | "updated_at" >

export type MotorMoveToOverhaulingRequestDTO = {
    overhauled_started_by: string;
    motor_id: string;   
}

export type MotorAnalyticDBResultDTO = {
    in_count: number;
    overhauling_count: number;
    out_count: number;
    fault_count: number;
    available_count: number;
    trial_count: number;
}

export type MotorAnalyticDTO = {
  in: number;
  overhauling: number;
  out: number;
  available: number;
  trial: number;
  fault: number;
};

export type MotorAnalyticsDTO = {
  overall: MotorAnalyticDTO;
  today: MotorAnalyticDTO;
  current_week: {
    monday: MotorAnalyticDTO;
    tuesday: MotorAnalyticDTO;
    wednesday: MotorAnalyticDTO;
    thursday: MotorAnalyticDTO;
    friday: MotorAnalyticDTO;
    saturday: MotorAnalyticDTO;
    sunday: MotorAnalyticDTO;
  };
  current_year: {
    january: MotorAnalyticDTO;
    february: MotorAnalyticDTO;
    march: MotorAnalyticDTO;
    april: MotorAnalyticDTO;
    may: MotorAnalyticDTO;
    june: MotorAnalyticDTO;
    july: MotorAnalyticDTO;
    august: MotorAnalyticDTO;
    september: MotorAnalyticDTO;
    october: MotorAnalyticDTO;
    november: MotorAnalyticDTO;
    december: MotorAnalyticDTO;
  };
};
