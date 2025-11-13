import { z } from "zod";
import { formatTimestamp } from "../../utils/date-time";
import { MotorStatus } from "../../core/types";

export const motorInRequestSchema = z
  .object({
    serial_no: z.string().min(1),
    motor_id: z.string().min(1),
    rpm: z.number(),
    frame: z.string(),
    amp: z.string(),
    kw: z.string(),
    voltage: z.string(),
    mounting: z.string(),
    make: z.string(),
    bearing_DE: z.string(),
    bearing_NDE: z.string(),
    in_at_date: z
      .string()
      .regex(/^\d{2}-\d{2}-\d{4}$/, "Date must be in DD-MM-YYYY format"),
    in_at_time: z
      .string()
      .regex(
        /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i,
        "Time must be in 12-hour format (e.g. 10:55 AM)"
      ),
    location: z.string(),
    remark: z.string().optional(),
  })
  .transform((data) => {
    const { in_at_date, in_at_time, ...rest } = data;
    const in_at = formatTimestamp(in_at_date, in_at_time);
    return { ...rest, in_at };
  });


export const motorFilterSchema = z.object({
  search: z.string().min(3).max(50).optional(),
  status: z.nativeEnum(MotorStatus).optional(),
  from: z
    .string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "Invalid date format, expected DD-MM-YYYY")
    .optional(),
  to: z
    .string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "Invalid date format, expected DD-MM-YYYY")
    .optional(),
});

export const motorMoveToTrialSchema = z.object({
   motor_id: z.uuid(),
   remark: z.string().max(200).optional(),
   parts: z.array(z.string()).optional()
})

export const motorMoveToAvailableSchema = z.object({
   motor_id: z.uuid(),
   remark: z.string().max(200).optional(),
   resistance_ry: z.number(),
   resistance_yb: z.number(),
   resistance_rb: z.number(),
   ir_ph_to_ph: z.number(),
   ir_ph_to_e: z.number(),
})

export const motorMoveToOverhaulingSchema = z.object({
   motor_id: z.uuid()
})

export const motorMoveToFaultSchema = z.object({
   motor_id: z.uuid(),
   remark: z.string().optional()
})

export const motorMoveToOutSchema = z.object({
   motor_id: z.uuid(),
   images: z.array(z.string()),
   location: z.string().min(3),
})