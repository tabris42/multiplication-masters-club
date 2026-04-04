import { useState, useCallback, useEffect, useRef } from "react";
import { generateMultipleChoiceQuestion, Question } from "@/lib/gameStore";
import { GameStats } from "@/lib/gameStore";
import { ArrowLeft, Clock, Zap } from "lucide-react";

interface Props {
  tables: number[];
  stats: GameStats;
  onAnswer: (table: number, correct: boolean) => void;
  onBack: () => void;
}

const GAME_DURATION = 60;

export function TimeAttackMode({ tables, stats, onAnswer, onBack }: Props) {
  const [phase, setPhase] = useState<"ready" | "playing" | "done">("ready");
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<Question>(() => generateMultipleChoiceQuestion(tables));
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (phase === "playing") {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setPhase("done");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const handleSelect = useCallback((opt: number) => {
    if (feedback || phase !== "playing") return;
    const correct = opt === question.answer;
    setFeedback(correct ? "correct" : "wrong");
    onAnswer(question.a, correct);
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      setFeedback(null);
      setQuestion(generateMultipleChoiceQuestion(tables));
    }, 400);
  }, [feedback, phase, question, tables, onAnswer]);

  const startGame = () => {
    setPhase("playing");
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setQuestion(generateMultipleChoiceQuestion(tables));
  };

  const getEmoji = () => {
    if (score >= 20) return "🏆";
    if (score >= 15) return "🥇";
    if (score >= 10) return "🥈";
    if (score >= 5) return "🥉";
    return "💪";
  };

  if (phase === "ready") {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
        <button onClick={onBack} className="self-start flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" /> Volver
        </button>
        <div className="text-center space-y-4">
          <div className="text-6xl animate-float">⚡</div>
          <h2 className="text-3xl font-black text-foreground">Contrarreloj</h2>
          <p className="text-muted-foreground text-lg">
            ¡Responde tantas como puedas en <strong>60 segundos</strong>!
          </p>
          <button onClick={startGame} className="gradient-primary rounded-2xl px-10 py-4 text-primary-foreground font-bold text-xl shadow-lg hover:scale-105 transition-transform animate-pulse-glow">
            ¡Comenzar!
          </button>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
        <div className="text-center space-y-4 animate-bounce-in">
          <div className="text-7xl">{getEmoji()}</div>
          <h2 className="text-3xl font-black text-foreground">¡Tiempo!</h2>
          <p className="text-5xl font-black text-gradient">{score}</p>
          <p className="text-muted-foreground text-lg">respuestas correctas</p>
          <div className="flex gap-3">
            <button onClick={startGame} className="gradient-primary rounded-2xl px-8 py-3 text-primary-foreground font-bold shadow-lg hover:scale-105 transition-transform">
              Reintentar
            </button>
            <button onClick={onBack} className="rounded-2xl px-8 py-3 bg-card border-2 border-border text-foreground font-bold hover:scale-105 transition-transform">
              Salir
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-md border border-border">
          <Clock className="h-5 w-5 text-streak" />
          <span className={`font-black text-xl ${timeLeft <= 10 ? "text-destructive animate-pulse" : "text-foreground"}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-md border border-border">
          <Zap className="h-5 w-5 text-star" />
          <span className="font-black text-xl text-foreground">{score}</span>
        </div>
      </div>

      <div className={`w-full rounded-3xl p-8 text-center shadow-xl transition-all duration-200 ${
        feedback === "correct" ? "gradient-success" : feedback === "wrong" ? "bg-destructive" : "bg-card border-2 border-border"
      }`}>
        <p className={`text-5xl font-black ${feedback ? "text-primary-foreground" : "text-foreground"}`}>
          {question.a} × {question.b}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        {question.options?.map((opt) => (
          <button
            key={opt}
            onClick={() => handleSelect(opt)}
            className="rounded-2xl bg-card border-2 border-border p-4 text-2xl font-bold text-foreground shadow-md hover:border-primary hover:scale-105 transition-all duration-200"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
