export function formatTimestamp(
  date: string,
  time12h: string,
  tzOffset: string = "+05:30"
): string {
  const [time, modifier] = time12h.trim().split(" ");
  let [hours, minutes] = time.split(":");

  if (hours === "12") hours = "00";
  if (modifier.toUpperCase() === "PM") {
    hours = String(parseInt(hours, 10) + 12);
  }

  const time24h = `${hours.padStart(2, "0")}:${minutes}`;
  return `${date}T${time24h}:00${tzOffset}`;
}
