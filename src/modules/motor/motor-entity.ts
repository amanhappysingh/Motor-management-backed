import { BaseEntity } from "../../core/base-entity";
import { MotorStatus, MotorOverhaulingAndTrialStatus } from "../../core/types";

export interface Motor extends BaseEntity {
  serial_no: string;
  motor_id: string;
  rpm: number;
  frame: string;
  qr: string;
  amp: string;
  kw: string;
  voltage: string;
  mounting: string;
  make: string;
  current_status: MotorStatus;
  bearing_DE: string;
  bearing_NDE: string;
}

export interface MotorHistory extends BaseEntity {
  motor_id: string;
  old_status?: MotorStatus;
  new_status: MotorStatus;
  changed_by: string;
  details: any;
}

export interface MotorIn extends BaseEntity {
  motor_id: string;
  location: string;
  in_at: string;
  in_by: string;
  remark?: string | null;
}

export interface MotorOverhauling extends BaseEntity {
  motor_id: string;
  parts?: string[];
  remark?: string | null;
  status: MotorOverhaulingAndTrialStatus;
  overhauled_started_by: string;
  overhauled_started_at: string;
  overhauled_completed_by: string;
  overhauled_completed_at: string;
}

export interface MotorTrial extends BaseEntity {
  motor_id: string;
  remark?: string | null;
  resistance_ry: number;
  resistance_yb: number;
  resistance_rb: number;
  ir_ph_to_ph: number;
  ir_ph_to_e: number;
  status: MotorOverhaulingAndTrialStatus;
  trial_started_by: string;
  trial_started_at: string;
  trial_completed_by: string;
  trial_completed_at: string;
}

export interface MotorFault extends BaseEntity {
  motor_id: string;
  old_status: MotorStatus;
  remark?: string | null;
  fault_find_at: string;
  fault_find_by: string;
}

export interface MotorAvailable extends BaseEntity {
  motor_id: string;
  remark?: string | null;
  available_by: string;
  available_at: string;
}

export interface MotorOut extends BaseEntity {
  motor_id: string;
  remark?: string | null;
  out_at: string;
  out_by: string;
  images: string[];
  location: string;
}

