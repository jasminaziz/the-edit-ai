import { ReactNode, useEffect, useId, useRef, useState } from "react";

interface CobaltZoneProps {
  heading: string;
  subheading?: string;
  bodyText?: string;
  illustration?: ReactNode;
  rightBadge?: string | { text: string; url: string };
  twoLineHeading?: { line1: string; line2: string; line2Color?: string; inline?: boolean };
  /**
   * An optional question-and-answer disclosure beside the heading. Added 1 Sep
   * 2026 for /tools, where the DPIA explanation was a paragraph above the grid
   * that Jasmin reported nobody was reading.
   *
   * Named generically rather than `dpiaBubble`: this component serves seven
   * routes and should not carry one page's vocabulary in its type signature.
   * Only Tools.tsx passes it; the other six render identically to before,
   * because the prop is undefined for them.
   *
   * It takes the SLOT rightBadge uses but not its component: that badge is a
   * single-line nowrap sticker built for short link text, and the DPIA answer
   * is 196 characters over two sentences. Passing both on one page would
   * overlap them; no page does, and /tools passes no rightBadge.
   */
  helpBubble?: { question: string; answer: string };
}

/**
 * A disclosure, not a tooltip, and the distinction is deliberate.
 *
 * ARIA tooltip semantics are for transient, supplementary, hover-or-focus
 * content and should not hold interactive or substantial content. This holds
 * two sentences a touch user needs to open, read and dismiss, so it is a
 * button plus a toggled panel. src/components/ui/tooltip.tsx survives in the
 * tree and is the wrong primitive for this: do not reach for it here.
 *
 * Closes on the trigger, on a click outside, and on Escape, so mouse, touch
 * and keyboard all have a way out.
 */
function HelpBubble({
  question,
  answer,
  align,
}: {
  question: string;
  answer: string;
  align: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const panelId = `help-panel-${uid}`;
  const triggerId = `help-trigger-${uid}`;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      {/* Cream-surface pill with cobalt text, not the lime sticker rightBadge
          uses. Lime on cobalt already means "CTA" everywhere on this site, and
          this is not a call to action. Reversing the header's own pairing,
          cream-on-cobalt to cobalt-on-cream, is what makes it read as a
          floating card rather than another button. Cobalt on white is 8.52:1
          and on the #EEF0FB hover tint 7.50:1, both measured. */}
      <button
        id={triggerId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={`font-body inline-flex items-center min-h-[44px] rounded-full border px-[18px] py-2.5 text-[14px] font-semibold whitespace-nowrap bg-[#FFFFFF] text-[#2D35C9] transition-colors duration-150 hover:bg-[#EEF0FB] focus-visible:bg-[#EEF0FB] ${
          open ? "border-[#2D35C9]" : "border-[#E8E2D8]"
        }`}
      >
        {question}
      </button>

      {open && (
        <div
          id={panelId}
          role="group"
          aria-labelledby={triggerId}
          className={`absolute z-50 mt-3 rounded-xl border border-[#E8E2D8] bg-[#FFFFFF] p-5 text-left shadow-[0_8px_24px_rgba(26,21,16,0.18)] ${
            align === "right" ? "right-0" : "left-0"
          }`}
          style={{ width: "min(340px, calc(100vw - 40px))" }}
        >
          {/* The tail is what makes it read as a speech bubble rather than a
              dropdown. Rotated square with two borders, sitting under the
              panel's own shadow. */}
          <div
            aria-hidden="true"
            className={`absolute -top-[7px] h-3 w-3 rotate-45 border-l border-t border-[#E8E2D8] bg-[#FFFFFF] ${
              align === "right" ? "right-7" : "left-7"
            }`}
          />
          {/* #6B625A on white is 5.97:1. Muted #9A8F82 never carries text. */}
          <p className="font-body text-[13px] leading-relaxed m-0" style={{ color: "#6B625A" }}>
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

export function CobaltZone({ heading, subheading, bodyText, illustration, rightBadge, twoLineHeading, helpBubble }: CobaltZoneProps) {
  const badgeText = typeof rightBadge === "string" ? rightBadge : rightBadge?.text;
  const badgeUrl = typeof rightBadge === "string" ? undefined : rightBadge?.url;

  const badgeContent = (
    <span
      className="font-heading animate-sign-drop"
      style={{
        display: "inline-block",
        backgroundColor: "#C8F04A",
        color: "#2D35C9",
        fontWeight: 700,
        fontSize: 13,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "10px 16px",
        borderRadius: 8,
        boxShadow: "4px 4px 0 #1A1510",
        whiteSpace: "nowrap",
        lineHeight: 1,
        transformOrigin: "top center",
        willChange: "transform",
      }}
    >
      {badgeText}
    </span>
  );

  const badge = rightBadge ? (
    badgeUrl ? (
      <a
        href={badgeUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
      >
        {badgeContent}
      </a>
    ) : (
      badgeContent
    )
  ) : null;

  return (
    <section
      // overflow-hidden clips the open panel, which extends below the
      // section. Dropped only when a bubble is present: the pages that rely on
      // it are the ones passing an illustration or the rotating rightBadge,
      // and no page passes those alongside a bubble.
      className={`relative w-full -mt-14 sm:-mt-16 ${helpBubble ? "" : "overflow-hidden"}`}
      style={{ backgroundColor: "#2D35C9", padding: "clamp(72px, 10vw, 96px) clamp(20px, 5vw, 48px) clamp(32px, 5vw, 48px)", paddingTop: "calc(clamp(72px, 10vw, 96px) + 4rem)" }}
    >
      <div className="max-w-[1280px] mx-auto relative">
        {/* Desktop badge — top right, vertically centered against the heading */}
        {badge && (
          <div className="hidden md:block absolute top-1/2 right-0 -translate-y-1/2 z-10">
            {badge}
          </div>
        )}

        {/* Desktop bubble — same slot and same md breakpoint as the badge, so
            two elements in one header never switch layout at two widths.

            z-50, not the badge's z-10. This wrapper carries -translate-y-1/2,
            and a transform creates a stacking context on its own, so the open
            panel's z-50 is scoped INSIDE this wrapper rather than competing at
            the root. At z-20 the whole bubble lost to the sticky filter bar
            below it (z-40), which painted over the panel and cut the answer off
            mid-sentence. That reads exactly like clipping and is not: nothing
            in the chain has overflow hidden. */}
        {helpBubble && (
          <div className="hidden md:block absolute top-1/2 right-0 -translate-y-1/2 z-50">
            <HelpBubble {...helpBubble} align="right" />
          </div>
        )}

        {twoLineHeading ? (
          twoLineHeading.inline ? (
            <h1
              className="font-heading font-bold leading-[0.95]"
              style={{
                fontSize: "clamp(56px, 8vw, 96px)",
                color: "#FAF8F4",
                letterSpacing: "-0.02em",
              }}
            >
              {twoLineHeading.line1}{" "}
              <span style={{ color: twoLineHeading.line2Color || "#C8F04A" }}>
                {twoLineHeading.line2}
              </span>
            </h1>
          ) : (
            /* One h1 carrying two block spans, not two h1 elements. A page has
               one first-level heading, and the second was rendering empty on
               /design-kit, which passes line2 as "": an empty h1 is announced
               as a heading with no content. The span is now skipped entirely
               when line2 is blank. Renders identically. */
            <h1
              className="font-heading font-bold leading-[0.95]"
              style={{
                fontSize: "clamp(56px, 8vw, 96px)",
                letterSpacing: "-0.02em",
              }}
            >
              <span className="block" style={{ color: "#FAF8F4" }}>
                {twoLineHeading.line1}
              </span>
              {twoLineHeading.line2 && (
                <span
                  className="block"
                  style={{ color: twoLineHeading.line2Color || "#C8F04A" }}
                >
                  {twoLineHeading.line2}
                </span>
              )}
            </h1>
          )
        ) : (
          <h1
            className="font-heading font-bold leading-[0.95]"
            style={{
              fontSize: "clamp(56px, 8vw, 96px)",
              color: "#FAF8F4",
              letterSpacing: "-0.02em",
            }}
          >
            {heading}
          </h1>
        )}
        {subheading && (
          <p
            className="font-heading font-semibold mt-3"
            style={{ fontSize: "clamp(20px, 3vw, 32px)", color: "#C8F04A" }}
          >
            {subheading}
          </p>
        )}
        {bodyText && (
          <p className="font-body text-[16px] mt-4 max-w-3xl" style={{ color: "rgba(250,248,244,0.6)" }}>
            {bodyText}
          </p>
        )}
        {/* Mobile badge — drops below subheading/body, left-aligned */}
        {badge && (
          <div className="md:hidden mt-6">
            {badge}
          </div>
        )}

        {/* Mobile bubble — same fallback as the badge. */}
        {helpBubble && (
          <div className="md:hidden mt-6 relative z-50">
            <HelpBubble {...helpBubble} align="left" />
          </div>
        )}
        {illustration && (
          <div className="absolute top-0 right-0">
            {illustration}
          </div>
        )}
      </div>
    </section>
  );
}
