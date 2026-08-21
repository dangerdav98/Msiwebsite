import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { generateBookingWindow, subtractTaken } from "@/lib/booking/slots";

export async function GET() {
  const window = generateBookingWindow();
  if (window.length === 0) {
    return NextResponse.json({ days: [] });
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("appointment_date, start_time")
    .eq("status", "confirmed")
    .gte("appointment_date", window[0].date)
    .lte("appointment_date", window[window.length - 1].date);

  if (error) {
    console.error("Failed to load bookings for availability", error);
    return NextResponse.json({ error: "Could not load availability" }, { status: 500 });
  }

  const taken = (data || []).map((b) => ({ date: b.appointment_date, time: b.start_time.slice(0, 5) }));
  const days = subtractTaken(window, taken);

  return NextResponse.json({ days });
}
