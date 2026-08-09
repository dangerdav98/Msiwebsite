import Link from "next/link";
import { getStripe } from "@/lib/stripe/server";
import "../checkout.css";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  let paid = false;
  let email: string | null = null;

  if (session_id) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(session_id);
      paid = session.payment_status === "paid" || session.payment_status === "no_payment_required";
      email = session.customer_details?.email || null;
    } catch {
      // fall through to generic confirmation
    }
  }

  return (
    <div className="checkout-page">
      <div className="checkout-nav">
        <Link href="/">
          Surface <b>Growth</b> Advisor
        </Link>
      </div>
      <main style={{ textAlign: "center" }}>
        <h1>{paid ? "You're All Set" : "Thanks!"}</h1>
        <p className="checkout-sub">
          {paid
            ? `Your payment went through${email ? ` — a confirmation was sent to ${email}` : ""}. David will be in touch within 24 hours to kick things off.`
            : "We're finishing up your enrollment. You'll receive a confirmation email shortly."}
        </p>
        <p style={{ marginTop: 24 }}>
          <Link href="/" style={{ color: "var(--gold)", fontWeight: 700 }}>
            ← Back to Home
          </Link>
        </p>
      </main>
    </div>
  );
}
