"use client";

import { useState } from "react";
import Link from "next/link";
import { RankingList } from "@/components/RankingList";
import { useRankingByLevel } from "@/lib/ranking";
import { LEVELS, LEVEL_LABELS, type Level } from "@/types/quiz";

export default function RankingPage() {
  const [level, setLevel] = useState<Level>("iniciante");
  const { entries, loading, error } = useRankingByLevel(level);

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary-dark">Melhores pontuações</h1>
        <Link href="/" className="text-sm text-foreground/60 underline underline-offset-4">
          Voltar à Home
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {LEVELS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setLevel(option)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              level === option
                ? "bg-primary text-white"
                : "bg-white/70 text-foreground/70 hover:bg-primary-light"
            }`}
          >
            {LEVEL_LABELS[option]}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="rounded-2xl bg-white/70 p-6 text-center text-foreground/70 shadow-sm">Carregando...</p>
      ) : error ? (
        <p className="rounded-2xl bg-error-light p-6 text-center text-error shadow-sm">{error}</p>
      ) : (
        <RankingList entries={entries} />
      )}
    </main>
  );
}
