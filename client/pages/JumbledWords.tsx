import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface WordItem {
  jumbled: string;
  answer: string;
}

const WORDS: WordItem[] = [
  { jumbled: "tac", answer: "cat" },
  { jumbled: "doog", answer: "good" },
  { jumbled: "ratce", answer: "trace" },
  { jumbled: "nrael", answer: "learn" },
  { jumbled: "plape", answer: "apple" },
  { jumbled: "thgir", answer: "right" },
  { jumbled: "esuoh", answer: "house" },
  { jumbled: "retaw", answer: "water" },
  { jumbled: "gmae", answer: "game" },
  { jumbled: "oolsch", answer: "school" },
];

const TOTAL_TIME = 120; // 2 minutes

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const JumbledWords: React.FC = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<number[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [gameOver, setGameOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setOrder(shuffle(WORDS.map((_, i) => i)));
    setIdx(0);
    setScore(0);
    setInput("");
    setTimeLeft(TOTAL_TIME);
    setGameOver(false);
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [gameOver]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [idx, gameOver]);

  const current = useMemo(() => {
    if (order.length === 0) return null;
    const wi = order[idx % order.length];
    return WORDS[wi];
  }, [order, idx]);

  const secondsToClock = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${sec}`;
  };

  const submit = () => {
    if (!current) return;
    const guess = input.trim().toLowerCase();
    const target = current.answer.toLowerCase();
    if (guess === target) {
      setScore((s) => s + 25);
      setIdx((i) => i + 1);
      setInput("");
    } else if (guess.length > 0) {
      setScore((s) => s - 5);
    }
  };

  const handleRetry = () => {
    setOrder(shuffle(WORDS.map((_, i) => i)));
    setIdx(0);
    setScore(0);
    setInput("");
    setTimeLeft(TOTAL_TIME);
    setGameOver(false);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-background">
      {/* playful neon gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-nova-500/15 via-transparent to-electric-500/20" />

      {/* Header */}
      <header className="relative z-10 w-full px-4 sm:px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide bg-gradient-to-r from-electric-500 to-cyber-500 bg-clip-text text-transparent">
          Jumbled Words
        </h1>
        <div
          className={`px-3 py-1 rounded-lg font-mono text-sm border ${timeLeft <= 10 ? "border-red-500/60 text-red-400" : "border-electric-500/50 text-electric-400"}`}
        >
          {secondsToClock(timeLeft)}
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-8 pt-2 pb-24">
        <div className="max-w-2xl w-full bg-card/70 backdrop-blur-md rounded-2xl border border-border p-6 shadow-xl text-center">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6">
            {current?.jumbled.split("").map((ch, i) => (
              <div
                key={`${ch}-${i}`}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold text-foreground bg-gradient-to-br from-nova-500/30 to-electric-500/30 border border-nova-500/40 animate-bounce"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                {ch.toUpperCase()}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 justify-center">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
              placeholder="Type the correct word"
              className="w-full max-w-sm px-4 py-3 rounded-xl bg-background border border-electric-500/40 outline-none text-foreground"
            />
            <Button
              onClick={submit}
              className="bg-gradient-to-r from-electric-500 to-cyber-500 text-white"
            >
              Submit
            </Button>
          </div>
        </div>
      </main>

      {/* Bottom score */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 px-4 sm:px-8 py-3 bg-background/80 backdrop-blur-lg border-t border-border flex items-center justify-center">
        <div className="text-sm sm:text-base">
          Score: <span className="font-bold text-cyan-400">{score}</span>
        </div>
      </footer>

      {/* Game Over overlay */}
      {gameOver && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/90 backdrop-blur-xl">
          <div className="w-full max-w-md mx-auto bg-card rounded-2xl border border-border p-6 text-center shadow-2xl">
            <h2 className="text-2xl font-extrabold mb-2">Game Over</h2>
            <p className="text-muted-foreground mb-6">
              Final Score:{" "}
              <span className="font-bold text-cyan-500">{score}</span>
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                onClick={handleRetry}
                className="bg-gradient-to-r from-nova-500 to-electric-500 text-white"
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

export default JumbledWords;
