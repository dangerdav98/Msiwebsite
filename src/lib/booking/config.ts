// All business-hours settings for the booking calendar live here so they
// can be changed without touching the availability/booking logic.

/** IANA timezone the business operates in. Handles DST automatically. */
export const BOOKING_TIMEZONE = "America/Denver";

export const SLOT_MINUTES = 30;

export const BOOKING_WINDOW_DAYS = 14;

/** Business hours per day of week (0 = Sunday ... 6 = Saturday). Days not listed are unavailable. */
export const BUSINESS_HOURS: Partial<Record<number, { start: string; end: string }>> = {
  1: { start: "09:00", end: "17:00" }, // Monday
  2: { start: "09:00", end: "17:00" }, // Tuesday
  3: { start: "09:00", end: "17:00" }, // Wednesday
  4: { start: "09:00", end: "17:00" }, // Thursday
  5: { start: "09:00", end: "17:00" }, // Friday
};
