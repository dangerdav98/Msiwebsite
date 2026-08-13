import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/server";
import { createAnonServerClient } from "@/lib/supabase/server";
import { resolveOrigin } from "@/lib/site-url";
import { computeSchedule, planTotal, planTermMonths } from "@/lib/payment-schedule";

interface CheckoutBody {
  plan: "3mo" | "12mo";
  deposit: number;
  name: string;
  businessName?: string;
  phone?: string;
  email: string;
  lang?: "en" | "es";
}

export async function POST(req: NextRequest) {
  let body: CheckoutBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { plan, deposit, name, businessName, phone, email } = body;
  const lang = body.lang === "es" ? "es" : "en";

  if (plan !== "3mo" && plan !== "12mo") {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }
  const depositNum = Number(deposit);
  const total = planTotal(plan);
  const MIN_DEPOSIT = 1500;
  if (!Number.isFinite(depositNum) || depositNum < MIN_DEPOSIT || depositNum > total) {
    return NextResponse.json({ error: `Deposit must be at least $${MIN_DEPOSIT.toLocaleString()}` }, { status: 400 });
  }
  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!email || typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Recomputed here rather than trusted from the client, so the amount
  // actually charged always matches the deposit/plan the customer picked.
  const term = planTermMonths(plan);
  const { payMonths, schedule } = computeSchedule(total, depositNum, term);

  const planLabel =
    plan === "3mo"
      ? lang === "es"
        ? "Plan de 3 Meses"
        : "3-Month Plan"
      : lang === "es"
        ? "Plan de 12 Meses"
        : "12-Month Plan";

  const origin = resolveOrigin(req);
  const unitAmount = Math.round(depositNum * 100);
  const orderId = randomUUID();

  const stripe = getStripe();

  let session;
  try {
    if (payMonths === 0) {
      session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: email.trim(),
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: `Surface Growth Advisor — ${planLabel} (Paid in Full)` },
              unit_amount: unitAmount,
            },
            quantity: 1,
          },
        ],
        metadata: { order_id: orderId },
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/checkout/cancel`,
      });
    } else {
      // First invoice (deposit) fires immediately via this recurring price.
      // The webhook converts the subscription into a Subscription Schedule
      // once it exists, so the remaining cycles bill the exact per-month
      // amounts in `schedule` instead of repeating the deposit forever.
      session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer_email: email.trim(),
        line_items: [
          {
            price_data: {
              currency: "usd",
              recurring: { interval: "month" },
              product_data: { name: `Surface Growth Advisor — ${planLabel}` },
              unit_amount: unitAmount,
            },
            quantity: 1,
          },
        ],
        subscription_data: {
          metadata: { order_id: orderId },
        },
        metadata: { order_id: orderId },
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/checkout/cancel`,
      });
    }
  } catch (err) {
    console.error("Stripe session creation failed", err);
    return NextResponse.json({ error: "Could not start checkout" }, { status: 502 });
  }

  const supabase = createAnonServerClient();
  const { error: insertError } = await supabase.from("orders").insert({
    id: orderId,
    plan,
    deposit_amount: depositNum,
    monthly_amount: depositNum,
    months: term,
    schedule,
    name: name.trim(),
    business_name: businessName?.trim() || null,
    phone: phone?.trim() || null,
    email: email.trim(),
    lang,
    status: "pending",
    stripe_checkout_session_id: session.id,
  });

  if (insertError) {
    console.error("Order insert failed", insertError);
  }

  return NextResponse.json({ url: session.url });
}
