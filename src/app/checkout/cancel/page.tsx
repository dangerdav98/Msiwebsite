import Link from "next/link";
import "../checkout.css";

export default function CheckoutCancelPage() {
  return (
    <div className="checkout-page">
      <div className="checkout-nav">
        <Link href="/">
          Surface <b>Growth</b> Advisor
        </Link>
      </div>
      <main style={{ textAlign: "center" }}>
        <h1>Checkout Canceled</h1>
        <p className="checkout-sub">No charge was made. You can head back to pricing and try again whenever you're ready.</p>
        <p style={{ marginTop: 24 }}>
          <Link href="/pricing" style={{ color: "var(--gold)", fontWeight: 700 }}>
            ← Back to Pricing
          </Link>
        </p>
      </main>
    </div>
  );
}
