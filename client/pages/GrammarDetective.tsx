import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Timer as TimerIcon, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Token {
  index: number;
  text: string;
  isMistake: boolean;
}

type Status = "pending" | "correct" | "wrong";

const INITIAL_SECONDS = 180; // 3 minutes

// Passage with exactly 5 mistakes. Provide correct answers mapping by token index.
// We split by spaces while preserving punctuation in tokens.
const RAW_PASSAGE =
  "Yesterday I go to the market and buyed fresh apples. It was raining, but I didn't brought a umbrella so I get very wet. The apples was delicious and I am happy to eat them later.";

// Build tokens and define which ones are mistakes with their correct forms
function buildPassage() {
  const words = RAW_PASSAGE.split(" ");
  const tokens: Token[] = words.map((w, i) => ({ index: i, text: w, isMistake: false }));

  // Define mistakes by token index and their correct replacement
  // Please ensure exactly 5 mistakes
  // Sentence tokens with their indices:
  // 0 Yesterday | 1 I | 2 go | 3 to | 4 the | 5 market | 6 and | 7 buyed | 8 fresh | 9 apples.
  // 10 It | 11 was | 12 raining, | 13 but | 14 I | 15 didn't | 16 brought | 17 a | 18 umbrella | 19 so | 20 I | 21 get | 22 very | 23 wet.
  // 24 The | 25 apples | 26 was | 27 delicious | 28 and | 29 I | 30 am | 31 happy | 32 to | 33 eat | 34 them | 35 later.

  const mistakes: Record<number, string> = {
    2: "went", // go -> went
    7: "bought", // buyed -> bought
    16: "bring", // didn't brought -> didn't bring
    21: "got", // get -> got
    26: "were", // apples was -> apples were
  };

  for (const idx of Object.keys(mistakes).map(Number)) {
    tokens[idx].isMistake = true;
  }

  return { tokens, mistakes };
}

export default function GrammarDetective() {
  const { tokens, mistakes } = useMemo(buildPassage, []);

  const [statuses, setStatuses] = useState<Record<number, Status>>(() => {
    const s: Record<number, Status> = {};
    Object.keys(mistakes).forEach((k) => (s[Number(k)] = "pending"));
    return s;
  });
  const [edits, setEdits] = useState<Record<number, string>>({});
  const [editing, setEditing] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);
  const [ended, setEnded] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (ended) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setEnded(true);
          setEditing(null);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [ended]);

  useEffect(() => {
    if (editing !== null) inputRef.current?.focus();
  }, [editing]);

  const correctCount = useMemo(
    () => Object.values(statuses).filter((x) => x === "correct").length,
    [statuses]
  );

  const formatTime = (n: number) => {
    const m = Math.floor(n / 60)
      .toString()
      .padStart(2, "0");
    const s = (n % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const onWordClick = (t: Token) => {
    if (ended) return;
    if (!t.isMistake) return; // only mistake words are editable
    if (statuses[t.index] === "correct") return; // lock once correct
    setEditing(t.index);
    setEdits((prev) => ({ ...prev, [t.index]: stripPunctuation(t.text) }));
  };

  const stripPunctuation = (w: string) => w.replace(/[.,!?]$/g, "");
  const trailingPunct = (w: string) => (/[.,!?]$/.test(w) ? w.slice(-1) : "");

  const submitEdit = (idx: number) => {
    const original = tokens[idx].text;
    const punct = trailingPunct(original);
    const attemptRaw = (edits[idx] ?? "").trim();
    const attempt = attemptRaw.toLowerCase();
    const correct = mistakes[idx].toLowerCase();

    if (!attemptRaw) return; // ignore empty

    if (attempt === correct) {
      // Correct answer
      if (statuses[idx] !== "correct") setScore((s) => s + 20);
      setStatuses((prev) => ({ ...prev, [idx]: "correct" }));
      setEditing(null);
    } else {
      // Wrong attempt
      setScore((s) => s - 5);
      setStatuses((prev) => ({ ...prev, [idx]: "wrong" }));
      // Keep editing so player can try again
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitEdit(idx);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setEditing(null);
    }
  };

  const onSubmitGame = () => {
    setEnded(true);
    setEditing(null);
  };

  const onReset = () => {
    setStatuses(() => {
      const s: Record<number, Status> = {};
      Object.keys(mistakes).forEach((k) => (s[Number(k)] = "pending"));
      return s;
    });
    setEdits({});
    setEditing(null);
    setScore(0);
    setSecondsLeft(INITIAL_SECONDS);
    setEnded(false);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-nova-500/15 via-background to-electric-500/15">
      {/* Header */}
      <header className="w-full sticky top-0 z-20 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-nova-400 via-electric-400 to-cyber-400 bg-clip-text text-transparent">Grammar Detective</span>
          </h1>
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm border",
            secondsLeft <= 15
              ? "bg-red-500/10 text-red-500 border-red-500/30"
              : secondsLeft <= 60
                ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
                : "bg-cyan-500/10 text-cyan-600 border-cyan-500/30"
          )}>
            <TimerIcon className="h-4 w-4" />
            <span>{formatTime(secondsLeft)}</span>
          </div>
        </div>
      </header>

      {/* Center Passage */}
      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
        <Card className="bg-card/80 backdrop-blur-md shadow-xl border-border">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-4 flex items-center justify-between">
              <Badge variant="outline" className="bg-electric-500/10 text-electric-600 border-electric-500/30">Find 5 mistakes</Badge>
              <div className="text-sm text-muted-foreground">Click a wrong word to edit it</div>
            </div>

            <div className="text-lg leading-8 sm:text-xl sm:leading-9">
              {tokens.map((t, i) => {
                const status = t.isMistake ? statuses[t.index] : undefined;
                const isEditing = editing === t.index;

                if (isEditing) {
                  return (
                    <span key={i} className="inline-flex items-center align-baseline mr-1 mb-2">
                      <input
                        ref={inputRef}
                        value={edits[t.index] ?? ""}
                        onChange={(e) => setEdits((prev) => ({ ...prev, [t.index]: e.target.value }))}
                        onKeyDown={(e) => onKeyDown(e, t.index)}
                        onBlur={() => submitEdit(t.index)}
                        className="px-2 py-1 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-electric-500 text-base"
                        aria-label={`Edit word ${t.text}`}
                      />
                      <span className="ml-1">{trailingPunct(t.text)}</span>
                    </span>
                  );
                }

                const base = "inline-block align-baseline px-1.5 py-0.5 rounded-md mr-1 mb-2 transition-colors";
                const styles = t.isMistake
                  ? status === "correct"
                    ? "bg-green-500/15 text-green-700 border border-green-500/30"
                    : status === "wrong"
                      ? "bg-red-500/15 text-red-700 border border-red-500/30"
                      : "bg-yellow-500/10 text-yellow-700 border border-yellow-500/30 cursor-text hover:bg-yellow-500/20"
                  : "";

                const content = (
                  <span
                    key={i}
                    className={cn(base, styles)}
                    onClick={() => onWordClick(t)}
                    role={t.isMistake ? "button" : undefined}
                    tabIndex={t.isMistake ? 0 : -1}
                    onKeyDown={(e) => {
                      if (t.isMistake && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        onWordClick(t);
                      }
                    }}
                    aria-label={t.isMistake ? `Edit mistaken word ${t.text}` : undefined}
                  >
                    {stripPunctuation(t.text)}
                  </span>
                );

                const punct = t.text.endsWith(".") || t.text.endsWith(",") || t.text.endsWith("!") || t.text.endsWith("?")
                  ? t.text.slice(-1)
                  : "";

                return (
                  <React.Fragment key={i}>
                    {content}
                    {punct && <span className="mr-2">{punct}</span>}
                    {!punct && <span> </span>}
                  </React.Fragment>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Bottom Controls */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-lg font-semibold">
            Score: <span className={cn(
              score >= 0 ? "text-green-600" : "text-red-600"
            )}>{score}</span>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onReset} className="gap-2">
              <RefreshCw className="h-4 w-4" /> Reset
            </Button>
            <Button onClick={onSubmitGame} className="gap-2 bg-gradient-to-r from-nova-500 to-electric-500 text-white">
              Submit
            </Button>
          </div>
        </div>
      </main>

      {/* Results Overlay */}
      {ended && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-background/80 backdrop-blur-md">
          <Card className="w-[90%] max-w-xl bg-card/95 border-border shadow-2xl">
            <CardContent className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Results</h2>
                <Badge variant="outline" className="bg-gradient-to-r from-nova-500/15 to-electric-500/15">{formatTime(secondsLeft)}</Badge>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span className="text-foreground font-medium">Correct fixes: {correctCount} / 5</span>
              </div>

              <div className="flex items-center gap-3">
                <XCircle className="h-6 w-6 text-red-500" />
                <span className="text-foreground font-medium">Remaining: {5 - correctCount}</span>
              </div>

              <div className="pt-2 text-lg font-semibold">
                Final Score: <span className={cn(score >= 0 ? "text-green-600" : "text-red-600")}>{score}</span>
              </div>

              <div className="pt-2">
                <h3 className="font-semibold mb-2">Answer Key</h3>
                <div className="text-sm text-muted-foreground leading-7">
                  {Object.entries(mistakes).map(([idxStr, answer]) => {
                    const idx = Number(idxStr);
                    const original = tokens[idx].text;
                    const was = stripPunctuation(original);
                    const status = statuses[idx];
                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="min-w-[90px]">{was} → {answer}</span>
                        <Badge variant="outline" className={cn(
                          "px-2",
                          status === "correct"
                            ? "bg-green-500/15 text-green-600 border-green-500/30"
                            : status === "wrong"
                              ? "bg-red-500/15 text-red-600 border-red-500/30"
                              : "bg-yellow-500/10 text-yellow-700 border-yellow-500/30"
                        )}>
                          {status}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setEnded(false)}>Close</Button>
                <Button onClick={onReset} className="bg-gradient-to-r from-nova-500 to-electric-500 text-white">Play Again</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
