import { NavLink, useLocation, Link } from "react-router-dom";
import { ReactNode, useEffect, useState, useRef, useCallback } from "react";
import { Menu, X, ArrowUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { FooterEmailCapture } from "@/components/FooterEmailCapture";
import { WORK_WITH_ME_HREF, SUBSTACK_LIVE, SUBSTACK_URL, LINKEDIN_URL } from "@/lib/links";

/**
 * My Stack is deliberately not in this list. It is a button in the CTA cluster
 * instead, ruled 4 Sep 2026, which moves Tools to second without touching the
 * order: the directory is the reason the site exists and it was sitting third,
 * behind a page about Jasmin's own toolkit.
 *
 * The sliding active pill handles its absence already. `updatePill` hides the
 * pill when no item matches the path, so /my-stack simply shows no tab as
 * active, which is correct now that it is not a tab.
 */
const navItems = [
  { to: "/", label: "Home" },
  { to: "/tools", label: "Tools" },
  { to: "/design-kit", label: "Design" },
  { to: "/learning", label: "Learning" },
  { to: "/ai-news", label: "AI News" },
];

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

  const updatePill = useCallback(() => {
    const activeItem = navItems.find((item) =>
      item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to)
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
    window.addEventListener("resize", updatePill);
    return () => window.removeEventListener("resize", updatePill);
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
      <nav
        className="shrink-0 z-50"
        style={{ backgroundColor: navBg }}
      >
        {/* lg:px-8 xl:px-12, design audit fix 5: between 1024 and 1279 the
            desktop nav needs every pixel it can get, so the gutter tightens
            there and returns to 48px at xl. At 1280 and up this renders exactly
            as it did before. */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-12 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-14 sm:h-16">
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
                    <div className="flex flex-col pt-16 px-6 gap-1 flex-1">
                      {navItems.map((item) => {
                        const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
                        return (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => setMobileOpen(false)}
                            className={`font-body text-base font-medium px-4 py-3 rounded-lg transition-colors ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "text-white/70 hover:text-white hover:bg-white/10"
                            }`}
                          >
                          {item.label}
                          </NavLink>
                        );
                      })}
                      <Link
                        to="/policy-template"
                        onClick={() => setMobileOpen(false)}
                        className="font-body text-base font-medium px-4 py-3 rounded-lg transition-colors text-white/70 hover:text-white hover:bg-white/10"
                      >
                        Get the template →
                      </Link>
                      {SUBSTACK_LIVE && (
                        <a
                          href={SUBSTACK_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setMobileOpen(false)}
                          className="font-body text-base font-medium px-4 py-3 rounded-lg transition-colors text-white/70 hover:text-white hover:bg-white/10"
                        >
                          Read the Substack →
                        </a>
                      )}
                    </div>
                    {/* The drawer's foot mirrors the desktop bar's ranking:
                        secondary button, then primary CTA. My Stack is a button
                        here rather than a plain row for the same reason it is
                        one on desktop, so the two do not describe it
                        differently. Full width because everything in this
                        drawer is, and the desktop button's px-4 would read as a
                        stray tab in a vertical stack. */}
                    <div className="px-6 pb-8 flex flex-col gap-3">
                      <Link
                        to="/my-stack"
                        onClick={() => setMobileOpen(false)}
                        className="nav-stack-btn block w-full text-center font-body text-base font-medium rounded-full py-3"
                      >
                        My Stack
                      </Link>
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
                    const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        ref={(el) => { navRefs.current[item.to] = el; }}
                        onMouseEnter={() => setHoveredItem(item.to)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={`relative z-10 font-body text-sm font-medium px-3 xl:px-4 py-1.5 rounded-[20px] whitespace-nowrap transition-colors duration-150 ${
                          isActive
                            ? pillText
                            : `${textColor} hover:bg-white/[0.15]`
                        }`}
                      >
                        {item.label}
                      </NavLink>
                    );
                  })}
                </div>

                {/* CTA cluster — secondary text link, secondary button, primary pill */}
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-5">
                    {/* "Read the Substack →" is deliberately absent from the
                        DESKTOP bar and deliberately still present in the mobile
                        drawer. Ruled 4 Sep 2026, and the asymmetry is the
                        decision rather than an oversight: do not "finish the
                        job" by removing it from the drawer too.

                        It came out here to make room. At 1040px, the tightest
                        width the desktop nav renders at, there were 34px
                        between the nav items and this cluster, and the My Stack
                        button needs about 50 more than removing the My Stack
                        text link gives back. Dropping this link takes the slack
                        to roughly 145px. The drawer is a vertical list with no
                        width pressure at all, so the same argument does not
                        apply there.

                        Nothing became unreachable: the Substack is in the
                        footer on every route and linked in prose on
                        /policy-template. */}
                    <Link
                      to="/policy-template"
                      className={`font-body text-sm font-medium whitespace-nowrap transition-colors text-primary-foreground/70 hover:text-primary-foreground`}
                    >
                      Get the template →
                    </Link>
                  </div>
                  {/* Secondary button. Colour, border and the reasoning behind
                      both live in index.css under .nav-stack-btn. Size is one
                      step down from "Work with me" (px-4 py-1.5 against px-5
                      py-2) and the weight is medium against semibold, so the
                      ranking survives even where colour does not carry it. */}
                  <Link
                    to="/my-stack"
                    className="nav-stack-btn font-body text-sm font-medium px-4 py-1.5 rounded-full whitespace-nowrap"
                  >
                    My Stack
                  </Link>
                  <span aria-hidden="true" className="w-px h-5 bg-white/15" />
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
          </div>
        </div>
      </nav>

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
