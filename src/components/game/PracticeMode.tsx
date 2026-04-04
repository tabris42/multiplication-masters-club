import { useState, useCallback, useEffect, useRef } from "react";
import { generateQuestion, Question } from "@/lib/gameStore";
import { StatsBar } from "./StatsBar";
import { GameStats } from "@/lib/gameStore";
import { ArrowLeft, Check, X } from "lucide-react";

interface Props {
  tables: number[];
  stats: GameStats;
  onAnswer: (table: number, correct: boolean) => void;
  onBack: () => void;
}

export function PracticeMode({ tables, stats, onAnswer, onBack }: Props) {
  const [question, setQuestion] = useState<Question>(() => generateQuestion(tables));
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [question]);

  const handleSubmit = useCallback(() => {
    if (!input.trim()) return;
    const answer = parseInt(input);
    const correct = answer === question.answer;
    setFeedback(correct ? "correct" : "wrong");
    onAnswer(question.a, correct);
    setTimeout(() => {
      setFeedback(null);
      setInput("");
      setQuestion(generateQuestion(tables));
    }, correct ? 800 : 1500);
  }, [input, question, tables, onAnswer]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <div className="flex items-center w-full justify-between">
        <button onClick={onBack} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" /> Volver
        </button>
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Práctica</span>
      </div>

      <StatsBar stats={stats} />

      <div
        className={`w-full rounded-3xl p-8 text-center shadow-xl transition-all duration-300 ${
          feedback === "correct"
            ? "gradient-success animate-bounce-in"
            : feedback === "wrong"
            ? "bg-destructive animate-shake"
            : "bg-card border-2 border-border"
        }`}
      >
        <p className={`text-5xl font-black mb-2 ${feedback ? "text-primary-foreground" : "text-foreground"}`}>
          {question.a} × {question.b}
        </p>
        {feedback === "correct" && (
          <div className="flex items-center justify-center gap-2 text-primary-foreground animate-bounce-in">
            <Check className="h-8 w-8" /> <span className="text-2xl font-bold">¡Correcto! 🎉</span>
          </div>
        )}
        {feedback === "wrong" && (
          <div className="flex flex-col items-center gap-1 text-destructive-foreground">
            <div className="flex items-center gap-2">
              <X className="h-8 w-8" /> <span className="text-2xl font-bold">Incorrecto</span>
            </div>
            <span className="text-lg">La respuesta es <strong>{question.answer}</strong></span>
          </div>
        )}
      </div>

      {!feedback && (
        <form
          onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
          className="flex gap-3 w-full"
        >
          <input
            ref={inputRef}
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-2xl border-2 border-border bg-card px-6 py-4 text-2xl font-bold text-center text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring transition-all"
            placeholder="?"
            autoFocus
          />
          <button
            type="submit"
            className="gradient-primary rounded-2xl px-8 py-4 text-primary-foreground font-bold text-xl shadow-lg hover:scale-105 transition-transform animate-pulse-glow"
          >
            ✓
          </button>
        </form>
      )}
    </div>
  );
}
