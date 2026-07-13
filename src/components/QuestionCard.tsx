export function QuestionCard({ statement }: { statement: string }) {
  return (
    <div className="rounded-2xl bg-white/70 p-6 shadow-sm sm:p-8">
      <p className="text-lg font-medium leading-relaxed sm:text-xl">{statement}</p>
    </div>
  );
}
