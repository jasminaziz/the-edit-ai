/**
 * Opt in (POST) and opt out (DELETE) for AI News push notifications.
 *
 * Both answer 204 whether or not the subscription was already stored, so the
 * response reveals nothing about who has opted in. Rows are tagged with the
 * host they arrived on, which keeps the test subdomain's subscriptions apart
 * from production's without any setting.
 */
import { MAX_SUBSCRIPTIONS, db, json, parseEndpoint, parseSubscription } from "./_push.js";

async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function POST(request: Request): Promise<Response> {
  const subscription = parseSubscription(await readJson(request));
  if (!subscription) return json({ error: "invalid subscription" }, 400);

  const supabase = db();
  if (!supabase) return json({ error: "not configured" }, 503);

  const origin = new URL(request.url).hostname;

  // A crude ceiling in place of rate limiting: stops the table being filled
  // with junk, and is far above any real audience for this page.
  const { count, error: countError } = await supabase
    .from("push_subscriptions")
    .select("endpoint", { count: "exact", head: true });
  if (countError) return json({ error: "storage error" }, 500);
  if ((count ?? 0) >= MAX_SUBSCRIPTIONS) return json({ error: "full" }, 503);

  const { error } = await supabase
    .from("push_subscriptions")
    .upsert({ ...subscription, origin }, { onConflict: "endpoint" });
  if (error) return json({ error: "storage error" }, 500);

  return new Response(null, { status: 204 });
}

export async function DELETE(request: Request): Promise<Response> {
  const body = await readJson(request);
  const endpoint = parseEndpoint((body as { endpoint?: unknown } | null)?.endpoint);
  if (!endpoint) return json({ error: "invalid endpoint" }, 400);

  const supabase = db();
  if (!supabase) return json({ error: "not configured" }, 503);

  const { error } = await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);
  if (error) return json({ error: "storage error" }, 500);

  return new Response(null, { status: 204 });
}
