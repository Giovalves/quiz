import type { RankingEntry } from "@/lib/ranking";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

export function RankingList({ entries }: { entries: RankingEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="rounded-2xl bg-white/70 p-6 text-center text-foreground/70 shadow-sm">
        Ainda não há pontuações salvas para este nível.
      </p>
    );
  }

  return (
    <ol className="flex flex-col gap-2">
      {entries.map((entry, index) => (
        <li
          key={`${entry.nickname}-${entry.date}-${index}`}
          className="flex items-center justify-between gap-4 rounded-xl bg-white/70 px-4 py-3 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span className="w-6 text-center font-semibold text-primary-dark">{index + 1}º</span>
            <div className="flex flex-col">
              <span className="font-medium">{entry.nickname}</span>
              <span className="text-xs text-foreground/60">{formatDate(entry.date)}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-semibold text-primary-dark">{entry.percentage}%</span>
            <span className="block text-xs text-foreground/60">
              {entry.score}/{entry.total}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}
