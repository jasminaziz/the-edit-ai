import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
import { StackBar } from "@/components/StackBar";
import { StackTooltip } from "@/components/StackTooltip";
import { slugifyToolName } from "@/utils/slugify";

import { Search, X } from "lucide-react";

const STACK_STORAGE_KEY = "the-edit-stack";
const COACHMARK_KEY = "stack-coachmark-seen";
const BANNER_KEY = "stack-banner-seen";

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
  const [searchParams] = useSearchParams();
  const stackParam = searchParams.get("stack");
  const hasStackParam = !!stackParam;

  const [stack, setStack] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(STACK_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
    } catch {
      return [];
    }
  });
  const [tooltipVisible, setTooltipVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    if (new URLSearchParams(window.location.search).has("stack")) return false;
    try {
      return window.localStorage.getItem("stack-tooltip-seen") !== "true";
    } catch {
      return false;
    }
  });
  const [coachmarkVisible, setCoachmarkVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    if (new URLSearchParams(window.location.search).has("stack")) return false;
    try {
      return window.localStorage.getItem(COACHMARK_KEY) !== "true";
    } catch {
      return false;
    }
  });
  const [bannerVisible, setBannerVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    if (new URLSearchParams(window.location.search).has("stack")) return false;
    try {
      return window.localStorage.getItem(BANNER_KEY) !== "true";
    } catch {
      return false;
    }
  });

  const dismissTooltip = () => {
    setTooltipVisible(false);
    try {
      window.localStorage.setItem("stack-tooltip-seen", "true");
    } catch {
      /* ignore */
    }
  };

  const dismissCoachmark = () => {
    setCoachmarkVisible(false);
    try {
      window.localStorage.setItem(COACHMARK_KEY, "true");
    } catch {
      /* ignore */
    }
  };

  const dismissBanner = () => {
    setBannerVisible(false);
    try {
      window.localStorage.setItem(BANNER_KEY, "true");
    } catch {
      /* ignore */
    }
  };

  const toggleStack = (name: string) => {
    setStack((prev) => {
      const next = prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name];
      if (prev.length === 0 && next.length > 0) {
        dismissTooltip();
        dismissCoachmark();
      }
      try {
        window.localStorage.setItem(STACK_STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  useEffect(() => {
    fetchTools().then((t) => {
      // The error state keys off the raw fetch, not the filtered list: zero
      // complete rows is a legitimate result (the directory relaunches small
      // and grows back verified), whereas a zero-row fetch is a 403.
      if (t.length === 0 && import.meta.env.VITE_GOOGLE_SHEETS_ID) setError(true);
      // Incomplete rows do not appear anywhere in the directory. Filtering
      // here, at the source, rather than at each render site means nothing
      // downstream — grid, search, shared stack — can reintroduce a hidden row.
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

  // Merge ?stack= slugs into localStorage stack once tools data is loaded.
  useEffect(() => {
    if (tools.length === 0 || !stackParam) return;
    const slugs = stackParam
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (slugs.length === 0) return;

    const matchedNames = tools
      .filter((t) => slugs.includes(slugifyToolName(t.name).toLowerCase()))
      .map((t) => t.name);
    if (matchedNames.length === 0) return;

    setStack((prev) => {
      const merged = Array.from(new Set([...prev, ...matchedNames]));
      if (merged.length === prev.length) return prev;
      try {
        window.localStorage.setItem(STACK_STORAGE_KEY, JSON.stringify(merged));
      } catch {
        /* ignore */
      }
      return merged;
    });
  }, [tools, stackParam]);

  const matchedSharedTools = useMemo(() => {
    if (!stackParam || tools.length === 0) return [] as Tool[];
    const slugs = stackParam
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    return tools.filter((t) => slugs.includes(slugifyToolName(t.name).toLowerCase()));
  }, [stackParam, tools]);

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
        style={{ color: "#9A8F82", maxWidth: 520 }}
      >
        Nothing matches that combination yet. The directory is deliberately small, and it grows as tools come through the checks.
      </p>
    </div>
  );

  const filterBar = (
    <section
      className={`sticky top-14 sm:top-16 z-40 bg-background border-b transition-[padding,box-shadow,border-color] duration-200 px-4 sm:px-12 ${
        scrolled
          ? "py-2.5 sm:py-3 border-border shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
          : "py-3 sm:py-5 border-border/60"
      }`}
    >
      <div
        className={`max-w-[1280px] mx-auto flex flex-col gap-2.5 sm:gap-0 sm:flex-row sm:items-center ${
          scrolled ? "sm:gap-3" : "sm:gap-4"
        }`}
      >
        <div
          className={`relative w-full ${
            scrolled ? "sm:w-[260px] sm:shrink-0" : "sm:max-w-[400px]"
          }`}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-10 pr-3 bg-card border border-border rounded-lg font-body text-foreground placeholder:text-muted focus:border-primary focus:ring-[3px] focus:ring-primary/[0.12] outline-none transition-all ${
              scrolled ? "py-1.5 text-sm" : "py-2.5 text-[15px]"
            }`}
          />
        </div>

        <div className="relative w-full sm:flex-1 min-w-0">
          <div
            className={`flex gap-2 flex-nowrap overflow-x-auto no-scrollbar scroll-smooth ${
              scrolled ? "" : "sm:flex-wrap sm:overflow-visible"
            }`}
          >
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
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
            className={`pointer-events-none absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-background to-transparent ${
              scrolled ? "" : "sm:hidden"
            }`}
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

  const renderCard = (tool: Tool, index: number) => {
    const isSelected = hoveredCard === tool.name;
    const isDimmed = !!hoveredCard && !isSelected;
    const isInStack = stack.includes(tool.name);
    const showCoachmark = index === 0 && coachmarkVisible && stack.length === 0;
    return (
      <RevealItem key={tool.name}>
        <ToolCard
          tool={tool}
          isSelected={isSelected}
          isDimmed={isDimmed}
          isInStack={isInStack}
          onMouseEnter={() => setHoveredCard(tool.name)}
          onMouseLeave={() => setHoveredCard(null)}
          onToggleStack={() => toggleStack(tool.name)}
          showCoachmark={showCoachmark}
          onDismissCoachmark={dismissCoachmark}
        />
      </RevealItem>
    );
  };

  const mobileBanner = bannerVisible && !hasStackParam ? (
    <div className="sm:hidden px-4 pt-3">
      <div
        className="max-w-[1280px] mx-auto relative font-body"
        style={{
          backgroundColor: "#7B7FD4",
          color: "#FFFFFF",
          padding: "12px 38px 12px 14px",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(123,127,212,0.18)",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>
          Build your stack <span style={{ color: "#C8F04A" }}>↓</span>
        </div>
        <div style={{ fontSize: 12.5, lineHeight: 1.4, marginTop: 2, color: "rgba(255,255,255,0.85)" }}>
          Tap <strong style={{ fontWeight: 600 }}>+ Add to my stack</strong> on any tool. Share it in one link.
        </div>
        <button
          onClick={dismissBanner}
          aria-label="Dismiss"
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.85)",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  ) : null;

  return (
    <>
      <SEO
        title="AI Tools Directory for Charity & Heritage Comms | The Edit"
        description="Curated AI tools for charity, cultural and heritage communications, with data location, training policy, nonprofit pricing and a DPIA flag on every verdict."
        canonical="https://theeditai.co.uk/tools"
      />
      <CobaltZone
        heading="Tools"
        subheading="Every tool judged on data, cost and whether you could defend it to a trustee."
      />

      {hasStackParam ? (
        <>
          {/* SECTION 1 — Your Stack */}
          <section className="bg-background pt-10 px-6 sm:px-12">
            <div className="max-w-[1280px] mx-auto">
              <h2
                className="font-display"
                style={{ fontSize: 28, fontWeight: 700, color: "#2D35C9", margin: 0 }}
              >
                Your Stack
              </h2>
              <p
                className="font-body"
                style={{ fontSize: 16, fontWeight: 400, color: "#9A8F82", marginTop: 8, marginBottom: 24 }}
              >
                Your saved stack. Add more tools or share it with someone.
              </p>

              {loading ? (
                <LoadingSpinner />
              ) : matchedSharedTools.length === 0 ? (
                <EmptyState />
              ) : (
                <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchedSharedTools.map(renderCard)}
                </RevealGroup>
              )}

              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid #E8E2D8",
                  marginTop: 32,
                  marginBottom: 32,
                }}
              />

              <h2
                className="font-display"
                style={{ fontSize: 22, fontWeight: 700, color: "#1A1510", margin: 0 }}
              >
                All Tools
              </h2>
            </div>
          </section>

          {filterBar}

          {/* SECTION 2 — All Tools grid */}
          <section className="bg-background py-10 px-6 sm:px-12 pb-[72px]">
            <div className="max-w-[1280px] mx-auto">
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
                  {filtered.map(renderCard)}
                </RevealGroup>
              )}
            </div>
          </section>
        </>
      ) : (
        <>
          {filterBar}
          {mobileBanner}

          <section className="bg-background py-10 px-6 sm:px-12 pb-[72px]">
            <div className="max-w-[1280px] mx-auto">
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
                  {filtered.map(renderCard)}
                </RevealGroup>
              )}
            </div>
          </section>
        </>
      )}

      <div className="hidden md:block">
        <StackTooltip visible={tooltipVisible && !hasStackParam} onDismiss={dismissTooltip} />
      </div>
      <StackBar stack={stack} onRemove={toggleStack} />
    </>
  );
};

export default Tools;
