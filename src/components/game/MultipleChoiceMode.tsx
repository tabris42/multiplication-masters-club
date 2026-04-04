import { useState, useCallback } from "react";
import { generateMultipleChoiceQuestion, Question } from "@/lib/gameStore";
import { StatsBar } from "./StatsBar";
import { GameStats } from "@/lib/gameStore";
import { ArrowLeft } from "lucide-react";

interface Props {
  tables: number[];
  stats: GameStats;
  onAnswer: (table: number, correct: boolean) => void;
  onBack: () => void;
}

export function MultipleChoiceMode({ tables, stats, onAnswer, onBack }: Props) {
  const [question, setQuestion] = useState<Question>(() => generateMultipleChoiceQuestion(tables));
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const handleSelect = useCallback((option: number) => {
    if (feedback) return;
    setSelected(option);
    const correct = option === question.answer;
    setFeedback(correct ? "correct" : "wrong");
    onAnswer(question.a, correct);
    setTimeout(() => {
      setFeedback(null);
      setSelected(null);
      setQuestion(generateMultipleChoiceQuestion(tables));
    }, correct ? 800 : 1500);
  }, [feedback, question, tables, onAnswer]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <div className="flex items-center w-full justify-between">
        <button onClick={onBack} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" /> Volver
        </button>
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Opciones</span>
      </div>

      <StatsBar stats={stats} />

      <div className="w-full rounded-3xl bg-card border-2 border-border p-8 text-center shadow-xl">
        <p className="text-5xl font-black text-foreground">{question.a} × {question.b}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        {question.options?.map((opt) => {
          let style = "bg-card border-2 border-border text-foreground hover:border-primary hover:scale-105";
          if (selected !== null) {
            if (opt === question.answer) style = "gradient-success text-primary-foreground scale-105 border-2 border-transparent";
            else if (opt === selected) style = "bg-destructive text-destructive-foreground animate-shake border-2 border-transparent";
            else style = "bg-muted text-muted-foreground border-2 border-transparent opacity-50";
          }
          return (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              disabled={feedback !== null}
              className={`rounded-2xl p-5 text-2xl font-bold shadow-md transition-all duration-200 ${style}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {feedback === "correct" && (
        <p className="text-2xl font-bold text-success animate-bounce-in">¡Genial! 🌟</p>
      )}
      {feedback === "wrong" && (
        <p className="text-lg font-semibold text-destructive">
          Era <strong>{question.answer}</strong> 💪 ¡Sigue intentando!
        </p>
      )}
    </div>
  );
}
