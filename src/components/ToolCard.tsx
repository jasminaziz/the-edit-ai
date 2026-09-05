import { useState } from "react";
import { Link } from "react-router-dom";
import { normaliseDpiaFlag, type Tool } from "@/lib/sheets";
import { toSlug } from "@/utils/slugify";

/**
 * Colour lives in index.css under `.tool-card`, not here.
 *
 * Ruled 29 Aug 2026: the cobalt hover inversion stays exactly as it looked,
 * but the card root carries `data-selected` and every child colour comes from
 * a descendant rule. The twenty per-element selected/unselected colour
 * ternaries this replaces were the reason the component could not carry a
 * single responsive class, so removing them is the precondition for the
 * hierarchy work.
 *
 * If a colour needs changing, change index.css. Adding an inline hex back into
 * this file re-creates the problem.
 */

/**
 * DPIA chip labels, one per flag value. Colours are locked and AA-verified
 * against both the white card and the cream page ground (axis spec, 23 Aug
 * 2026), and live in index.css keyed off `data-flag`.
 *
 * The label carries the meaning, so the chip never relies on colour alone:
 * "Green" only reads to someone who already knows the scheme. Labels are
 * approved copy from the B3 microcopy pack: do not reword them.
 */
const DPIA_CHIP = {
  Green: { label: "DPIA unlikely" },
  Amber: { label: "DPIA likely once personal data goes in" },
  Red: { label: "Assume a DPIA before adopting" },
} as const;

/** One labelled axis fact. Label strings are approved copy — do not reword. */
const AxisLine = ({ label, value }: { label: string; value: string }) => (
  // Label and value share a baseline rather than stacking, the pattern the
  // nonprofit line already used. Saves a row per fact without dropping either
  // half, which is how the card gets calmer without losing a field.
  <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
    <p className="font-body text-[11px] leading-tight m-0 tc-secondary">{label}</p>
    <p className="font-body text-[13px] font-semibold leading-snug m-0 tc-primary">{value}</p>
  </div>
);

/**
 * Selection handlers shared by the directory card and the radar card.
 *
 * Exported rather than duplicated because the touch/mouse split below is
 * subtle enough that two copies would drift, and the two cards must feel
 * identical: /radar is the old directory experience, so it inverts and dims
 * exactly the way /tools does.
 *
 * Two separate input models, split on pointerType. Ruled 1 Sep 2026.
 *
 * Mouse keeps hover exactly as built: enter selects, leave clears. That
 * behaviour was ruled on 29 Aug and nothing here reopens it.
 *
 * Touch is a selection, not a hover. Hover does not exist on touch, and this
 * card has been through both failure modes. Originally a tap raised a
 * compatibility mouseenter with no matching mouseleave, so the card stuck
 * inverted and every other card stayed dimmed. Switching to pointer events
 * fixed that, but pointers are created and destroyed per touch, so the state
 * then cleared on finger-lift and the card flashed cobalt for the tap.
 *
 * Holding is correct and sticking is not, and the difference is a way out. So
 * touch selection is handled in pointerdown, deliberately NOT in pointerenter:
 * pointerenter fires first and React flushes between the two events, so a
 * toggle written there would read its own freshly-set state and deselect on the
 * first tap. Tapping again clears it; tapping another card moves it.
 *
 * Taps landing on a link or button are ignored so the card's own controls keep
 * doing only their own job. onFocus and onBlur bubble from those controls,
 * which is what makes the state reachable by keyboard.
 */
export function cardSelectionProps({
  isSelected,
  onActivate,
  onDeactivate,
}: {
  isSelected: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  return {
    onPointerEnter: (e: React.PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      // A card that scrolls up under a stationary cursor genuinely enters its
      // hover state, so the browser fires pointerenter for it with no mouse
      // movement at all. With the whole grid sharing one hovered value, that
      // made the cobalt inversion chase down the column on every scroll while
      // the mouse sat still. Requiring movement is what separates a hover the
      // reader performed from one the scroll performed: a pointer crossing a
      // boundary because it moved always carries a non-zero delta on at least
      // one axis, and a scroll-induced entry carries zero on both.
      if (e.movementX === 0 && e.movementY === 0) return;
      onActivate();
    },
    onPointerLeave: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") onDeactivate();
    },
    onPointerDown: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") return;
      if ((e.target as Element).closest("a, button")) return;
      if (isSelected) onDeactivate();
      else onActivate();
    },
    onFocus: onActivate,
    onBlur: onDeactivate,
  };
}

interface ToolCardProps {
  tool: Tool;
  isSelected: boolean;
  isDimmed: boolean;
  /** Fired by pointer entry and by focus, so the state is not mouse-only. */
  onActivate: () => void;
  onDeactivate: () => void;
  /**
   * Opens the verdict on first render, for a `?tool=` deep link. Read once as
   * the initial state and never again, so a reader who closes a deep-linked
   * verdict is not fighting the URL to keep it shut.
   */
  defaultExpanded?: boolean;
}

export const ToolCard = ({
  tool,
  isSelected,
  isDimmed,
  onActivate,
  onDeactivate,
  defaultExpanded = false,
}: ToolCardProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  // normaliseDpiaFlag resolves casing, and returns "" for anything that is not
  // one of the three allowed values, so an unrecognised flag renders no chip
  // rather than an empty one. isComplete() keeps such a row off the grid anyway.
  const flag = normaliseDpiaFlag(tool.dpia_flag);
  const dpia = flag ? DPIA_CHIP[flag] : null;

  return (
    <div
      // Handlers live in cardSelectionProps above, shared with the radar card.
      {...cardSelectionProps({ isSelected, onActivate, onDeactivate })}
      // The state is an attribute, not a branch: `data-selected` and
      // `data-dimmed` are omitted entirely when false, and index.css keys off
      // their presence.
      data-selected={isSelected || undefined}
      data-dimmed={isDimmed || undefined}
      // The scroll target for a `?tool=` deep link. An attribute rather than an
      // id because ids have to be unique document-wide and the radar card
      // shares these class names; nothing styles off this.
      data-tool={toSlug(tool.name)}
      className="tool-card rounded-xl border p-4 sm:p-5 flex flex-col h-full transition-all duration-200"
    >
      {/* Always an h3, with the link inside it rather than instead of it.
          Ruled 1 Sep 2026: 22 of the 23 rendering rows carry a url, so the name
          was an anchor and not a heading on all but one card, and a screen
          reader user could not navigate the directory by heading at all. The h3
          sits under CobaltZone's subheading, now an h2, so the page runs h1, h2,
          h3 without a skip. Renders identically: Tailwind's preflight strips the
          heading's own size, weight and margin. */}
      <h3 className="font-heading font-semibold text-xl tc-primary">
        {tool.url ? (
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline tc-primary"
            onClick={(e) => e.stopPropagation()}
          >
            {tool.name}
          </a>
        ) : (
          tool.name
        )}
      </h3>

      {/* ZONE 1, explore. Description before the chips, per the restructure:
          the chips answer "which of my problems does this solve", the
          description answers "what kind of thing is this", and comprehension
          has to come first. Guarded, so a row without a description does not
          leave a gap; as at 2026-08-26 all rendering rows have one. */}
      {tool.what_it_does && (
        <p className="mt-2 font-body text-[15px] leading-relaxed line-clamp-2 tc-primary">
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
            className="inline-block px-2.5 py-0.5 font-body text-[11px] font-semibold uppercase tracking-[0.05em] rounded-full tc-chip-job"
          >
            {job}
          </span>
        ))}
        {tool.status === "in_stack" && (
          <span className="inline-block px-2.5 py-0.5 font-body text-[11px] font-semibold uppercase tracking-[0.05em] rounded-full tc-chip-stack">
            IN MY STACK
          </span>
        )}
        {/* The failure badge. The positioning statement presses the tools that
            went through the checks and did not survive them as the scarcest
            content the site owns, but nothing on the grid distinguished a
            published failure from a Red row that is still recommended, so a
            reader could not find them without opening every verdict.

            Solid, not tinted, so it does not read as a fourth DPIA chip: the
            chips carry a 1px border on a pale tint, this carries neither.
            #FFFFFF on #A8261C is the locked Red ink at roughly 7:1, and it is
            held constant through the hover state for the same reason the DPIA
            chips are, since it carries its own background. Source string is
            sentence case and CSS uppercases it, the IN MY STACK pattern.
            Approved copy, copy pack four item 6: do not reword. */}
        {tool.status === "not_recommended" && (
          <span className="inline-block px-2.5 py-0.5 font-body text-[11px] font-semibold uppercase tracking-[0.05em] rounded-full tc-chip-fail">
            Judged, not recommended
          </span>
        )}
      </div>

      {/* ZONE 2, buying. Nonprofit pricing sits with the price rather than
          with the risk facts: it decides affordability, not exposure. */}
      {tool.pricing && (
        <p className="mt-3 font-body text-[13px] tc-secondary">{tool.pricing}</p>
      )}
      {tool.nonprofit_tier && (
        <p className="mt-1.5 font-body flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-[11px] leading-tight tc-secondary">Nonprofit pricing</span>
          <span className="text-[13px] font-semibold leading-snug tc-primary">
            {tool.nonprofit_tier}
          </span>
        </p>
      )}

      {/* ZONE 3, the checks. The only zone that earns a heading: a name, a
          description, chips and a price are self-evident, whereas this block
          contains an acronym and is the part nobody else publishes.

          "The checks" is approved copy, 26 Aug. It stays sentence case in the
          source and is uppercased by CSS, the treatment the job chips already
          use. It is not "Risk": the site's headline claim is that no tool
          appears until it has been through the checks, and this block is where
          that claim is evidenced. "Risk" would also mislabel its own contents,
          because "Where your data sits: US" is a fact, not a risk. */}
      <div className="mt-4 flex items-center gap-3">
        <span className="font-body text-[11px] font-semibold uppercase tracking-[0.05em] shrink-0 tc-checks-label">
          The checks
        </span>
        <div className="h-px flex-1 tc-rule" />
      </div>

      {/* DPIA chip, first in the zone. Reordered 28 Aug on the surface audit's
          finding: the zone used to lead with the two driest facts and hold the
          human sentence back to third, so the block read data-first when the
          register Jasmin asked for is caution-first. The chip is the sentence
          that says why care is needed; the two fact lines below it now read as
          its evidence.

          Colours hold constant through the hover state: the chip carries its
          own background, so its contrast holds on the cobalt card. */}
      {dpia && (
        <div className="mt-3">
          <span
            data-flag={flag}
            className="inline-block font-body text-[13px] font-medium leading-snug tc-dpia"
          >
            {dpia.label}
          </span>

          {/* C4(b), approved copy, string unchanged. Red only, approved
              26 Aug. It was scoped when Green was expected to be common, and
              amendment 4 made Green rare, so a line meant to appear sometimes
              was appearing on 14 of the 15 published cards and reading as
              furniture. Red puts it on the rows where a reader needs a policy
              before going near the tool. The counter was weighed and lost:
              Amber is arguably where people need the policy most, but the
              template already has three other placements and a prompt nobody
              reads captures nothing. */}
          {flag === "Red" && (
            <Link
              to="/policy-template"
              onClick={(e) => e.stopPropagation()}
              className="block mt-2 font-body text-[13px] leading-snug no-underline hover:underline tc-policy-link"
            >
              Not sure what your policy should say? Start with the template.
            </Link>
          )}
        </div>
      )}

      {tool.data_location && <AxisLine label="Where your data sits" value={tool.data_location} />}
      {tool.trains_on_input && (
        <AxisLine label="Trains on your content" value={tool.trains_on_input} />
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
          className="text-left font-body font-semibold text-[15px] min-h-[44px] flex items-center transition-colors tc-verdict-toggle"
        >
          {isExpanded ? "Honest verdict ↑" : "Honest verdict ↓"}
        </button>
        {tool.last_checked && (
          <span className="font-body text-[11px] shrink-0 tc-secondary">
            Checked {tool.last_checked}
          </span>
        )}
      </div>

      {/* Expanded verdict, with the trustee note inside it. The note is the
          sentence you could say at a board meeting, so it belongs with the
          judgement, not with the facts above. */}
      {isExpanded && (tool.verdict || tool.trustee_note) && (
        <div
          className="mt-3 pt-4 pl-4 font-body text-[15px] leading-relaxed tc-verdict tc-primary"
        >
          {tool.verdict}
          {tool.trustee_note && (
            <div className={tool.verdict ? "mt-3" : "mt-0"}>
              <p
                className="font-body text-[11px] leading-tight m-0 tc-secondary"
              >
                Say this to your board
              </p>
              <p className="font-body text-[15px] leading-relaxed m-0 mt-0.5">
                {tool.trustee_note}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Visit tool button — lime pill. Hover is a CSS rule now, not two JS
          handlers writing inline styles. */}
      {tool.url && (
        <div className="mt-3 flex justify-end">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="font-body inline-flex items-center min-h-[44px] text-[13px] font-medium no-underline rounded-[20px] px-5 transition-colors duration-200 tc-visit"
          >
            Visit tool →
          </a>
        </div>
      )}
    </div>
  );
};
