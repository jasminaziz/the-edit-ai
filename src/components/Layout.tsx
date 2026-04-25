import { NavLink, useLocation, Link } from "react-router-dom";
import { ReactNode, useEffect, useState, useRef, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { FooterEmailCapture } from "@/components/FooterEmailCapture";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/my-stack", label: "My Stack" },
  { to: "/tools", label: "Tools" },
  { to: "/design-kit", label: "Design" },
  { to: "/learning", label: "Learning" },
  { to: "/whats-new", label: "What's New" },
];

const WORK_WITH_ME_URL = "https://jasminaziz.co.uk";
const CONTACT_EMAIL = "hello@jasminaziz.co.uk";

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isHome = location.pathname === "/";
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
                    <button className="p-2 text-primary-foreground" aria-label="Open menu">
                      <Menu className="h-5 w-5" />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[260px] p-0 flex flex-col" style={{ backgroundColor: "#2D35C9" }}>
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
                      <a
                        href="https://jasminaziz.substack.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMobileOpen(false)}
                        className="font-body text-base font-medium px-4 py-3 rounded-lg transition-colors text-white/70 hover:text-white hover:bg-white/10"
                      >
                        Read the Substack →
                      </a>
                    </div>
                    <div className="px-6 pb-8">
                      <a
                        href={WORK_WITH_ME_URL}
                        target="_blank"
                        rel="noopener noreferrer"
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
                    <a
                      href="https://jasminaziz.substack.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`font-body text-sm font-medium whitespace-nowrap transition-colors text-primary-foreground/70 hover:text-primary-foreground`}
                    >
                      Read the Substack →
                    </a>
                    <Link
                      to="/subscribe"
                      className={`font-body text-sm font-medium whitespace-nowrap transition-colors text-primary-foreground/70 hover:text-primary-foreground`}
                    >
                      Get the digest →
                    </Link>
                  </div>
                  <span aria-hidden="true" className="w-px h-5 bg-white/15" />
                  <a
                    href={WORK_WITH_ME_URL}
                    target="_blank"
                    rel="noopener noreferrer"
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
          <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
              <span className="font-body font-semibold text-[13px] text-primary-foreground">
                The Edit — curated by Jasmin Aziz
              </span>
              <span
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  width: 1,
                  height: 14,
                  backgroundColor: "rgba(255,255,255,0.2)",
                }}
              />
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-body font-semibold text-[13px] no-underline hover:underline transition-colors text-primary-foreground"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
              <a
                href={WORK_WITH_ME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[12px] sm:text-[13px] text-primary-foreground/40 hover:text-primary-foreground transition-colors"
              >
                Work with me →
              </a>
              <a
                href="https://jasminaziz.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[12px] sm:text-[13px] text-primary-foreground/40 hover:text-primary-foreground transition-colors"
              >
                Read the Substack →
              </a>
              <span className="font-body text-[12px] sm:text-[13px] text-primary-foreground/40">
                © 2026
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
