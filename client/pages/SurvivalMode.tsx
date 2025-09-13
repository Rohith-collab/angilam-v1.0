import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface MCQ {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  difficulty: number; // 1 easy -> 5 hard
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

const BASE_QUESTIONS: MCQ[] = [
  {
    id: uid(),
    prompt: "Choose the correct sentence:",
    options: [
      "She don’t likes coffee.",
      "She doesn’t like coffee.",
      "She not like coffee.",
      "She isn’t likes coffee.",
    ],
    correctIndex: 1,
    difficulty: 1,
  },
  {
    id: uid(),
    prompt: 'Pick the correct past tense: "He ____ a new bike yesterday."',
    options: ["buy", "buys", "bought", "buying"],
    correctIndex: 2,
    difficulty: 2,
  },
  {
    id: uid(),
    prompt: "Which sentence is correct?",
    options: [
      "The informations are useful.",
      "The information is useful.",
      "The information are useful.",
      "The informations is useful.",
    ],
    correctIndex: 1,
    difficulty: 2,
  },
  {
    id: uid(),
    prompt: 'Fill the blank: "They have been friends ____ childhood."',
    options: ["for", "since", "from", "on"],
    correctIndex: 0,
    difficulty: 3,
  },
  {
    id: uid(),
    prompt:
      'Spot the error: "She is one of the girl who always help." (select the correction)',
    options: ["girl → girls", "help → helps", "is → are", "who → whom"],
    correctIndex: 0,
    difficulty: 4,
  },
  // A few more to extend difficulty curve
  {
    id: uid(),
    prompt: "Choose the correctly punctuated sentence:",
    options: [
      "Its raining; bring your umbrella.",
      "It’s raining; bring your umbrella.",
      "It’s raining bring your umbrella.",
      "Its raining, bring your umbrella;",
    ],
    correctIndex: 1,
    difficulty: 4,
  },
  {
    id: uid(),
    prompt: "Select the correct usage:",
    options: [
      "Each of the students have completed their assignments.",
      "Each of the students has completed his or her assignment.",
      "Each of the students have completed his assignment.",
      "Each of the student has completed their assignments.",
    ],
    correctIndex: 1,
    difficulty: 5,
  },
];

const PER_QUESTION_TIME = 10; // seconds

const SurvivalMode: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(PER_QUESTION_TIME);
  const [gameOver, setGameOver] = useState(false);
  const [flash, setFlash] = useState(false);
  const timerRef = useRef<number | null>(null);

  const highScore = useMemo(() => {
    const raw = localStorage.getItem("survivalModeHighScore");
    return raw ? parseInt(raw, 10) : 0;
  }, []);
  const [best, setBest] = useState(highScore);

  useEffect(() => {
    const sorted = [...BASE_QUESTIONS].sort(
      (a, b) => a.difficulty - b.difficulty,
    );
    setQuestions(sorted);
    setIndex(0);
    setScore(0);
    setTimeLeft(PER_QUESTION_TIME);
    setGameOver(false);
    setFlash(false);
  }, []);

  useEffect(() => {
    if (gameOver) return;
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(timerRef.current!);
          triggerGameOver();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [index, gameOver]);

  const triggerGameOver = () => {
    setGameOver(true);
    setFlash(true);
    const nextBest = Math.max(score, best);
    if (nextBest !== best) {
      localStorage.setItem("survivalModeHighScore", String(nextBest));
      setBest(nextBest);
    }
    setTimeout(() => setFlash(false), 500);
  };

  const onSelect = (optIndex: number) => {
    if (gameOver) return;
    const q = questions[index];
    if (!q) return;
    if (optIndex === q.correctIndex) {
      setScore((s) => s + 50);
      // move to next harder question
      const nextIdx = index + 1;
      if (nextIdx >= questions.length) {
        // loop through the hardest few repeatedly
        setIndex(
          questions.length - 3 >= 0
            ? questions.length - 3
            : questions.length - 1,
        );
      } else {
        setIndex(nextIdx);
      }
      setTimeLeft(PER_QUESTION_TIME);
    } else {
      triggerGameOver();
    }
  };

  const secondsToClock = (s: number) => {
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const ss = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const handleRetry = () => {
    // reset state to beginning with sorted questions
    const sorted = [...BASE_QUESTIONS].sort(
      (a, b) => a.difficulty - b.difficulty,
    );
    setQuestions(sorted);
    setIndex(0);
    setScore(0);
    setTimeLeft(PER_QUESTION_TIME);
    setGameOver(false);
    setFlash(false);
  };

  const q = questions[index];

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-background">
      {/* simple neon gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-electric-500/20" />

      {/* header */}
      <header className="relative z-10 w-full px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
            Survival Mode
          </h1>
          <span className="px-2 py-1 rounded-md text-xs font-bold border border-red-500/60 text-red-400 uppercase">
            1 Life Only
          </span>
        </div>
        <div
          className={`px-3 py-1 rounded-lg font-mono text-sm border ${timeLeft <= 3 ? "border-red-500/60 text-red-400" : "border-electric-500/50 text-electric-400"}`}
        >
          {secondsToClock(timeLeft)}
        </div>
      </header>

      {/* main content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-8 pt-2 pb-24">
        <div className="max-w-3xl w-full bg-card/70 backdrop-blur-md rounded-2xl border border-border p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Question {index + 1}
            </div>
            <div className="text-sm">
              Score: <span className="font-bold text-cyan-400">{score}</span>
            </div>
          </div>

          {q ? (
            <div>
              <p className="text-lg sm:text-xl font-semibold mb-6 text-foreground">
                {q.prompt}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.options.map((opt, i) => (
                  <Button
                    key={i}
                    className="w-full text-left justify-start bg-gradient-to-r from-nova-500/20 to-electric-500/20 hover:from-nova-500/30 hover:to-electric-500/30 border border-border"
                    onClick={() => onSelect(i)}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">Loading…</div>
          )}
        </div>
      </main>

      {/* red flash on game over */}
      {flash && (
        <div className="absolute inset-0 z-20 bg-red-600/50 animate-pulse" />
      )}

      {/* Game Over overlay */}
      {gameOver && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/90 backdrop-blur-xl">
          <div className="w-full max-w-md mx-auto bg-card rounded-2xl border border-border p-6 text-center shadow-2xl">
            <h2 className="text-2xl font-extrabold mb-2 text-red-500">
              Game Over
            </h2>
            <p className="text-muted-foreground">
              Final Score:{" "}
              <span className="font-bold text-cyan-500">{score}</span>
            </p>
            <p className="mt-1 text-sm text-foreground">
              Highest Score:{" "}
              <span className="font-bold text-yellow-400">{best}</span>
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button
                onClick={handleRetry}
                className="bg-gradient-to-r from-red-500 to-electric-500 text-white"
              >
                Retry
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/game-arena")}
                className="border-electric-500/60"
              >
                Back to Game Arena
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurvivalMode;
