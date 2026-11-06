---
paths:
  - ".github/workflows/append-whats-new.yml"
  - ".github/workflows/whats-new-watchdog.yml"
  - "api/**"
  - "src/components/PushToggle.tsx"
  - "src/components/WhatsNewCard.tsx"
  - "src/pages/WhatsNew.tsx"
---

# The whats_new pipeline and push notifications

Loads with the files above. History: `.claude/history/CLAUDE-md_2026-11-06.md`, section "whats_new automation".

## The pipeline

- A Claude Code Routine (`trig_01288KFUKoGh4wWrewE7JqC2`) reads the Rundown newsletter from Gmail, extracts up to five stories and dispatches `.github/workflows/append-whats-new.yml` (one input, `payload_b64`), which POSTs to the Apps Script, which appends rows to the `whats_new` tab. Read its schedule, model and Gmail search from the trigger, not from here; on 6 Nov 2026 it ran Mon to Fri at 09:00 London on Sonnet 5.5, searching `from:news@daily.therundown.ai newer_than:1d`.
- Dispatch goes through the GitHub MCP tool `actions_run_trigger` (method `run_workflow`, workflow `append-whats-new.yml`, ref `main`). Raw curl to api.github.com cannot work from the Routine sandbox: its proxy strips the Authorization header and injects a credential that cannot dispatch. No PATs; the repo connection is the only credential the Routine needs, and the workflow's repository secrets never reach it.
- The GitHub relay exists because the Routine sandbox blocks egress to script.google.com. Do not delete it as redundant. If a direct Apps Script call from the Cowork cloud ever passes a redirect check, the relay and its watchdog can go.
- The Apps Script exec URL is never written in this repo. The workflow reads it from the secret `WHATS_NEW_EXEC_URL` and sends `WHATS_NEW_TOKEN` as a `token` parameter; the script refuses any call without it, `doGet` included. The old URL is in git history and harmless without the token. The endpoint can still read the whole `tools` tab for anyone holding the token, which is why `tools` writes are never routed through it.
- curl against the Apps Script: `-d @file` without `-X POST`, and follow the 302 with GET.
- Schema, columns A to F in order: name, developer, date, what_it_is, category, url. The date is `DD MMM YYYY`, strictly, because it drives the month parser. No ranges, no "Unknown".
- The watchdog's schedule and its reasons are in the comments of `whats-new-watchdog.yml`; read them there. A watchdog that fires on a correct quiet day destroys the alert channel's credibility, so check a schedule change against the Routine's real run days.

## Push notifications

- Plan, rulings A to G and the approved copy: `reports/2026-10-08-push-notifications-plan.md`. A second job, `notify`, runs only after `append` succeeds and posts the batch's story count to `/api/push-send` with `PUSH_SEND_SECRET`. It is a separate job so a push failure never marks the append failed; with the secret unset it skips with a warning. A 409 is the daily cap working (one send per UK date per host), not an error.
- No service worker. The site uses Declarative Web Push on `window.pushManager`. A worker at scope `/` would be replaced and unregistered by the self-destroying `/sw.js` on the next load, taking its subscription with it, so never "upgrade" `PushToggle.tsx` to `navigator.serviceWorker.ready.pushManager`.
- Apple only in version 1: `api/_push.ts` refuses any endpoint not on `web.push.apple.com`.
- `window.pushManager` existing does not mean push works: iOS exposes it in an ordinary Safari tab, where push is not delivered and `subscribe()` crashed the page. On an iPhone or iPad the button shows only in the home-screen app; `isAppleTouchTab()` sends a tab to the install hint, and iPads, which report a Mac user agent, are told apart by touch points.
- Subscriptions live in Supabase (`push_subscriptions`, `push_sends`, RLS on with no policies, grants revoked), written only by the `api/` functions with the service role key. Rows carry the host they arrived on, which keeps the test subdomain apart from production.
- The notification text is the template in `api/_push.ts` plus the count, never caller-supplied, so a leaked secret can at worst send one genuine-looking notification.
- Server-only variables (`PUSH_VAPID_PRIVATE_KEY`, `PUSH_SEND_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) are never `VITE_`-prefixed, because a `VITE_` variable is baked into the browser bundle. Production values live in Vercel only.
- Guards: `bun test api/`. The `api/` files sit outside every tsconfig; check them with `bunx tsc --noEmit --strict --skipLibCheck --target es2022 --module nodenext --moduleResolution nodenext --types node api/push.ts api/push-send.ts api/_push.ts`.
