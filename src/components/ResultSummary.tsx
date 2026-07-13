import { calculatePercentage } from "@/lib/percentage";

export function ResultSummary({
  correctCount,
  wrongCount,
  total,
}: {
  correctCount: number;
  wrongCount: number;
  total: number;
}) {
  const percentage = calculatePercentage(correctCount, total);

  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/70 p-8 text-center shadow-sm">
      <p className="text-sm font-medium uppercase tracking-wide text-foreground/60">Resultado</p>
      <p className="text-4xl font-bold text-primary-dark">{percentage}%</p>
      <p className="text-foreground/80">
        {correctCount} acerto{correctCount === 1 ? "" : "s"} · {wrongCount} erro{wrongCount === 1 ? "" : "s"} de{" "}
        {total} pergunta{total === 1 ? "" : "s"}
      </p>
    </div>
  );
}
