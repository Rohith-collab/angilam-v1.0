import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

// Beginner-friendly dictionary (validation + bot)
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
  "mat",
  "bat",
  "rat",
];

const LETTER_POOL = ["a", "c", "d", "e", "g", "m", "n", "o", "p", "r", "s", "t"];
const RACK_SIZE = 6;
const TOTAL_TIME = 90; // seconds

function randInt(n: number) {
  return Math.floor(Math.random() * n);
}

function buildRack(): string[] {
  const rack: string[] = [];
  for (let i = 0; i < RACK_SIZE; i++) rack.push(LETTER_POOL[randInt(LETTER_POOL.length)]);
  // Ensure at least 2 vowels for playability
  const isVowel = (c: string) => "aeiou".includes(c);
  const vCount = rack.filter(isVowel).length;
  if (vCount < 2) {
    for (let i = vCount; i < 2; i++) {
      const idx = randInt(rack.length);
      rack[idx] = ["a", "e", "o"][randInt(3)];
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

function pointsFor(len: number): number {
  if (len >= 6) return 30;
  if (len === 5) return 20;
  if (len === 4) return 10;
  return 5; // 3-letter
}

const WordBattles: React.FC = () => {
  const navigate = useNavigate();
  const [rack, setRack] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [over, setOver] = useState(false);

  const [playerInput, setPlayerInput] = useState("");
  const [playerScore, setPlayerScore] = useState(0);
  const [playerWords, setPlayerWords] = useState<string[]>([]);

  const [botScore, setBotScore] = useState(0);
  const [botWords, setBotWords] = useState<string[]>([]);

  const [invalidMsg, setInvalidMsg] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const dict = useMemo(() => new Set(EASY_WORD_BANK.map((w) => w.toLowerCase())), []);

  const reset = useCallback(() => {
    setRack(buildRack());
    setTimeLeft(TOTAL_TIME);
    setOver(false);
    setPlayerInput("");
    setPlayerScore(0);
    setPlayerWords([]);
    setBotScore(0);
    setBotWords([]);
    setInvalidMsg("");
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

  // Bot behavior: try a word every 2-3 seconds if available
  useEffect(() => {
    if (over) return;
    const tryBot = () => {
      // Build candidate list from dictionary not yet used by anyone and formable from rack
      const used = new Set([...playerWords, ...botWords]);
      const candidates = EASY_WORD_BANK.filter((w) => w.length >= 3 && !used.has(w) && canFormWord(w, rack));
      if (candidates.length === 0) return;
      // Prefer shorter/easier words randomly
      candidates.sort((a, b) => a.length - b.length || a.localeCompare(b));
      const pick = candidates[randInt(Math.min(4, candidates.length))];
      setBotWords((prev) => [pick, ...prev]);
      setBotScore((s) => s + pointsFor(pick.length));
    };

    const interval = setInterval(tryBot, 2000 + randInt(1200));
    return () => clearInterval(interval);
  }, [over, rack, playerWords, botWords]);

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

  const submitPlayer = () => {
    if (over) return;
    const guess = playerInput.trim().toLowerCase();
    if (!guess) return;
    if (guess.length < 3) return flashInvalid("Too short!");

    const used = new Set([...playerWords, ...botWords]);
    if (used.has(guess)) return flashInvalid("Already used!");
    if (!dict.has(guess)) return flashInvalid("Invalid!");
    if (!canFormWord(guess, rack)) return flashInvalid("Invalid!");

    const pts = pointsFor(guess.length);
    setPlayerScore((s) => s + pts);
    setPlayerWords((ws) => [guess, ...ws]);
    setPlayerInput("");
  };

  const flashInvalid = (msg: string) => {
    setInvalidMsg(msg);
    setTimeout(() => setInvalidMsg(""), 900);
  };

  const total = Math.max(1, playerScore + botScore);
  const playerPct = (playerScore / total) * 100;
  const botPct = (botScore / total) * 100;

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-background">
      {/* playful battle gradient */}
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

      {/* Arena layout */}
      <main className="relative z-10 px-4 sm:px-8 pb-24">
        {/* Energy bars */}
        <div className="max-w-6xl mx-auto mb-6 grid grid-cols-2 gap-4 items-center">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Player Energy</div>
            <Progress value={playerPct} className="h-3" />
            <div className="text-sm mt-1">Score: <span className="font-bold text-cyan-400">{playerScore}</span></div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1 text-right">Bot Energy</div>
            <Progress value={botPct} className="h-3" />
            <div className="text-sm mt-1 text-right">Score: <span className="font-bold text-yellow-400">{botScore}</span></div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Player panel */}
          <div className="order-2 md:order-1 bg-card/70 backdrop-blur-md border border-border rounded-2xl p-4">
            <h2 className="font-bold mb-2">Player</h2>
            <div className="flex gap-2 mb-2">
              <input
                ref={inputRef}
                value={playerInput}
                onChange={(e) => setPlayerInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submitPlayer(); }}
                placeholder="Type a word"
                className="w-full px-4 py-3 rounded-xl bg-background border border-electric-500/40 outline-none text-foreground"
              />
              <Button onClick={submitPlayer} className="bg-gradient-to-r from-electric-500 to-cyber-500 text-white">Submit</Button>
            </div>
            {invalidMsg && (
              <div className="text-sm text-red-400 mb-2">{invalidMsg}</div>
            )}
            <div>
              <h3 className="text-sm font-semibold mb-1">Your Words ({playerWords.length})</h3>
              <div className="max-h-40 overflow-y-auto grid grid-cols-2 gap-2">
                {playerWords.map((w) => (
                  <div key={`p-${w}`} className="p-2 rounded-lg bg-muted/50 border border-border text-center font-mono">
                    {w.toUpperCase()} <span className="text-muted-foreground text-xs">(+{pointsFor(w.length)})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center letters */}
          <div className="order-1 md:order-2 flex flex-wrap items-center justify-center gap-3 p-4">
            {rack.map((ch, i) => (
              <div
                key={`${ch}-${i}`}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-extrabold text-foreground bg-gradient-to-br from-nova-500/30 to-electric-500/30 border border-nova-500/40 animate-bounce"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                {ch.toUpperCase()}
              </div>
            ))}
          </div>

          {/* Bot panel */}
          <div className="order-3 bg-card/70 backdrop-blur-md border border-border rounded-2xl p-4">
            <h2 className="font-bold mb-2 text-right">Bot</h2>
            <div>
              <h3 className="text-sm font-semibold mb-1 text-right">Bot Words ({botWords.length})</h3>
              <div className="max-h-40 overflow-y-auto grid grid-cols-2 gap-2">
                {botWords.map((w) => (
                  <div key={`b-${w}`} className="p-2 rounded-lg bg-muted/50 border border-border text-center font-mono">
                    {w.toUpperCase()} <span className="text-muted-foreground text-xs">(+{pointsFor(w.length)})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Battle Over overlay */}
      {over && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/90 backdrop-blur-xl">
          <div className="w-full max-w-md mx-auto bg-card rounded-2xl border border-border p-6 text-center shadow-2xl">
            <h2 className="text-2xl font-extrabold mb-3">Battle Over</h2>
            <div className="text-4xl font-black mb-2">
              {playerScore > botScore ? "You Win!" : playerScore < botScore ? "You Lose!" : "Tie!"}
            </div>
            <p className="text-muted-foreground">Player: <span className="font-bold text-cyan-400">{playerScore}</span> vs Bot: <span className="font-bold text-yellow-400">{botScore}</span></p>
            <div className="mt-6 flex items-center justify-center gap-3">
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
