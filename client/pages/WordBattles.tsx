import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DICTIONARY = [
  "cat",
  "dog",
  "game",
  "apple",
  "school",
  "water",
  "learn",
  "trace",
  "right",
  "house",
  "fight",
  "strong",
  "word",
  "battle",
  "build",
];

const VOWELS = new Set(["a", "e", "i", "o", "u"]);
const TOTAL_TIME = 120; // seconds
const RACK_SIZE = 7;
const MIN_LENGTH = 3;

function randInt(n: number) {
  return Math.floor(Math.random() * n);
}

function buildRack(size: number): string[] {
  // Weighted simple bag to avoid too many consonants
  const bag = "aaaaaeeeeiiiioooouu" + "bbccddffgghhjkllmmnnppqrrsssttttvvwwxxyz";
  const rack: string[] = [];
  for (let i = 0; i < size; i++) {
    rack.push(bag[randInt(bag.length)]);
  }
  // ensure at least 2 vowels
  const vowelCount = rack.filter((c) => VOWELS.has(c)).length;
  if (vowelCount < 2) {
    for (let i = vowelCount; i < 2; i++) {
      const idx = randInt(rack.length);
      rack[idx] = "aeiou"[randInt(5)];
    }
  }
  return rack;
}

function canFormWord(word: string, rack: string[]): boolean {
  const avail: Record<string, number> = {};
  for (const c of rack) avail[c] = (avail[c] || 0) + 1;
  for (const c of word) {
    if (!avail[c]) return false;
    avail[c] -= 1;
  }
  return true;
}

function pointsForLength(len: number): number {
  if (len >= 6) return 40;
  if (len === 5) return 20;
  if (len === 4) return 10;
  return 5; // len === 3
}

const WordBattles: React.FC = () => {
  const navigate = useNavigate();
  const [rack, setRack] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [used, setUsed] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dict = useMemo(() => new Set(DICTIONARY.map((w) => w.toLowerCase())), []);

  const reset = useCallback(() => {
    const r = buildRack(RACK_SIZE);
    setRack(r);
    setInput("");
    setScore(0);
    setUsed([]);
    setMessage("");
    setTimeLeft(TOTAL_TIME);
    setOver(false);
  }, []);

  useEffect(() => {
    reset();
  }, [reset]);

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
    if (inputRef.current) {
      inputRef.current.focus();
    }
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

  const submit = () => {
    if (over) return;
    const guess = input.trim().toLowerCase();
    if (guess.length < MIN_LENGTH) {
      setMessage(`Word must be at least ${MIN_LENGTH} letters.`);
      return;
    }
    if (!canFormWord(guess, rack)) {
      setMessage("Word cannot be formed from the given letters.");
      return;
    }
    if (!dict.has(guess)) {
      setMessage("Invalid word.");
      return;
    }
    if (used.includes(guess)) {
      setMessage("Word already used.");
      return;
    }
    const pts = pointsForLength(guess.length);
    setScore((s) => s + pts);
    setUsed((u) => [guess, ...u]);
    setInput("");
    setMessage(`+${pts} points for ${guess.toUpperCase()}`);
  };

  const shuffleRack = () => setRack(buildRack(RACK_SIZE));

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-background">
      {/* energetic gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-nova-500/15 via-transparent to-electric-500/25" />

      {/* Header */}
      <header className="relative z-10 w-full px-4 sm:px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide bg-gradient-to-r from-electric-500 to-cyber-500 bg-clip-text text-transparent">
          Word Building Battles
        </h1>
        <div className={`px-3 py-1 rounded-lg font-mono text-sm border ${timeLeft <= 10 ? "border-red-500/60 text-red-400" : "border-electric-500/50 text-electric-400"}`}>
          {secondsToClock(timeLeft)}
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-8 pt-2 pb-24">
        <div className="max-w-4xl w-full bg-card/70 backdrop-blur-md rounded-2xl border border-border p-6 shadow-xl">
          {/* Rack */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6">
            {rack.map((ch, i) => (
              <div
                key={`${ch}-${i}`}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-extrabold text-foreground bg-gradient-to-br from-nova-500/30 to-electric-500/30 border border-nova-500/40 animate-bounce"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {ch.toUpperCase()}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-3 justify-center mb-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
              placeholder="Type a word"
              className="w-full max-w-md px-4 py-3 rounded-xl bg-background border border-electric-500/40 outline-none text-foreground text-lg"
            />
            <Button onClick={submit} className="bg-gradient-to-r from-electric-500 to-cyber-500 text-white">
              Submit
            </Button>
            <Button variant="outline" onClick={shuffleRack} className="border-electric-500/60">
              Shuffle
            </Button>
          </div>
          {message && (
            <p className="text-center text-electric-400 font-medium mb-4">{message}</p>
          )}

          {/* Found words + score */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <h3 className="font-semibold mb-2">Words Found ({used.length})</h3>
              <div className="max-h-40 overflow-y-auto grid grid-cols-2 gap-2">
                {used.map((w) => (
                  <div key={w} className="p-2 rounded-lg bg-muted/50 border border-border text-center font-mono">
                    {w.toUpperCase()} <span className="text-muted-foreground text-xs">(+{pointsForLength(w.length)})</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl p-4 bg-gradient-to-br from-electric-500/15 to-cyber-500/15 border border-electric-500/30">
              <div className="text-sm text-muted-foreground">Score</div>
              <div className="text-4xl font-extrabold text-cyan-400">{score}</div>
              <div className="mt-2 text-xs text-muted-foreground">3L=5, 4L=10, 5L=20, 6L+=40</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer score */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 px-4 sm:px-8 py-3 bg-background/80 backdrop-blur-lg border-t border-border flex items-center justify-center">
        <div className="text-sm sm:text-base">Score: <span className="font-bold text-cyan-400">{score}</span></div>
      </footer>

      {/* Battle Over */}
      {over && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/90 backdrop-blur-xl">
          <div className="w-full max-w-md mx-auto bg-card rounded-2xl border border-border p-6 text-center shadow-2xl">
            <h2 className="text-2xl font-extrabold mb-2">Battle Over</h2>
            <p className="text-muted-foreground">Total Words: <span className="font-bold text-foreground">{used.length}</span></p>
            <p className="text-muted-foreground mb-6">Final Score: <span className="font-bold text-cyan-500">{score}</span></p>
            <div className="flex items-center justify-center gap-3">
              <Button onClick={reset} className="bg-gradient-to-r from-nova-500 to-electric-500 text-white">Retry</Button>
              <Button variant="outline" onClick={() => navigate("/game-arena")} className="border-electric-500/60">Back to Game Arena</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordBattles;
