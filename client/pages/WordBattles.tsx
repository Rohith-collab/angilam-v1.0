import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Simple beginner word bank (validation)
const WORD_BANK = [
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
];

const TOTAL_TIME = 120; // 2 minutes
const RACK_SIZE = 7;
const VOWELS = new Set(["a", "e", "i", "o", "u"]);

function randInt(n: number) {
  return Math.floor(Math.random() * n);
}

function buildRack(size: number): string[] {
  // Light-weighted pool for playability
  const pool = "aaaaaeeeiiiooouu" + "bbccddfghhjkllmmnnppqrrsssttttvvwwxxyz";
  const rack: string[] = [];
  for (let i = 0; i < size; i++) rack.push(pool[randInt(pool.length)]);
  const vowelCount = rack.filter((c) => VOWELS.has(c)).length;
  if (vowelCount < 2) {
    for (let i = vowelCount; i < 2; i++) {
      const idx = randInt(rack.length);
      rack[idx] = ["a", "e", "i", "o", "u"][randInt(5)];
    }
  }
  return rack;
}

function canFormWord(word: string, rack: string[]): boolean {
  const counts: Record<string, number> = {};
  for (const c of rack) counts[c] = (counts[c] || 0) + 1;
  for (const ch of word) {
    if (!counts[ch]) return false;
    counts[ch] -= 1;
  }
  return true;
}

function pointsForLength(len: number): number {
  if (len >= 6) return 30;
  if (len === 5) return 20;
  if (len === 4) return 10;
  return 5; // 3 letters
}

const WordBattles: React.FC = () => {
  const navigate = useNavigate();
  const [rack, setRack] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [found, setFound] = useState<string[]>([]);
  const [msg, setMsg] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dict = useMemo(() => new Set(WORD_BANK.map((w) => w.toLowerCase())), []);

  const reset = useCallback(() => {
    setRack(buildRack(RACK_SIZE));
    setInput("");
    setScore(0);
    setFound([]);
    setMsg("");
    setTimeLeft(TOTAL_TIME);
    setOver(false);
  }, []);

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

  const flash = (text: string) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 900);
  };

  const submit = () => {
    if (over) return;
    const guess = input.trim().toLowerCase();
    if (!guess) return;
    if (guess.length < 3) return flash("Invalid!");
    if (found.includes(guess)) return flash("Invalid!");
    if (!dict.has(guess)) return flash("Invalid!");
    if (!canFormWord(guess, rack)) return flash("Invalid!");

    const pts = pointsForLength(guess.length);
    setScore((s) => s + pts);
    setFound((f) => [guess, ...f]);
    setInput("");
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-background">
      {/* fun minimal gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-nova-500/15 via-transparent to-electric-500/20" />

      {/* Header */}
      <header className="relative z-10 w-full px-4 sm:px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide bg-gradient-to-r from-electric-500 to-cyber-500 bg-clip-text text-transparent">
          Word Building Battles
        </h1>
        <div className={`px-3 py-1 rounded-lg font-mono text-sm border ${timeLeft <= 10 ? "border-red-500/60 text-red-400" : "border-electric-500/50 text-electric-400"}`}>
          {secondsToClock(timeLeft)}
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex flex-col items-center justify-start px-4 sm:px-8 pt-4 pb-28">
        {/* Rack */}
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

        {/* Input */}
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
          <Button onClick={submit} className="bg-gradient-to-r from-electric-500 to-cyber-500 text-white">
            Submit
          </Button>
        </div>
        {msg && <div className="text-sm text-red-400 mb-4">{msg}</div>}

        {/* Found words list */}
        <div className="w-full max-w-3xl">
          <h3 className="font-semibold mb-2">Words Found ({found.length})</h3>
          <div className="max-h-48 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-2">
            {found.map((w) => (
              <div key={w} className="p-2 rounded-lg bg-muted/50 border border-border text-center font-mono">
                {w.toUpperCase()} <span className="text-muted-foreground text-xs">(+{pointsForLength(w.length)})</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom score */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 px-4 sm:px-8 py-3 bg-background/85 backdrop-blur-lg border-t border-border flex items-center justify-between">
        <div className="text-sm sm:text-base">Score: <span className="font-bold text-cyan-400">{score}</span></div>
        <div className="text-xs text-muted-foreground">3L=5 · 4L=10 · 5L=20 · 6L+=30</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={reset} className="border-electric-500/60">Retry</Button>
          <Button variant="outline" onClick={() => navigate("/game-arena")} className="border-electric-500/60">Back</Button>
        </div>
      </footer>

      {/* Game Over overlay */}
      {over && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/90 backdrop-blur-xl">
          <div className="w-full max-w-md mx-auto bg-card rounded-2xl border border-border p-6 text-center shadow-2xl">
            <h2 className="text-2xl font-extrabold mb-2">Game Over</h2>
            <p className="text-muted-foreground">Words Found: <span className="font-bold text-foreground">{found.length}</span></p>
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
