import type { APIRoute } from 'astro';
import { Resend } from 'resend';

/**
 * POST /api/waitlist — collects waitlist signups from /waitlist.
 *
 * Persistence strategy (chosen for "ship now, migrate later"):
 *   1. Always console.log the submission with a [WAITLIST] prefix so it's
 *      captured in Vercel function logs even if the email step fails.
 *   2. If RESEND_API_KEY + WAITLIST_NOTIFY_TO are set, send a notification
 *      email to the founder via Resend so submissions surface in the inbox.
 *
 * When volume justifies it, swap the email-only path for a real list
 * (Resend audiences API, Vercel Postgres, or a Render Postgres table) by
 * extending this handler — the form contract stays the same.
 *
 * Required env vars (set in Vercel project, not committed):
 *   RESEND_API_KEY        — Resend API key
 *   WAITLIST_NOTIFY_TO    — founder's email (where notifications land)
 *   WAITLIST_NOTIFY_FROM  — verified sending address, e.g. waitlist@onconjure.com
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const email        = String(formData.get('email')        ?? '').trim();
  const designFocus  = String(formData.get('design_focus') ?? '').trim();
  const honeypot     = String(formData.get('website')      ?? '');

  // Honeypot: bots fill hidden fields. Pretend success so they don't retry.
  if (honeypot) {
    return json({ ok: true });
  }

  if (!email || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'Please enter a valid email address.' }, 400);
  }

  const submission = {
    email,
    design_focus: designFocus || null,
    source: 'marketing-waitlist',
    created_at: new Date().toISOString(),
  };

  // Persist via function logs at minimum. Vercel preserves these.
  console.log('[WAITLIST]', JSON.stringify(submission));

  const apiKey     = import.meta.env.RESEND_API_KEY;
  const notifyTo   = import.meta.env.WAITLIST_NOTIFY_TO;
  const notifyFrom = import.meta.env.WAITLIST_NOTIFY_FROM ?? 'waitlist@onconjure.com';

  if (apiKey && notifyTo) {
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: notifyFrom,
        to: notifyTo,
        subject: `Waitlist signup — ${email}`,
        text: [
          `Email:        ${email}`,
          `Designs:      ${designFocus || '(blank)'}`,
          `Source:       ${submission.source}`,
          `Received:     ${submission.created_at}`,
        ].join('\n'),
      });
    } catch (err) {
      // Don't fail the user's submission if the notification step breaks —
      // we already have it in the function logs.
      console.error('[WAITLIST] notification email failed', err);
    }
  }

  return json({ ok: true });
};
