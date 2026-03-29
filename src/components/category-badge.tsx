import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants";
import type { Category } from "@/types";

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

export default function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const def = CATEGORIES.find((c) => c.value === category);
  if (!def) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0 font-mono text-[10px] uppercase tracking-widest border",
        def.color,
        className
      )}
      style={{ borderColor: "currentColor", background: "rgba(0,0,0,0.4)" }}
    >
      [{def.label}]
    </span>
  );
}
