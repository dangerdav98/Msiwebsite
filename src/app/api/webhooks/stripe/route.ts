import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

/** Groups consecutive equal amounts so each distinct price becomes one phase. */
function groupSchedule(schedule: number[]): { amount: number; iterations: number }[] {
  const groups: { amount: number; iterations: number }[] = [];
  for (const amount of schedule) {
    const last = groups[groups.length - 1];
    if (last && last.amount === amount) {
      last.iterations += 1;
    } else {
      groups.push({ amount, iterations: 1 });
    }
  }
  return groups;
}

/**
 * Converts a freshly-created subscription (billing the deposit amount every
 * cycle) into a Subscription Schedule whose remaining phases charge the
 * exact per-month amounts in `schedule`, then cancels automatically after
 * the last phase. The deposit phase (already invoiced by Checkout) is cut
 * to a single cycle so it doesn't keep repeating at that price.
 */
async function applyScheduleToSubscription(stripe: Stripe, subscriptionId: string, schedule: number[]) {
  const groups = groupSchedule(schedule);

  const prices = await Promise.all(
    groups.map((g) =>
      stripe.prices.create({
        currency: "usd",
        unit_amount: Math.round(g.amount * 100),
        recurring: { interval: "month" },
        product_data: { name: "Surface Growth Advisor — Monthly Payment" },
      })
    )
  );

  const schedule_ = await stripe.subscriptionSchedules.create({ from_subscription: subscriptionId });
  const depositPhase = schedule_.phases[0];

  await stripe.subscriptionSchedules.update(schedule_.id, {
    end_behavior: "cancel",
    phases: [
      {
        // Stripe requires an explicit start_date on the first phase when
        // replacing the whole phases array on an existing schedule — without
        // it, the update is rejected ("missing at least one phase with a
        // start_date to anchor end dates to").
        start_date: depositPhase.start_date,
        items: depositPhase.items.map((item) => ({ price: item.price as string, quantity: item.quantity })),
        duration: { interval: "month", interval_count: 1 },
      },
      ...groups.map((g, i) => ({
        items: [{ price: prices[i].id, quantity: 1 }],
        duration: { interval: "month" as const, interval_count: g.iterations },
      })),
    ],
  });
}

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

      const { data: order } = await supabase.from("orders").select("schedule").eq("id", orderId).single();

      await supabase
        .from("orders")
        .update({
          status: "paid",
          stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
          stripe_subscription_id: typeof session.subscription === "string" ? session.subscription : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      const scheduleArr = Array.isArray(order?.schedule) ? (order.schedule as number[]) : [];

      if (typeof session.subscription === "string" && scheduleArr.length > 0) {
        try {
          await applyScheduleToSubscription(stripe, session.subscription, scheduleArr);
        } catch (err) {
          console.error("Failed to apply payment schedule to subscription", err);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
