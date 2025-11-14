"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_repository_1 = __importDefault(require("../../config/postgres-repository"));
const types_1 = require("../../core/types");
const env_1 = __importDefault(require("../../config/env"));
class MotorRepository extends postgres_repository_1.default {
    constructor() {
        super();
    }
    async motorIn(data) {
        const client = await this.pool.connect();
        try {
            await client.query("BEGIN");
            const result_motor = await client.query(`
        INSERT INTO motors (
          serial_no,
          motor_id,
          rpm,
          frame,
          qr,
          amp,
          voltage,
          mounting,
          make,
          current_status,
          bearing_DE,
          bearing_NDE,
          kw
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
        ) RETURNING id
        `, [
                data.serial_no,
                data.motor_id,
                data.rpm,
                data.frame,
                data.qr,
                data.amp,
                data.voltage,
                data.mounting,
                data.make,
                types_1.MotorStatus.In,
                data.bearing_DE,
                data.bearing_NDE,
                data.kw,
            ]);
            if (!result_motor.rowCount)
                throw new Error("Failed to motor in");
            const motorId = result_motor.rows[0].id;
            await client.query(`INSERT INTO motor_in (
          motor_id,
          location,
          in_at,
          in_by,
          remark
          )
          VALUES (
          $1, $2, $3, $4, $5
          )
          `, [motorId, data.location, data.in_at, data.in_by, data.remark]);
            await client.query("COMMIT");
        }
        catch (error) {
            await client.query("ROLLBACK");
            switch (error.code) {
                case "23505":
                    throw new Error(error.detail, { cause: 2 });
                case "22P02":
                    throw new Error("Invalid UUID", { cause: 3 });
                case "23503":
                    throw new Error(error.detail, { cause: 4 });
                default:
                    throw error;
            }
        }
        finally {
            client.release();
        }
    }
    async getMotors(data) {
        let query = `
    SELECT 
      m.id,
      m.serial_no,
      m.motor_id,
      m.rpm,
      m.frame,
      m.amp,
      m.kw,
      m.voltage,
      m.mounting,
      m.make,
      '${env_1.default.API_URL}' || m.qr AS qr,
      m.bearing_de,
      m.bearing_nde,
      m.current_status,
      TO_CHAR(mi.in_at, 'DD-MON-YYYY HH24:MI') AS in_at,
      mi.remark AS in_remark,
      mi.location AS in_location,
      u_in.email AS in_by_email,
      up_in.display_name AS in_by_name,
      r_in.role AS in_by_role,
      mf.remark AS fault_remark,
      TO_CHAR(mf.fault_find_at, 'DD-MON-YYYY HH24:MI') AS fault_find_at,
      u_fault.email AS fault_find_by_email,
      up_fault.display_name AS fault_find_by_name,
      r_fault.role AS fault_find_by_role,
      TO_CHAR(mo.out_at, 'DD-MON-YYYY HH24:MI') AS out_at,
      mo.remark AS out_remark,
      mo.location AS out_location,
      mo.images AS out_images,
      u_out.email AS out_by_email,
      up_out.display_name AS out_by_name,
      r_out.role AS out_by_role,
      TO_CHAR(mh.overhauled_started_at, 'DD-MON-YYYY HH24:MI') AS overhauled_started_at,
      TO_CHAR(mh.overhauled_completed_at, 'DD-MON-YYYY HH24:MI') AS overhauled_completed_at,
      u_oh_start.email AS overhauled_started_by_email,
      up_oh_start.display_name AS overhauled_started_by_name,
      r_oh_start.role AS overhauled_started_by_role,
      u_oh_complete.email AS overhauled_completed_by_email,
      up_oh_complete.display_name AS overhauled_completed_by_name,
      r_oh_complete.role AS overhauled_completed_by_role,
      mh.parts,
      mh.status AS overhauled_status,
      mh.remark AS overhauled_remark,
      TO_CHAR(ma.available_at, 'DD-MON-YYYY HH24:MI') AS available_at,
      ma.remark AS available_remark,
      u_av.email AS available_by_email,
      up_av.display_name AS available_by_name,
      r_av.role AS available_by_role,
      TO_CHAR(mt.trial_started_at, 'DD-MON-YYYY HH24:MI') AS trial_started_at,
      TO_CHAR(mt.trial_completed_at, 'DD-MON-YYYY HH24:MI') AS trial_completed_at,
      u_trial_start.email AS trial_started_by_email,
      up_trial_start.display_name AS trial_started_by_name,
      r_trial_start.role AS trial_started_by_role,
      u_trial_complete.email AS trial_completed_by_email,
      up_trial_complete.display_name AS trial_completed_by_name,
      r_trial_complete.role AS trial_completed_by_role,
      mt.resistance_ry,
      mt.resistance_yb,
      mt.resistance_rb,
      mt.ir_ph_to_ph,
      mt.ir_ph_to_e,
      mt.status AS trial_status,
      mt.remark AS trial_remark
    FROM motors m
    LEFT JOIN motor_in mi ON mi.motor_id = m.id
    LEFT JOIN users u_in ON u_in.id = mi.in_by
    LEFT JOIN user_profile up_in ON up_in.user_id = mi.in_by
    LEFT JOIN user_role ur_in ON ur_in.user_id = mi.in_by
    LEFT JOIN roles r_in ON r_in.id = ur_in.role_id
    LEFT JOIN motor_fault mf ON mf.motor_id = m.id
    LEFT JOIN users u_fault ON u_fault.id = mf.fault_find_by
    LEFT JOIN user_profile up_fault ON up_fault.user_id = mf.fault_find_by
    LEFT JOIN user_role ur_fault ON ur_fault.user_id = mf.fault_find_by
    LEFT JOIN roles r_fault ON r_fault.id = ur_fault.role_id
    LEFT JOIN motor_out mo ON mo.motor_id = m.id
    LEFT JOIN users u_out ON u_out.id = mo.out_by
    LEFT JOIN user_profile up_out ON up_out.user_id = mo.out_by
    LEFT JOIN user_role ur_out ON ur_out.user_id = mo.out_by
    LEFT JOIN roles r_out ON r_out.id = ur_out.role_id
    LEFT JOIN motor_overhauling mh ON mh.motor_id = m.id
    LEFT JOIN users u_oh_start ON u_oh_start.id = mh.overhauled_started_by
    LEFT JOIN user_profile up_oh_start ON up_oh_start.user_id = mh.overhauled_started_by
    LEFT JOIN user_role ur_oh_start ON ur_oh_start.user_id = mh.overhauled_started_by
    LEFT JOIN roles r_oh_start ON r_oh_start.id = ur_oh_start.role_id
    LEFT JOIN users u_oh_complete ON u_oh_complete.id = mh.overhauled_completed_by
    LEFT JOIN user_profile up_oh_complete ON up_oh_complete.user_id = mh.overhauled_completed_by
    LEFT JOIN user_role ur_oh_complete ON ur_oh_complete.user_id = mh.overhauled_completed_by
    LEFT JOIN roles r_oh_complete ON r_oh_complete.id = ur_oh_complete.role_id
    LEFT JOIN motor_available ma ON ma.motor_id = m.id
    LEFT JOIN users u_av ON u_av.id = ma.available_by
    LEFT JOIN user_profile up_av ON up_av.user_id = ma.available_by
    LEFT JOIN user_role ur_av ON ur_av.user_id = ma.available_by
    LEFT JOIN roles r_av ON r_av.id = ur_av.role_id
    LEFT JOIN motor_trial mt ON mt.motor_id = m.id
    LEFT JOIN users u_trial_start ON u_trial_start.id = mt.trial_started_by
    LEFT JOIN user_profile up_trial_start ON up_trial_start.user_id = mt.trial_started_by
    LEFT JOIN user_role ur_trial_start ON ur_trial_start.user_id = mt.trial_started_by
    LEFT JOIN roles r_trial_start ON r_trial_start.id = ur_trial_start.role_id
    LEFT JOIN users u_trial_complete ON u_trial_complete.id = mt.trial_completed_by
    LEFT JOIN user_profile up_trial_complete ON up_trial_complete.user_id = mt.trial_completed_by
    LEFT JOIN user_role ur_trial_complete ON ur_trial_complete.user_id = mt.trial_completed_by
    LEFT JOIN roles r_trial_complete ON r_trial_complete.id = ur_trial_complete.role_id
    WHERE 1=1
  `;
        const params = [];
        let index = 1;
        if (data.status) {
            query += ` AND m.current_status = $${index}`;
            params.push(data.status);
            index++;
        }
        if (data.search) {
            query += ` AND (m.serial_no ILIKE $${index} OR m.motor_id ILIKE $${index} OR m.make ILIKE $${index})`;
            params.push(`%${data.search}%`);
            index++;
        }
        const parseDate = (d) => {
            const parts = d.split("-");
            return parts[0].length === 4 ? d : parts.reverse().join("-");
        };
        if (data.from && data.to) {
            query += ` AND mi.in_at BETWEEN $${index} AND $${index + 1}`;
            params.push(`${parseDate(data.from)}T00:00:00+05:30`);
            params.push(`${parseDate(data.to)}T23:59:59+05:30`);
            index += 2;
        }
        else if (data.from && !data.to) {
            query += ` AND mi.in_at BETWEEN $${index} AND NOW()`;
            params.push(`${parseDate(data.from)}T00:00:00+05:30`);
            index++;
        }
        query += ` ORDER BY mi.in_at DESC;`;
        console.log("__params", params);
        const result = await this.pool.query(query, params);
        return result.rows;
    }
    async getMotor(motorId) {
        // let query = `
        // SELECT 
        // m.id,
        // m.serial_no,
        // m.motor_id,
        // m.rpm,
        // m.frame,
        // m.amp,
        // m.kw,
        // m.voltage,
        // m.mounting,
        // m.make,
        // '${env.API_URL}' || m.qr AS qr,
        // m.bearing_de,
        // m.bearing_nde,
        // m.current_status,
        // TO_CHAR(mi.in_at, 'DD-MON-YYYY HH24:MI') AS in_at,
        // u.email,
        // r.role,
        // mi.remark,
        // mi.location,
        // up.display_name,
        // mf.remark AS fault_remark,
        // mf.fault_find_by,
        // mf.fault_find_at,
        // mo.out_by,
        // mo.out_at,
        // mo.location,
        // mo.images,
        // mo.remark AS out_remark,
        // mh.overhauled_started_at,
        // mh.overhauled_completed_at,
        // mh.overhauled_started_by,
        // mh.overhauled_completed_by,
        // mh.parts,
        // mh.status AS overhauled_status,
        // mh.remark AS overhauled_remark,
        // ma.available_by,
        // ma.available_at,
        // ma.remark AS available_remark,
        // mt.remark AS trial_remark,
        // mt.trial_started_at,
        // mt.trial_completed_at,
        // mt.trial_started_by,
        // mt.trial_completed_by,
        // mt.resistance_ry,
        // mt.resistance_yb,
        // mt.resistance_rb,
        // mt.ir_ph_to_ph,
        // mt.ir_ph_to_e,
        // mt.status AS trial_status
        // FROM motors m
        // LEFT JOIN motor_in mi ON mi.motor_id = m.id
        // LEFT JOIN users u ON u.id = mi.in_by
        // LEFT JOIN user_role ur ON ur.user_id = mi.in_by
        // LEFT JOIN user_profile up ON up.user_id = mi.in_by
        // LEFT JOIN roles r ON r.id = ur.role_id
        // LEFT JOIN motor_overhauling mh ON mh.motor_id = m.id
        // LEFT JOIN motor_available ma ON ma.motor_id = m.id
        // LEFT JOIN motor_fault mf ON mf.motor_id = m.id
        // LEFT JOIN motor_trial mt ON mt.motor_id = m.id
        // LEFT JOIN motor_out mo ON mo.motor_id = m.id
        // WHERE m.motor_id = $1
        // `;
        let query = `
      SELECT 
      m.id,
      m.serial_no,
      m.motor_id,
      m.rpm,
      m.frame,
      m.amp,
      m.kw,
      m.voltage,
      m.mounting,
      m.make,
      '${env_1.default.API_URL}' || m.qr AS qr,
      m.bearing_de,
      m.bearing_nde,
      m.current_status,

      -- Motor In
      TO_CHAR(mi.in_at, 'DD-MON-YYYY HH24:MI') AS in_at,
      mi.remark AS in_remark,
      mi.location AS in_location,
      u_in.email AS in_by_email,
      up_in.display_name AS in_by_name,
      r_in.role AS in_by_role,

      -- Motor Fault
      mf.remark AS fault_remark,
      TO_CHAR(mf.fault_find_at, 'DD-MON-YYYY HH24:MI') AS fault_find_at,
      u_fault.email AS fault_find_by_email,
      up_fault.display_name AS fault_find_by_name,
      r_fault.role AS fault_find_by_role,

      -- Motor Out
      TO_CHAR(mo.out_at, 'DD-MON-YYYY HH24:MI') AS out_at,
      mo.remark AS out_remark,
      mo.location AS out_location,
      mo.images AS out_images,
      u_out.email AS out_by_email,
      up_out.display_name AS out_by_name,
      r_out.role AS out_by_role,

      -- Motor Overhauling
      TO_CHAR(mh.overhauled_started_at, 'DD-MON-YYYY HH24:MI') AS overhauled_started_at,
      TO_CHAR(mh.overhauled_completed_at, 'DD-MON-YYYY HH24:MI') AS overhauled_completed_at,
      u_oh_start.email AS overhauled_started_by_email,
      up_oh_start.display_name AS overhauled_started_by_name,
      r_oh_start.role AS overhauled_started_by_role,
      u_oh_complete.email AS overhauled_completed_by_email,
      up_oh_complete.display_name AS overhauled_completed_by_name,
      r_oh_complete.role AS overhauled_completed_by_role,
      mh.parts,
      mh.status AS overhauled_status,
      mh.remark AS overhauled_remark,

      -- Motor Available
      TO_CHAR(ma.available_at, 'DD-MON-YYYY HH24:MI') AS available_at,
      ma.remark AS available_remark,
      u_av.email AS available_by_email,
      up_av.display_name AS available_by_name,
      r_av.role AS available_by_role,

      -- Motor Trial
      TO_CHAR(mt.trial_started_at, 'DD-MON-YYYY HH24:MI') AS trial_started_at,
      TO_CHAR(mt.trial_completed_at, 'DD-MON-YYYY HH24:MI') AS trial_completed_at,
      u_trial_start.email AS trial_started_by_email,
      up_trial_start.display_name AS trial_started_by_name,
      r_trial_start.role AS trial_started_by_role,
      u_trial_complete.email AS trial_completed_by_email,
      up_trial_complete.display_name AS trial_completed_by_name,
      r_trial_complete.role AS trial_completed_by_role,
      mt.resistance_ry,
      mt.resistance_yb,
      mt.resistance_rb,
      mt.ir_ph_to_ph,
      mt.ir_ph_to_e,
      mt.status AS trial_status,
      mt.remark AS trial_remark

    FROM motors m

    -- Motor In Joins
    LEFT JOIN motor_in mi ON mi.motor_id = m.id
    LEFT JOIN users u_in ON u_in.id = mi.in_by
    LEFT JOIN user_profile up_in ON up_in.user_id = mi.in_by
    LEFT JOIN user_role ur_in ON ur_in.user_id = mi.in_by
    LEFT JOIN roles r_in ON r_in.id = ur_in.role_id

    -- Motor Fault Joins
    LEFT JOIN motor_fault mf ON mf.motor_id = m.id
    LEFT JOIN users u_fault ON u_fault.id = mf.fault_find_by
    LEFT JOIN user_profile up_fault ON up_fault.user_id = mf.fault_find_by
    LEFT JOIN user_role ur_fault ON ur_fault.user_id = mf.fault_find_by
    LEFT JOIN roles r_fault ON r_fault.id = ur_fault.role_id

    -- Motor Out Joins
    LEFT JOIN motor_out mo ON mo.motor_id = m.id
    LEFT JOIN users u_out ON u_out.id = mo.out_by
    LEFT JOIN user_profile up_out ON up_out.user_id = mo.out_by
    LEFT JOIN user_role ur_out ON ur_out.user_id = mo.out_by
    LEFT JOIN roles r_out ON r_out.id = ur_out.role_id

    -- Motor Overhauling Joins
    LEFT JOIN motor_overhauling mh ON mh.motor_id = m.id
    LEFT JOIN users u_oh_start ON u_oh_start.id = mh.overhauled_started_by
    LEFT JOIN user_profile up_oh_start ON up_oh_start.user_id = mh.overhauled_started_by
    LEFT JOIN user_role ur_oh_start ON ur_oh_start.user_id = mh.overhauled_started_by
    LEFT JOIN roles r_oh_start ON r_oh_start.id = ur_oh_start.role_id
    LEFT JOIN users u_oh_complete ON u_oh_complete.id = mh.overhauled_completed_by
    LEFT JOIN user_profile up_oh_complete ON up_oh_complete.user_id = mh.overhauled_completed_by
    LEFT JOIN user_role ur_oh_complete ON ur_oh_complete.user_id = mh.overhauled_completed_by
    LEFT JOIN roles r_oh_complete ON r_oh_complete.id = ur_oh_complete.role_id

    -- Motor Available Joins
    LEFT JOIN motor_available ma ON ma.motor_id = m.id
    LEFT JOIN users u_av ON u_av.id = ma.available_by
    LEFT JOIN user_profile up_av ON up_av.user_id = ma.available_by
    LEFT JOIN user_role ur_av ON ur_av.user_id = ma.available_by
    LEFT JOIN roles r_av ON r_av.id = ur_av.role_id

    -- Motor Trial Joins
    LEFT JOIN motor_trial mt ON mt.motor_id = m.id
    LEFT JOIN users u_trial_start ON u_trial_start.id = mt.trial_started_by
    LEFT JOIN user_profile up_trial_start ON up_trial_start.user_id = mt.trial_started_by
    LEFT JOIN user_role ur_trial_start ON ur_trial_start.user_id = mt.trial_started_by
    LEFT JOIN roles r_trial_start ON r_trial_start.id = ur_trial_start.role_id
    LEFT JOIN users u_trial_complete ON u_trial_complete.id = mt.trial_completed_by
    LEFT JOIN user_profile up_trial_complete ON up_trial_complete.user_id = mt.trial_completed_by
    LEFT JOIN user_role ur_trial_complete ON ur_trial_complete.user_id = mt.trial_completed_by
    LEFT JOIN roles r_trial_complete ON r_trial_complete.id = ur_trial_complete.role_id

    WHERE m.motor_id = $1;

    `;
        const result = await this.pool.query(query, [motorId]);
        if (!result.rows)
            throw new Error("Motor not found");
        return result.rows[0];
    }
    async motorMoveToOverhauling(data) {
        const client = await this.pool.connect();
        try {
            await client.query("BEGIN");
            const result = await client.query(`
          INSERT INTO motor_overhauling 
          (motor_id, status, overhauled_started_by, overhauled_started_at)
          VALUES ($1, $2, $3, now())
          `, [
                data.motor_id,
                types_1.MotorOverhaulingAndTrialStatus.Active,
                data.overhauled_started_by,
            ]);
            if (!result.rows)
                throw new Error("Failed to move in overhauling");
            await client.query(`UPDATE motors SET current_status = $1 WHERE id = $2`, [types_1.MotorStatus.Overhauling, data.motor_id]);
            await client.query("COMMIT");
        }
        catch (error) {
            await client.query("ROLLBACK");
            throw error;
        }
        finally {
            client.release();
        }
    }
    async motorMoveToTrial(data) {
        const client = await this.pool.connect();
        try {
            await client.query("BEGIN");
            const result = await client.query(`
          UPDATE motor_overhauling 
          SET parts = $1, remark = $2, overhauled_completed_by = $3, status = $4, overhauled_completed_at = now()
          WHERE motor_id = $5
          `, [
                data.parts,
                data.remark,
                data.overhauled_completed_by,
                types_1.MotorOverhaulingAndTrialStatus.Completed,
                data.motor_id,
            ]);
            if (!result.rows)
                throw new Error("Failed to update status");
            await client.query(`
        INSERT INTO motor_trial (
        motor_id,
        status,
        trial_started_by,
        trial_started_at
        ) VALUES ($1, $2, $3, now())
        `, [
                data.motor_id,
                types_1.MotorOverhaulingAndTrialStatus.Active,
                data.trial_started_by,
            ]);
            await client.query(`UPDATE motors SET current_status = $1 WHERE id = $2`, [types_1.MotorStatus.Trial, data.motor_id]);
            await client.query("COMMIT");
        }
        catch (error) {
            await client.query("ROLLBACK");
            throw error;
        }
        finally {
            client.release();
        }
    }
    async motorMoveToAvailable(data) {
        const client = await this.pool.connect();
        try {
            await client.query("BEGIN");
            const result = await client.query(`
          UPDATE motor_trial 
          SET resistance_ry = $1, resistance_yb = $2, resistance_rb = $3, ir_ph_to_ph = $4, ir_ph_to_e = $5, remark = $6, trial_completed_by = $7, status = $8, trial_completed_at = now()
          WHERE motor_id = $9
          `, [
                data.resistance_ry,
                data.resistance_yb,
                data.resistance_rb,
                data.ir_ph_to_ph,
                data.ir_ph_to_e,
                data.remark,
                data.trial_completed_by,
                types_1.MotorOverhaulingAndTrialStatus.Completed,
                data.motor_id,
            ]);
            if (!result.rows)
                throw new Error("Failed to update status");
            await client.query(`
        INSERT INTO motor_available (
        motor_id,
        available_by,
        available_at
        ) VALUES ($1, $2, now())
        `, [data.motor_id, data.available_by]);
            await client.query(`UPDATE motors SET current_status = $1 WHERE id = $2`, [types_1.MotorStatus.Available, data.motor_id]);
            await client.query("COMMIT");
        }
        catch (error) {
            await client.query("ROLLBACK");
            throw error;
        }
        finally {
            client.release();
        }
    }
    async motorMoveToOut(data) {
        const client = await this.pool.connect();
        try {
            await client.query("BEGIN");
            await client.query(`
        INSERT INTO motor_out (
        motor_id,
        out_by,
        location,
        images,
        remark,
        out_at
        ) VALUES ($1, $2, $3, $4, $5, now())
        `, [data.motor_id, data.out_by, data.location, data.images, data.remark]);
            await client.query(`UPDATE motors SET current_status = $1 WHERE id = $2`, [types_1.MotorStatus.Out, data.motor_id]);
            await client.query("COMMIT");
        }
        catch (error) {
            await client.query("ROLLBACK");
            throw error;
        }
        finally {
            client.release();
        }
    }
    async motorMoveToFault(data) {
        const client = await this.pool.connect();
        try {
            await client.query("BEGIN");
            const result = await client.query(`SELECT current_status FROM motors WHERE id = $1`, [data.motor_id]);
            if (!result.rows)
                throw new Error("Motor not found");
            const currentStatus = result.rows[0].current_status;
            await client.query(`
        INSERT INTO motor_fault (
        motor_id,
        remark,
        fault_find_by,
        old_status,
        fault_find_at
        ) VALUES ($1, $2, $3, $4, now())
        `, [data.motor_id, data.remark, data.fault_find_by, currentStatus]);
            await client.query(`UPDATE motors SET current_status = $1 WHERE id = $2`, [types_1.MotorStatus.Fault, data.motor_id]);
            await client.query("COMMIT");
        }
        catch (error) {
            await client.query("ROLLBACK");
            throw error;
        }
        finally {
            client.release();
        }
    }
    async motorAnalytics(userId) {
        const defaultWeek = {
            monday: {
                in: 0,
                overhauling: 0,
                out: 0,
                available: 0,
                trial: 0,
                fault: 0,
            },
            tuesday: {
                in: 0,
                overhauling: 0,
                out: 0,
                available: 0,
                trial: 0,
                fault: 0,
            },
            wednesday: {
                in: 0,
                overhauling: 0,
                out: 0,
                available: 0,
                trial: 0,
                fault: 0,
            },
            thursday: {
                in: 0,
                overhauling: 0,
                out: 0,
                available: 0,
                trial: 0,
                fault: 0,
            },
            friday: {
                in: 0,
                overhauling: 0,
                out: 0,
                available: 0,
                trial: 0,
                fault: 0,
            },
            saturday: {
                in: 0,
                overhauling: 0,
                out: 0,
                available: 0,
                trial: 0,
                fault: 0,
            },
            sunday: {
                in: 0,
                overhauling: 0,
                out: 0,
                available: 0,
                trial: 0,
                fault: 0,
            },
        };
        const monthKeys = [
            "january",
            "february",
            "march",
            "april",
            "may",
            "june",
            "july",
            "august",
            "september",
            "october",
            "november",
            "december",
        ];
        const defaultYear = monthKeys.reduce((acc, month) => {
            acc[month] = {
                in: 0,
                overhauling: 0,
                out: 0,
                available: 0,
                trial: 0,
                fault: 0,
            };
            return acc;
        }, {});
        // Overall
        const overallResult = await this.pool.query(`
    SELECT
      COUNT(*) FILTER (WHERE current_status='In') AS in_count,
      COUNT(*) FILTER (WHERE current_status='Overhauling') AS overhauling_count,
      COUNT(*) FILTER (WHERE current_status='Out') AS out_count,
      COUNT(*) FILTER (WHERE current_status='Available') AS available_count,
      COUNT(*) FILTER (WHERE current_status='Trial') AS trial_count,
      COUNT(*) FILTER (WHERE current_status='Fault') AS fault_count
    FROM motors
  `);
        // Today
        const todayResult = await this.pool.query(`
    SELECT
      COUNT(*) FILTER (WHERE current_status='In') AS in_count,
      COUNT(*) FILTER (WHERE current_status='Overhauling') AS overhauling_count,
      COUNT(*) FILTER (WHERE current_status='Out') AS out_count,
      COUNT(*) FILTER (WHERE current_status='Available') AS available_count,
      COUNT(*) FILTER (WHERE current_status='Trial') AS trial_count,
      COUNT(*) FILTER (WHERE current_status='Fault') AS fault_count
    FROM motors
    WHERE DATE(created_at) = CURRENT_DATE
  `);
        // Last week
        const currentWeekResult = await this.pool.query(`
    SELECT
      EXTRACT(DOW FROM created_at) AS day_of_week,
      COUNT(*) FILTER (WHERE current_status='In') AS in_count,
      COUNT(*) FILTER (WHERE current_status='Overhauling') AS overhauling_count,
      COUNT(*) FILTER (WHERE current_status='Out') AS out_count,
      COUNT(*) FILTER (WHERE current_status='Available') AS available_count,
      COUNT(*) FILTER (WHERE current_status='Trial') AS trial_count,
      COUNT(*) FILTER (WHERE current_status='Fault') AS fault_count
    FROM motors
    WHERE created_at >= CURRENT_DATE - INTERVAL '6 days'
    GROUP BY day_of_week
  `);
        const dayKeys = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
        ];
        const current_week = { ...defaultWeek };
        currentWeekResult.rows.forEach((row) => {
            const key = dayKeys[Number(row.day_of_week)];
            current_week[key] = {
                in: Number(row.in_count),
                overhauling: Number(row.overhauling_count),
                out: Number(row.out_count),
                available: Number(row.available_count),
                trial: Number(row.trial_count),
                fault: Number(row.fault_count),
            };
        });
        // Last year
        const currentYearResult = await this.pool.query(`
    SELECT
      EXTRACT(MON FROM created_at) AS month_num,
      COUNT(*) FILTER (WHERE current_status='In') AS in_count,
      COUNT(*) FILTER (WHERE current_status='Overhauling') AS overhauling_count,
      COUNT(*) FILTER (WHERE current_status='Out') AS out_count,
      COUNT(*) FILTER (WHERE current_status='Available') AS available_count,
      COUNT(*) FILTER (WHERE current_status='Trial') AS trial_count,
      COUNT(*) FILTER (WHERE current_status='Fault') AS fault_count
    FROM motors
    WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
    GROUP BY month_num
    ORDER BY month_num
  `);
        const current_year = { ...defaultYear };
        currentYearResult.rows.forEach((row) => {
            const key = monthKeys[Number(row.month_num) - 1];
            current_year[key] = {
                in: Number(row.in_count),
                overhauling: Number(row.overhauling_count),
                out: Number(row.out_count),
                available: Number(row.available_count),
                trial: Number(row.trial_count),
                fault: Number(row.fault_count),
            };
        });
        return {
            overall: {
                in: Number(overallResult.rows[0].in_count),
                overhauling: Number(overallResult.rows[0].overhauling_count),
                out: Number(overallResult.rows[0].out_count),
                available: Number(overallResult.rows[0].available_count),
                trial: Number(overallResult.rows[0].trial_count),
                fault: Number(overallResult.rows[0].fault_count),
            },
            today: {
                in: Number(todayResult.rows[0].in_count),
                overhauling: Number(todayResult.rows[0].overhauling_count),
                out: Number(todayResult.rows[0].out_count),
                available: Number(todayResult.rows[0].available_count),
                trial: Number(todayResult.rows[0].trial_count),
                fault: Number(todayResult.rows[0].fault_count),
            },
            current_week,
            current_year,
        };
    }
}
exports.default = MotorRepository;
//# sourceMappingURL=motor-repository.js.map