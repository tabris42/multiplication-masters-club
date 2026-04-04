import { useState, useCallback } from "react";
import { useGameStats, GameMode } from "@/lib/gameStore";
import { TableSelector } from "@/components/game/TableSelector";
import { StatsBar } from "@/components/game/StatsBar";
import { PracticeMode } from "@/components/game/PracticeMode";
import { MultipleChoiceMode } from "@/components/game/MultipleChoiceMode";
import { TimeAttackMode } from "@/components/game/TimeAttackMode";
import { BookOpen, Zap, ListChecks, BarChart3, RotateCcw } from "lucide-react";

type View = "home" | "playing";

const MODES: { id: GameMode; label: string; desc: string; icon: React.ReactNode; emoji: string }[] = [
  { id: "practice", label: "Práctica", desc: "Escribe la respuesta", icon: <BookOpen className="h-6 w-6" />, emoji: "✏️" },
  { id: "multipleChoice", label: "Opciones", desc: "Elige la correcta", icon: <ListChecks className="h-6 w-6" />, emoji: "🎯" },
  { id: "timeAttack", label: "Contrarreloj", desc: "60 segundos", icon: <Zap className="h-6 w-6" />, emoji: "⚡" },
];

export default function Index() {
  const { stats, recordAnswer, resetStats } = useGameStats();
  const [selectedTables, setSelectedTables] = useState<number[]>([2]);
  const [mode, setMode] = useState<GameMode>("practice");
  const [view, setView] = useState<View>("home");

  const toggleTable = useCallback((n: number) => {
    setSelectedTables((prev) =>
      prev.includes(n) ? (prev.length > 1 ? prev.filter((t) => t !== n) : prev) : [...prev, n]
    );
  }, []);

  const selectAll = () => setSelectedTables(Array.from({ length: 12 }, (_, i) => i + 1));

  const startGame = (m: GameMode) => {
    setMode(m);
    setView("playing");
  };

  if (view === "playing") {
    const commonProps = {
      tables: selectedTables,
      stats,
      onAnswer: recordAnswer,
      onBack: () => setView("home"),
    };
    if (mode === "practice") return <div className="min-h-screen p-4 pt-8"><PracticeMode {...commonProps} /></div>;
    if (mode === "multipleChoice") return <div className="min-h-screen p-4 pt-8"><MultipleChoiceMode {...commonProps} /></div>;
    return <div className="min-h-screen p-4 pt-8"><TimeAttackMode {...commonProps} /></div>;
  }

  const accuracy = stats.totalCorrect + stats.totalWrong > 0
    ? Math.round((stats.totalCorrect / (stats.totalCorrect + stats.totalWrong)) * 100)
    : 0;

  return (
    <div className="min-h-screen p-4 pb-12">
      <div className="mx-auto max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 pt-6">
          <h1 className="text-4xl sm:text-5xl font-black">
            <span className="text-gradient">MultiTablas</span> 🧮
          </h1>
          <p className="text-muted-foreground text-lg">¡Domina las tablas de multiplicar!</p>
        </div>

        {/* Stats */}
        <StatsBar stats={stats} />

        {/* Quick Stats Card */}
        <div className="rounded-3xl bg-card border-2 border-border p-5 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-5 w-5 text-secondary" />
            <h3 className="font-bold text-foreground">Tu progreso</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-black text-success">{stats.totalCorrect}</p>
              <p className="text-xs text-muted-foreground">Correctas</p>
            </div>
            <div>
              <p className="text-2xl font-black text-destructive">{stats.totalWrong}</p>
              <p className="text-xs text-muted-foreground">Incorrectas</p>
            </div>
            <div>
              <p className="text-2xl font-black text-secondary">{accuracy}%</p>
              <p className="text-xs text-muted-foreground">Precisión</p>
            </div>
          </div>
          <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full gradient-success rounded-full transition-all duration-500" style={{ width: `${accuracy}%` }} />
          </div>
        </div>

        {/* Table Selection */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-foreground">Elige tus tablas</h2>
            <button onClick={selectAll} className="text-sm font-semibold text-primary hover:underline">
              Todas
            </button>
          </div>
          <TableSelector selected={selectedTables} onToggle={toggleTable} stats={stats} />
        </div>

        {/* Game Modes */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-3">Modo de juego</h2>
          <div className="grid gap-3">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => startGame(m.id)}
                className="flex items-center gap-4 rounded-2xl bg-card border-2 border-border p-5 shadow-md hover:border-primary hover:scale-[1.02] transition-all duration-200 text-left group"
              >
                <div className="text-3xl group-hover:animate-bounce-in">{m.emoji}</div>
                <div className="flex-1">
                  <p className="font-bold text-lg text-foreground">{m.label}</p>
                  <p className="text-sm text-muted-foreground">{m.desc}</p>
                </div>
                <div className="text-muted-foreground group-hover:text-primary transition-colors">
                  {m.icon}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Best Streak */}
        {stats.bestStreak > 0 && (
          <div className="text-center rounded-2xl gradient-warning p-4 shadow-md">
            <p className="text-warning-foreground font-bold text-lg">
              🔥 Mejor racha: <span className="text-2xl">{stats.bestStreak}</span>
            </p>
          </div>
        )}

        {/* Reset */}
        <div className="text-center">
          <button
            onClick={() => { if (confirm("¿Borrar todo el progreso?")) resetStats(); }}
            className="flex items-center gap-2 mx-auto text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            <RotateCcw className="h-4 w-4" /> Reiniciar progreso
          </button>
        </div>
      </div>
    </div>
  );
}
