## First-visit StackBar tooltip

### Flags (per your "flag before building" asks)

1. **z-index**: StackBar is `z-50`. Tooltip will use `z-[60]` so it sits above the bar but below modals (none on this page). No other fixed/sticky element on /tools sits in the bottom region — the sticky filter bar is `top-14` `z-40` and won't conflict.
2. **Dismiss-on-first-add wiring**: I'll wrap the existing `toggleStack` in `Tools.tsx` (not touch `ToolCard` or `StackBar`) so that whenever the stack transitions from 0 → ≥1 items, the tooltip is dismissed and `stack-tooltip-seen=true` is written. This uses the same single source of truth — no parallel state.
3. **Edge case — returning user with `?stack=`**: The merge effect can also bring stack from 0 → N on load. I'll dismiss the tooltip in that case too (otherwise it floats over a populated bar, which is wrong).
4. **Better-idea suggestion (flag)**: One small enhancement worth considering — gently pulse/bounce the tooltip's pointer once (or apply a subtle 2-cycle attention pulse to the StackBar itself) when the tooltip appears. It draws the eye to the bar without adding copy. **I won't build it unless you say yes** — the spec calls for a static fade-in only.

### Files

- **New**: `src/components/StackTooltip.tsx` — self-contained presentational component.
- **Edit**: `src/pages/Tools.tsx` — mount tooltip, manage visibility, dismiss hooks.

No changes to `StackBar.tsx`, `ToolCard.tsx`, card grid, filters, header, footer, or the `the-edit-stack` localStorage key.

### `StackTooltip.tsx`

Props: `visible: boolean`, `onDismiss: () => void`.

- Renders `null` until a 1500ms timer (started on mount when `visible` is true) elapses, then transitions opacity 0 → 1 over 300ms ease-in.
- Container: `position: fixed; bottom: 60px; left: 50%; transform: translateX(-50%); z-index: 60; max-width: 320px; width: calc(100% - 32px); background: #1A1510; border-radius: 6px; padding: 14px 18px;`.
- Text: Plus Jakarta Sans 400 / 14px / `#FFFFFF` / line-height 1.5. Copy: *"Build your own stack as you browse. Click any tool to add it to your stack."*
- Close button: absolute top-right, 20×20px touch target, `#9A8F82`, `aria-label="Dismiss tooltip"`, calls `onDismiss`.
- Pointer: CSS triangle (8px) at bottom-centre, `#1A1510`, pointing down, via `::after` or an absolutely-positioned div with borders.

### `Tools.tsx` changes

1. Add state:
   ```ts
   const [tooltipVisible, setTooltipVisible] = useState(() => {
     if (typeof window === "undefined") return false;
     try { return window.localStorage.getItem("stack-tooltip-seen") !== "true"; }
     catch { return false; }
   });
   ```
2. Add `dismissTooltip()` helper that sets state false and writes `stack-tooltip-seen=true` to localStorage (try/catch).
3. Wrap `toggleStack` so that if `prev.length === 0` and the new length > 0 → call `dismissTooltip()`.
4. In the `?stack=` merge effect, if `tooltipVisible && merged.length > 0` → call `dismissTooltip()`.
5. Render `<StackTooltip visible={tooltipVisible} onDismiss={dismissTooltip} />` just before `<StackBar … />`.

### Verification

- Fresh visit (clear localStorage): tooltip fades in ~1.5s after load.
- Click X → disappears, localStorage `stack-tooltip-seen=true`, reload → no tooltip.
- Click any tool card → tooltip disappears, same localStorage write.
- Visit `/tools?stack=…` fresh → tooltip suppressed once shared stack is applied.
- Check 375px and 1280px viewports for centring and that the pointer aligns with the StackBar centre.
