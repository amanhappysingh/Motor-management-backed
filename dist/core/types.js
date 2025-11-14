"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MotorStatus = exports.MotorOverhaulingAndTrialStatus = exports.Roles = void 0;
var Roles;
(function (Roles) {
    Roles["HOD"] = "HOD";
    Roles["Technician"] = "Technician";
    Roles["Workshop_Engineer"] = "Workshop_Engineer";
})(Roles || (exports.Roles = Roles = {}));
var MotorOverhaulingAndTrialStatus;
(function (MotorOverhaulingAndTrialStatus) {
    MotorOverhaulingAndTrialStatus["Active"] = "Active";
    MotorOverhaulingAndTrialStatus["Completed"] = "Completed";
    MotorOverhaulingAndTrialStatus["Fault"] = "Fault";
})(MotorOverhaulingAndTrialStatus || (exports.MotorOverhaulingAndTrialStatus = MotorOverhaulingAndTrialStatus = {}));
var MotorStatus;
(function (MotorStatus) {
    MotorStatus["In"] = "In";
    MotorStatus["Overhauling"] = "Overhauling";
    MotorStatus["Trial"] = "Trial";
    MotorStatus["Available"] = "Available";
    MotorStatus["Fault"] = "Fault";
    MotorStatus["Out"] = "Out";
})(MotorStatus || (exports.MotorStatus = MotorStatus = {}));
//# sourceMappingURL=types.js.map