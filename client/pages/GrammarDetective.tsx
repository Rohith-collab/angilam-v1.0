import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Timer as TimerIcon, RefreshCw, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

type Status = "pending" | "correct" | "wrong";

interface Token {
  index: number;
  text: string; // with punctuation kept on the token
}

interface PassageSpec {
  text: string;
  corrections: { wrong: string; right: string }[];
}

interface GroupMistake {
  id: number; // index in mistakes array
  start: number; // token index start
  length: number; // number of tokens in the wrong phrase
  right: string; // expected corrected phrase (no trailing punctuation)
}

const INITIAL_SECONDS = 180; // 3 minutes

// Utility helpers
const stripTrailingPunct = (w: string) => w.replace(/[.,!?]$/g, "");
const trailingPunct = (w: string) => (/[.,!?]$/.test(w) ? w.slice(-1) : "");
const normalize = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();

// Provided passages and corrections
const PASSAGES: PassageSpec[] = [
  {
    text:
      "She go to the market yesterday but forget to buy apples. The shop were very crowd. He don't like waiting, so he leave quickly.",
    corrections: [
      { wrong: "go", right: "went" },
      { wrong: "forget", right: "forgot" },
      { wrong: "were", right: "was" },
      { wrong: "don't", right: "doesn't" },
      { wrong: "leave", right: "left" },
    ],
  },
  {
    text:
      "The childrens is playing in the park when it start to rain. She runned home fastly. They was all wet.",
    corrections: [
      { wrong: "childrens", right: "children" },
      { wrong: "is", right: "are" },
      { wrong: "start", right: "started" },
      { wrong: "runned", right: "ran" },
      { wrong: "was", right: "were" },
    ],
  },
  {
    text:
      "I has a big dog who bark loud every night. He eat two bowl of food everyday. My parents doesn't likes the noise.",
    corrections: [
      { wrong: "has", right: "have" },
      { wrong: "bark", right: "barks" },
      { wrong: "eat", right: "eats" },
      { wrong: "bowl", right: "bowls" },
      { wrong: "doesn't likes", right: "don't like" },
    ],
  },
  {
    text:
      "Yesterday we seen a movie at the mall. The actor was very good but the scene was too much long. After the movie, we goes to dinner.",
    corrections: [
      { wrong: "seen", right: "saw" },
      { wrong: "too much long", right: "too long" },
      { wrong: "goes", right: "went" },
    ],
  },
  {
    text:
      "She are my best friend since five years. We enjoys playing football together. Sometime we goes shopping also.",
    corrections: [
      { wrong: "are", right: "has been" },
      { wrong: "enjoys", right: "enjoy" },
      { wrong: "Sometime", right: "Sometimes" },
      { wrong: "goes", right: "go" },
    ],
  },
];

function tokenize(text: string): Token[] {
  return text.split(" ").map((w, i) => ({ index: i, text: w }));
}

function findGroups(tokens: Token[], corrections: PassageSpec["corrections"]): GroupMistake[] {
  const used: boolean[] = Array(tokens.length).fill(false);
  const groups: GroupMistake[] = [];

  const findRun = (wrongWords: string[]) => {
    const wrongNorm = wrongWords.map((w) => normalize(w));
    for (let i = 0; i <= tokens.length - wrongWords.length; i++) {
      if (used[i]) continue;
      let ok = true;
      for (let k = 0; k < wrongWords.length; k++) {
        const t = tokens[i + k];
        const tNorm = normalize(stripTrailingPunct(t.text));
        if (tNorm !== wrongNorm[k]) {
          ok = false;
          break;
        }
      }
      if (ok) return i;
    }
    return -1;
  };

  corrections.forEach((corr, idx) => {
    const wrongWords = corr.wrong.split(" ");
    const start = findRun(wrongWords);
    if (start !== -1) {
      for (let j = 0; j < wrongWords.length; j++) used[start + j] = true;
      groups.push({ id: idx, start, length: wrongWords.length, right: corr.right });
    }
  });

  return groups
    .sort((a, b) => a.start - b.start)
    .filter((g) => g.start >= 0);
}

export default function GrammarDetective() {
  const navigate = useNavigate();

  // Choose a random passage at start
  const [passageIndex, setPassageIndex] = useState(() => Math.floor(Math.random() * PASSAGES.length));
  const passage = PASSAGES[passageIndex];

  // Recompute derived state when passage changes
  const tokens = useMemo(() => tokenize(passage.text), [passage.text]);
  const groups = useMemo(() => findGroups(tokens, passage.corrections), [tokens, passage.corrections]);

  // Map from token index to group id for quick lookup (so clicking any word in the phrase works)
  const groupIdByToken = useMemo(() => {
    const map = new Map<number, number>();
    groups.forEach((g) => {
      for (let i = 0; i < g.length; i++) map.set(g.start + i, g.id);
    });
    return map;
  }, [groups]);

  const [statuses, setStatuses] = useState<Record<number, Status>>({});
  const [edits, setEdits] = useState<Record<number, string>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);
  const [ended, setEnded] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Initialize when passage changes
  useEffect(() => {
    const nextStatuses: Record<number, Status> = {};
    groups.forEach((g) => (nextStatuses[g.id] = "pending"));
    setStatuses(nextStatuses);
    setEdits({});
    setEditingId(null);
    setScore(0);
    setSecondsLeft(INITIAL_SECONDS);
    setEnded(false);
  }, [passageIndex, groups.length]);

  useEffect(() => {
    if (ended) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setEnded(true);
          setEditingId(null);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [ended]);

  useEffect(() => {
    if (editingId !== null) inputRef.current?.focus();
  }, [editingId]);

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

  const openEditorForToken = (tokenIndex: number) => {
    if (ended) return;
    const gid = groupIdByToken.get(tokenIndex);
    if (gid === undefined) return;
    if (statuses[gid] === "correct") return;

    // Prefill edit with the original phrase (without trailing punctuation)
    const g = groups.find((x) => x.id === gid)!;
    const rawPhrase = tokens
      .slice(g.start, g.start + g.length)
      .map((t) => stripTrailingPunct(t.text))
      .join(" ");
    setEdits((prev) => ({ ...prev, [gid]: rawPhrase }));
    setEditingId(gid);
  };

  const submitEdit = (gid: number) => {
    const attemptRaw = (edits[gid] ?? "").trim();
    if (!attemptRaw) return;

    const g = groups.find((x) => x.id === gid)!;
    const answer = g.right;

    if (normalize(attemptRaw) === normalize(answer)) {
      if (statuses[gid] !== "correct") setScore((s) => s + 20);
      setStatuses((prev) => ({ ...prev, [gid]: "correct" }));
      setEditingId(null);
    } else {
      setScore((s) => s - 5);
      setStatuses((prev) => ({ ...prev, [gid]: "wrong" }));
      // keep editing open to allow further tries
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, gid: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitEdit(gid);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setEditingId(null);
    }
  };

  const onSubmitGame = () => {
    setEnded(true);
    setEditingId(null);
  };

  const onReset = () => {
    const nextStatuses: Record<number, Status> = {};
    groups.forEach((g) => (nextStatuses[g.id] = "pending"));
    setStatuses(nextStatuses);
    setEdits({});
    setEditingId(null);
    setScore(0);
    setSecondsLeft(INITIAL_SECONDS);
    setEnded(false);
  };

  const onRetryDifferent = useCallback(() => {
    if (PASSAGES.length <= 1) {
      onReset();
      return;
    }
    let next = Math.floor(Math.random() * PASSAGES.length);
    if (next === passageIndex) next = (next + 1) % PASSAGES.length;
    setPassageIndex(next);
  }, [passageIndex]);

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-nova-500/15 via-background to-electric-500/15">
      {/* Header */}
      <header className="w-full sticky top-0 z-20 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-nova-400 via-electric-400 to-cyber-400 bg-clip-text text-transparent">Grammar Detective</span>
          </h1>
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm border",
              secondsLeft <= 15
                ? "bg-red-500/10 text-red-500 border-red-500/30"
                : secondsLeft <= 60
                  ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
                  : "bg-cyan-500/10 text-cyan-600 border-cyan-500/30"
            )}
          >
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
              <Badge variant="outline" className="bg-electric-500/10 text-electric-600 border-electric-500/30">
                Find mistakes ({groups.length})
              </Badge>
              <div className="text-sm text-muted-foreground">Click a wrong word to edit it</div>
            </div>

            <div className="text-lg leading-8 sm:text-xl sm:leading-9">
              {(() => {
                const out: React.ReactNode[] = [];
                let i = 0;
                while (i < tokens.length) {
                  const gid = groupIdByToken.get(i);
                  if (gid !== undefined) {
                    const g = groups.find((x) => x.id === gid)!;
                    const phraseTokens = tokens.slice(g.start, g.start + g.length);
                    const punct = trailingPunct(phraseTokens[phraseTokens.length - 1].text);
                    const original = phraseTokens.map((t) => stripTrailingPunct(t.text)).join(" ");
                    const status = statuses[gid];
                    const isEditing = editingId === gid;

                    if (isEditing) {
                      out.push(
                        <span key={`g-${gid}`} className="inline-flex items-center align-baseline mr-1 mb-2">
                          <input
                            ref={inputRef}
                            value={edits[gid] ?? ""}
                            onChange={(e) => setEdits((prev) => ({ ...prev, [gid]: e.target.value }))}
                            onKeyDown={(e) => onKeyDown(e, gid)}
                            onBlur={() => submitEdit(gid)}
                            className="px-2 py-1 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-electric-500 text-base"
                            aria-label={`Edit phrase ${original}`}
                          />
                          {punct && <span className="ml-1">{punct}</span>}
                        </span>
                      );
                    } else {
                      const base = "inline-block align-baseline px-1.5 py-0.5 rounded-md mr-1 mb-2 transition-colors";
                      const styles = status === "correct"
                        ? "bg-green-500/15 text-green-700 border border-green-500/30"
                        : status === "wrong"
                          ? "bg-red-500/15 text-red-700 border border-red-500/30"
                          : "bg-yellow-500/10 text-yellow-700 border border-yellow-500/30 cursor-text hover:bg-yellow-500/20";

                      out.push(
                        <span
                          key={`g-${gid}`}
                          className={cn(base, styles)}
                          onClick={() => openEditorForToken(i)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              openEditorForToken(i);
                            }
                          }}
                          aria-label={`Edit mistaken phrase ${original}`}
                        >
                          {original}
                        </span>
                      );
                      if (punct) out.push(<span key={`p-${gid}`} className="mr-2">{punct}</span>);
                      else out.push(<span key={`sp-${gid}`}> </span>);
                    }

                    i = g.start + g.length;
                    continue;
                  }

                  // Normal token (not part of a mistake group)
                  const t = tokens[i];
                  out.push(
                    <span key={i} className="inline-block align-baseline px-1.5 py-0.5 rounded-md mr-1 mb-2 transition-colors">
                      {stripTrailingPunct(t.text)}
                    </span>
                  );
                  const punct = trailingPunct(t.text);
                  if (punct) out.push(<span key={`p-${i}`} className="mr-2">{punct}</span>);
                  else out.push(<span key={`sp-${i}`}> </span>);
                  i++;
                }
                return out;
              })()}
            </div>
          </CardContent>
        </Card>

        {/* Bottom Controls */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-lg font-semibold">
            Score: <span className={cn(score >= 0 ? "text-green-600" : "text-red-600")}>{score}</span>
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
                <h2 className="text-2xl font-bold">Game Over</h2>
                <Badge variant="outline" className="bg-gradient-to-r from-nova-500/15 to-electric-500/15">{formatTime(secondsLeft)}</Badge>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span className="text-foreground font-medium">Correct fixes: {correctCount} / {groups.length}</span>
              </div>

              <div className="flex items-center gap-3">
                <XCircle className="h-6 w-6 text-red-500" />
                <span className="text-foreground font-medium">Remaining: {groups.length - correctCount}</span>
              </div>

              <div className="pt-2 text-lg font-semibold">
                Final Score: <span className={cn(score >= 0 ? "text-green-600" : "text-red-600")}>{score}</span>
              </div>

              <div className="pt-4 flex justify-between gap-3">
                <Button variant="outline" onClick={() => navigate("/game-arena")} className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back to Game Arena
                </Button>
                <Button onClick={onRetryDifferent} className="bg-gradient-to-r from-nova-500 to-electric-500 text-white">Retry</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
