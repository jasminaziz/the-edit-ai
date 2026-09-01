import { useEffect, useState } from "react";
import { fetchTools, isComplete, type Tool } from "@/lib/sheets";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState } from "@/components/ErrorState";
import { CobaltZone } from "@/components/CobaltZone";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { SEO } from "@/components/SEO";

/**
 * The radar, built 1 Sep 2026 on Jasmin's ruling of 28 August: the radar gets
 * its own tab. The reasoning on record is that an uncapped radar list sharing a
 * page with the capped, complete directory is how the 45-row ceiling erodes.
 *
 * Rows are selected by !isComplete(), NOT by status === "on_radar", and the
 * difference is load-bearing. Blotato and Grok are finished, published rows
 * that still carry on_radar in the Sheet's status column from before they were
 * completed, so filtering on status would list two tools that already live on
 * /tools. isComplete() is the predicate the grid and the homepage counter
 * already share, so using it here means a row is on exactly one of the two
 * pages and the three surfaces cannot disagree.
 *
 * ToolCard is deliberately not reused. Its "THE CHECKS" heading and rule render
 * unconditionally, before the axis fields they introduce, and every one of
 * those fields is empty by definition on a radar row. A radar card built from
 * it would print a checks header above nothing, which reads as "checked, found
 * nothing" on the one page whose whole point is "not checked yet". The card
 * below carries only what an incomplete row actually holds: name, url,
 * what_it_does and verdict, none of which isComplete() gates on.
 */

/**
 * One radar row. Light by design: no axis fields, no DPIA chip, no job chips,
 * no Checked stamp, because a radar row has none of those and showing empty
 * furniture would overstate the work done.
 *
 * "First look" is approved copy and is deliberately not "Honest verdict", the
 * label the directory card uses. The directory's verdict sits behind the seven
 * checks; this one does not, and reusing the label would promise the same
 * rigour. Do not reword either.
 */
const RadarCard = ({ tool }: { tool: Tool }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col h-full">
      {tool.url ? (
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-heading font-semibold text-xl no-underline text-foreground hover:text-primary transition-colors"
        >
          {tool.name}
        </a>
      ) : (
        <h3 className="font-heading font-semibold text-xl text-foreground">{tool.name}</h3>
      )}

      {tool.what_it_does && (
        <p className="mt-2 font-body text-[15px] leading-relaxed text-foreground">
          {tool.what_it_does}
        </p>
      )}

      {/* Guarded, because plenty of radar rows carry no verdict yet. A toggle
          that opens onto nothing is worse than no toggle. */}
      {tool.verdict && (
        <div className="mt-auto pt-4">
          <button
            onClick={() => setIsExpanded((v) => !v)}
            className="text-left font-body font-semibold text-[15px] min-h-[44px] flex items-center text-primary hover:text-foreground transition-colors"
          >
            {isExpanded ? "First look ↑" : "First look ↓"}
          </button>
          {isExpanded && (
            <p
              className="mt-1 pl-4 font-body text-[15px] leading-relaxed text-foreground"
              style={{ borderLeft: "4px solid #2D35C9" }}
            >
              {tool.verdict}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const Radar = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchTools().then((t) => {
      // Same error rule as /tools: zero rows from the fetch is a 403, whereas
      // zero rows after filtering is a legitimate (if unlikely) state.
      if (t.length === 0 && import.meta.env.VITE_GOOGLE_SHEETS_ID) setError(true);
      setTools(t.filter((row) => !isComplete(row)));
      setLoading(false);
    });
  }, []);

  return (
    <>
      <SEO
        // NOT approved copy. The 1 Sep pack supplied the h1, subheading, body
        // and toggle label but no meta, so the title follows the site's
        // established "<Page> | The Edit" pattern and the description reuses
        // the approved subheading verbatim rather than writing a new sentence.
        // Both are placeholders for Jasmin to approve or replace.
        title="On My Radar | The Edit"
        description="Tools I've spotted but haven't put through the checks yet."
        canonical="https://theeditai.co.uk/radar"
      />
      <CobaltZone
        heading="On My Radar"
        subheading="Tools I've spotted but haven't put through the checks yet."
      />

      <section className="bg-background py-10 px-6 sm:px-12 pb-[72px]">
        <div className="max-w-[1280px] mx-auto">
          {/* Sits above the grid rather than in the hero, matching where /tools
              puts its DPIA definition. It is the page's honesty statement, so
              it reads before the first card, not after. */}
          <p
            className="font-body text-[13px] leading-relaxed mb-6"
            style={{ color: "hsl(var(--text-secondary))", maxWidth: 720 }}
          >
            These haven't been through the DPIA, data and training checks that get a tool onto the main directory, so treat them as leads, not recommendations. If one earns its place, it moves to Tools once it's checked.
          </p>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorState />
          ) : (
            <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => (
                <RevealItem key={tool.name}>
                  <RadarCard tool={tool} />
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
