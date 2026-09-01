import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { SEO } from "@/components/SEO";

/**
 * Rebuilt 1 Sep 2026 against the consultancy site's 404 as the reference
 * (~/Developer/jasmin-aziz/404.html): a heading that names the situation, two
 * short paragraphs of actual voice, one pill CTA home, and a 30-second
 * redirect with a visible countdown. The structure is portable; none of the
 * consultancy's own content or its --periwinkle-text heading is, because
 * periwinkle is scoped to the homepage hero here. The heading is cobalt.
 *
 * The page chrome is not rebuilt: NotFound renders inside Layout (App.tsx), so
 * nav and footer already wrap it. What was missing was everything between them
 * — the previous version was four lines with no voice.
 *
 * Strings are approved copy supplied 1 Sep 2026. Do not reword them.
 *
 * Colours are Tailwind arbitrary values, not inline style, and deliberately:
 * an inline style declaration outranks the stylesheet, so setting the pill's
 * background inline would beat its own hover rule. That is the same mechanism
 * that forced ToolCard and .about-byline into JS handlers. The hover is the
 * locked cobalt-to-ink, ruled 30 Aug.
 */

/** Seconds before the redirect fires. Matches the consultancy site. */
const REDIRECT_SECONDS = 30;

const NotFound = () => {
  const location = useLocation();
  const [remaining, setRemaining] = useState(REDIRECT_SECONDS);
  const [cancelled, setCancelled] = useState(false);
  const cancelledRef = useRef(false);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    // Cancel on ANY interaction, not just on the home link.
    //
    // The reference cancels on clicking its home link, which is close to a
    // no-op: that click navigates home regardless. A timed redirect the
    // visitor cannot stop is a WCAG 2.2.1 (Timing Adjustable) failure, and the
    // pre-launch gates are AA, so anyone who starts reading, scrolling or
    // tabbing keeps the page.
    const cancel = () => {
      if (cancelledRef.current) return;
      cancelledRef.current = true;
      setCancelled(true);
    };

    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "wheel", "touchstart"];
    events.forEach((e) => window.addEventListener(e, cancel, { passive: true }));
    // Scrolling happens inside Layout's #app-scroll pane, not the window
    // (body scroll is locked to stop iOS Safari's fixed-header bounce bug).
    const scrollEl = document.getElementById("app-scroll");
    scrollEl?.addEventListener("scroll", cancel, { passive: true });

    const tick = window.setInterval(() => {
      if (cancelledRef.current) return;
      setRemaining((n) => {
        if (n <= 1) {
          window.clearInterval(tick);
          // Full assignment rather than router navigation: this replaces the
          // dead URL rather than pushing the homepage on top of it, so Back
          // does not land the visitor straight back on the 404.
          window.location.replace("/");
          return 0;
        }
        return n - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(tick);
      events.forEach((e) => window.removeEventListener(e, cancel));
      scrollEl?.removeEventListener("scroll", cancel);
    };
  }, []);

  return (
    <>
      <SEO
        title="Page Not Found | The Edit"
        description="That page doesn't exist. Here's how to find your way back to The Edit."
        // Self-referential, because the catch-all route has no fixed URL and
        // this page cannot 301. Paired with noindex, which is the part that
        // actually matters: vercel.json is a SPA catch-all, so every unknown
        // URL returns 200 with a full page body rather than a 404 status. A
        // canonical on its own would invite indexing of junk URLs; noindex is
        // what stops it.
        canonical={`https://theeditai.co.uk${location.pathname}`}
        noindex
      />
      {/* min-h-[60vh], not min-h-screen: the page renders inside Layout's
          #app-scroll pane, so a full viewport height overflows the pane by the
          height of the nav and introduces a scrollbar on an empty page. */}
      <div className="bg-background min-h-[60vh] px-6 sm:px-12 py-20 sm:py-28">
        <div className="max-w-[640px] mx-auto">
          <h1
            className="font-heading font-bold text-[#2D35C9] leading-[1.05] tracking-[-0.025em]"
            style={{ fontSize: "clamp(32px, 5vw, 48px)" }}
          >
            Page not found
          </h1>

          <p className="font-body text-foreground text-[17px] leading-[1.72] mt-9">
            That link's dead, or that page never existed. Either way, you're not where you meant to be.
          </p>
          <p className="font-body text-foreground text-[17px] leading-[1.72] mt-5">
            Everything else on the site is where it should be — the directory, the stack, the policy template. Home's the fastest way back to all of it.
          </p>

          <div className="mt-9">
            <Link
              to="/"
              className="font-body inline-block no-underline text-[15px] font-semibold rounded-full px-6 py-3.5 bg-[#2D35C9] text-[#FAF8F4] hover:bg-[#1A1510] transition-colors duration-200"
            >
              Back to home
            </Link>
            {/* aria-live so a screen reader user is told the redirect exists
                rather than being moved without warning. Polite, not assertive:
                it should not interrupt the paragraphs above. Emptied on
                cancel, which is also the announcement that it has stopped. */}
            <p
              aria-live="polite"
              className="font-body text-[11px] font-medium tracking-[0.06em] mt-5 min-h-[1.2em]"
              style={{ color: "hsl(var(--text-secondary))" }}
            >
              {cancelled
                ? ""
                : `Taking you home in ${remaining} second${remaining === 1 ? "" : "s"}…`}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
