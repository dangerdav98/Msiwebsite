import { Resend } from "resend";

/**
 * Sends an email from the business address. Failures are logged but never
 * thrown — an email failing to send should never block the actual form
 * submission from succeeding.
 */
async function send(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("Resend not configured: missing RESEND_API_KEY");
    return;
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "Surface Growth Advisor <notifications@surfacegrowthco.com>",
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Failed to send email", err);
  }
}

/** Sends a notification email to the configured business inbox. */
export async function sendNotification(subject: string, html: string) {
  const to = process.env.NOTIFY_EMAIL;
  if (!to) {
    console.error("Resend not configured: missing NOTIFY_EMAIL");
    return;
  }
  await send(to, subject, html);
}

/** Sends an email directly to a customer/visitor (e.g. a booking confirmation). */
export async function sendCustomerEmail(to: string, subject: string, html: string) {
  await send(to, subject, html);
}
