import Link from "next/link";
import { LevelCard } from "@/components/LevelCard";
import { LEVELS } from "@/types/quiz";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold text-primary-dark sm:text-4xl">Quiz Claude Code</h1>
        <p className="text-foreground/70">
          Teste seus conhecimentos sobre o Claude Code com perguntas de Verdadeiro ou Falso. Escolha um
          nível para começar.
        </p>
      </div>

      <div className="grid w-full gap-4 sm:grid-cols-3">
        {LEVELS.map((level) => (
          <LevelCard key={level} level={level} />
        ))}
      </div>

      <Link href="/ranking" className="text-sm font-medium text-primary-dark underline underline-offset-4">
        Ver melhores pontuações
      </Link>
    </main>
  );
}
