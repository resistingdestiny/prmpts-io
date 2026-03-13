import { cn } from "@/lib/cn";
import type { DifficultyLevel } from "@/types";

const labels: Record<DifficultyLevel, string> = {
  instant: "Instant",
  "light-setup": "Light setup",
  "technical-setup": "Technical setup",
};

const styles: Record<DifficultyLevel, string> = {
  instant: "text-emerald-600 bg-emerald-50",
  "light-setup": "text-amber-600 bg-amber-50",
  "technical-setup": "text-orange-600 bg-orange-50",
};

type SetupBadgeProps = {
  level: DifficultyLevel;
  className?: string;
};

export function SetupBadge({ level, className }: SetupBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        styles[level],
        className,
      )}
    >
      {labels[level]}
    </span>
  );
}
