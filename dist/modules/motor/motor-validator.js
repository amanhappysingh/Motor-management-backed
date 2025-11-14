"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.motorMoveToOutSchema = exports.motorMoveToFaultSchema = exports.motorMoveToOverhaulingSchema = exports.motorMoveToAvailableSchema = exports.motorMoveToTrialSchema = exports.motorFilterSchema = exports.motorInRequestSchema = void 0;
const zod_1 = require("zod");
const date_time_1 = require("../../utils/date-time");
const types_1 = require("../../core/types");
exports.motorInRequestSchema = zod_1.z
    .object({
    serial_no: zod_1.z.string().min(1),
    motor_id: zod_1.z.string().min(1),
    rpm: zod_1.z.number(),
    frame: zod_1.z.string(),
    amp: zod_1.z.string(),
    kw: zod_1.z.string(),
    voltage: zod_1.z.string(),
    mounting: zod_1.z.string(),
    make: zod_1.z.string(),
    bearing_DE: zod_1.z.string(),
    bearing_NDE: zod_1.z.string(),
    in_at_date: zod_1.z
        .string()
        .regex(/^\d{2}-\d{2}-\d{4}$/, "Date must be in DD-MM-YYYY format"),
    in_at_time: zod_1.z
        .string()
        .regex(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i, "Time must be in 12-hour format (e.g. 10:55 AM)"),
    location: zod_1.z.string(),
    remark: zod_1.z.string().optional(),
})
    .transform((data) => {
    const { in_at_date, in_at_time, ...rest } = data;
    const in_at = (0, date_time_1.formatTimestamp)(in_at_date, in_at_time);
    return { ...rest, in_at };
});
exports.motorFilterSchema = zod_1.z.object({
    search: zod_1.z.string().min(3).max(50).optional(),
    status: zod_1.z.nativeEnum(types_1.MotorStatus).optional(),
    from: zod_1.z
        .string()
        .regex(/^\d{2}-\d{2}-\d{4}$/, "Invalid date format, expected DD-MM-YYYY")
        .optional(),
    to: zod_1.z
        .string()
        .regex(/^\d{2}-\d{2}-\d{4}$/, "Invalid date format, expected DD-MM-YYYY")
        .optional(),
});
exports.motorMoveToTrialSchema = zod_1.z.object({
    motor_id: zod_1.z.uuid(),
    remark: zod_1.z.string().max(200).optional(),
    parts: zod_1.z.array(zod_1.z.string()).optional()
});
exports.motorMoveToAvailableSchema = zod_1.z.object({
    motor_id: zod_1.z.uuid(),
    remark: zod_1.z.string().max(200).optional(),
    resistance_ry: zod_1.z.number(),
    resistance_yb: zod_1.z.number(),
    resistance_rb: zod_1.z.number(),
    ir_ph_to_ph: zod_1.z.number(),
    ir_ph_to_e: zod_1.z.number(),
});
exports.motorMoveToOverhaulingSchema = zod_1.z.object({
    motor_id: zod_1.z.uuid()
});
exports.motorMoveToFaultSchema = zod_1.z.object({
    motor_id: zod_1.z.uuid(),
    remark: zod_1.z.string().optional()
});
exports.motorMoveToOutSchema = zod_1.z.object({
    motor_id: zod_1.z.uuid(),
    images: zod_1.z.array(zod_1.z.string()),
    location: zod_1.z.string().min(3),
});
//# sourceMappingURL=motor-validator.js.map