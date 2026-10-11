import { Loader2 } from "lucide-react";

/**
 * At least a screen tall, with the spinner where it always sat (80px down).
 *
 * Since 11 Oct 2026. Without the height, a page with a short header (/ai-news,
 * /my-stack) pulled the footer up into view while its Sheet data loaded, and
 * when the rows arrived the content pushed the footer back off the screen.
 * That move is a layout shift: 0.332 on /ai-news and 0.111 on /my-stack,
 * measured cold at 412px, and identical with the prerendered HTML stripped
 * out, so it predates the prerender. /tools never showed it only because its
 * own header is tall enough to keep the footer below the screen anyway.
 */
export function LoadingSpinner() {
  return (
    <div className="flex items-start justify-center py-20 min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
