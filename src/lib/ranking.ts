import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Level } from "@/types/quiz";

export interface RankingEntry {
  nickname: string;
  level: Level;
  score: number;
  total: number;
  percentage: number;
  date: string;
}

interface RankingRow {
  nickname: string;
  level: Level;
  score: number;
  total: number;
  percentage: number;
  played_at: string;
}

function rowToEntry(row: RankingRow): RankingEntry {
  return {
    nickname: row.nickname,
    level: row.level,
    score: row.score,
    total: row.total,
    percentage: row.percentage,
    date: row.played_at,
  };
}

export async function saveRankingEntry(entry: RankingEntry): Promise<{ error: string | null }> {
  const { error } = await supabase.from("rankings").insert({
    nickname: entry.nickname,
    level: entry.level,
    score: entry.score,
    total: entry.total,
    percentage: entry.percentage,
    played_at: entry.date,
  });
  return { error: error?.message ?? null };
}

export async function getRankingByLevel(level: Level): Promise<RankingEntry[]> {
  const { data, error } = await supabase
    .from("rankings")
    .select("nickname, level, score, total, percentage, played_at")
    .eq("level", level)
    .order("percentage", { ascending: false })
    .order("score", { ascending: false });

  if (error || !data) return [];
  return (data as RankingRow[]).map(rowToEntry);
}

interface UseRankingByLevelResult {
  entries: RankingEntry[];
  loading: boolean;
  error: string | null;
}

export function useRankingByLevel(level: Level): UseRankingByLevelResult {
  const [entries, setEntries] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("rankings")
        .select("nickname, level, score, total, percentage, played_at")
        .eq("level", level)
        .order("percentage", { ascending: false })
        .order("score", { ascending: false });

      if (cancelled) return;
      if (fetchError || !data) {
        setError("Não foi possível carregar o ranking.");
        setEntries([]);
      } else {
        setEntries((data as RankingRow[]).map(rowToEntry));
      }
      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [level]);

  return { entries, loading, error };
}
