# The Edit

Live at [theeditai.co.uk](https://theeditai.co.uk). An opinionated directory
of AI tools for communications teams in charities, cultural organisations and
heritage. Every tool is judged on where the data sits, whether it trains on
what you type into it, whether there's a nonprofit price, and whether you
could explain it to a trustee.

It runs as a system rather than a website. The content layer lives in Google
Sheets, deliberately separated from the build, so the directory updates
without touching code. The site reads it through the Sheets API and deploys
automatically from `main`. Maintenance splits on one principle: machines
maintain facts, a human owns judgement. Scheduled tasks re-check the factual
fields against published sources and stamp when they last did. The DPIA flag,
the trustee note and the verdict are never written by automation.

Designed, shipped and operated end to end by one non-engineer, as part of an
independent communications practice: [jasminaziz.co.uk](https://jasminaziz.co.uk).

## Stack

Vite + React + TypeScript · Tailwind · Google Sheets as the content layer · Vercel

## Running locally

```bash
bun install --frozen-lockfile
bun run dev
```

Dev server runs on port 8080. `bun.lock` is canonical. Never run
`npm install` or `npm audit fix`: both resolve against and rewrite a stale
`package-lock.json`.

Environment variables go in `.env.local`, which is gitignored:
`VITE_GOOGLE_SHEETS_ID`, `VITE_GOOGLE_SHEETS_API_KEY`, `VITE_SUPABASE_URL`,
`VITE_SUPABASE_PUBLISHABLE_KEY`. The production Sheets key is
referrer-restricted to the live domain and returns 403 from localhost, so
local dev needs its own key scoped to `http://localhost:8080/*`.
