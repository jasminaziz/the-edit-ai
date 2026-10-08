/**
 * Sends one notification for one whats_new batch. Called by the `notify` job
 * in .github/workflows/append-whats-new.yml after the append has succeeded.
 *
 * - The caller must present PUSH_SEND_SECRET as a bearer token.
 * - The caller supplies only the story count. The text is the approved
 *   template, so a leaked secret can at worst send one genuine-looking
 *   notification, and the daily cap stops even that the second time.
 * - At most one send per UK calendar day per host (ruling F). The cap is the
 *   primary key on push_sends: the insert fails before anything is sent.
 * - Subscriptions Apple reports as gone (404 or 410) are deleted.
 */
import webpush from "web-push";
import { PUSH_TTL_SECONDS, authorised, buildPayload, db, json, parseCount, ukDate } from "./_push.js";

export async function POST(request: Request): Promise<Response> {
  if (!authorised(request.headers.get("authorization"), process.env.PUSH_SEND_SECRET)) {
    return json({ error: "unauthorised" }, 401);
  }

  const vapidPublic = process.env.VITE_PUSH_VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.PUSH_VAPID_PRIVATE_KEY;
  const supabase = db();
  if (!vapidPublic || !vapidPrivate || !supabase) return json({ error: "not configured" }, 503);

  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    // falls through to the count check
  }
  const count = parseCount((body as { count?: unknown } | null)?.count);
  if (!count) return json({ error: "invalid count" }, 400);

  const { origin: siteOrigin, hostname } = new URL(request.url);
  const sendDate = ukDate(new Date());

  const { error: capError } = await supabase
    .from("push_sends")
    .insert({ send_date: sendDate, origin: hostname, story_count: count });
  if (capError) {
    // 23505 is a unique violation: today's notification has already gone.
    return capError.code === "23505"
      ? json({ sent: false, reason: `already sent for ${sendDate}` }, 409)
      : json({ error: "storage error" }, 500);
  }

  const { data: subscriptions, error } = await supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("origin", hostname);
  if (error) return json({ error: "storage error" }, 500);

  webpush.setVapidDetails("https://theeditai.co.uk", vapidPublic, vapidPrivate);
  const payload = buildPayload(count, siteOrigin);

  const results = await Promise.allSettled(
    (subscriptions ?? []).map((s) =>
      webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload, {
        TTL: PUSH_TTL_SECONDS,
        urgency: "normal",
      }),
    ),
  );

  let delivered = 0;
  const gone: string[] = [];
  results.forEach((result, i) => {
    if (result.status === "fulfilled") delivered++;
    else {
      const status = (result.reason as { statusCode?: number }).statusCode;
      if (status === 404 || status === 410) gone.push(subscriptions![i].endpoint);
    }
  });
  if (gone.length) await supabase.from("push_subscriptions").delete().in("endpoint", gone);
  const failed = results.length - delivered - gone.length;

  await supabase
    .from("push_sends")
    .update({ delivered, removed: gone.length, failed })
    .eq("send_date", sendDate)
    .eq("origin", hostname);

  return json({ sent: true, date: sendDate, delivered, removed: gone.length, failed });
}
