import { useEffect, useState } from "react";
import { fetchTools, type Tool, CATEGORIES, STATUS_MAP } from "@/lib/sheets";
import { StatusBadge } from "@/components/StatusBadge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { Input } from "@/components/ui/input";
import { Search, Sparkles } from "lucide-react";

const STATUS_FILTERS = ["ALL", "in_stack", "trialling", "queued", "watch", "know_about"];

const Tools = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedVerdicts, setExpandedVerdicts] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchTools().then((t) => {
      if (t.length === 0 && (import.meta.env.VITE_GOOGLE_SHEETS_ID)) setError(true);
      setTools(t);
      setLoading(false);
    });
  }, []);

  const toggleVerdict = (name: string) => {
    setExpandedVerdicts((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const filtered = tools.filter((t) => {
    const matchSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.what_it_does.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "ALL" || t.category === category;
    const matchStatus = statusFilter === "ALL" || t.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <>
      <section className="bg-primary py-12 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-heading font-black text-4xl sm:text-5xl text-primary-foreground">Tools</h1>
        </div>
        <Sparkles className="absolute top-6 right-8 h-10 w-10 text-accent opacity-80" />
      </section>

      <section className="bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                    category === c
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:bg-muted"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((s) => {
                const label = s === "ALL" ? "ALL" : STATUS_MAP[s]?.label || s;
                return (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                      statusFilter === s
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorState />
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((tool) => (
                <div
                  key={tool.name}
                  className="bg-card rounded-lg shadow-sm border border-border p-5 flex flex-col"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-heading font-bold text-base">{tool.name}</h3>
                    <StatusBadge status={tool.status} />
                  </div>
                  <span className="inline-block self-start px-2 py-0.5 text-xs rounded-full bg-secondary/50 text-secondary-foreground mb-2">
                    {tool.category}
                  </span>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{tool.what_it_does}</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    {tool.free_tier && <span>Free tier: {tool.free_tier}</span>}
                    {tool.free_tier && tool.cost && <span> · </span>}
                    {tool.cost && <span>{tool.cost}</span>}
                  </p>
                  <button
                    onClick={() => toggleVerdict(tool.name)}
                    className="mt-auto text-left text-sm font-semibold text-accent-foreground hover:underline"
                    style={{ color: "#C8F135" === "#C8F135" ? "#6d8a00" : undefined }}
                  >
                    {expandedVerdicts.has(tool.name) ? "Honest verdict −" : "Honest verdict +"}
                  </button>
                  {expandedVerdicts.has(tool.name) && tool.verdict && (
                    <p className="mt-2 text-sm text-foreground bg-muted p-3 rounded-md">{tool.verdict}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Tools;
