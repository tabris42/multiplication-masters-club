import { GameStats } from "@/lib/gameStore";

interface TableSelectorProps {
  selected: number[];
  onToggle: (n: number) => void;
  stats: GameStats;
}

export function TableSelector({ selected, onToggle, stats }: TableSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
      {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
        const isSelected = selected.includes(n);
        const progress = stats.tableProgress[n];
        const pct = progress ? Math.round((progress.correct / Math.max(progress.total, 1)) * 100) : 0;
        return (
          <button
            key={n}
            onClick={() => onToggle(n)}
            className={`relative flex flex-col items-center justify-center rounded-2xl p-3 font-bold text-lg transition-all duration-200 border-2 shadow-sm hover:scale-105 ${
              isSelected
                ? "gradient-primary text-primary-foreground border-transparent shadow-lg scale-105"
                : "bg-card text-foreground border-border hover:border-primary"
            }`}
          >
            <span className="text-xl">×{n}</span>
            {progress && (
              <div className="mt-1 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full gradient-success transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
