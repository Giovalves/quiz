import questionsData from "@/data/questions.json";
import type { Level, Question } from "@/types/quiz";

const ALL_QUESTIONS = questionsData as Question[];

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function getQuestionsByLevel(level: Level): Question[] {
  return shuffle(ALL_QUESTIONS.filter((question) => question.level === level));
}
