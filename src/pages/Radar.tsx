import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTools, isComplete, type Tool } from "@/lib/sheets";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { CobaltZone } from "@/components/CobaltZone";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { SEO } from "@/components/SEO";
import { cardSelectionProps } from "@/components/ToolCard";

import { Search } from "lucide-react";

/**
 * The radar, built 1 Sep 2026 on Jasmin's ruling of 28 August that the radar
 * gets its own page, and rebuilt the same day on her ruling that it should
 * mirror what the tools page used to be rather than be a stripped-down list.
 *
 * It is deliberately NOT in the main nav. It is reached from /tools, because it
 * is a secondary view of the same directory rather than a seventh destination.
 * A seventh nav item also broke the header: it measured scrollWidth 1046
 * against clientWidth 1024 and silently clipped "Work with me", which is the
 * failure recorded in CLAUDE.md for 768-1086px.
 *
 * Rows are selected by !isComplete(), NOT by status === "on_radar", and the
 * difference is load-bearing. Blotato and Grok are finished, published rows
 * that still carry on_radar in the Sheet from before they were completed, so a
 * status filter would list two tools that already live on /tools. isComplete()
 * is the predicate the grid and the homepage counter already share, so a row is
 * on exactly one of the two pages.
 *
 * What these rows actually hold, checked against the live Sheet on 1 Sep: all
 * 44 carry name, category, cost, verdict, url and status. Only what_it_does and
 * jobs are empty, because those were added for the sector re-point and have not
 * been filled below the line. So the card shows the category chip and the price
 * as well as the verdict: that information is recorded and there is no reason
 * to withhold it.
 *
 * The filter rail runs on column B `category`, the legacy tool-type taxonomy,
 * not on `jobs`. That is what the old tools page filtered on and it is the only
 * taxonomy these rows carry. Options are derived from the data rather than
 * hardcoded, so the rail cannot drift from the Sheet.
 *
 * ToolCard itself is not reused. Its "THE CHECKS" heading and rule render
 * unconditionally, above fields that are empty by definition here, so it would
 * print a checks header over nothing on the one page whose point is "not
 * checked yet". The look and feel is shared a better way: this card carries the
 * same `.tool-card` class and the same tc-* descendant classes from index.css,
 * so the cobalt inversion, the neighbour dim and every colour are the same
 * rules, not a copy of them. Selection handlers are imported for the same
 * reason.
 */

const RadarCard = ({
  tool,
  isSelected,
  isDimmed,
  onActivate,
  onDeactivate,
}: {
  tool: Tool;
  isSelected: boolean;
  isDimmed: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      {...cardSelectionProps({ isSelected, onActivate, onDeactivate })}
      data-selected={isSelected || undefined}
      data-dimmed={isDimmed || undefined}
      className="tool-card rounded-xl border p-4 sm:p-5 flex flex-col h-full transition-all duration-200"
    >
      {tool.url ? (
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-heading font-semibold text-xl no-underline tc-primary"
          onClick={(e) => e.stopPropagation()}
        >
          {tool.name}
        </a>
      ) : (
        <h3 className="font-heading font-semibold text-xl tc-primary">{tool.name}</h3>
      )}

      {/* Category chip. tc-chip-job is the locked cobalt-on-#EEF0FB pairing,
          which is exactly what the old category chip used, so this is the
          original treatment rather than a new one. */}
      <div className="flex flex-wrap gap-2 mt-2.5">
        {tool.category && (
          <span className="inline-block px-2.5 py-0.5 font-body text-[11px] font-semibold uppercase tracking-[0.05em] rounded-full tc-chip-job">
            {tool.category}
          </span>
        )}
        {tool.status === "in_stack" && (
          <span className="inline-block px-2.5 py-0.5 font-body text-[11px] font-semibold uppercase tracking-[0.05em] rounded-full tc-chip-stack">
            IN MY STACK
          </span>
        )}
      </div>

      {/* Guarded: empty on all 44 rows as at 1 Sep, but it is a real column and
          a row that gains one should show it. */}
      {tool.what_it_does && (
        <p className="mt-2.5 font-body text-[15px] leading-relaxed line-clamp-2 tc-primary">
          {tool.what_it_does}
        </p>
      )}

      {tool.pricing && (
        <p className="mt-3 font-body text-[13px] tc-secondary">{tool.pricing}</p>
      )}

      {/* The text slot, and the reason this card no longer leads with nothing.
          The old tools page always showed a description up front and kept the
          verdict behind a toggle. Here what_it_does is empty on every row and
          the verdict is present on every row, so the verdict fills the slot the
          description used to hold: two clamped lines visible, expanding in
          place rather than into a second copy of itself.

          "What it is" is Jasmin's label, ruled 1 Sep, replacing "First look".
          Both were chosen against the same constraint: this is not the
          directory's "Honest verdict", which sits behind the seven checks, so
          it must not borrow that label and promise the same rigour. */}
      {tool.verdict && (
        <div className="mt-3">
          <p
            className={`font-body text-[15px] leading-relaxed tc-primary ${
              isExpanded ? "" : "line-clamp-2"
            }`}
          >
            {tool.verdict}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded((v) => !v);
            }}
            className="mt-1 text-left font-body font-semibold text-[15px] min-h-[44px] flex items-center transition-colors tc-verdict-toggle"
          >
            {isExpanded ? "What it is ↑" : "What it is ↓"}
          </button>
        </div>
      )}

      <div className="mt-auto" />

      {/* A plain link, deliberately NOT the directory's lime tc-visit pill.
          Design audit finding 1, 1 Sep 2026: the radar card was pixel-identical
          to a vetted card right down to the CTA, so nothing on the card itself
          distinguished a lead from a recommendation, and the absence of the
          checks zone is a negative signal only legible by comparison.

          tc-policy-link is the existing lower-commitment treatment already used
          for the policy-template line on the directory card: cobalt on white at
          8.52:1, lime on the inverted card at 6.50:1. Reusing it keeps the
          hover inversion working and introduces no new colour. */}
      {tool.url && (
        <div className="mt-3 flex justify-end">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="font-body inline-flex items-center min-h-[44px] text-[14px] font-medium no-underline hover:underline transition-colors duration-200 tc-policy-link"
          >
            Visit tool →
          </a>
        </div>
      )}
    </div>
  );
};

const Radar = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    fetchTools().then((t) => {
      // Same error rule as /tools: zero rows from the fetch is a 403, whereas
      // zero rows after filtering is a legitimate state.
      if (t.length === 0 && import.meta.env.VITE_GOOGLE_SHEETS_ID) setError(true);
      setTools(t.filter((row) => !isComplete(row)));
      setLoading(false);
    });
  }, []);

  // Derived from the rows on the page, not hardcoded, so the rail cannot drift
  // from the Sheet as rows are completed and leave for /tools.
  const categories = useMemo(
    () => ["ALL", ...Array.from(new Set(tools.map((t) => t.category).filter(Boolean))).sort()],
    [tools],
  );

  const filtered = tools.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.verdict.toLowerCase().includes(q);
    const matchCat = category === "ALL" || t.category.toLowerCase() === category.toLowerCase();
    return matchSearch && matchCat;
  });

  return (
    <>
      <SEO
        // NOT approved copy. The 1 Sep pack supplied the h1, subheading, body
        // and toggle label but no meta, so the title follows the site's
        // established "<Page> | The Edit" pattern and the description reuses
        // the approved subheading verbatim. Placeholders for Jasmin.
        title="On My Radar | The Edit"
        description="Tools I've spotted but haven't put through the checks yet."
        canonical="https://theeditai.co.uk/radar"
      />
      <CobaltZone
        heading="On My Radar"
        subheading="Tools I've spotted but haven't put through the checks yet."
      />

      {/* Filter bar, mirroring /tools: same sticky behaviour, same search box,
          same lime-active chip rail. */}
      <section className="sticky top-0 z-40 bg-background border-b border-border/60 py-3 sm:py-5 px-4 sm:px-12">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-2.5 lg:gap-4 lg:flex-row lg:items-center">
          <div className="relative w-full lg:max-w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              placeholder="Search tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 text-[15px] bg-card border border-border rounded-lg font-body text-foreground placeholder:text-text-secondary focus:border-primary focus:ring-[3px] focus:ring-primary/[0.12] outline-none transition-all"
            />
          </div>

          <div className="relative w-full lg:flex-1 min-w-0">
            {/* Same rail rule as /tools: scroller below lg, wraps at lg and up.
                Restoring the sm wrap reintroduces horizontal page scroll. */}
            <div className="flex gap-2 flex-nowrap overflow-x-auto no-scrollbar scroll-smooth lg:flex-wrap lg:overflow-visible">
              {categories.map((c) => (
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
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-background to-transparent lg:hidden"
            />
          </div>
        </div>
      </section>

      <section className="bg-background py-10 px-6 sm:px-12 pb-[72px]">
        <div className="max-w-[1280px] mx-auto">
          {/* Approved copy. Sits above the grid, matching where /tools puts its
              DPIA definition: it is the page's honesty statement, so it reads
              before the first card. */}
          <p
            className="font-body text-[13px] leading-relaxed mb-6"
            style={{ color: "hsl(var(--text-secondary))", maxWidth: 720 }}
          >
            These haven't been through the DPIA, data and training checks that get a tool onto the main directory, so treat them as leads, not recommendations. If one earns its place, it moves to{" "}
            {/* Design audit finding 5: the nav covers the return path but only
                ambiently. A visitor who arrived through the signpost's CTA has
                no contextual way back. This paragraph already named Tools in
                prose, so linking that word costs no new copy and the rendered
                sentence is unchanged. */}
            <Link to="/tools" className="underline hover:no-underline" style={{ color: "#2D35C9" }}>
              Tools
            </Link>{" "}
            once it's checked.
          </p>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorState />
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <RevealGroup
              key={`${category}-${search}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((tool) => (
                <RevealItem key={tool.name}>
                  <RadarCard
                    tool={tool}
                    isSelected={hoveredCard === tool.name}
                    isDimmed={!!hoveredCard && hoveredCard !== tool.name}
                    onActivate={() => setHoveredCard(tool.name)}
                    // Clears only if this card is still the selected one, so a
                    // stale blur cannot wipe a selection just set by another
                    // card. Same guard as /tools.
                    onDeactivate={() =>
                      setHoveredCard((cur) => (cur === tool.name ? null : cur))
                    }
                  />
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      </section>
    </>
  );
};

export default Radar;
