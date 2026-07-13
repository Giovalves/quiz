interface FeedbackPanelProps {
  isCorrect: boolean;
  correctAnswer: boolean;
  explanation: string;
  isLast: boolean;
  onNext: () => void;
}

export function FeedbackPanel({ isCorrect, correctAnswer, explanation, isLast, onNext }: FeedbackPanelProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col gap-3 rounded-2xl border p-5 ${
        isCorrect ? "border-success bg-success-light" : "border-error bg-error-light"
      }`}
    >
      {isCorrect ? (
        <p className="font-semibold text-success">Você acertou!</p>
      ) : (
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-error">
            Você errou. A resposta correta é: {correctAnswer ? "Verdadeiro" : "Falso"}.
          </p>
          <p className="text-sm text-foreground/80">{explanation}</p>
        </div>
      )}
      <button
        type="button"
        onClick={onNext}
        className="self-start rounded-lg bg-primary px-5 py-2 font-medium text-white transition hover:bg-primary-dark"
      >
        {isLast ? "Ver resultado" : "Próxima"}
      </button>
    </div>
  );
}
