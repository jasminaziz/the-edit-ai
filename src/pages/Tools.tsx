import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchTools, type Tool, CATEGORIES } from "@/lib/sheets";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { CobaltZone } from "@/components/CobaltZone";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { SEO } from "@/components/SEO";
import { ToolCard } from "@/components/ToolCard";
import { StackBar } from "@/components/StackBar";
import { slugifyToolName } from "@/utils/slugify";

import { Search, X } from "lucide-react";

const STACK_STORAGE_KEY = "the-edit-stack";

const Tools = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
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

  const toggleStack = (name: string) => {
    setStack((prev) => {
      const next = prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name];
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
      if (t.length === 0 && import.meta.env.VITE_GOOGLE_SHEETS_ID) setError(true);
      setTools(t);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  const filtered = tools.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.what_it_does.toLowerCase().includes(q);
    const matchCat = category === "ALL" || t.category === category;
    return matchSearch && matchCat;
  });

  return (
    <>
      <SEO
        title="AI Toolkit | The Edit"
        description="49 curated AI tools across Writing, Research, Design, Video, Automation and Building. Honest verdicts from someone who uses them."
        canonical="https://theeditai.co.uk/toolkit"
      />
      <CobaltZone
        heading="Tools"
        subheading="Things on my radar. Breadth matters."
      />

      {/* Filter Bar — flush against nav. Mobile: stacked (search + dedicated pills row with edge fade). Desktop: compacts on scroll. */}
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
          {/* Search */}
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

          {/* Category pills row — full-width on mobile with right-edge fade hinting horizontal scroll */}
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
            {/* Edge fade — visible on mobile (and desktop while scrolled, where pills also scroll) */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-background to-transparent ${
                scrolled ? "" : "sm:hidden"
              }`}
            />
          </div>
        </div>
      </section>

      {/* Tool Grid */}
      <section className="bg-background py-10 px-6 sm:px-12">
        <div className="max-w-[1280px] mx-auto">
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
              {filtered.map((tool) => {
                const isSelected = hoveredCard === tool.name;
                const isDimmed = !!hoveredCard && !isSelected;
                const isInStack = stack.includes(tool.name);

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
                    />
                  </RevealItem>
                );
              })}
            </RevealGroup>
          )}
        </div>
      </section>

      <StackBar stack={stack} onRemove={toggleStack} />
    </>

  );
};

export default Tools;
