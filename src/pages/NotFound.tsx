import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

/**
 * Rebuilt on the locked palette, 29 Aug 2026, design audit fix 3.
 *
 * The previous version was untouched shadcn boilerplate: it put `bg-muted` on
 * the page ground and `text-muted-foreground` on the message. Both tokens
 * resolve to the same HSL triple (index.css:28-29), so the message rendered at
 * 1.00:1 against its own background and was literally invisible.
 *
 * The tokens themselves are deliberately NOT changed here. `--muted-foreground`
 * is read as text by Learning.tsx and ErrorState.tsx, so darkening it restyles
 * those two components, and the muted colour is one of the open contrast
 * rulings. Using the page ground and ink tokens fixes this page on its own.
 *
 * Colours are tokens, not inline hex: background, foreground and primary map to
 * cream, ink and cobalt in index.css. Strings are unchanged.
 */
const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    // min-h-[60vh], not min-h-screen: the page renders inside Layout's
    // #app-scroll pane, so a full viewport height overflows the pane by the
    // height of the nav and introduces a scrollbar on an empty page.
    <div className="bg-background flex min-h-[60vh] items-center justify-center px-6 py-24">
      <div className="text-center">
        <h1 className="font-heading font-bold text-foreground mb-4 text-5xl sm:text-6xl">404</h1>
        <p className="font-body text-foreground mb-6 text-lg sm:text-xl">Oops! Page not found</p>
        <Link
          to="/"
          className="font-body text-primary font-medium underline underline-offset-2 hover:no-underline"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
