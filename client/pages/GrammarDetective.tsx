import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PassageSpec {
  text: string;
  mistakes: { wrong: string; correct: string }[];
}

interface ErrorSpan {
  id: string;
  start: number; // token index
  length: number; // number of tokens in wrong phrase
  wrongPhrase: string;
  correct: string;
  status: "pending" | "correct";
  lastAttempt?: string;
}

function normalizeToken(t: string) {
  const unified = t.replace(/’/g, "'");
  return unified.replace(/[.,!?;:()\[\]{}"“”‘’]/g, "").toLowerCase();
}

function splitTokens(text: string) {
  // Split by spaces but keep punctuation attached as separate tokens when possible
  // We'll do a simple split and keep punctuation as part of the token for rendering; matching uses normalizeToken
  return text.split(/\s+/g);
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

const PASSAGES: PassageSpec[] = [
  {
    text:
      "She go to the market yesterday but forget to buy apples. The shop were very crowd. He don’t like waiting, so he leave quickly.",
    mistakes: [
      { wrong: "go", correct: "went" },
      { wrong: "forget", correct: "forgot" },
      { wrong: "were", correct: "was" },
      { wrong: "don’t", correct: "doesn’t" },
      { wrong: "leave", correct: "left" },
    ],
  },
  {
    text:
      "The childrens is playing in the park when it start to rain. She runned home fastly. They was all wet.",
    mistakes: [
      { wrong: "childrens", correct: "children" },
      { wrong: "is", correct: "are" },
      { wrong: "start", correct: "started" },
      { wrong: "runned", correct: "ran" },
      { wrong: "was", correct: "were" },
    ],
  },
  {
    text:
      "I has a big dog who bark loud every night. He eat two bowl of food everyday. My parents doesn’t likes the noise.",
    mistakes: [
      { wrong: "has", correct: "have" },
      { wrong: "bark", correct: "barks" },
      { wrong: "eat", correct: "eats" },
      { wrong: "bowl", correct: "bowls" },
      { wrong: "doesn’t likes", correct: "don’t like" },
    ],
  },
  {
    text:
      "Yesterday we seen a movie at the mall. The actor was very good but the scene was too much long. After the movie, we goes to dinner.",
    mistakes: [
      { wrong: "seen", correct: "saw" },
      { wrong: "too much long", correct: "too long" },
      { wrong: "goes", correct: "went" },
    ],
  },
  {
    text:
      "She are my best friend since five years. We enjoys playing football together. Sometime we goes shopping also.",
    mistakes: [
      { wrong: "are", correct: "has been" },
      { wrong: "enjoys", correct: "enjoy" },
      { wrong: "Sometime", correct: "Sometimes" },
      { wrong: "goes", correct: "go" },
    ],
  },
];

const TOTAL_TIME = 3 * 60; // seconds

const GrammarDetective: React.FC = () => {
  const navigate = useNavigate();
  const [passageIndex, setPassageIndex] = useState<number>(() => {
    return Math.floor(Math.random() * PASSAGES.length);
  });
  const [tokens, setTokens] = useState<string[]>([]);
  const [errors, setErrors] = useState<ErrorSpan[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [gameOver, setGameOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const passage = PASSAGES[passageIndex];

  const initGame = useCallback((p: PassageSpec) => {
    const tks = splitTokens(p.text);
    const normalizedTokens = tks.map((t) => normalizeToken(t));

    const mapped: ErrorSpan[] = [];

    p.mistakes.forEach((m) => {
      const wrongParts = m.wrong.split(/\s+/g).map((w) => normalizeToken(w));
      const n = wrongParts.length;
      let found = false;
      for (let i = 0; i <= normalizedTokens.length - n; i++) {
        const windowSlice = normalizedTokens.slice(i, i + n);
        if (
          windowSlice.length === n &&
          windowSlice.every((w, idx) => w === wrongParts[idx])
        ) {
          mapped.push({
            id: uid(),
            start: i,
            length: n,
            wrongPhrase: tks.slice(i, i + n).join(" "),
            correct: m.correct,
            status: "pending",
          });
          found = true;
          break;
        }
      }
      if (!found) {
        // If exact sequence not found (due to punctuation/casing), try a looser search by joining tokens
        const joined = normalizedTokens.join(" ");
        const needle = wrongParts.join(" ");
        if (joined.includes(needle)) {
          // As a fallback, don't compute indices; show still clickable by ignoring this mapping
          // But to keep game playable, we simply skip mapping if not precisely found
        }
      }
    });

    setTokens(tks);
    setErrors(mapped);
    setEditingId(null);
    setInputValue("");
    setScore(0);
    setTimeLeft(TOTAL_TIME);
    setGameOver(false);
  }, []);

  useEffect(() => {
    initGame(passage);
  }, [passageIndex, initGame]);

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
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const secondsToClock = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${sec}`;
  };

  const startEditing = (errId: string) => {
    const e = errors.find((x) => x.id === errId);
    if (!e || e.status === "correct") return;
    setEditingId(errId);
    setInputValue(e.lastAttempt ?? e.wrongPhrase);
  };

  const submitEdit = () => {
    if (!editingId) return;
    const valNorm = normalizeToken(inputValue.trim());
    const idx = errors.findIndex((x) => x.id === editingId);
    if (idx === -1) return;
    const e = errors[idx];
    const correctNorm = normalizeToken(e.correct.trim());

    const next = [...errors];
    if (valNorm === correctNorm) {
      next[idx] = { ...e, status: "correct", lastAttempt: inputValue };
      setErrors(next);
      setScore((s) => s + 20);
    } else {
      next[idx] = { ...e, lastAttempt: inputValue };
      setErrors(next);
      setScore((s) => s - 5);
    }
    setEditingId(null);
  };

  const handleRetry = () => {
    const choices = PASSAGES.map((_, i) => i).filter((i) => i !== passageIndex);
    if (choices.length === 0) {
      initGame(passage);
      return;
    }
    const newIdx = choices[Math.floor(Math.random() * choices.length)];
    setPassageIndex(newIdx);
  };

  const allFixed = useMemo(() => errors.length > 0 && errors.every((e) => e.status === "correct"), [errors]);

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-background">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-electric-500/15 via-transparent to-nova-500/15" />

      {/* Header */}
      <header className="relative z-10 w-full px-4 sm:px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide bg-gradient-to-r from-electric-500 to-cyber-500 bg-clip-text text-transparent">
          Grammar Detective
        </h1>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-lg font-mono text-sm border ${timeLeft <= 10 ? "border-red-500/60 text-red-400" : "border-electric-500/50 text-electric-400"}`}>
            {secondsToClock(timeLeft)}
          </div>
          <Button
            variant="outline"
            onClick={() => setGameOver(true)}
            className="border-cyber-500/60"
          >
            Submit
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-8 pt-2 pb-24">
        <div className="max-w-4xl w-full bg-card/70 backdrop-blur-md rounded-2xl border border-border p-4 sm:p-6 shadow-xl">
          <div className="text-base sm:text-lg leading-8 text-foreground select-none">
            {tokens.map((tok, i) => {
              // If token is the start of an error span, render the span group and skip the covered indices
              const err = errors.find((e) => e.start === i);
              if (err) {
                const isEditing = editingId === err.id;
                const isCorrect = err.status === "correct";
                const display = isCorrect
                  ? err.correct
                  : err.lastAttempt ?? err.wrongPhrase;
                const color = isCorrect
                  ? "text-green-500 bg-green-500/10 border-green-500/30"
                  : err.lastAttempt
                    ? "text-red-500 bg-red-500/10 border-red-500/30"
                    : "text-yellow-500 bg-yellow-500/10 border-yellow-500/30";

                const content = isEditing ? (
                  <input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onBlur={submitEdit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submitEdit();
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    className="px-2 py-1 rounded-md bg-background border border-electric-500/40 outline-none text-foreground"
                  />
                ) : (
                  <button
                    onClick={() => startEditing(err.id)}
                    className={`px-1.5 py-0.5 rounded-md border transition-colors ${color}`}
                    title="Click to correct"
                  >
                    {display}
                  </button>
                );

                const element = (
                  <span key={`err-${err.id}`} className="inline-block align-baseline mx-1">
                    {content}
                  </span>
                );

                // Render the element and skip the rest of the tokens in this span
                const placeholders = new Array(err.length - 1).fill(null).map((_, k) => (
                  <span key={`skip-${err.id}-${k}`} className="hidden" />
                ));

                return (
                  <React.Fragment key={`grp-${err.id}`}>
                    {element}
                    {placeholders}
                  </React.Fragment>
                );
              }

              // If token is covered by an error span but not the start, skip rendering
              const covered = errors.some((e) => i > e.start && i < e.start + e.length);
              if (covered) return null;

              const clickable = false; // non-error tokens are not editable
              return (
                <span
                  key={i}
                  className={`mx-1 ${clickable ? "cursor-pointer underline decoration-dashed" : ""}`}
                >
                  {tok}
                </span>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 px-4 sm:px-8 py-4 bg-background/80 backdrop-blur-lg border-t border-border">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="text-sm sm:text-base text-foreground">
            Score: <span className="font-bold text-cyan-400">{score}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={handleRetry}
              className="bg-gradient-to-r from-nova-500/80 to-electric-500/80 text-white"
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
      </footer>

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/90 backdrop-blur-xl">
          <div className="w-full max-w-md mx-auto bg-card rounded-2xl border border-border p-6 text-center shadow-2xl">
            <h2 className="text-2xl font-extrabold mb-2">Game Over</h2>
            <p className="text-muted-foreground mb-6">Final Score: <span className="font-bold text-cyan-500">{score}</span></p>
            <div className="flex items-center justify-center gap-3">
              <Button onClick={handleRetry} className="bg-gradient-to-r from-electric-500 to-cyber-500 text-white">
                Retry
              </Button>
              <Button variant="outline" onClick={() => navigate("/game-arena")}>
                Back to Game Arena
              </Button>
            </div>
            {allFixed && <p className="mt-4 text-green-500 font-medium">Great job! You found all corrections.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default GrammarDetective;
