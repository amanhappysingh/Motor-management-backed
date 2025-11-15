"use strict";
// export function formatTimestamp(
//   date: string,
//   time12h: string,
//   tzOffset: string = "+05:30"
// ): string {
//   const [time, modifier] = time12h.trim().split(" ");
//   let [hours, minutes] = time.split(":");
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTimestamp = formatTimestamp;
//   if (hours === "12") hours = "00";
//   if (modifier.toUpperCase() === "PM") {
//     hours = String(parseInt(hours, 10) + 12);
//   }
//   const time24h = `${hours.padStart(2, "0")}:${minutes}`;
//   return `${date}T${time24h}:00${tzOffset}`;
// }
function formatTimestamp(date, time12h, tzOffset = "+05:30") {
    // Convert DD-MM-YYYY -> YYYY-MM-DD
    const [day, month, year] = date.split("-");
    const isoDate = `${year}-${month}-${day}`;
    // Convert 12-hour time to 24-hour
    const [time, modifier] = time12h.trim().split(" ");
    let [hours, minutes] = time.split(":");
    hours = hours === "12" ? "00" : hours;
    if (modifier.toUpperCase() === "PM") {
        hours = String(parseInt(hours, 10) + 12);
    }
    const time24h = `${hours.padStart(2, "0")}:${minutes}`;
    return `${isoDate}T${time24h}:00${tzOffset}`;
}
//# sourceMappingURL=date-time.js.map