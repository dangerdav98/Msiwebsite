import { BOOKING_TIMEZONE, BOOKING_WINDOW_DAYS, BUSINESS_HOURS, SLOT_MINUTES } from "./config";

export interface DaySlots {
  date: string; // YYYY-MM-DD, business-timezone calendar date
  slots: string[]; // HH:MM 24h, business-timezone local time
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toDateString(y: number, m: number, d: number) {
  return `${y}-${pad(m)}-${pad(d)}`;
}

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(mins: number) {
  return `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;
}

/** Returns the current date/time as observed in the business timezone. */
export function nowInBusinessTimezone() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BOOKING_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const hourRaw = get("hour");
  return { year: get("year"), month: get("month"), day: get("day"), hour: hourRaw === 24 ? 0 : hourRaw, minute: get("minute") };
}

function slotsForDayOfWeek(dow: number): string[] {
  const hours = BUSINESS_HOURS[dow];
  if (!hours) return [];
  const startMin = timeToMinutes(hours.start);
  const endMin = timeToMinutes(hours.end);
  const slots: string[] = [];
  for (let t = startMin; t + SLOT_MINUTES <= endMin; t += SLOT_MINUTES) {
    slots.push(minutesToTime(t));
  }
  return slots;
}

/**
 * Builds the full slot template for the booking window (today through
 * BOOKING_WINDOW_DAYS out), excluding slots that have already passed today
 * and days with no business hours (weekends). Already-booked slots are
 * subtracted separately by the caller.
 */
export function generateBookingWindow(): DaySlots[] {
  const now = nowInBusinessTimezone();
  const todayStr = toDateString(now.year, now.month, now.day);
  const nowMinutes = now.hour * 60 + now.minute;

  // Anchor at UTC noon on today's business-timezone calendar date so adding
  // days can't drift across a local-midnight DST edge case.
  const anchor = new Date(Date.UTC(now.year, now.month - 1, now.day, 12));

  const days: DaySlots[] = [];
  for (let i = 0; i < BOOKING_WINDOW_DAYS; i++) {
    const d = new Date(anchor);
    d.setUTCDate(anchor.getUTCDate() + i);
    const dateStr = toDateString(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
    const dow = d.getUTCDay();

    let slots = slotsForDayOfWeek(dow);
    if (dateStr === todayStr) {
      slots = slots.filter((s) => timeToMinutes(s) > nowMinutes);
    }
    if (slots.length > 0) {
      days.push({ date: dateStr, slots });
    }
  }
  return days;
}

/** Removes already-booked (date, time) pairs from a generated window. */
export function subtractTaken(window: DaySlots[], taken: { date: string; time: string }[]): DaySlots[] {
  const takenSet = new Set(taken.map((t) => `${t.date}|${t.time}`));
  return window
    .map((day) => ({
      date: day.date,
      slots: day.slots.filter((s) => !takenSet.has(`${day.date}|${s}`)),
    }))
    .filter((day) => day.slots.length > 0);
}

/** True if (date, time) is a real, still-available slot in the current booking window. */
export function isValidSlot(window: DaySlots[], date: string, time: string): boolean {
  const day = window.find((d) => d.date === date);
  return !!day && day.slots.includes(time);
}

export function formatTimeLabel(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${pad(m)} ${period}`;
}

export function formatFullDate(dateStr: string, lang: "en" | "es" = "en"): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 12));
  return dt.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
