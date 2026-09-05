/**
 * Build-time prerender for The Edit.
 *
 * WHY THIS EXISTS. The site ships a 4,380-byte shell whose entire body is
 * `<div id="root"></div>`, verified against production on 4 Sep 2026. A crawler
 * that does not execute JavaScript gets the title and the meta description and
 * nothing else: no heading, no verdicts, no footer, no attribution to Jasmin.
 * Googlebot renders and so sees the site; OAI-SearchBot and PerplexityBot most
 * likely do not, which is a factual gate on being cited at all rather than a
 * ranking signal.
 *
 * WHY A BROWSER AND NOT react-dom/server. Every page fetches its rows in a
 * `useEffect`. `renderToString` never runs effects, so server rendering this
 * app prerenders the loading spinner, and getting data in instead means
 * restructuring how it reaches components, which is a change to the data flow.
 * A real browser runs the real app, the effects fire, the Sheet responds, and
 * what gets captured is what a reader actually sees. No application code
 * changes at all: this script only reads the built output and writes HTML
 * beside it.
 *
 * WHY NOT HAND-WRITTEN STATIC HTML. That is two renderers for the same
 * content, with nothing failing when they disagree. This project has a long
 * record of exactly that drift.
 *
 * THE TRADE, ACCEPTED BY JASMIN 4 SEP 2026. Prerendered HTML freezes a Sheet
 * snapshot at build time. Browsers still fetch live data on every visit, so
 * nothing changes for a reader, but a non-JS crawler sees the rows as of the
 * last deploy. "A Sheet edit is public in seconds with no deploy" therefore
 * stops being true for crawlers specifically. If that window ever needs
 * closing, the lever is a scheduled rebuild, not a change here.
 *
 * NOT VERIFIED: this has been proven against a local static server only.
 * Vercel preview URLs sit behind SSO protection (`all_except_custom_domains`),
 * so they cannot be fetched with curl to confirm Vercel's own routing, and
 * whether the Sheets API key exists in the Vercel build environment is unknown
 * from here. Both are named in the handover rather than assumed away.
 */

import { createServer } from "node:http";
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Two ways to get a browser, because Vercel's build image cannot run the one
 * Playwright downloads.
 *
 * Locally, plain `playwright`. Its Chromium is already on the machine and it
 * needs no special handling.
 *
 * On Vercel, `npx playwright install chromium` puts the binary in place and it
 * still will not start: the image carries none of Chromium's shared libraries
 * and the first one it looks for, libnspr4.so, is missing. `--with-deps` does
 * not rescue it either, because that shells out to apt and the image is Amazon
 * Linux. Verified from the build log of dpl_6Jwn1Mqpmba8ke65T9VrrWgKq2oz on
 * 4 Sep 2026, not assumed.
 *
 * @sparticuz/chromium is a Chromium built for exactly this: it carries its own
 * libraries, so nothing has to be installed into the image. It is driven with
 * playwright-core rather than playwright, which is the pairing that package
 * documents.
 */
async function launchBrowser() {
  if (process.env.VERCEL) {
    const [{ default: sparticuz }, { chromium }] = await Promise.all([
      import("@sparticuz/chromium"),
      import("playwright-core"),
    ]);
    return chromium.launch({
      args: sparticuz.args,
      executablePath: await sparticuz.executablePath(),
      headless: true,
    });
  }
  const { chromium } = await import("playwright");
  return chromium.launch();
}

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");

/**
 * Port 8080 is not arbitrary. The Sheets API key is referrer-restricted, and
 * the local development key in .env.local is scoped to http://localhost:8080/*
 * exactly. Serving the prerender on any other port makes every Sheets call 403
 * and the pages prerender empty.
 */
const PORT = Number(process.env.PRERENDER_PORT ?? 8080);

/**
 * Every route in App.tsx that renders a page, excluding the three redirects
 * and the catch-all. Keep in step with App.tsx: a route missing here silently
 * keeps the old empty shell, which is the failure this script exists to fix.
 */
const ROUTES = [
  "/",
  "/tools",
  "/radar",
  "/my-stack",
  "/design-kit",
  "/learning",
  "/ai-news",
  "/policy-template",
  "/submit",
  "/privacy-policy",
  "/terms-of-service",
  "/cookie-policy",
];

/**
 * A route is only accepted if its rendered text clears this. The number is a
 * floor for "something actually rendered", not a quality bar: the shortest
 * real page here is an order of magnitude above it. Its job is to fail the
 * build loudly rather than write a confidently empty page, which would be
 * worse than the bug being fixed because it would look done.
 */
const MIN_TEXT_LENGTH = 400;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

/** Static server with an SPA fallback, mirroring vercel.json's catch-all. */
function serve(shellHtml) {
  return createServer(async (req, res) => {
    const urlPath = decodeURIComponent((req.url ?? "/").split("?")[0]);
    const filePath = join(DIST, urlPath);
    if (urlPath !== "/" && existsSync(filePath) && extname(filePath)) {
      try {
        const body = await readFile(filePath);
        res.writeHead(200, { "content-type": MIME[extname(filePath)] ?? "application/octet-stream" });
        res.end(body);
        return;
      } catch {
        /* fall through to the shell */
      }
    }
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(shellHtml);
  });
}

async function main() {
  const shellHtml = await readFile(join(DIST, "index.html"), "utf8");

  /**
   * The pristine shell is kept as app.html and vercel.json's catch-all points
   * at it. Without this, index.html carries the prerendered homepage and every
   * unknown URL would serve homepage copy to a crawler, turning each 404 into
   * a soft duplicate of the front page.
   */
  await writeFile(join(DIST, "app.html"), shellHtml, "utf8");

  const server = serve(shellHtml);
  await new Promise((resolve) => server.listen(PORT, resolve));

  const browser = await launchBrowser();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });

  /**
   * The production Sheets key is referrer-restricted to theeditai.co.uk, so a
   * build running anywhere other than a localhost-keyed machine has to present
   * that Referer. Set PRERENDER_REFERER in the build environment to switch this
   * on. Left off by default because the local key is scoped to localhost:8080
   * and overriding the header there would break the very fetch it is meant to
   * enable.
   */
  const referer = process.env.PRERENDER_REFERER;
  if (referer) {
    await context.route("**://sheets.googleapis.com/**", (route) =>
      route.continue({ headers: { ...route.request().headers(), referer } }),
    );
  }

  const results = [];
  for (const routePath of ROUTES) {
    const page = await context.newPage();
    await page.goto(`http://localhost:${PORT}${routePath}`, { waitUntil: "networkidle", timeout: 45000 });

    // Wait for real content rather than for the network, which goes idle while
    // a spinner is still on screen.
    await page
      .waitForFunction(
        (min) => (document.getElementById("root")?.innerText ?? "").length > min,
        MIN_TEXT_LENGTH,
        { timeout: 30000 },
      )
      .catch(() => {});

    /**
     * Reveal wrappers animate in on scroll and sit at `opacity: 0` until they
     * enter the viewport, so a capture taken at the top of the page would write
     * most of the document out as invisible. Scrolling the inner pane triggers
     * them for real; the sweep afterwards clears anything still at zero, which
     * catches the wrappers below the last scroll step. Body scroll is locked on
     * this site and an inner element scrolls, so scrolling the window does
     * nothing at all here.
     */
    await page.evaluate(async () => {
      const pane = document.getElementById("app-scroll");
      if (pane) {
        const step = Math.max(200, window.innerHeight - 100);
        for (let y = 0; y <= pane.scrollHeight; y += step) {
          pane.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 120));
        }
        pane.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 250));
      }
      for (const el of document.querySelectorAll("#root [style]")) {
        const s = el.style;
        if (s.opacity !== "" && Number(s.opacity) < 1) s.opacity = "1";
        if (s.transform && s.transform !== "none") s.transform = "none";
      }
    });

    const text = await page.evaluate(() => document.getElementById("root")?.innerText ?? "");
    const html = await page.content();
    await page.close();

    if (text.trim().length < MIN_TEXT_LENGTH) {
      throw new Error(
        `Prerender produced ${text.trim().length} characters for ${routePath}, below the ${MIN_TEXT_LENGTH} floor. ` +
          `The usual cause is the Sheets fetch failing: the key is referrer-restricted, so check it matches the ` +
          `port being served (localhost:8080 for the local key) or set PRERENDER_REFERER. Refusing to write an ` +
          `empty page.`,
      );
    }

    const outDir = routePath === "/" ? DIST : join(DIST, routePath);
    await mkdir(outDir, { recursive: true });
    await writeFile(join(outDir, "index.html"), html, "utf8");
    results.push({ route: routePath, chars: text.trim().length, bytes: Buffer.byteLength(html) });
  }

  await browser.close();
  await new Promise((resolve) => server.close(resolve));

  console.log("\nPrerendered:");
  for (const r of results) {
    console.log(`  ${r.route.padEnd(20)} ${String(r.chars).padStart(6)} chars of text   ${String(r.bytes).padStart(7)} bytes html`);
  }
  console.log(`\n${results.length} routes written. Shell preserved as dist/app.html.\n`);
}

main().catch((err) => {
  console.error("\nPrerender failed:", err.message, "\n");
  process.exit(1);
});
