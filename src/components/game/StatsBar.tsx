import { GameStats } from "@/lib/gameStore";
import { Flame, Star, Trophy } from "lucide-react";

interface StatsBarProps {
  stats: GameStats;
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="flex items-center gap-4 flex-wrap justify-center">
      <div className="flex items-center gap-1.5 rounded-full bg-card px-4 py-2 shadow-md border border-border">
        <Flame className="h-5 w-5 text-streak" />
        <span className="font-bold text-foreground">{stats.currentStreak}</span>
      </div>
      <div className="flex items-center gap-1.5 rounded-full bg-card px-4 py-2 shadow-md border border-border">
        <Star className="h-5 w-5 text-star fill-star" />
        <span className="font-bold text-foreground">{stats.stars}</span>
      </div>
      <div className="flex items-center gap-1.5 rounded-full bg-card px-4 py-2 shadow-md border border-border">
        <Trophy className="h-5 w-5 text-primary" />
        <span className="font-bold text-foreground">
          🥇{stats.medals.gold} 🥈{stats.medals.silver} 🥉{stats.medals.bronze}
        </span>
      </div>
    </div>
  );
}
