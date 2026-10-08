/**
 * Guards on the push functions. Run: bun test api/
 * Kept out of the vitest glob (src/**) on purpose, like scripts/: this is
 * server code, not the app. The leading underscore keeps Vercel from serving
 * it as a route.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  APPLE_PUSH_HOST,
  MAX_STORIES,
  NOTIFY_BODY_ONE,
  NOTIFY_TITLE,
  authorised,
  buildPayload,
  parseCount,
  parseEndpoint,
  parseSubscription,
  ukDate,
} from "./_push.js";

const P256DH = "B" + "a".repeat(86); // 87 characters, 65 bytes
const AUTH = "c".repeat(22); // 22 characters, 16 bytes
const ENDPOINT = `https://${APPLE_PUSH_HOST}/QGuQyavXutnMH_Example`;

test("an Apple subscription is accepted and stored as given", () => {
  assert.deepEqual(parseSubscription({ endpoint: ENDPOINT, keys: { p256dh: P256DH, auth: AUTH } }), {
    endpoint: ENDPOINT,
    p256dh: P256DH,
    auth: AUTH,
  });
});

test("padded keys are accepted with the padding stripped", () => {
  const parsed = parseSubscription({ endpoint: ENDPOINT, keys: { p256dh: P256DH + "=", auth: AUTH + "==" } });
  assert.equal(parsed?.p256dh, P256DH);
  assert.equal(parsed?.auth, AUTH);
});

test("a non-Apple push service is refused: version 1 is Apple only", () => {
  const keys = { p256dh: P256DH, auth: AUTH };
  assert.equal(parseSubscription({ endpoint: "https://fcm.googleapis.com/fcm/send/abc", keys }), null);
  assert.equal(parseSubscription({ endpoint: `https://${APPLE_PUSH_HOST}.evil.example/x`, keys }), null);
  assert.equal(parseSubscription({ endpoint: `http://${APPLE_PUSH_HOST}/x`, keys }), null);
});

test("malformed subscriptions are refused", () => {
  assert.equal(parseSubscription(null), null);
  assert.equal(parseSubscription("text"), null);
  assert.equal(parseSubscription({ endpoint: ENDPOINT }), null);
  assert.equal(parseSubscription({ endpoint: ENDPOINT, keys: { p256dh: P256DH.slice(1), auth: AUTH } }), null);
  assert.equal(parseSubscription({ endpoint: ENDPOINT, keys: { p256dh: P256DH, auth: "c".repeat(21) + "+" } }), null);
  assert.equal(parseEndpoint(`https://${APPLE_PUSH_HOST}/` + "x".repeat(1024)), null);
});

test("the story count must be a whole number from 1 to the ceiling", () => {
  assert.equal(parseCount(1), 1);
  assert.equal(parseCount(5), 5);
  for (const bad of [0, -1, 2.5, MAX_STORIES + 1, "3", null, undefined]) assert.equal(parseCount(bad), null);
});

test("the daily cap is keyed on the UK date, not UTC", () => {
  // 23:30 UTC on 8 Oct is 00:30 on 9 Oct in London (BST)
  assert.equal(ukDate(new Date("2026-10-08T23:30:00Z")), "2026-10-09");
  // in winter London is UTC
  assert.equal(ukDate(new Date("2026-12-08T23:30:00Z")), "2026-12-08");
});

test("the payload is declarative, carries template text only and no badge", () => {
  const one = JSON.parse(buildPayload(1, "https://theeditai.co.uk"));
  assert.equal(one.web_push, 8030);
  assert.equal(one.notification.title, NOTIFY_TITLE);
  assert.equal(one.notification.body, NOTIFY_BODY_ONE);
  assert.equal(one.notification.navigate, "https://theeditai.co.uk/ai-news");
  assert.equal("app_badge" in one, false);
  assert.equal("app_badge" in one.notification, false);

  const many = JSON.parse(buildPayload(4, "https://push-test.example"));
  assert.match(many.notification.body, /4/);
  assert.equal(many.notification.navigate, "https://push-test.example/ai-news");
});

test("the send token must match exactly, and an unset secret refuses everything", () => {
  assert.equal(authorised("Bearer s3cret", "s3cret"), true);
  assert.equal(authorised("Bearer s3cre", "s3cret"), false);
  assert.equal(authorised("s3cret", "s3cret"), false);
  assert.equal(authorised(null, "s3cret"), false);
  assert.equal(authorised("Bearer ", ""), false);
  assert.equal(authorised("Bearer anything", undefined), false);
});
