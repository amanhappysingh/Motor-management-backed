export enum Roles {
  HOD = "HOD",
  Technician = "Technician",
  Workshop_Engineer = "Workshop_Engineer",
}

export enum MotorOverhaulingAndTrialStatus {
   Active = "Active",
   Completed = "Completed",
   Fault = "Fault"
}

export enum MotorStatus {
  In = "In",
  Overhauling = "Overhauling",
  Trial = "Trial",
  Available = "Available",
  Fault = "Fault",
  Out = "Out"
}

export type tokenPayload = {
  userId: string;
  role: Roles;
  iat: number;
  exp: number;
};
