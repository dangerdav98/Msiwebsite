import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  const rawBody = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;

    if (orderId) {
      const supabase = createServiceRoleClient();

      const { data: order } = await supabase.from("orders").select("months").eq("id", orderId).single();

      await supabase
        .from("orders")
        .update({
          status: "paid",
          stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
          stripe_subscription_id: typeof session.subscription === "string" ? session.subscription : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (typeof session.subscription === "string" && order && order.months > 1) {
        const cancelAt = new Date();
        cancelAt.setMonth(cancelAt.getMonth() + (order.months - 1));
        try {
          await stripe.subscriptions.update(session.subscription, {
            cancel_at: Math.floor(cancelAt.getTime() / 1000),
          });
        } catch (err) {
          console.error("Failed to set subscription cancel_at", err);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
