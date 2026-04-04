import { useState, useCallback } from "react";

export type GameMode = "practice" | "timeAttack" | "multipleChoice";
export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  a: number;
  b: number;
  answer: number;
  options?: number[];
}

export interface GameStats {
  totalCorrect: number;
  totalWrong: number;
  currentStreak: number;
  bestStreak: number;
  stars: number;
  medals: { gold: number; silver: number; bronze: number };
  tableProgress: Record<number, { correct: number; total: number }>;
}

const STORAGE_KEY = "multiTablas_stats";

function loadStats(): GameStats {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    totalCorrect: 0,
    totalWrong: 0,
    currentStreak: 0,
    bestStreak: 0,
    stars: 0,
    medals: { gold: 0, silver: 0, bronze: 0 },
    tableProgress: {},
  };
}

function saveStats(stats: GameStats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function generateQuestion(tables: number[]): Question {
  const a = tables[Math.floor(Math.random() * tables.length)];
  const b = Math.floor(Math.random() * 12) + 1;
  return { a, b, answer: a * b };
}

export function generateMultipleChoiceQuestion(tables: number[]): Question {
  const q = generateQuestion(tables);
  const options = new Set<number>([q.answer]);
  while (options.size < 4) {
    const offset = Math.floor(Math.random() * 20) - 10;
    const wrong = q.answer + offset;
    if (wrong > 0 && wrong !== q.answer) options.add(wrong);
  }
  return { ...q, options: shuffle([...options]) };
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function useGameStats() {
  const [stats, setStats] = useState<GameStats>(loadStats);

  const recordAnswer = useCallback((table: number, correct: boolean) => {
    setStats((prev) => {
      const next = { ...prev };
      const tp = { ...(prev.tableProgress[table] || { correct: 0, total: 0 }) };
      tp.total++;
      if (correct) {
        tp.correct++;
        next.totalCorrect++;
        next.currentStreak++;
        if (next.currentStreak > next.bestStreak) next.bestStreak = next.currentStreak;
        // Stars: every 5 correct
        if (next.totalCorrect % 5 === 0) next.stars++;
        // Medals
        if (next.currentStreak === 10) next.medals = { ...next.medals, bronze: next.medals.bronze + 1 };
        if (next.currentStreak === 25) next.medals = { ...next.medals, silver: next.medals.silver + 1 };
        if (next.currentStreak === 50) next.medals = { ...next.medals, gold: next.medals.gold + 1 };
      } else {
        next.totalWrong++;
        next.currentStreak = 0;
      }
      next.tableProgress = { ...prev.tableProgress, [table]: tp };
      saveStats(next);
      return next;
    });
  }, []);

  const resetStats = useCallback(() => {
    const fresh: GameStats = {
      totalCorrect: 0, totalWrong: 0, currentStreak: 0, bestStreak: 0, stars: 0,
      medals: { gold: 0, silver: 0, bronze: 0 }, tableProgress: {},
    };
    saveStats(fresh);
    setStats(fresh);
  }, []);

  return { stats, recordAnswer, resetStats };
}
