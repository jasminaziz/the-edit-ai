import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  fetchTools,
  isComplete,
  hasNonprofitPricing,
  doesNotTrainOnInput,
  isDpiaGreen,
  type Tool,
  CATEGORIES,
} from "@/lib/sheets";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { CobaltZone } from "@/components/CobaltZone";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { SEO } from "@/components/SEO";
import { ToolCard } from "@/components/ToolCard";
import { toSlug } from "@/utils/slugify";

import { Search } from "lucide-react";

const Tools = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  // The three sector toggles. Pass rules live in sheets.ts, held by tests, so
  // they cannot be widened here by accident.
  const [onlyNonprofit, setOnlyNonprofit] = useState(false);
  const [onlyNoTraining, setOnlyNoTraining] = useState(false);
  const [onlyDpiaGreen, setOnlyDpiaGreen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  /**
   * `?tool=` deep link. Opens one card's verdict and scrolls to it, so a
   * verdict can be linked to from outside the site. There is no per-tool
   * route: this is a share link rather than an indexable page, which is what
   * the job actually needs, and it leaves a real route free to be added later
   * without breaking anything pasted in the meantime.
   *
   * The parameter is run through toSlug as well as the name, so both
   * `?tool=gemini-notebook` and `?tool=Gemini%20Notebook` resolve. A parameter
   * matching nothing is a silent no-op: the page renders normally rather than
   * erroring, which is the right behaviour for a link to a row that has since
   * been renamed, or to one that lives on /radar and never reaches this grid.
   */
  const [searchParams] = useSearchParams();
  // Empty is treated as absent, so `?tool=` and `?tool=!!!` both fall through
  // to the normal page. Both slug to "", and without this guard an empty slug
  // would match any tool whose name also slugged to "".
  const wantedSlug = toSlug(searchParams.get("tool") ?? "") || null;
  const deepLinkedName = wantedSlug
    ? (tools.find((t) => toSlug(t.name) === wantedSlug)?.name ?? null)
    : null;

  /**
   * Scroll the deep-linked card into view once the grid exists.
   *
   * `block: "start"` plus a `scroll-margin-top` on `.tool-card` in index.css,
   * rather than `block: "center"`. Centring an expanded card puts its own name
   * above the fold, so the reader arrives at a verdict with nothing saying
   * which tool it belongs to. The margin clears the sticky filter rail: the
   * card top lands at 212px, which is the scroller's own 64px offset plus the
   * 148px margin, with the name clear of the rail bottom at 197px. Measured on
   * the dev server rather than derived.
   *
   * No `behavior: "smooth"`, deliberately. A smooth scroll is driven by
   * requestAnimationFrame, so it does not run in a background tab and stalls
   * part-way through wherever frames are not being produced. An instant scroll
   * lands correctly regardless, which is also what an anchor link would do.
   * Nothing here needs a frame to settle first: the reveal wrappers animate
   * transform and opacity only, neither of which reflows, so the card's
   * position is final as soon as the grid commits (verified: the card's offset
   * is identical at rest and after scrolling).
   */
  useEffect(() => {
    if (!deepLinkedName) return;
    document
      .querySelector(`[data-tool="${toSlug(deepLinkedName)}"]`)
      ?.scrollIntoView({ block: "start" });
  }, [deepLinkedName]);

  useEffect(() => {
    fetchTools().then((t) => {
      // The error state keys off the raw fetch, not the filtered list: zero
      // complete rows is a legitimate result (the directory relaunches small
      // and grows back verified), whereas a zero-row fetch is a 403.
      if (t.length === 0 && import.meta.env.VITE_GOOGLE_SHEETS_ID) setError(true);
      // Incomplete rows do not appear anywhere in the directory. Filtering
      // here, at the source, rather than at each render site means nothing
      // downstream — grid, search — can reintroduce a hidden row.
      setTools(t.filter(isComplete));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    // Scrolling happens inside Layout's #app-scroll pane, not the window
    // (body scroll is locked to stop iOS Safari's fixed-header bounce bug).
    const scrollEl = document.getElementById("app-scroll");
    const onScroll = () => setScrolled((scrollEl ? scrollEl.scrollTop : window.scrollY) > 8);
    onScroll();
    const target: EventTarget = scrollEl ?? window;
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => target.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = tools.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.jobs.some((j) => j.toLowerCase().includes(q)) ||
      t.category.toLowerCase().includes(q) ||
      t.what_it_does.toLowerCase().includes(q);
    // Contains, not equals: a tool can hold more than one job. Compared
    // case-insensitively so a mis-cased Sheet value still filters — unlike
    // dpia_flag, a job value is not validated before it reaches the card.
    const matchCat =
      category === "ALL" ||
      t.jobs.some((j) => j.toLowerCase() === category.toLowerCase());
    // Toggles combine with AND: each one narrows what the others left.
    const matchToggles =
      (!onlyNonprofit || hasNonprofitPricing(t)) &&
      (!onlyNoTraining || doesNotTrainOnInput(t)) &&
      (!onlyDpiaGreen || isDpiaGreen(t));
    return matchSearch && matchCat && matchToggles;
  });

  const filtersActive =
    search.trim() !== "" ||
    category !== "ALL" ||
    onlyNonprofit ||
    onlyNoTraining ||
    onlyDpiaGreen;

  // Approved copy, for a filter or toggle combination that matches no visible
  // row. The generic EmptyState stays for nothing-active-and-zero-rows: that
  // state should not reach live, and stretching an approved string over a state
  // it was not written for would be authoring copy.
  const filterEmptyState = (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p
        className="font-body text-[15px] leading-relaxed"
        style={{ color: "hsl(var(--text-secondary))", maxWidth: 520 }}
      >
        Nothing matches that combination yet. The directory is deliberately small, and it grows as tools come through the checks.
      </p>
    </div>
  );

  const filterBar = (
    <section
      className={`sticky top-0 z-40 bg-background border-b transition-[padding,box-shadow,border-color] duration-200 px-4 sm:px-12 ${
        scrolled
          ? "py-2.5 sm:py-3 border-border shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
          : "py-3 sm:py-5 border-border/60"
      }`}
    >
      <div
        className={`max-w-[1280px] mx-auto flex flex-col gap-2.5 lg:gap-0 lg:flex-row lg:items-center ${
          scrolled ? "lg:gap-3" : "lg:gap-4"
        }`}
      >
        <div
          className={`relative w-full ${
            scrolled ? "lg:w-[260px] lg:shrink-0" : "lg:max-w-[400px]"
          }`}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-10 pr-3 bg-card border border-border rounded-lg font-body text-foreground placeholder:text-text-secondary focus:border-primary focus:ring-[3px] focus:ring-primary/[0.12] outline-none transition-all ${
              scrolled ? "py-1.5 text-sm" : "py-2.5 text-[15px]"
            }`}
          />
        </div>

        <div className="relative w-full lg:flex-1 min-w-0">
          {/* F2c, ruled 26 Aug: the rail wraps in both scroll states rather
              than becoming a horizontal scroller, which clipped 172px at 1280
              and lost Translation entirely behind the gradient fade. The comms
              jobs are the taxonomy the whole re-point is expressed in, so
              hiding one is not a fair trade for 38px of vertical.

              The wrap threshold moved from sm to lg on 29 Aug (design audit
              fix 4). F2c was right about wrapping and wrong about where: at sm
              the rail shares a row with the 400px search box, which left it a
              128px track while the widest chip is 228px. Between 640 and 739px
              the chip escaped the viewport and dragged the page into
              horizontal scroll (scrollWidth 692 against a 640 viewport), and
              up to roughly 1000px the rail was a one-chip-per-line column.
              Below lg the rail now gets its own full-width row and keeps the
              scroller it already had at 375px. At lg and up nothing changes:
              the rail wraps and no job is hidden, which is what F2c ruled. */}
          <div className="flex gap-2 flex-nowrap overflow-x-auto no-scrollbar scroll-smooth lg:flex-wrap lg:overflow-visible">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={`shrink-0 px-3.5 py-1.5 font-body text-xs font-medium uppercase tracking-[0.04em] rounded-full border transition-colors duration-150 ${
                  category === c
                    ? "text-foreground border-transparent"
                    : "bg-transparent border-border text-foreground hover:bg-card"
                }`}
                style={category === c ? { backgroundColor: "#C8F04A" } : undefined}
              >
                {c}
              </button>
            ))}
          </div>
          {/* The fade signals horizontal overflow, so it follows the rail: it
              is hidden from lg up, because there the rail wraps in both states
              and there is nothing left to scroll. Left showing at lg it would
              wash a 40px strip over the right edge of the wrapped chips, which
              is the clipping F2c was raised to stop. It tracks the rail's
              breakpoint exactly, so if one moves the other moves with it. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-background to-transparent lg:hidden"
          />
        </div>
      </div>

      {/* Sector toggles. Labels are approved copy (B3 microcopy pack); the
          third matches the Green chip label exactly so the filter and the card
          use one vocabulary. Cobalt on cream when on, per the locked rule for
          new buttons. */}
      <div className="max-w-[1280px] mx-auto mt-2.5 flex flex-wrap gap-2">
        {[
          { label: "Has nonprofit pricing", on: onlyNonprofit, set: setOnlyNonprofit },
          { label: "Doesn't train on your content", on: onlyNoTraining, set: setOnlyNoTraining },
          { label: "DPIA unlikely", on: onlyDpiaGreen, set: setOnlyDpiaGreen },
        ].map(({ label, on, set }) => (
          <button
            key={label}
            type="button"
            aria-pressed={on}
            onClick={() => set((v) => !v)}
            className="shrink-0 px-3.5 py-1.5 font-body text-xs font-medium rounded-full border transition-colors duration-150"
            style={
              on
                ? { backgroundColor: "#2D35C9", borderColor: "#2D35C9", color: "#FAF8F4" }
                : { backgroundColor: "transparent", borderColor: "#E8E2D8", color: "#1A1510" }
            }
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );

  const renderCard = (tool: Tool) => {
    const isSelected = hoveredCard === tool.name;
    const isDimmed = !!hoveredCard && !isSelected;
    return (
      <RevealItem key={tool.name}>
        <ToolCard
          tool={tool}
          isSelected={isSelected}
          isDimmed={isDimmed}
          defaultExpanded={tool.name === deepLinkedName}
          onActivate={() => setHoveredCard(tool.name)}
          // Clears only if this card is still the selected one.
          //
          // An unconditional setHoveredCard(null) loses a race. Moving between
          // two cards fires the new card's activate before the old card's blur,
          // and the old card's blur would then wipe the selection that had just
          // been set, leaving nothing selected. Guarding on identity makes a
          // stale deactivate a no-op. It matters more since touch selection
          // holds, because a held card keeps focus inside it.
          onDeactivate={() =>
            setHoveredCard((cur) => (cur === tool.name ? null : cur))
          }
        />
      </RevealItem>
    );
  };

  /**
   * Signpost to the radar. It is deliberately not in the main nav: it is a
   * secondary view of this same directory rather than a seventh destination,
   * and a seventh nav item silently clipped "Work with me" at 1024px. So this
   * is the only way in, which makes it load-bearing rather than decorative,
   * and it was a plain text link until Jasmin ruled on 1 Sep that it needed a
   * clear CTA.
   *
   * Still no authored copy. The sentence is the radar page's own approved
   * subheading, reused verbatim so the signpost explains what it points at,
   * and the label is that page's approved h1 plus the trailing arrow this site
   * uses on every forward link.
   *
   * Cobalt pill rather than lime: the template card in this same grid already
   * carries the lime CTA, and two identical pills on one page compete. Hover is
   * the locked cobalt-to-ink. Colours are Tailwind arbitrary values, not inline
   * style, because an inline declaration would outrank the hover rule.
   *
   * Rendered twice, at two breakpoints, never both at once. See the two call
   * sites below for why.
   */
  const radarSignpost = (
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
      <p className="font-body text-[15px] leading-relaxed m-0 text-foreground">
        Tools I've spotted but haven't put through the checks yet.
      </p>
      <Link
        to="/radar"
        className="font-body inline-block shrink-0 no-underline text-[15px] font-semibold rounded-full px-6 py-3 bg-[#2D35C9] text-[#FAF8F4] hover:bg-[#1A1510] transition-colors duration-200"
      >
        On My Radar →
      </Link>
    </div>
  );

  /**
   * C4(a), approved copy. Sits after the sixth tool card, or at the end when
   * the grid is shorter, and only when no filter is active: someone who has
   * narrowed to "DPIA unlikely plus nonprofit pricing" is working, and a promo
   * card in the middle of a result set is noise. The offer is not lost in
   * filtered views, because every Red card carries the C4(b) line.
   *
   * The CTA label keeps the trailing arrow the nav and footer already carry, so
   * a visitor sees one identical label in all four places.
   */
  const templateCard = (
    <RevealItem key="__template-card">
      <div
        className="rounded-xl border p-5 flex flex-col h-full"
        style={{ backgroundColor: "#2D35C9", borderColor: "#2D35C9" }}
      >
        <h3 className="font-heading font-semibold text-xl" style={{ color: "#FAF8F4" }}>
          The tools are the easy part
        </h3>
        <p
          className="mt-3 font-body text-sm leading-relaxed"
          style={{ color: "rgba(250,248,244,0.85)" }}
        >
          If your organisation doesn't have an AI-use policy yet, start there. Free, written for charity, cultural and heritage teams, and written to be adapted.
        </p>
        <div className="mt-auto pt-4">
          <Link
            to="/policy-template"
            className="font-body inline-block no-underline"
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "#1A1510",
              backgroundColor: "#C8F04A",
              borderRadius: "20px",
              padding: "10px 20px",
            }}
          >
            Get the template →
          </Link>
        </div>
      </div>
    </RevealItem>
  );

  /**
   * The phone's mid-grid copy of the radar signpost. Ruled 1 Sep 2026.
   *
   * The signpost is the only route to /radar, since the page is deliberately
   * out of the nav, and on a phone the grid is one column, so the copy below
   * the grid sits after roughly two dozen stacked cards. Almost nobody reaches
   * it. This puts a second one where a reader still has momentum.
   *
   * sm:hidden, so it never renders alongside the desktop signpost above the
   * grid: display:none takes it out of the accessibility tree too, so the label
   * is not announced twice on any viewport.
   *
   * Same approved sentence and label as the other two, not a third string.
   */
  const radarGridCard = (
    // sm:hidden goes on the RevealItem, which is the grid child, NOT on the
    // div inside it. On the inner div the cell still existed: display:none hid
    // the signpost but the grid slot stayed and stretched to the row height, so
    // desktop carried a 471px hole between two cards. Measured, not assumed.
    <RevealItem key="__radar-card" className="sm:hidden">
      <div className="rounded-xl border p-5 h-full" style={{ borderColor: "#E8E2D8", backgroundColor: "#FFFFFF" }}>
        {radarSignpost}
      </div>
    </RevealItem>
  );

  /**
   * The grid's children: tool cards, with the template card spliced in, and on
   * a phone the radar signpost as well.
   *
   * The two indices are kept apart on purpose. The template sits at 6; putting
   * the radar there too would give a reader two CTAs back to back and neither
   * would land. 12 is roughly halfway down the 23 published rows and leaves six
   * cards of directory between them.
   *
   * Splice the later index first, or inserting at 6 shifts 12 by one.
   */
  const gridItems = (list: Tool[]) => {
    const cards = list.map(renderCard);
    if (filtersActive) return cards;
    const out = [...cards];
    if (out.length > 12) out.splice(12, 0, radarGridCard);
    out.splice(Math.min(6, cards.length), 0, templateCard);
    return out;
  };

  return (
    <>
      <SEO
        title="AI Tools Directory for Charity & Heritage Comms | The Edit"
        description="Curated AI tools for charity, cultural and heritage communications. What each one is for and what it costs, with the data, training and DPIA checks already done on every card."
        canonical="https://theeditai.co.uk/tools"
      />
      {/* The DPIA explainer lives in the header disclosure, not in a paragraph
          above the grid. Ruled 1 Sep 2026: Jasmin reported the explanation was
          "lost on the page" as body copy. Both strings are approved.

          Note for anyone editing this call: the bubble is vertically centred
          against the heading block, so it sits beside the h1 only while this
          page passes no bodyText. Adding bodyText here drags it downward. */}
      <CobaltZone
        heading="Tools"
        subheading={
          <>
            {/* Break after the semicolon on desktop so the second clause stays
                whole. Unbroken it wrapped at "the final / call is yours.",
                splitting a phrase across lines. The br is display:none below
                md, where the line is short enough to wrap naturally and a
                forced break would strand two words. The space before it is
                kept so the sentence still reads as one string to a screen
                reader and to textContent. */}
            Pick the tool for the job. The checks give you a head start;{" "}
            <br className="hidden md:inline" />
            the final call is yours.
          </>
        }
        helpBubble={{
          question: "What is a DPIA?",
          answer:
            "A DPIA is the assessment your organisation carries out before using personal data in a way that could put people at risk. The flag on each card says how likely typical comms use is to trigger one.",
        }}
      />

      {filterBar}

      <section className="bg-background py-10 px-6 sm:px-12 pb-[72px]">
        <div className="max-w-[1280px] mx-auto">
          {/* Above the grid from sm up only. Ruled 1 Sep: on a phone this
              cannot sit at the top, because it takes the first screen away
              from a reader still working out what /tools is. Below sm the
              same signpost renders after the grid instead.

              sm, not the 1024 JS hook: the breakpoint contract is that
              Tailwind sm governs content layout and MOBILE_BREAKPOINT governs
              chrome, and no element consults both. This is content. */}
          <div className="hidden sm:block mb-8">{radarSignpost}</div>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorState />
          ) : filtered.length === 0 ? (
            filtersActive ? filterEmptyState : <EmptyState />
          ) : (
            <RevealGroup
              key={`${category}-${search}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {gridItems(filtered)}
            </RevealGroup>
          )}

          {/* The phone's copy of the signpost, below the grid. Only one of the
              two is ever in the layout: the other is display:none, so it is out
              of the accessibility tree too and nothing is announced twice. */}
          <div className="sm:hidden mt-12">{radarSignpost}</div>
        </div>
      </section>
    </>
  );
};

export default Tools;
