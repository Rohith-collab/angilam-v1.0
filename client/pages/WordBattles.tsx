import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Easy word bank (source of truth if no extended dictionary is available)
const EASY_WORD_BANK = [
  "cat",
  "dog",
  "pen",
  "cup",
  "map",
  "car",
  "sun",
  "moon",
  "star",
  "book",
  "good",
  "bad",
  "game",
  "run",
  "eat",
  "top",
  "hat",
  "bat",
  "rat",
  "mat",
  "apple",
  "water",
  "learn",
  "trace",
  "right",
  "house",
];

// Predefined letter sets to keep variety without repetition
const LETTER_SETS_RAW = [
  "c a t d o p n",
  "r a m e h l s",
  "s t a r o p m",
  "b o o k g a m",
  "w a t e r n s",
];

const LETTER_SETS: string[][] = LETTER_SETS_RAW.map((s) =>
  s.replace(/\s+/g, "").split(""),
);

const TOTAL_TIME = 120; // 2 minutes

function normalizeInput(raw: string) {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z]/g, "");
}

function countLetters(letters: string[]): Record<string, number> {
  return letters.reduce(
    (acc, c) => {
      acc[c] = (acc[c] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

function lettersFit(word: string, rack: string[]): boolean {
  const rackCounts = countLetters(rack);
  const wCounts = countLetters(word.split(""));
  for (const [ch, n] of Object.entries(wCounts)) {
    if ((rackCounts[ch] || 0) < n) return false;
  }
  return true;
}

function pointsForLength(len: number): number {
  if (len >= 6) return 30;
  if (len === 5) return 20;
  if (len === 4) return 10;
  return 5; // 3 letters
}

type Feedback = {
  type: "ok" | "error";
  message: string;
  points?: number;
} | null;

const WordBattles: React.FC = () => {
  const navigate = useNavigate();
  const [rack, setRack] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [found, setFound] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [over, setOver] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [attemptLog, setAttemptLog] = useState<
    { word: string; result: string }[]
  >([]);
  const [extendedDict, setExtendedDict] = useState<Set<string> | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const easyDict = useMemo(
    () => new Set(EASY_WORD_BANK.map((w) => w.toLowerCase())),
    [],
  );

  // Attempt to load extended dictionary if available
  useEffect(() => {
    const loadDict = async () => {
      try {
        const res = await fetch("/words-dictionary.json");
        if (res.ok) {
          const words: string[] = await res.json();
          setExtendedDict(new Set(words.map((w) => w.toLowerCase())));
        } else {
          setExtendedDict(null);
        }
      } catch {
        setExtendedDict(null);
      }
    };
    loadDict();
  }, []);

  const pickLetters = useCallback(() => {
    const idx = Math.floor(Math.random() * LETTER_SETS.length);
    setRack(LETTER_SETS[idx]);
  }, []);

  const reset = useCallback(() => {
    pickLetters();
    setInput("");
    setScore(0);
    setFound([]);
    setFeedback(null);
    setAttemptLog([]);
    setTimeLeft(TOTAL_TIME);
    setOver(false);
  }, [pickLetters]);

  useEffect(() => {
    reset();
  }, [reset]);

  // Timer
  useEffect(() => {
    if (over) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          setOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [over]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [rack, over]);

  const secondsToClock = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${sec}`;
  };

  const logAttempt = (word: string, result: string) => {
    setAttemptLog((prev) => [{ word, result }, ...prev].slice(0, 10));
  };

  const showFeedback = (fb: Feedback) => {
    setFeedback(fb);
    setTimeout(() => setFeedback(null), 1500);
  };

  const inDictionary = (word: string) => {
    if (easyDict.has(word)) return true;
    if (extendedDict && extendedDict.has(word)) return true;
    return false;
  };

  const submit = () => {
    if (over) return;
    const w = normalizeInput(input);
    if (!w) return;

    // 1) length
    if (w.length < 3) {
      showFeedback({ type: "error", message: "✖ Too short (min 3)" });
      logAttempt(w, "too short");
      return;
    }

    // 2) duplicate (case-insensitive)
    if (found.some((fw) => fw.toLowerCase() === w)) {
      showFeedback({ type: "error", message: "✖ Already used" });
      logAttempt(w, "already used");
      return;
    }

    // 3) letter usage
    if (!lettersFit(w, rack)) {
      showFeedback({
        type: "error",
        message: "✖ Invalid — uses letters not in set",
      });
      logAttempt(w, "letters not in set");
      return;
    }

    // 4) dictionary
    if (!inDictionary(w)) {
      showFeedback({ type: "error", message: "✖ Invalid — not a real word" });
      logAttempt(w, "not a real word");
      return;
    }

    // success
    const pts = pointsForLength(w.length);
    setScore((s) => s + pts);
    setFound((f) => [w, ...f]);
    setInput("");
    showFeedback({ type: "ok", message: `✓ Accepted +${pts}`, points: pts });
    logAttempt(w, `accepted +${pts}`);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-nova-500/15 via-transparent to-electric-500/20" />

      {/* Header */}
      <header className="relative z-10 w-full px-4 sm:px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide bg-gradient-to-r from-electric-500 to-cyber-500 bg-clip-text text-transparent">
          Word Building Battles
        </h1>
        <div
          className={`px-3 py-1 rounded-lg font-mono text-sm border ${timeLeft <= 10 ? "border-red-500/60 text-red-400" : "border-electric-500/50 text-electric-400"}`}
        >
          {secondsToClock(timeLeft)}
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex flex-col items-center justify-start px-4 sm:px-8 pt-4 pb-28">
        {/* Letter rack */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          {rack.map((ch, i) => (
            <div
              key={`${ch}-${i}`}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-extrabold text-foreground bg-gradient-to-br from-nova-500/30 to-electric-500/30 border border-nova-500/40 shadow-md animate-bounce"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              {ch.toUpperCase()}
            </div>
          ))}
        </div>

        {/* Input + submit */}
        <div className="w-full max-w-xl flex items-center gap-3 justify-center mb-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder="Type a word"
            className="w-full px-4 py-3 rounded-xl bg-background border border-electric-500/40 outline-none text-foreground text-lg"
          />
          <Button
            onClick={submit}
            className="bg-gradient-to-r from-electric-500 to-cyber-500 text-white"
          >
            Submit
          </Button>
        </div>
        {feedback && (
          <div
            className={`${feedback.type === "ok" ? "text-green-500" : "text-red-400"} text-sm font-medium mb-4`}
          >
            {feedback.message}
          </div>
        )}

        {/* Found words list */}
        <div className="w-full max-w-3xl">
          <h3 className="font-semibold mb-2">Words Found ({found.length})</h3>
          <div className="max-h-48 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-2">
            {found.map((w) => (
              <div
                key={w}
                className="p-2 rounded-lg bg-muted/50 border border-border text-center font-mono"
              >
                {w.toUpperCase()}{" "}
                <span className="text-muted-foreground text-xs">
                  (+{pointsForLength(w.length)})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Debug toggle */}
        <div className="w-full max-w-3xl mt-6">
          <button
            onClick={() => setShowDebug((v) => !v)}
            className="text-xs text-muted-foreground underline"
          >
            {showDebug ? "Hide" : "Show"} debug log
          </button>
          {showDebug && (
            <div className="mt-2 p-3 rounded-lg border border-border bg-muted/40 text-xs">
              <div className="font-semibold mb-1">Last attempts</div>
              <ul className="list-disc pl-5 space-y-1">
                {attemptLog.map((a, i) => (
                  <li key={i}>
                    <span className="font-mono">{a.word}</span>: {a.result}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>

      {/* Bottom score */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 px-4 sm:px-8 py-3 bg-background/85 backdrop-blur-lg border-t border-border flex items-center justify-between">
        <div className="text-sm sm:text-base">
          Score: <span className="font-bold text-cyan-400">{score}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          3L=5 · 4L=10 · 5L=20 · 6L+=30
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={reset}
            className="border-electric-500/60"
          >
            Retry
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/game-arena")}
            className="border-electric-500/60"
          >
            Back
          </Button>
        </div>
      </footer>

      {/* Game Over overlay */}
      {over && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/90 backdrop-blur-xl">
          <div className="w-full max-w-md mx-auto bg-card rounded-2xl border border-border p-6 text-center shadow-2xl">
            <h2 className="text-2xl font-extrabold mb-2">Game Over</h2>
            <p className="text-muted-foreground">
              Words Found:{" "}
              <span className="font-bold text-foreground">{found.length}</span>
            </p>
            <p className="text-muted-foreground mb-6">
              Final Score:{" "}
              <span className="font-bold text-cyan-500">{score}</span>
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                onClick={reset}
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

export default WordBattles;
