import { calculatePercentage } from "@/lib/percentage";

export function ProgressBar({ current, total }: { current: number; total: number }) {
  const percentage = calculatePercentage(current, total);
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-foreground/70">
        Pergunta {current}/{total}
      </span>
      <div className="h-2 w-full overflow-hidden rounded-full bg-cream-dark">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
