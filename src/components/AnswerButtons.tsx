interface AnswerButtonsProps {
  answered: boolean;
  selected: boolean | null;
  correctAnswer: boolean;
  onAnswer: (value: boolean) => void;
}

function buttonClasses({
  value,
  answered,
  selected,
  correctAnswer,
}: {
  value: boolean;
  answered: boolean;
  selected: boolean | null;
  correctAnswer: boolean;
}) {
  const base = "rounded-xl border-2 py-4 text-lg font-semibold transition";
  // Cores neutras (não verde/vermelho) antes de responder: acerto/erro só deve ficar
  // visualmente claro no feedback pós-resposta, sem sugerir de antemão qual botão é o certo.
  const neutral = value
    ? "border-primary text-primary-dark hover:bg-primary-light"
    : "border-foreground/40 text-foreground hover:bg-cream-dark";

  if (!answered) return `${base} ${neutral} cursor-pointer`;

  if (value === correctAnswer) {
    return `${base} border-success bg-success-light text-success`;
  }
  if (value === selected) {
    return `${base} border-error bg-error-light text-error`;
  }
  return `${base} border-cream-dark text-foreground/40`;
}

export function AnswerButtons({ answered, selected, correctAnswer, onAnswer }: AnswerButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        type="button"
        disabled={answered}
        onClick={() => onAnswer(true)}
        className={buttonClasses({ value: true, answered, selected, correctAnswer })}
      >
        Verdadeiro
      </button>
      <button
        type="button"
        disabled={answered}
        onClick={() => onAnswer(false)}
        className={buttonClasses({ value: false, answered, selected, correctAnswer })}
      >
        Falso
      </button>
    </div>
  );
}
