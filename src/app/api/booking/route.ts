import { NextRequest, NextResponse } from "next/server";
import { createAnonServerClient } from "@/lib/supabase/server";
import { sendNotification } from "@/lib/resend/server";
import { formatTimeLabel, generateBookingWindow, isValidSlot } from "@/lib/booking/slots";

interface BookingBody {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  businessName?: string;
  date?: string;
  time?: string;
  lang?: string;
}

export async function POST(req: NextRequest) {
  let body: BookingBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const firstName = body.firstName?.trim() || "";
  const lastName = body.lastName?.trim() || "";
  const phone = body.phone?.trim() || "";
  const email = body.email?.trim() || "";
  const date = body.date?.trim() || "";
  const time = body.time?.trim() || "";
  const businessName = body.businessName?.trim() || null;
  const lang = body.lang === "es" ? "es" : "en";

  if (!firstName || !lastName || !phone || !email) {
    return NextResponse.json({ error: "Name, phone, and email are required" }, { status: 400 });
  }
  if (!date || !time) {
    return NextResponse.json({ error: "Date and time are required" }, { status: 400 });
  }

  // Revalidated server-side so a stale client can't book a past or
  // out-of-hours slot even if the request is crafted directly.
  const window = generateBookingWindow();
  if (!isValidSlot(window, date, time)) {
    return NextResponse.json({ error: "That time is no longer available. Please pick another." }, { status: 409 });
  }

  const name = `${firstName} ${lastName}`;
  const supabase = createAnonServerClient();
  const { error: insertError } = await supabase.from("bookings").insert({
    name,
    phone,
    email,
    business_name: businessName,
    appointment_date: date,
    start_time: time,
    lang,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json({ error: "That time was just booked. Please pick another." }, { status: 409 });
    }
    console.error("Booking insert failed", insertError);
    return NextResponse.json({ error: "Could not save booking" }, { status: 500 });
  }

  await sendNotification(
    `New Strategy Call Booked — ${name}`,
    `
      <h2>New 30-Min Strategy Call Booked</h2>
      <p><b>Name:</b> ${name}</p>
      <p><b>Business:</b> ${businessName || "—"}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Date:</b> ${date}</p>
      <p><b>Time:</b> ${formatTimeLabel(time)} (Mountain Time)</p>
      <p><b>Language:</b> ${lang}</p>
    `
  );

  return NextResponse.json({ ok: true });
}
