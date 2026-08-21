import { NextRequest, NextResponse } from "next/server";
import { createAnonServerClient } from "@/lib/supabase/server";
import { sendCustomerEmail, sendNotification } from "@/lib/resend/server";
import { formatFullDate, formatTimeLabel, generateBookingWindow, isValidSlot } from "@/lib/booking/slots";

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

  const dateLabel = formatFullDate(date, lang);
  const timeLabel = formatTimeLabel(time);

  await sendNotification(
    `New Strategy Call Booked — ${name}`,
    `
      <h2>New 30-Min Strategy Call Booked</h2>
      <p><b>Name:</b> ${name}</p>
      <p><b>Business:</b> ${businessName || "—"}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Date:</b> ${date}</p>
      <p><b>Time:</b> ${timeLabel} (Mountain Time)</p>
      <p><b>Language:</b> ${lang}</p>
    `
  );

  const customerSubject =
    lang === "es" ? `Confirmación: Su llamada estratégica — ${dateLabel}` : `Confirmed: Your Strategy Call — ${dateLabel}`;
  const customerHtml =
    lang === "es"
      ? `
        <h2>¡Su llamada está confirmada!</h2>
        <p>Hola ${firstName},</p>
        <p>Su llamada estratégica gratuita de 30 minutos con Surface Growth Advisor está confirmada para:</p>
        <p style="font-size:18px;font-weight:bold;">${dateLabel} a las ${timeLabel} (Hora de Montaña)</p>
        <p>Le llamaremos al número que proporcionó: ${phone}.</p>
        <p>Si necesita reprogramar o cancelar, simplemente responda a este correo.</p>
        <p>¡Nos vemos pronto!<br>Surface Growth Advisor</p>
      `
      : `
        <h2>Your call is confirmed!</h2>
        <p>Hi ${firstName},</p>
        <p>Your free 30-minute strategy call with Surface Growth Advisor is confirmed for:</p>
        <p style="font-size:18px;font-weight:bold;">${dateLabel} at ${timeLabel} (Mountain Time)</p>
        <p>We'll call you at the number you provided: ${phone}.</p>
        <p>Need to reschedule or cancel? Just reply to this email.</p>
        <p>Talk soon!<br>Surface Growth Advisor</p>
      `;
  await sendCustomerEmail(email, customerSubject, customerHtml);

  return NextResponse.json({ ok: true });
}
