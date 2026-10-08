/**
 * Shared checks for the two push functions. The leading underscore keeps
 * Vercel from serving this file as a route.
 *
 * Plan and rulings: reports/2026-10-08-push-notifications-plan.md.
 * Version 1 is Apple only (ruling A), so a subscription must point at Apple's
 * push service. Anything else is refused rather than stored.
 */
import { timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

export const APPLE_PUSH_HOST = "web.push.apple.com";
export const MAX_SUBSCRIPTIONS = 5000;
export const MAX_STORIES = 20;

// Messages expire after 12 hours, so a phone that was off overnight still
// gets the morning's batch but never yesterday's.
export const PUSH_TTL_SECONDS = 12 * 60 * 60;

// Placeholder strings. Jasmin writes these (plan section 5). Replace only
// with approved copy.
export const NOTIFY_TITLE = "[NOTIFY_TITLE]";
export const NOTIFY_BODY_ONE = "[NOTIFY_BODY_ONE]";
export const NOTIFY_BODY_MANY = "[NOTIFY_BODY_MANY {count}]";

export type StoredSubscription = { endpoint: string; p256dh: string; auth: string };

const BASE64URL = /^[A-Za-z0-9_-]+$/;

// A browser key in base64url: padding is optional, so strip it before
// checking the length. p256dh is 65 bytes (87 characters), auth 16 (22).
function key(value: unknown, length: number): string | null {
  if (typeof value !== "string") return null;
  const bare = value.replace(/=+$/, "");
  return bare.length === length && BASE64URL.test(bare) ? bare : null;
}

export function parseEndpoint(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 1024) return null;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  return url.protocol === "https:" && url.hostname === APPLE_PUSH_HOST ? value : null;
}

export function parseSubscription(body: unknown): StoredSubscription | null {
  if (!body || typeof body !== "object") return null;
  const { endpoint, keys } = body as { endpoint?: unknown; keys?: { p256dh?: unknown; auth?: unknown } };
  const checkedEndpoint = parseEndpoint(endpoint);
  const p256dh = key(keys?.p256dh, 87);
  const auth = key(keys?.auth, 22);
  return checkedEndpoint && p256dh && auth ? { endpoint: checkedEndpoint, p256dh, auth } : null;
}

export function parseCount(value: unknown): number | null {
  return Number.isInteger(value) && (value as number) >= 1 && (value as number) <= MAX_STORIES
    ? (value as number)
    : null;
}

// The UK calendar date the daily cap is keyed on, as YYYY-MM-DD.
export function ukDate(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

// Declarative Web Push payload: iOS shows it with no service worker. The text
// comes from the approved template and the count only, never from the caller.
// No app_badge (ruling D).
export function buildPayload(count: number, siteOrigin: string): string {
  return JSON.stringify({
    web_push: 8030,
    notification: {
      title: NOTIFY_TITLE,
      body: count === 1 ? NOTIFY_BODY_ONE : NOTIFY_BODY_MANY.replace("{count}", String(count)),
      navigate: `${siteOrigin}/ai-news`,
      lang: "en-GB",
      dir: "ltr",
    },
  });
}

// Constant-time comparison of the bearer token against the secret. An unset
// secret refuses everything rather than accepting an empty token.
export function authorised(header: string | null, secret: string | undefined): boolean {
  if (!secret || !header?.startsWith("Bearer ")) return false;
  const given = Buffer.from(header.slice("Bearer ".length));
  const expected = Buffer.from(secret);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export function db() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}
