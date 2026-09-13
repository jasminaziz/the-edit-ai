import { useLocation, Link } from "react-router-dom";
import { ReactNode, useEffect, useState, useRef, useCallback } from "react";
import { Menu, X, ArrowUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { FooterEmailCapture } from "@/components/FooterEmailCapture";
import { WORK_WITH_ME_HREF, SUBSTACK_LIVE, SUBSTACK_URL, LINKEDIN_URL, HUB_PAGES } from "@/lib/links";

/**
 * The bar: three tabs and the "How I work" hub. Ruled 13 Sep 2026 (site map
 * build, step 3), superseding the six-tab bar ruled the same morning.
 *
 * The line the bar draws is checked against not checked. Tools is the checked
 * directory; the hub holds the pages that come from Jasmin rather than from
 * the checks, and the section banner on those pages says so. Tools stays
 * second, which was the one goal of the 4 Sep and morning rulings. Template
 * became a tab, so "Get the template →" left the bar and the drawer.
 *
 * The hub tab links to My Stack, its first page, so no route is new and no URL
 * redirects. /radar stays off the bar; its way in is the signpost on /tools.
 */
// The four pages, their labels and their subheadings: one source, in links.ts.
const hubItems = HUB_PAGES;

const HUB_LABEL = "How I work";

const navItems = [
  { to: "/", label: "Home", hub: false },
  { to: "/tools", label: "Tools", hub: false },
  { to: "/policy-template", label: "Template", hub: false },
  { to: hubItems[0].to, label: HUB_LABEL, hub: true },
];

// Exact, or a path beneath it after a slash. A bare startsWith would put a
// future route such as /tools-archive under the Tools tab without complaint.
const onRoute = (pathname: string, to: string) =>
  to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(to + "/");

const isExternalHref = (href: string) => /^https?:\/\//i.test(href);
const CONTACT_EMAIL = "hello@jasminaziz.co.uk";
// Sync touch to trigger Vercel rebuild.

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isMobile = useIsMobile();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const navContainerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number; visible: boolean }>({ left: 0, width: 0, visible: false });

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    scrollRef.current?.scrollTo(0, 0);
    setShowScrollTop(false);
  }, [location.pathname]);

  // Same 300px trigger as the consultancy site, read off the inner pane
  // rather than off window. Passive because it only reads scrollTop.
  useEffect(() => {
    const pane = scrollRef.current;
    if (!pane) return;
    const onScroll = () => setShowScrollTop(pane.scrollTop > 300);
    pane.addEventListener("scroll", onScroll, { passive: true });
    return () => pane.removeEventListener("scroll", onScroll);
  }, []);

  // The hub tab is active on all four hub pages, not only on the page it links
  // to, so the pill sits on "How I work" wherever the section banner shows.
  const isHubRoute = hubItems.some((h) => onRoute(location.pathname, h.to));
  const isActive = (item: (typeof navItems)[number]) =>
    item.hub ? isHubRoute : onRoute(location.pathname, item.to);
  // Set by hand rather than by NavLink, which could only mark the hub tab on
  // the one page it links to. "page" where the link is the current page; on
  // the hub tab, "true" on the other three hub pages, meaning current section.
  const currentFor = (item: (typeof navItems)[number]) =>
    !isActive(item) ? undefined : item.hub && location.pathname !== item.to ? ("true" as const) : ("page" as const);

  const updatePill = useCallback(() => {
    const activeItem = navItems.find((item) =>
      item.hub
        ? hubItems.some((h) => onRoute(location.pathname, h.to))
        : onRoute(location.pathname, item.to)
    );
    if (!activeItem || !navContainerRef.current) {
      setPillStyle((prev) => ({ ...prev, visible: false }));
      return;
    }
    const el = navRefs.current[activeItem.to];
    if (!el) return;
    const containerRect = navContainerRef.current.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setPillStyle({
      left: elRect.left - containerRect.left,
      width: elRect.width,
      visible: true,
    });
  }, [location.pathname]);

  useEffect(() => {
    updatePill();
    // Measure again once the web fonts have loaded. On a first visit the
    // first measurement is taken against the fallback font, so the pill sat
    // up to 14px left of the rightmost tab, with its label running off the
    // pill's edge, until the window was resized. Found 13 Sep 2026 when
    // My Stack became the last tab, the one the drift hits hardest.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) updatePill();
    });
    window.addEventListener("resize", updatePill);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", updatePill);
    };
  }, [updatePill]);

  // Periwinkle on the homepage, cobalt everywhere else. Restored 1 Sep 2026
  // on Jasmin's ruling, reverting the 30 Aug removal.
  //
  // #7B7FD4, not the current #9B9EDE, and the hero at Index.tsx moves with it,
  // because the whole point is that the header stops reading as a band across
  // the top of the hero. A nav one step off the hero is the defect, not the
  // fix, so the two hexes have to be identical.
  //
  // THIS KNOWINGLY REINSTATES THREE AA FAILURES ON THE HOMEPAGE, and they are
  // the reason the colour was removed in the first place. Cream nav links are
  // 3.40:1 against 4.5, the lime "Menu" label 2.75:1, and the cobalt wordmark
  // on the hero 2.37:1 against the 3:1 display floor. Every ramp between here
  // and a compliant periwinkle was computed before this shipped: cream and
  // lime only both clear 4.5:1 at #4E53C6, which is so close to cobalt that
  // the blend disappears and the wordmark falls to 1.37:1. There is no value
  // that satisfies both, so this is a decision rather than an oversight.
  //
  // Scoped to the homepage deliberately. The --secondary token stays #9B9EDE,
  // which is what keeps the legal and policy page h1s passing at 3.38:1. Do
  // not "finish the job" by reverting the token.
  const navBg = isHome ? "#7B7FD4" : "#2D35C9";
  const textColor = "text-primary-foreground";
  const pillBg = "bg-white";
  const pillText = "text-primary";

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      {/* A header holding up to two labelled nav landmarks: "Main" (the bar,
          or on a phone the drawer) and, on the four hub pages, "How I work".
          Two unlabelled navs would be announced as the same thing twice. */}
      <header
        className="shrink-0 z-50"
        style={{ backgroundColor: navBg }}
      >
        {/* lg:px-8 xl:px-12, design audit fix 5: between 1024 and 1279 the
            desktop nav needs every pixel it can get, so the gutter tightens
            there and returns to 48px at xl. At 1280 and up this renders exactly
            as it did before. */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-12 lg:px-8 xl:px-12">
          <nav aria-label="Main" className="flex items-center justify-between h-14 sm:h-16">
            {/* Mobile hamburger */}
            {isMobile ? (
              <>
                <div className="w-10" />
                <div className="flex-1" />
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger asChild>
                    <button
                      className="flex items-center gap-2 p-1.5 rounded-md transition-opacity hover:opacity-90"
                      aria-label="Open menu"
                      style={{ backgroundColor: "transparent" }}
                    >
                      <span
                        className="font-body font-semibold text-[11px] uppercase tracking-wide"
                        style={{
                          color: "#C8F04A",
                          textShadow: "0 1px 8px rgba(26, 21, 16, 0.35), 0 0 12px rgba(200, 240, 74, 0.25)",
                        }}
                      >
                        Menu
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 32 32"
                        width="28"
                        height="28"
                        aria-hidden="true"
                      >
                        <rect x="4" y="5" width="24" height="6" rx="3" fill="#C8F04A" />
                        <rect x="9" y="13" width="19" height="6" rx="3" fill="#C8F04A" />
                        <rect x="4" y="21" width="24" height="6" rx="3" fill="#C8F04A" />
                      </svg>
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[260px] p-0 flex flex-col" style={{ backgroundColor: navBg, borderLeft: "1px solid rgba(255,255,255,0.12)" }}>
                    <SheetTitle className="sr-only">Navigation</SheetTitle>
                    {/* The drawer renders in a portal outside the header, so
                        it carries its own "Main" landmark. While it is open the
                        dialog hides the rest of the page from assistive tech,
                        so only one "Main" is ever exposed. */}
                    <nav aria-label="Main" className="flex flex-col pt-16 px-6 gap-1 flex-1">
                      {/* Home, Tools and Template. The hub tab is not a row
                          here: its four pages are listed under their label
                          below, which is the drawer's version of the second
                          row. */}
                      {navItems.filter((item) => !item.hub).map((item) => {
                        const active = isActive(item);
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            aria-current={active ? "page" : undefined}
                            onClick={() => setMobileOpen(false)}
                            className={`font-body text-base font-medium px-4 py-3 rounded-lg transition-colors ${
                              active
                                ? "bg-white/20 text-white"
                                : "text-white/70 hover:text-white hover:bg-white/10"
                            }`}
                          >
                          {item.label}
                          </Link>
                        );
                      })}
                      {/* The How I work pages as their own panel, ruled 13 Sep
                          2026 (option B from a rendered board). The heading was
                          an 11px tracked-caps label sitting 12px under Template,
                          so the two groups ran together; it is now a real
                          heading in the display face, in a lighter panel set
                          24px below the main three. */}
                      <div
                        role="group"
                        aria-labelledby="drawer-hub-label"
                        className="mt-6 flex flex-col gap-1 rounded-2xl bg-[rgba(250,248,244,0.08)] pt-3.5 px-1.5 pb-1.5"
                      >
                        <p
                          id="drawer-hub-label"
                          className="font-heading font-bold text-[20px] leading-tight px-4 pb-1.5 m-0 text-[#FAF8F4]"
                        >
                          {HUB_LABEL}
                        </p>
                        {hubItems.map((item) => {
                          const active = onRoute(location.pathname, item.to);
                          return (
                            <Link
                              key={item.to}
                              to={item.to}
                              aria-current={active ? "page" : undefined}
                              onClick={() => setMobileOpen(false)}
                              className={`font-body text-base font-medium px-4 py-3 rounded-lg transition-colors ${
                                active
                                  ? "bg-white/20 text-white"
                                  : // 80%, not the 70% of the rows above: on the panel's
                                    // lighter ground 70% measures 4.39:1, under AA, and
                                    // 80% measures 5.22:1.
                                    "text-white/80 hover:text-white hover:bg-white/10"
                              }`}
                            >
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                      {SUBSTACK_LIVE && (
                        <a
                          href={SUBSTACK_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setMobileOpen(false)}
                          className="mt-5 font-body text-base font-medium px-4 py-3 rounded-lg transition-colors text-white/70 hover:text-white hover:bg-white/10"
                        >
                          Read the Substack →
                        </a>
                      )}
                    </nav>
                    {/* The drawer's foot carries the one primary CTA, as the
                        desktop bar does. */}
                    <div className="px-6 pb-8 flex flex-col gap-3">
                      <a
                        href={WORK_WITH_ME_HREF}
                        {...(isExternalHref(WORK_WITH_ME_HREF)
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        onClick={() => setMobileOpen(false)}
                        className="block w-full text-center font-body text-base font-semibold rounded-full py-3 bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
                      >
                        Work with me
                      </a>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              <>
                <div ref={navContainerRef} className="relative flex items-center gap-1 sm:gap-2">
                  {/* Sliding active pill — only rendered when a nav item is active */}
                  {pillStyle.visible && (
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 h-8 rounded-[20px] ${pillBg} transition-all duration-[250ms]`}
                      style={{
                        left: pillStyle.left,
                        width: pillStyle.width,
                        transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                      }}
                    />
                  )}
                  {navItems.map((item) => {
                    const active = isActive(item);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        ref={(el) => { navRefs.current[item.to] = el; }}
                        aria-current={currentFor(item)}
                        onMouseEnter={() => setHoveredItem(item.to)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={`relative z-10 font-body text-sm font-medium px-3 xl:px-4 py-1.5 rounded-[20px] whitespace-nowrap transition-colors duration-150 ${
                          active
                            ? pillText
                            : `${textColor} hover:bg-white/[0.15]`
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                {/* The one primary CTA. "Get the template →" and the divider
                    beside it left the bar on 13 Sep 2026, when Template became
                    a tab.

                    "Read the Substack →" stays out of the DESKTOP bar and in
                    the mobile drawer, on Jasmin's 4 Sep ruling: the asymmetry
                    is the decision, so do not "finish the job" by removing it
                    from the drawer. It left the bar to make room, and the bar
                    now has far more slack than it did, so the width argument no
                    longer forces it out. Whether it returns is Jasmin's call.
                    The Substack stays reachable from the footer on every route
                    and in prose on /policy-template. */}
                <div className="flex items-center">
                  <a
                    href={WORK_WITH_ME_HREF}
                    {...(isExternalHref(WORK_WITH_ME_HREF)
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    // White on the homepage, as it was pre-merge. Lime on
                    // periwinkle is a 1.92:1 boundary, so the pill would have
                    // dissolved into the nav it sits on; white gives 3.60:1 and
                    // cobalt text on it 8.52:1. Lime everywhere else, where the
                    // nav is cobalt and lime reads at 6.50:1.
                    className={`font-body text-sm font-semibold px-5 py-2 rounded-full whitespace-nowrap transition-opacity hover:opacity-90 ${
                      isHome ? "bg-white text-primary" : "bg-accent text-accent-foreground"
                    }`}
                  >
                    Work with me
                  </a>
                </div>
              </>
            )}
          </nav>
        </div>

        {/* The How I work section banner, on the four hub pages only, so never
            on the homepage and its periwinkle blend. Ruled 13 Sep 2026 (option
            2 from a rendered board, without numbers so it does not read as a
            numbered system). It replaced a thin 13px text row that read as a
            breadcrumb rather than arriving somewhere.

            A title, then the four pages as choices: each tile carries its
            page's own subheading from links.ts, except the page you are on,
            which is the filled tile and shows only its name, because its
            subheading is already the h2 directly below.

            The checks line lives here, as a fact about the section rather than
            a third line of page copy under the heading. It shows from lg (the
            1024 chrome breakpoint) and not on phones or tablets, on Jasmin's
            ruling; below lg the tiles are names only, two by two.

            Contrast on cobalt: title and names cream (8.03:1), descriptions and
            the checks line cream at 75% and 85% (5.18:1 and 6.24:1), the
            current tile cobalt on cream (8.03:1). */}
        {isHubRoute && (
          <nav aria-labelledby="hub-banner-title" className="border-t border-[rgba(250,248,244,0.12)]">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-12 lg:px-8 xl:px-12 pt-[18px] pb-5 lg:pt-7 lg:pb-8">
              <div className="mb-3.5 lg:mb-5 lg:flex lg:items-end lg:justify-between lg:gap-8">
                <p id="hub-banner-title" className="font-heading font-bold m-0 leading-none text-[30px] lg:text-[44px] text-[#FAF8F4]">
                  {HUB_LABEL}
                </p>
                <p className="hidden lg:block font-body m-0 max-w-[320px] text-right text-[14px] leading-[1.4] text-[rgba(250,248,244,0.85)]">
                  This page hasn't been through the checks. Everything on{" "}
                  <Link to="/tools" className="lime-link">
                    Tools
                  </Link>{" "}
                  has.
                </p>
              </div>
              <ul className="m-0 p-0 list-none grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3.5">
                {hubItems.map((item) => {
                  const current = onRoute(location.pathname, item.to);
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        aria-current={current ? "page" : undefined}
                        className={`block h-full no-underline rounded-[14px] px-3.5 py-3 lg:px-5 lg:pt-[18px] lg:pb-5 transition-colors duration-150 ${
                          current
                            ? "bg-[#FAF8F4]"
                            : "shadow-[inset_0_0_0_1px_rgba(250,248,244,0.22)] hover:bg-[rgba(250,248,244,0.08)] focus-visible:bg-[rgba(250,248,244,0.08)]"
                        }`}
                      >
                        <span
                          className={`block font-heading font-bold leading-[1.1] text-[17px] lg:text-[22px] ${
                            current ? "text-[#2D35C9]" : "text-[#FAF8F4]"
                          }`}
                        >
                          {item.label}
                        </span>
                        {!current && (
                          <span className="hidden lg:block mt-1.5 font-body text-[14px] leading-[1.4] text-[rgba(250,248,244,0.75)]">
                            {item.subheading}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        )}
      </header>

      {/* Back to top. The pattern is the consultancy site's
          (~/Developer/jasmin-aziz: scroll-top.js plus .scroll-top-btn), reused
          rather than rebuilt: same 300px trigger, same 48px circle bottom-right,
          same reduced-motion fallback, same aria-label.

          ONE THING HAD TO CHANGE, and it is the whole reason a straight port
          would have shipped dead. That script listens on `window` scroll and
          calls `window.scrollTo`. This site locks body scroll and scrolls an
          inner pane instead, so window.scrollY is 0 no matter how far down the
          page you are: verified with the pane at scrollTop 800 and
          window.scrollY still 0. Both halves therefore read and write
          scrollRef, the same element the route-change reset above already uses.

          Gated on isMobile, which is the 1024 chrome hook, because this is
          chrome. It does not also consult a Tailwind breakpoint, per the
          breakpoint contract. */}
      {isMobile && showScrollTop && (
        <button
          type="button"
          aria-label="Back to top"
          onClick={() => {
            const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            scrollRef.current?.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
          }}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center border-none cursor-pointer text-white bg-[#2D35C9] hover:bg-[#1A1510] transition-colors duration-200"
          style={{ boxShadow: "0 2px 8px rgba(26, 21, 16, 0.18)" }}
        >
          <ArrowUp size={22} aria-hidden="true" />
        </button>
      )}

      <div
        id="app-scroll"
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain flex flex-col"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
      <main className="flex-1">{children}</main>

      <footer className="px-4 sm:px-12" style={{ backgroundColor: "#1A1510" }}>
        <div className="max-w-[1280px] mx-auto w-full">
          <FooterEmailCapture />
          <div className="py-4 flex flex-col gap-3">
            {/* Top row: curator + primary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p
                className="font-body text-[13px] text-center sm:text-left"
                style={{ fontWeight: 500, color: "#FFFFFF", margin: 0 }}
              >
                Curated by Jasmin Aziz ·{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  style={{ color: "#C8F04A", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
              <div className="flex items-center gap-5 flex-wrap justify-center">
                <a
                  href={WORK_WITH_ME_HREF}
                  {...(isExternalHref(WORK_WITH_ME_HREF)
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="font-body text-[13px] text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  Work with me →
                </a>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-[13px] text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  LinkedIn →
                </a>
                {SUBSTACK_LIVE && (
                  <a
                    href={SUBSTACK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-[13px] text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    Read the Substack →
                  </a>
                )}
              </div>
            </div>

            {/* Bottom row: legal + copyright */}
            <div className="flex items-center gap-4 sm:gap-5 flex-wrap justify-center sm:justify-end border-t border-white/5 pt-3">
              <Link
                to="/privacy-policy"
                className="font-body text-[12px] text-primary-foreground/40 hover:text-primary-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/terms-of-service"
                className="font-body text-[12px] text-primary-foreground/40 hover:text-primary-foreground transition-colors"
              >
                Terms
              </Link>
              <Link
                to="/cookie-policy"
                className="font-body text-[12px] text-primary-foreground/40 hover:text-primary-foreground transition-colors"
              >
                Cookies
              </Link>
              <span className="font-body text-[12px] text-primary-foreground/40">
                © 2026
              </span>
            </div>
          </div>

        </div>
      </footer>
      </div>
    </div>
  );
}
