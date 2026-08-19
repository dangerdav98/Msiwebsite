import { Resend } from "resend";

/**
 * Sends a notification email to the configured business inbox. Failures are
 * logged but never thrown — a notification email failing to send should
 * never block the actual form submission from succeeding.
 */
export async function sendNotification(subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;

  if (!apiKey || !to) {
    console.error("Resend not configured: missing RESEND_API_KEY or NOTIFY_EMAIL");
    return;
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "Surface Growth Advisor <onboarding@resend.dev>",
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Failed to send notification email", err);
  }
}
