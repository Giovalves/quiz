import Link from "next/link";
import type { Level } from "@/types/quiz";
import { LEVEL_LABELS } from "@/types/quiz";

const LEVEL_DESCRIPTIONS: Record<Level, string> = {
  iniciante: "O que é Claude Code, para que serve e comandos básicos.",
  intermediario: "Comandos, CLI e integrações do dia a dia.",
  avancado: "MCP, hooks, subagents, skills e o ecossistema avançado.",
};

export function LevelCard({ level }: { level: Level }) {
  return (
    <Link
      href={`/quiz/${level}`}
      className="flex flex-col gap-2 rounded-2xl border border-primary-light bg-white/60 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:border-primary"
    >
      <span className="text-xl font-semibold text-primary-dark">{LEVEL_LABELS[level]}</span>
      <span className="text-sm text-foreground/70">{LEVEL_DESCRIPTIONS[level]}</span>
    </Link>
  );
}
