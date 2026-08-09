import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/server";
import { createAnonServerClient } from "@/lib/supabase/server";
import { resolveOrigin } from "@/lib/site-url";

interface CheckoutBody {
  plan: "3mo" | "12mo";
  deposit: number;
  months: number;
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

  const { plan, deposit, months, name, businessName, phone, email } = body;
  const lang = body.lang === "es" ? "es" : "en";

  if (plan !== "3mo" && plan !== "12mo") {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }
  const depositNum = Number(deposit);
  const monthsNum = Number(months);
  const planCap = plan === "3mo" ? 5000 : 18000;
  const MIN_DEPOSIT = 1500;
  if (!Number.isFinite(depositNum) || depositNum < MIN_DEPOSIT || depositNum > planCap) {
    return NextResponse.json({ error: `Deposit must be at least $${MIN_DEPOSIT.toLocaleString()}` }, { status: 400 });
  }
  if (!Number.isFinite(monthsNum) || monthsNum < 1 || monthsNum > 24) {
    return NextResponse.json({ error: "Invalid months" }, { status: 400 });
  }
  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!email || typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

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
    if (monthsNum <= 1) {
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
      // Note: cancel_at can't be set at Checkout Session creation time for
      // subscription mode — the webhook applies it via subscriptions.update()
      // once checkout.session.completed fires and a real subscription exists.
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
    months: monthsNum,
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
