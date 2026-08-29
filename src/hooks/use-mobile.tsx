import * as React from "react";

/**
 * The width below which the site serves its mobile chrome.
 *
 * Raised from 768 to 1024 on 29 Aug 2026 (design audit fix 5). At 768 the hook
 * handed over to the desktop navigation, which needs 1087px to lay out: every
 * child is whitespace-nowrap so nothing shrinks, and Layout's overflow-hidden
 * clipped the excess instead of producing a scrollbar. The result was that
 * "Work with me", the consultancy link, rendered entirely off-screen between
 * 768px and roughly 1086px, silently, on iPads in portrait and small laptops.
 *
 * The contract this fixes, and the one to keep: THIS breakpoint governs chrome
 * (the nav, the homepage counter, the hero pills, the drag hint) at 1024, and
 * Tailwind's `sm:` governs content layout at 640. No element should consult
 * both. 1024 is Tailwind's `lg`, so JS and CSS agree wherever they meet.
 */
const MOBILE_BREAKPOINT = 1024;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
