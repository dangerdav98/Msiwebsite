import { Resend } from "resend";

/**
 * Sends an email from the business address. Failures are logged but never
 * thrown — an email failing to send should never block the actual form
 * submission from succeeding.
 */
async function send(to: string, subject: string, html: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("Resend not configured: missing RESEND_API_KEY");
    return false;
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "Surface Growth Advisor <notifications@surfacegrowthco.com>",
      to,
      subject,
      html,
    });
    if (error) {
      console.error("Resend rejected email", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to send email", err);
    return false;
  }
}

/** Sends a notification email to the configured business inbox. Returns whether it was sent. */
export async function sendNotification(subject: string, html: string): Promise<boolean> {
  const to = process.env.NOTIFY_EMAIL;
  if (!to) {
    console.error("Resend not configured: missing NOTIFY_EMAIL");
    return false;
  }
  return send(to, subject, html);
}

/** Sends an email directly to a customer/visitor (e.g. a booking confirmation). */
export async function sendCustomerEmail(to: string, subject: string, html: string): Promise<boolean> {
  return send(to, subject, html);
}

/** Banner prepended to a notification when the lead could not be saved to the database. */
export const NOT_SAVED_BANNER =
  '<p style="background:#fee2e2;color:#991b1b;padding:10px 14px;border-radius:4px;"><b>NOT SAVED TO DATABASE.</b> The database save failed, so this email is the only record of this submission.</p>';
