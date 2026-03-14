import { STATUS_MAP, RELEVANCE_MAP } from "@/lib/sheets";

export function StatusBadge({ status }: { status: string }) {
  const config = STATUS_MAP[status];
  if (!config) return null;
  return (
    <span
      className="inline-block px-2.5 py-1 font-body text-[11px] font-semibold rounded-full uppercase tracking-[0.05em]"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {config.label}
    </span>
  );
}

export function RelevanceBadge({ level }: { level: string }) {
  const config = RELEVANCE_MAP[level];
  if (!config) return null;
  return (
    <span
      className="inline-block px-2.5 py-1 font-body text-[11px] font-semibold rounded-full uppercase tracking-[0.05em]"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {config.label}
    </span>
  );
}
