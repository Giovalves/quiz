export type Level = "iniciante" | "intermediario" | "avancado";

export type Category = "negocios" | "comandos" | "avancado" | "integracoes";

export interface Question {
  id: string;
  level: Level;
  category: Category;
  statement: string;
  answer: boolean;
  explanation: string;
}

export const LEVELS: Level[] = ["iniciante", "intermediario", "avancado"];

export const LEVEL_LABELS: Record<Level, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

export function isLevel(value: string): value is Level {
  return LEVELS.includes(value as Level);
}
