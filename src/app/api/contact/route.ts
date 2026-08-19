import { NextRequest, NextResponse } from "next/server";
import { createAnonServerClient } from "@/lib/supabase/server";
import { sendNotification } from "@/lib/resend/server";

interface ContactBody {
  name: string;
  businessName?: string;
  email?: string;
  phone?: string;
  serviceInterest?: string;
  message?: string;
}

export async function POST(req: NextRequest) {
  let body: ContactBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = body.name?.trim() || "";
  const email = body.email?.trim() || "";
  if (!name && !email) {
    return NextResponse.json({ error: "Name or email is required" }, { status: 400 });
  }

  const businessName = body.businessName?.trim() || null;
  const phone = body.phone?.trim() || null;
  const serviceInterest = body.serviceInterest?.trim() || null;
  const message = body.message?.trim() || null;

  const supabase = createAnonServerClient();
  const { error: insertError } = await supabase.from("contact_submissions").insert({
    name,
    business_name: businessName,
    email: email || null,
    phone,
    service_interest: serviceInterest,
    message,
  });

  if (insertError) {
    console.error("Contact submission insert failed", insertError);
    return NextResponse.json({ error: "Could not save submission" }, { status: 500 });
  }

  await sendNotification(
    `New Contact Form Submission — ${name || "Unknown"}`,
    `
      <h2>New Contact Form Submission</h2>
      <p><b>Name:</b> ${name || "—"}</p>
      <p><b>Business:</b> ${businessName || "—"}</p>
      <p><b>Email:</b> ${email || "—"}</p>
      <p><b>Phone:</b> ${phone || "—"}</p>
      <p><b>Service Interest:</b> ${serviceInterest || "—"}</p>
      <p><b>Message:</b><br>${(message || "—").replace(/\n/g, "<br>")}</p>
    `
  );

  return NextResponse.json({ ok: true });
}
