import { useState } from "react";
import { Link } from "react-router-dom";
import { normaliseDpiaFlag, type Tool } from "@/lib/sheets";

/**
 * DPIA chip, one per flag value. Colours are locked and AA-verified against
 * both the white card and the cream page ground (axis spec, 23 Aug 2026).
 * Text and border share a hex; the tint is the background. Do not substitute.
 *
 * The label carries the meaning, so the chip never relies on colour alone —
 * "Green" only reads to someone who already knows the scheme. Labels are
 * approved copy from the B3 microcopy pack: do not reword them.
 */
const DPIA_CHIP = {
  Green: { label: "DPIA unlikely", ink: "#2D6A4F", tint: "#E4F0E9" },
  Amber: { label: "DPIA likely once personal data goes in", ink: "#7A5200", tint: "#FAF0DB" },
  Red: { label: "Assume a DPIA before adopting", ink: "#A8261C", tint: "#FBE9E6" },
} as const;

/** One labelled axis fact. Label strings are approved copy — do not reword. */
const AxisLine = ({
  label,
  value,
  isSelected,
}: {
  label: string;
  value: string;
  isSelected: boolean;
}) => (
  <div className="mt-2.5">
    <p
      className="font-body text-[11px] leading-tight"
      style={{ color: isSelected ? "rgba(250,248,244,0.6)" : "#9A8F82", margin: 0 }}
    >
      {label}
    </p>
    <p
      className="font-body text-[13px] leading-snug"
      style={{ color: isSelected ? "#FAF8F4" : "#1A1510", margin: 0, marginTop: 1 }}
    >
      {value}
    </p>
  </div>
);

interface ToolCardProps {
  tool: Tool;
  isSelected: boolean;
  isDimmed: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const ToolCard = ({
  tool,
  isSelected,
  isDimmed,
  onMouseEnter,
  onMouseLeave,
}: ToolCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // normaliseDpiaFlag resolves casing, and returns "" for anything that is not
  // one of the three allowed values, so an unrecognised flag renders no chip
  // rather than an empty one. isComplete() keeps such a row off the grid anyway.
  const flag = normaliseDpiaFlag(tool.dpia_flag);
  const dpia = flag ? DPIA_CHIP[flag] : null;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`rounded-xl border p-5 flex flex-col h-full transition-all duration-200 ${
        isDimmed ? "opacity-70 scale-[0.98]" : ""
      }`}
      style={
        isSelected
          ? {
              backgroundColor: "#2D35C9",
              borderColor: "#2D35C9",
              color: "#FAF8F4",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            }
          : {
              backgroundColor: "#FFFFFF",
              borderColor: "#E8E2D8",
            }
      }
    >
      {/* Tool name as link */}
      {tool.url ? (
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-heading font-semibold text-xl no-underline"
          style={{ color: isSelected ? "#FAF8F4" : "#1A1510" }}
          onClick={(e) => e.stopPropagation()}
        >
          {tool.name}
        </a>
      ) : (
        <h3
          className="font-heading font-semibold text-xl"
          style={{ color: isSelected ? "#FAF8F4" : "#1A1510" }}
        >
          {tool.name}
        </h3>
      )}

      {/* ZONE 1, explore. Description before the chips, per the restructure:
          the chips answer "which of my problems does this solve", the
          description answers "what kind of thing is this", and comprehension
          has to come first. Empty until the Sheet's what_it_does is filled. */}
      {tool.what_it_does && (
        <p
          className="mt-2 font-body text-sm leading-relaxed line-clamp-2"
          style={{ color: isSelected ? "#FAF8F4" : "#1A1510" }}
        >
          {tool.what_it_does}
        </p>
      )}

      {/* Job chips. They replace the legacy tool-type category chip: the
          re-point judges a tool by the comms job it serves, not by what kind
          of tool it is. Column B stays in the data. */}
      <div className="flex flex-wrap gap-2 mt-2.5">
        {tool.jobs.map((job) => (
          <span
            key={job}
            className="inline-block px-2.5 py-0.5 font-body text-[11px] font-semibold uppercase tracking-[0.05em] rounded-full"
            style={
              isSelected
                ? { backgroundColor: "#9B9FE0", color: "#FFFFFF" }
                : { backgroundColor: "#EEF0FB", color: "#2D35C9" }
            }
          >
            {job}
          </span>
        ))}
        {tool.status === "in_stack" && (
          <span
            className="inline-block px-2.5 py-0.5 font-body text-[11px] font-semibold uppercase tracking-[0.05em] rounded-full"
            style={
              isSelected
                ? { backgroundColor: "rgba(250,248,244,0.15)", color: "#FAF8F4" }
                : { backgroundColor: "#2D6A4F", color: "#FFFFFF" }
            }
          >
            IN MY STACK
          </span>
        )}
      </div>

      {/* ZONE 2, buying. Nonprofit pricing sits with the price rather than
          with the risk facts: it decides affordability, not exposure. The
          #EEF0FB tint is dropped and the value carries the emphasis instead,
          so the card holds two coloured regions rather than five. */}
      {tool.pricing && (
        <p
          className="mt-3 font-body text-[13px]"
          style={{ color: isSelected ? "rgba(250,248,244,0.6)" : "#9A8F82" }}
        >
          {tool.pricing}
        </p>
      )}
      {tool.nonprofit_tier && (
        <p className="mt-1.5 font-body flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span
            className="text-[11px] leading-tight"
            style={{ color: isSelected ? "rgba(250,248,244,0.6)" : "#9A8F82" }}
          >
            Nonprofit pricing
          </span>
          <span
            className="text-[13px] font-semibold leading-snug"
            style={{ color: isSelected ? "#FAF8F4" : "#1A1510" }}
          >
            {tool.nonprofit_tier}
          </span>
        </p>
      )}

      {/* ZONE 3, the checks. The only zone that earns a heading: a name, a
          description, chips and a price are self-evident, whereas this block
          contains an acronym and is the part nobody else publishes. The rule
          renders now; its approved label is placed with the copy pack. */}
      <div className="mt-4 flex items-center gap-3">
        <div
          className="h-px flex-1"
          style={{ backgroundColor: isSelected ? "rgba(250,248,244,0.3)" : "#E8E2D8" }}
        />
      </div>

      {tool.data_location && (
        <AxisLine label="Where your data sits" value={tool.data_location} isSelected={isSelected} />
      )}
      {tool.trains_on_input && (
        <AxisLine label="Trains on your content" value={tool.trains_on_input} isSelected={isSelected} />
      )}

      {/* DPIA chip. Colours are held constant through the hover state: the
          chip carries its own background, so its contrast holds on the cobalt
          card, and the three pairings are locked. */}
      {dpia && (
        <div className="mt-3">
          <span
            className="inline-block font-body text-[12px] font-medium leading-snug"
            style={{
              backgroundColor: dpia.tint,
              color: dpia.ink,
              border: `1px solid ${dpia.ink}`,
              borderRadius: 999,
              padding: "3px 10px",
            }}
          >
            {dpia.label}
          </span>

          {/* C4(b), approved copy, string unchanged. Red only, approved
              26 Aug. It was scoped when Green was expected to be common, and
              amendment 4 made Green rare, so a line meant to appear sometimes
              was appearing on 14 of the 15 published cards and reading as
              furniture. Red puts it on two, HubSpot and DeepSeek, which are
              the rows where a reader needs a policy before going near the
              tool. The counter was weighed and lost: Amber is arguably where
              people need the policy most, but the template already has three
              other placements and a prompt nobody reads captures nothing. */}
          {flag === "Red" && (
            <Link
              to="/policy-template"
              onClick={(e) => e.stopPropagation()}
              className="block mt-2 font-body text-[12px] leading-snug no-underline hover:underline"
              style={{ color: isSelected ? "#C8F04A" : "#2D35C9" }}
            >
              Not sure what your policy should say? Start with the template.
            </Link>
          )}
        </div>
      )}

      {/* ZONE 4, act. The verdict toggle and the Checked stamp share one row:
          both are meta about the judgement, and stacking them cost a line for
          nothing. "Checked" is a prefix, per the microcopy pack. */}
      <div className="mt-auto pt-4 flex items-center justify-between gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded((v) => !v);
          }}
          className="text-left font-body font-medium text-[13px] transition-colors"
          style={{ color: isSelected ? "#C8F04A" : "#9B9FE0" }}
        >
          {isExpanded ? "Honest verdict ↑" : "Honest verdict ↓"}
        </button>
        {tool.last_checked && (
          <span
            className="font-body text-[11px] shrink-0"
            style={{ color: isSelected ? "rgba(250,248,244,0.6)" : "#9A8F82" }}
          >
            Checked {tool.last_checked}
          </span>
        )}
      </div>

      {/* Expanded verdict, with the trustee note inside it. The note is the
          sentence you could say at a board meeting, so it belongs with the
          judgement, not with the facts above. */}
      {isExpanded && (tool.verdict || tool.trustee_note) && (
        <div
          className="mt-3 pt-4 font-body text-sm leading-relaxed"
          style={{
            borderLeft: "4px solid #9B9FE0",
            paddingLeft: 16,
            color: isSelected ? "#FAF8F4" : "#1A1510",
          }}
        >
          {tool.verdict}
          {tool.trustee_note && (
            <div style={{ marginTop: tool.verdict ? 12 : 0 }}>
              <p
                className="font-body text-[11px] leading-tight"
                style={{ color: isSelected ? "rgba(250,248,244,0.6)" : "#9A8F82", margin: 0 }}
              >
                Say this to a trustee
              </p>
              <p
                className="font-body text-sm leading-relaxed"
                style={{ margin: 0, marginTop: 2 }}
              >
                {tool.trustee_note}
              </p>
            </div>
          )}
        </div>
      )}


      {/* Visit tool button — lime pill */}
      {tool.url && (
        <div className="mt-3 flex justify-end">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="font-body inline-block"
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: isSelected ? "#2D35C9" : "#1A1510",
              backgroundColor: isSelected ? "#FAF8F4" : "#C8F04A",
              borderRadius: "20px",
              padding: "10px 20px",
              transition: "background-color 0.2s ease-out, color 0.2s ease-out",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              if (isSelected) {
                e.currentTarget.style.backgroundColor = "#C8F04A";
                e.currentTarget.style.color = "#1A1510";
              } else {
                e.currentTarget.style.backgroundColor = "#2D35C9";
                e.currentTarget.style.color = "#FFFFFF";
              }
            }}
            onMouseLeave={(e) => {
              if (isSelected) {
                e.currentTarget.style.backgroundColor = "#FAF8F4";
                e.currentTarget.style.color = "#2D35C9";
              } else {
                e.currentTarget.style.backgroundColor = "#C8F04A";
                e.currentTarget.style.color = "#1A1510";
              }
            }}
          >
            Visit tool →
          </a>
        </div>
      )}
    </div>
  );
};
