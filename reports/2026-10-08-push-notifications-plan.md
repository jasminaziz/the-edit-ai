# Push notifications for The Edit: plan

8 October 2026. **Plan only. Nothing is built until Jasmin rules on the
decisions in section 9.** Write each ruling on its `Ruling:` line.

The aim: when a new batch lands on the AI News page (`/ai-news`, which
`/whats-new` redirects to), a phone that has installed the site and opted in
gets one notification.

## Assumptions the plan depends on

1. **Jasmin's iPhone runs iOS 18.4 or later.** Everything below depends on a
   feature Apple added in 18.4. Unverified.
2. **Her home-screen install is of `theeditai.co.uk`, not `www.`.** If it was
   installed before 22 August it may be the `www.` one. The test plan
   reinstalls from Safari either way.
3. **Version 1 covers Apple devices only:** iPhone and iPad from the home
   screen, plus Safari on a Mac. Android and desktop Chrome get nothing. That is
   the price of leaving the service worker ruling untouched (section 0).
   Decision A.
4. **This adds the site's first server code, an `api/` folder.** The
   4 September capture ruling rejected a server function for email capture on
   build cost. Push cannot avoid one: the opt-in has to be stored somewhere, and
   the send needs a private key that cannot sit in the browser. Off-the-shelf
   push services (OneSignal and similar) need their own script and service
   worker on the site, which breaks both the worker ruling and the
   no-third-party-script position. Decision B.
5. **The Vercel plan is unverified.** The API did not return it. Any plan's
   included function allowance covers roughly 30 sends a month.
6. **How the whats_new watchdog judges a failed run is not known here.** If it
   alerts on any red workflow run, a push failure would read as an append
   failure. To check before building.

## 0. The service worker ruling stands, and push works without it

**Push cannot share the site with a normal worker as things are.** Checked
against production on 8 October: every page load runs
`navigator.serviceWorker.register('/sw.js', { scope: '/' })` from
`/registerSW.js`, and `/sw.js` is vite-plugin-pwa's self-destroying worker,
which unregisters itself on activation. A push worker at scope `/` would be
replaced by `/sw.js` on the next page load and then unregistered, and its push
subscription would go with it. A worker at a narrower scope might survive, but
that is untested on iOS.

**Apple's Declarative Web Push needs no service worker at all.** The page
subscribes through `window.pushManager`, and the operating system displays the
notification itself from a JSON payload (`"web_push": 8030`, with a
`notification` object carrying `title`, `body` and `navigate`). Shipped in
iOS and iPadOS 18.4, and in Safari 18.5 on macOS.

**Recommendation: use Declarative Web Push and leave `selfDestroying: true`
and `/sw.js` exactly as they are.** The ruling is not lifted and nothing about
the August bug is reopened.

**The one unproven point.** WebKit says a root-scope worker shares the window's
subscription and that removing the worker does not remove the subscription. On
this site a worker installs and removes itself on every page load, which is an
unusual case. Proving the subscription survives that is the first thing the
phone test does (section 7, step 4).

**Android later** would need a push worker, which reopens the ruling. That is
its own decision with its own evidence, not part of this plan.

## 1. Opting in and opting out

- **Opt in:** one control in the `/ai-news` header, outside the data-loading
  part of the page so it works even when the feed fails. It appears only where
  `window.pushManager` exists. A tap asks iOS for permission (Apple requires a
  tap), subscribes, and sends the subscription to `POST /api/push`. No worker
  is registered.
- **State:** read from `pushManager.getSubscription()` on load. No
  localStorage, no cookie.
- **iPhone in a Safari tab:** push does not work there, so the control is
  replaced by a one-line hint to add the site to the home screen.
- **Opt out:** the same control switches to off. It unsubscribes on the device
  and calls `DELETE /api/push`, which removes the row.
- **Other ways out:** iOS Settings, or deleting the icon. Apple then reports the
  subscription as gone on the next send, and the row is deleted automatically.

## 2. Storage, access and cost

- **Where:** a new table, `push_subscriptions`, in the existing Supabase project
  "The Edit" (eu-west-1, Ireland). It holds the push endpoint (unique), the two
  encryption keys, an origin tag (production or test) and the opt-in date. No
  name, email, IP address or browser details.
- **Send log:** a second table, `push_sends`, one row per send: date, story
  count, delivered, removed, failed. This is the record of what was sent,
  because Vercel's runtime logs last about an hour.
- **Who can read it:** RLS is on with no policies, so the publishable key can do
  nothing. Only the server functions read it, with the service role key held in
  Vercel's environment settings. Jasmin can read it in the Supabase dashboard.
  The opt-in endpoint returns the same response whether a subscription is new
  or already stored, so it reveals nothing about who has opted in.
- **Not the Sheet:** the public Sheets key can read every tab.
- **Cost: £0 a month.** Supabase is on the Free plan (confirmed 8 October); a
  thousand subscribers is under 1 MB. Apple's push service is free and needs no
  developer account. About 30 function calls a month.
- **One real risk:** Free projects pause after a week of inactivity, and two of
  Jasmin's other projects are paused now. Daily sends keep this one active, and
  a paused project would fail the send visibly in the workflow run.

## 3. What triggers a send

**The existing workflow is the trigger.** A second job, `notify`, is added to
`.github/workflows/append-whats-new.yml`:

- It runs only after the `append` job has succeeded.
- It posts `{date, count}` to `/api/push-send` with a bearer token from a new
  repository secret, `PUSH_SEND_SECRET`. This follows the pattern the workflow
  already uses for `WHATS_NEW_EXEC_URL` and `WHATS_NEW_TOKEN` (since 4 October).
  The Routine needs nothing new.
- The function writes the notification from the approved template plus the
  count. It never sends text supplied by the caller, so a leaked secret could at
  worst send one real-looking "N new stories" notification, and the daily cap in
  section 4 stops even that the second time.
- Being a separate job, a push failure leaves the append job green. See
  assumption 6 for the watchdog.

## 4. One notification per batch

- One workflow run is one batch, and it produces one send.
- A cap of **one per UK calendar day**, enforced by a unique date in
  `push_sends`. That covers duplicate batches like the 3 and 6 July ones.
- A day with no stories triggers no workflow run, so no notification.
- Messages expire after 12 hours, so a phone that was off does not get
  yesterday's news.

## 5. Visitor-facing strings, for Jasmin to write

| Placeholder | Where it shows |
|---|---|
| `PUSH_OPTIN` | the button when notifications are off |
| `PUSH_OPTOUT` | the button or state when they are on |
| `PUSH_DENIED` | after "Don't Allow" on the iOS prompt: how to turn it back on in Settings |
| `PUSH_INSTALL_HINT` | iPhone in a Safari tab: add to home screen first |
| `PUSH_ERROR` | subscribing failed |
| `NOTIFY_TITLE` | notification title |
| `NOTIFY_BODY_ONE` | notification body, one story |
| `NOTIFY_BODY_MANY` | notification body, several stories, with `{count}` |

Not hers to write: the permission prompt is Apple's system text, and the
notification's source label is the existing manifest `short_name`, "The Edit".

## 6. What the privacy policy has to say, as facts

- **What is stored:** a push address that Apple issues for one browser on one
  device, two encryption keys and the date of opt-in. Nothing else.
- **Consent:** off by default. It starts only after a tap and the iOS prompt,
  and is withdrawn through the same control, iOS Settings or by deleting the
  icon.
- **Where it is held:** Supabase, EU (Ireland). It passes through a Vercel
  function, which will be pinned to an EU region (Vercel's default is US East).
- **Delivery:** through Apple's push service. The message content is encrypted
  end to end, but Apple sees that a message went to a device, and when.
- **Who can access it:** Jasmin and the site's server. Not public, not shared.
- **Retention:** until opt-out, or until Apple reports the subscription gone.
  The send log holds counts only, no device data.
- **Unchanged:** "The site sets no cookies and runs no analytics" stays true.
- **Newly named:** Supabase for a second purpose, and Vercel for the first time.
- **Hers to state:** the lawful basis, and whether a push address is treated as
  personal data.
- The claims register entry for the privacy policy changes in the same pass.

## 7. Testing on Jasmin's phone before anyone else sees it

1. Build on its own branch in its own worktree, as the site map build was, so
   this shared tree is never touched.
2. Assign that branch a test subdomain of `theeditai.co.uk`. Deployment
   protection is `all_except_custom_domains` (confirmed 8 October), so a custom
   domain skips the login wall. That matters because the home-screen app does
   not share Safari's login cookie. Adding the subdomain is console work for
   Jasmin.
3. It is a separate origin, so it gets its own install and subscription. Its
   rows are tagged as test and production sends never reach them. The feed will
   be empty there because the Sheets key is not scoped to it; the test does not
   need it.
4. Jasmin opens it in Safari, adds it to the home screen, opts in, then closes
   and reopens the app several times. Each reopen runs the self-destroying
   worker, which is the unproven point in section 0.
5. A test send with curl, only after her go. Then: opt out, opt in again, deny
   and re-enable through Settings, and delete the icon to confirm the row is
   removed on the next send.
6. Only then merge, which is when everyone else sees the control. Jasmin
   reinstalls from `theeditai.co.uk` and confirms the first real morning batch
   arrives.

## 8. Apple limits

Fixed, no decision needed:

- Push works only from the home-screen app on iPhone and iPad, never in a
  Safari tab.
- The permission prompt must come from a tap, and iOS asks once. After "Don't
  Allow", only Settings can turn it back on.
- No images and no action buttons on the notification.
- Focus modes and Notification Summary can delay delivery, and web apps cannot
  mark anything time-sensitive.
- Deleting the icon ends the subscription. Reinstalling means opting in again.

The four limits that need a ruling are decisions C to F below.

## 9. Decisions

**A. Version 1 is Apple only.** Android and desktop Chrome get no control,
because reaching them needs a service worker. Recommended: yes.

Ruling:

**B. The site gets its first `api/` server code.** Two functions, a Supabase
table pair and one new repository secret. Recommended: yes; there is no route to
push without it.

Ruling:

**C. Phones older than iOS 18.4.** Recommended: show them nothing.

Ruling:

**D. A badge count on the home-screen icon.** Recommended: not in version 1.
The `app_badge` field crashed Safari 18.6 and moved to the top level of the
payload in Safari 26, so it carries version risk for little gain.

Ruling:

**E. The notification body: count only, or name the lead story too.**
Recommended: count only. Naming the story puts Routine-extracted text on
phones, which is the same text `/ai-news` already shows but a different place
to be wrong in.

Ruling:

**F. The daily cap of one notification per UK calendar day.** Recommended: yes.

Ruling:

**G. Privacy policy:** the lawful basis, and whether a push address is
personal data (section 6).

Ruling:

## Sources

Read 8 October 2026.

- [WebKit: Meet Declarative Web Push](https://webkit.org/blog/16535/meet-declarative-web-push/)
- [WebKit bug 293457: `app_badge` moved to the top level](https://bugs.webkit.org/show_bug.cgi?id=293457)
- [WebKit bug 297907: `app_badge` crash in Safari 18.6](https://bugs.webkit.org/show_bug.cgi?id=297907)
- [Safari 18.5 adds Declarative Web Push on macOS](https://appleworld.today/2025/05/with-safari-18-5-included-in-macos-15-5-apple-added-declarative-web-push/)
- [heise: iOS 26 home-screen web app behaviour](https://heise.de/-10749652)
- Production: `https://theeditai.co.uk/registerSW.js` and `/sw.js`, fetched
  8 October.
- Supabase organisation plan and project region, and Vercel project protection
  settings, read through their APIs 8 October.
