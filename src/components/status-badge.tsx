import { cn } from "@/lib/utils";
import { STATUSES } from "@/lib/constants";
import type { ChallengeStatus } from "@/types";

interface StatusBadgeProps {
  status: ChallengeStatus;
  className?: string;
}

const statusGlow: Record<ChallengeStatus, string> = {
  unsolved: "",
  partial:  "glow-orange",
  solved:   "glow-green",
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const def = STATUSES.find((s) => s.value === status);
  if (!def) return null;

  const dotColor =
    status === "solved"  ? "#3fb950" :
    status === "partial" ? "#ffa657" :
    "#1c2d44";

  const dotGlow =
    status === "solved"  ? "0 0 4px #3fb950" :
    status === "partial" ? "0 0 4px #ffa657" :
    "none";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest",
        def.color,
        className
      )}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: dotColor, boxShadow: dotGlow }}
      />
      {def.label}
    </span>
  );
}
