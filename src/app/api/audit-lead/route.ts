import { NextRequest, NextResponse } from "next/server";
import { createAnonServerClient } from "@/lib/supabase/server";
import { sendNotification } from "@/lib/resend/server";

interface AuditLeadBody {
  name?: string;
  businessName?: string;
  phone?: string;
  email?: string;
  lang?: string;
  gapCount: number;
  answers: Record<string, string | null>;
}

export async function POST(req: NextRequest) {
  let body: AuditLeadBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = body.name?.trim() || "";
  const phone = body.phone?.trim() || "";
  const email = body.email?.trim() || "";
  if (!name && !phone && !email) {
    return NextResponse.json({ error: "Name, phone, or email is required" }, { status: 400 });
  }

  const businessName = body.businessName?.trim() || null;
  const lang = body.lang === "es" ? "es" : "en";
  const gapCount = Number(body.gapCount) || 0;

  const supabase = createAnonServerClient();
  const { error: insertError } = await supabase.from("audit_leads").insert({
    name: name || null,
    business_name: businessName,
    phone: phone || null,
    email: email || null,
    lang,
    gap_count: gapCount,
    answers: body.answers || {},
  });

  if (insertError) {
    console.error("Audit lead insert failed", insertError);
    return NextResponse.json({ error: "Could not save lead" }, { status: 500 });
  }

  await sendNotification(
    `New Audit Lead — ${name || businessName || "Unknown"}`,
    `
      <h2>New Business Growth Audit Completed</h2>
      <p><b>Name:</b> ${name || "—"}</p>
      <p><b>Business:</b> ${businessName || "—"}</p>
      <p><b>Phone:</b> ${phone || "—"}</p>
      <p><b>Email:</b> ${email || "—"}</p>
      <p><b>Language:</b> ${lang}</p>
      <p><b>Gaps Found:</b> ${gapCount}</p>
    `
  );

  return NextResponse.json({ ok: true });
}
