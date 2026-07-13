"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useQuiz } from "@/hooks/useQuiz";
import { ProgressBar } from "@/components/ProgressBar";
import { QuestionCard } from "@/components/QuestionCard";
import { AnswerButtons } from "@/components/AnswerButtons";
import { FeedbackPanel } from "@/components/FeedbackPanel";
import { ResultSummary } from "@/components/ResultSummary";
import { NicknameForm } from "@/components/NicknameForm";
import { isLevel, LEVEL_LABELS, type Level } from "@/types/quiz";
import { saveRankingEntry } from "@/lib/ranking";
import { calculatePercentage } from "@/lib/percentage";

export default function QuizPage({ params }: { params: Promise<{ nivel: string }> }) {
  const { nivel } = use(params);

  if (!isLevel(nivel)) {
    return (
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-lg font-medium">Nível inválido.</p>
        <Link href="/" className="text-primary-dark underline underline-offset-4">
          Voltar à Home
        </Link>
      </main>
    );
  }

  return <Quiz level={nivel} />;
}

function Quiz({ level }: { level: Level }) {
  const { state, currentQuestion, totalQuestions, answer, next, restart } = useQuiz(level);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (state.status === "finished") {
    const percentage = calculatePercentage(state.correctCount, state.total);
    return (
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-6 py-12">
        <ResultSummary correctCount={state.correctCount} wrongCount={state.wrongCount} total={state.total} />

        <div className="rounded-2xl bg-white/70 p-6 shadow-sm">
          <NicknameForm
            saved={saved}
            saving={saving}
            error={saveError}
            onSave={async (nickname) => {
              setSaving(true);
              setSaveError(null);
              const { error } = await saveRankingEntry({
                nickname,
                level,
                score: state.correctCount,
                total: state.total,
                percentage,
                date: new Date().toISOString(),
              });
              setSaving(false);
              if (error) {
                setSaveError("Não foi possível salvar. Tente novamente.");
              } else {
                setSaved(true);
              }
            }}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setSaved(false);
              setSaveError(null);
              restart();
            }}
            className="flex-1 rounded-lg bg-primary px-5 py-3 font-medium text-white transition hover:bg-primary-dark"
          >
            Jogar novamente
          </button>
          <Link
            href="/"
            className="flex-1 rounded-lg border border-primary px-5 py-3 text-center font-medium text-primary-dark transition hover:bg-primary-light"
          >
            Voltar à Home
          </Link>
        </div>
      </main>
    );
  }

  if (state.status !== "playing" || !currentQuestion) {
    return (
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-6">
        <p className="text-foreground/60">Carregando perguntas...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-primary-dark">{LEVEL_LABELS[level]}</h1>
        <Link href="/" className="text-sm text-foreground/60 underline underline-offset-4">
          Sair
        </Link>
      </div>

      <ProgressBar current={state.index + 1} total={totalQuestions} />
      <QuestionCard statement={currentQuestion.statement} />
      <AnswerButtons
        answered={state.answered}
        selected={state.selected}
        correctAnswer={currentQuestion.answer}
        onAnswer={answer}
      />

      {state.answered && (
        <FeedbackPanel
          isCorrect={state.selected === currentQuestion.answer}
          correctAnswer={currentQuestion.answer}
          explanation={currentQuestion.explanation}
          isLast={state.index + 1 === totalQuestions}
          onNext={next}
        />
      )}
    </main>
  );
}
