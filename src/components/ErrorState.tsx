import { Link } from "react-router-dom";

export function ErrorState({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-muted-foreground text-lg mb-4">
        {message || "Couldn't load data right now. Try refreshing."}
      </p>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-muted-foreground text-lg mb-4">Nothing here yet.</p>
      <Link to="/" className="text-primary font-medium hover:underline">
        Back to Home
      </Link>
    </div>
  );
}
