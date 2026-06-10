import { NavLink, useLocation, Link } from "react-router-dom";
import { ReactNode, useEffect, useState, useRef, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { FooterEmailCapture } from "@/components/FooterEmailCapture";
import { WORK_WITH_ME_HREF, SUBSTACK_LIVE, SUBSTACK_URL, LINKEDIN_URL } from "@/lib/links";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/my-stack", label: "My Stack" },
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
  const isBare = location.pathname === "/stack";
  const isMobile = useIsMobile();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const navContainerRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number; visible: boolean }>({ left: 0, width: 0, visible: false });

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

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

  if (isBare) {
    return <>{children}</>;
  }


  const navBg = isHome ? "#7B7FD4" : "#2D35C9";
  const textColor = "text-primary-foreground";
  const pillBg = "bg-white";
  const pillText = "text-primary";

  return (
    <div className="min-h-screen flex flex-col">
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{ backgroundColor: navBg }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-12">
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
                        className="font-body font-bold text-[11px] uppercase tracking-wide"
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
                        to="/subscribe"
                        onClick={() => setMobileOpen(false)}
                        className="font-body text-base font-medium px-4 py-3 rounded-lg transition-colors text-white/70 hover:text-white hover:bg-white/10"
                      >
                        Get the digest →
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
                    <div className="px-6 pb-8">
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
                        className={`relative z-10 font-body text-sm font-medium px-4 py-1.5 rounded-[20px] whitespace-nowrap transition-colors duration-150 ${
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

                {/* CTA cluster — secondary text links + primary pill */}
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-5">
                    {SUBSTACK_LIVE && (
                      <a
                        href={SUBSTACK_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`font-body text-sm font-medium whitespace-nowrap transition-colors text-primary-foreground/70 hover:text-primary-foreground`}
                      >
                        Read the Substack →
                      </a>
                    )}
                    <Link
                      to="/subscribe"
                      className={`font-body text-sm font-medium whitespace-nowrap transition-colors text-primary-foreground/70 hover:text-primary-foreground`}
                    >
                      Get the digest →
                    </Link>
                  </div>
                  <span aria-hidden="true" className="w-px h-5 bg-white/15" />
                  <a
                    href={WORK_WITH_ME_HREF}
                    {...(isExternalHref(WORK_WITH_ME_HREF)
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
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

      <main className="flex-1 pt-14 sm:pt-16">{children}</main>

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
  );
}
