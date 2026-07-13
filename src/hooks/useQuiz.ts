"use client";

import { useCallback, useEffect, useReducer } from "react";
import { getQuestionsByLevel } from "@/lib/questions";
import type { Level, Question } from "@/types/quiz";

interface LoadingState {
  status: "loading";
}

interface PlayingState {
  status: "playing";
  questions: Question[];
  index: number;
  answered: boolean;
  selected: boolean | null;
  correctCount: number;
  wrongCount: number;
}

interface FinishedState {
  status: "finished";
  total: number;
  correctCount: number;
  wrongCount: number;
}

type QuizState = LoadingState | PlayingState | FinishedState;

type QuizAction =
  | { type: "ANSWER"; value: boolean }
  | { type: "NEXT" }
  | { type: "RESTART"; questions: Question[] };

function reducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "ANSWER": {
      if (state.status !== "playing" || state.answered) return state;
      const isCorrect = action.value === state.questions[state.index].answer;
      return {
        ...state,
        answered: true,
        selected: action.value,
        correctCount: state.correctCount + (isCorrect ? 1 : 0),
        wrongCount: state.wrongCount + (isCorrect ? 0 : 1),
      };
    }
    case "NEXT": {
      if (state.status !== "playing" || !state.answered) return state;
      const nextIndex = state.index + 1;
      if (nextIndex < state.questions.length) {
        return {
          ...state,
          index: nextIndex,
          answered: false,
          selected: null,
        };
      }
      return {
        status: "finished",
        total: state.questions.length,
        correctCount: state.correctCount,
        wrongCount: state.wrongCount,
      };
    }
    case "RESTART":
      return {
        status: "playing",
        questions: action.questions,
        index: 0,
        answered: false,
        selected: null,
        correctCount: 0,
        wrongCount: 0,
      };
    default:
      return state;
  }
}

export function useQuiz(level: Level) {
  const [state, dispatch] = useReducer(reducer, { status: "loading" } as QuizState);

  const load = useCallback(() => dispatch({ type: "RESTART", questions: getQuestionsByLevel(level) }), [level]);

  // As perguntas são embaralhadas com Math.random, então só podem ser carregadas
  // depois da montagem no cliente — fazer isso durante a renderização causaria
  // divergência entre o HTML gerado no servidor e a hidratação no cliente.
  useEffect(() => {
    load();
  }, [load]);

  const answer = useCallback((value: boolean) => dispatch({ type: "ANSWER", value }), []);
  const next = useCallback(() => dispatch({ type: "NEXT" }), []);

  const currentQuestion = state.status === "playing" ? state.questions[state.index] : null;
  const totalQuestions =
    state.status === "playing" ? state.questions.length : state.status === "finished" ? state.total : 0;

  return { state, currentQuestion, totalQuestions, answer, next, restart: load };
}
