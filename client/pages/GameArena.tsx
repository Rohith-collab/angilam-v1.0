import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Gamepad2,
  Trophy,
  Zap,
  Crown,
  Star,
  Target,
  Users,
  Clock,
  Flame,
  Award,
  Play,
  Volume2,
  Settings,
  ChevronRight,
  Sparkles,
  Swords,
  Shield,
  Coins,
  Timer,
  Puzzle,
  ArrowDown,
  HelpCircle,
  Type,
  Search,
  AlertTriangle,
  Shuffle,
  Info,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import WordBuildingBattles from "@/components/WordBuildingBattles";
import { useNavigate } from "react-router-dom";

interface GameMode {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  players: number;
  duration: string;
  reward: number;
  icon: React.ReactNode;
  color: string;
  isLocked: boolean;
  requirementText?: string;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  avatar: string;
  level: number;
  isCurrentUser?: boolean;
}

const GameArena = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<string>("");
  const [showWordBattles, setShowWordBattles] = useState(false);
  const [userLevel, setUserLevel] = useState(15);
  const [userCoins, setUserCoins] = useState(2450);
  const [userXP, setUserXP] = useState(3680);
  const [nextLevelXP] = useState(4000);

  const gameModes: GameMode[] = [
    {
      id: "word-building-battles",
      title: "Word Building Battles",
      description:
        "Race the clock to form valid words from random letters. Solo or versus AI.",
      difficulty: "Easy",
      players: 1,
      duration: "1 min",
      reward: 50,
      icon: <Type className="h-6 w-6" />,
      color: "from-electric-500 to-electric-600",
      isLocked: false,
    },
    {
      id: "grammar-detective",
      title: "Grammar Detective",
      description:
        "Spot and fix errors in humorous passages before time runs out.",
      difficulty: "Medium",
      players: 1,
      duration: "3 min",
      reward: 100,
      icon: <Search className="h-6 w-6" />,
      color: "from-cyber-500 to-cyber-600",
      isLocked: false,
    },
    {
      id: "survival-mode",
      title: "Survival Mode",
      description: "One life. Rising difficulty. Miss once and it's game over.",
      difficulty: "Hard",
      players: 1,
      duration: "5 min",
      reward: 200,
      icon: <AlertTriangle className="h-6 w-6" />,
      color: "from-red-500 to-red-600",
      isLocked: false,
    },
    {
      id: "jumbled-words",
      title: "Jumbled Words",
      description: "Unscramble letters into correct words under a timer.",
      difficulty: "Medium",
      players: 1,
      duration: "2 min",
      reward: 75,
      icon: <Shuffle className="h-6 w-6" />,
      color: "from-nova-500 to-nova-600",
      isLocked: false,
    },
    {
      id: "accent-arena",
      title: "Accent Arena",
      description:
        "Practice different English accents in this immersive challenge mode.",
      difficulty: "Hard",
      players: 1,
      duration: "8 min",
      reward: 250,
      icon: <Volume2 className="h-6 w-6" />,
      color: "from-cyan-500 to-cyan-600",
      isLocked: false,
    },
  ];

  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, name: "Sarah Chen", score: 15420, avatar: "SC", level: 28 },
    { rank: 2, name: "Alex Rivera", score: 14850, avatar: "AR", level: 26 },
    { rank: 3, name: "Emma Watson", score: 14200, avatar: "EW", level: 25 },
    {
      rank: 4,
      name: "You",
      score: 13950,
      avatar: currentUser?.displayName?.charAt(0) || "U",
      level: userLevel,
      isCurrentUser: true,
    },
    { rank: 5, name: "David Kim", score: 13100, avatar: "DK", level: 23 },
    { rank: 6, name: "Luna Garcia", score: 12800, avatar: "LG", level: 22 },
    { rank: 7, name: "James Wilson", score: 12450, avatar: "JW", level: 21 },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Hard":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Expert":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getLevelProgress = () => {
    return ((userXP % 1000) / 1000) * 100;
  };

  const scrollToGameModes = () => {
    const gameModeSection = document.getElementById("game-modes-section");
    if (gameModeSection) {
      gameModeSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToHowItWorks = () => {
    const howItWorksSection = document.getElementById("how-it-works-section");
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Intense Gaming Background */}
      <div className="fixed inset-0 z-0">
        {/* Theme-aware cyberpunk base */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-nova-950/20 dark:via-nova-950/80 to-electric-950/20 dark:to-electric-950/60"></div>

        {/* HUD-style scanning lines */}
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(0, 255, 127, 0.08) 2px,
                  rgba(0, 255, 127, 0.08) 4px
                ),
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 2px,
                  rgba(59, 130, 246, 0.08) 2px,
                  rgba(59, 130, 246, 0.08) 4px
                )
              `,
              animation: "scan-lines 3s linear infinite",
            }}
          ></div>
        </div>

        {/* Cyberpunk grid matrix */}
        <div className="absolute inset-0 opacity-15 dark:opacity-30">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(138, 43, 226, 0.6) 1px, transparent 1px),
                linear-gradient(90deg, rgba(138, 43, 226, 0.6) 1px, transparent 1px),
                linear-gradient(rgba(0, 191, 255, 0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 191, 255, 0.5) 1px, transparent 1px),
                linear-gradient(rgba(0, 255, 127, 0.4) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 127, 0.4) 1px, transparent 1px)
              `,
              backgroundSize:
                "40px 40px, 40px 40px, 80px 80px, 80px 80px, 160px 160px, 160px 160px",
              animation: "matrix-rain 25s linear infinite",
            }}
          ></div>
        </div>

        {/* Gaming HUD elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Corner HUD elements */}
          <div className="absolute top-4 left-4 w-20 h-20 border-l-2 border-t-2 border-electric-500/80 dark:border-electric-400/60 animate-pulse"></div>
          <div
            className="absolute top-4 right-4 w-20 h-20 border-r-2 border-t-2 border-cyber-500/80 dark:border-cyber-400/60 animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute bottom-4 left-4 w-20 h-20 border-l-2 border-b-2 border-nova-500/80 dark:border-nova-400/60 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-4 right-4 w-20 h-20 border-r-2 border-b-2 border-electric-500/80 dark:border-electric-400/60 animate-pulse"
            style={{ animationDelay: "1.5s" }}
          ></div>

          {/* Floating cyberpunk shapes */}
          <div className="absolute top-20 left-10 w-32 h-32 border-2 border-electric-600/60 dark:border-electric-500/40 transform rotate-45 animate-spin-slow opacity-60 dark:opacity-40 gaming-hexagon"></div>
          <div className="absolute top-40 right-20 w-24 h-24 border-2 border-cyber-600/70 dark:border-cyber-500/50 transform rotate-12 animate-float opacity-70 dark:opacity-50 gaming-diamond"></div>
          <div
            className="absolute bottom-40 left-1/4 w-40 h-40 border-2 border-nova-600/50 dark:border-nova-500/30 transform -rotate-12 animate-pulse-scale opacity-60 dark:opacity-40 gaming-triangle"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-20 right-1/3 w-28 h-28 border-2 border-electric-600/65 dark:border-electric-400/45 transform rotate-45 animate-float opacity-70 dark:opacity-50 gaming-octagon"
            style={{ animationDelay: "2s" }}
          ></div>

          {/* Neon circuit patterns */}
          <div className="absolute top-1/3 left-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-cyber-500 dark:via-cyber-400/80 to-transparent animate-circuit-flow"></div>
          <div
            className="absolute top-1/2 left-1/4 w-1 h-32 bg-gradient-to-b from-transparent via-electric-500 dark:via-electric-400/80 to-transparent animate-circuit-flow"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-1/3 right-1/3 w-28 h-1 bg-gradient-to-l from-transparent via-nova-500 dark:via-nova-400/80 to-transparent animate-circuit-flow"
            style={{ animationDelay: "2s" }}
          ></div>

          {/* Gaming particles with trails */}
          <div
            className="absolute top-1/4 left-1/3 w-3 h-3 bg-electric-500 dark:bg-electric-400 rounded-full animate-particle-trail gaming-particle"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute top-2/3 right-1/3 w-2 h-2 bg-cyber-500 dark:bg-cyber-400 rounded-full animate-particle-bounce gaming-particle"
            style={{ animationDelay: "1.5s" }}
          ></div>
          <div
            className="absolute bottom-1/4 left-2/3 w-4 h-4 bg-nova-500 dark:bg-nova-400 rounded-full animate-particle-orbit gaming-particle"
            style={{ animationDelay: "2.5s" }}
          ></div>

          {/* Floating Cyberpunk English Alphabets */}
          <div
            className="absolute top-20 left-20 text-4xl font-bold text-electric-500/60 dark:text-electric-400/40 animate-float cyberpunk-alphabet"
            style={{ animationDelay: "0s" }}
          >
            A
          </div>
          <div
            className="absolute top-32 right-24 text-3xl font-bold text-cyber-500/50 dark:text-cyber-400/30 animate-particle-bounce cyberpunk-alphabet"
            style={{ animationDelay: "1s" }}
          >
            B
          </div>
          <div
            className="absolute top-48 left-1/4 text-5xl font-bold text-nova-500/70 dark:text-nova-400/50 animate-particle-orbit cyberpunk-alphabet"
            style={{ animationDelay: "2s" }}
          >
            C
          </div>
          <div
            className="absolute top-64 right-1/3 text-2xl font-bold text-pink-500/60 dark:text-pink-400/40 animate-particle-trail cyberpunk-alphabet"
            style={{ animationDelay: "0.5s" }}
          >
            D
          </div>
          <div
            className="absolute top-80 left-1/2 text-4xl font-bold text-cyan-500/50 dark:text-cyan-400/30 animate-float cyberpunk-alphabet"
            style={{ animationDelay: "1.5s" }}
          >
            E
          </div>

          <div
            className="absolute bottom-80 left-16 text-3xl font-bold text-electric-500/60 dark:text-electric-400/40 animate-particle-trail cyberpunk-alphabet"
            style={{ animationDelay: "3s" }}
          >
            F
          </div>
          <div
            className="absolute bottom-64 right-20 text-4xl font-bold text-cyber-500/70 dark:text-cyber-400/50 animate-particle-bounce cyberpunk-alphabet"
            style={{ animationDelay: "2.5s" }}
          >
            G
          </div>
          <div
            className="absolute bottom-48 left-1/3 text-2xl font-bold text-nova-500/50 dark:text-nova-400/30 animate-particle-orbit cyberpunk-alphabet"
            style={{ animationDelay: "4s" }}
          >
            H
          </div>
          <div
            className="absolute bottom-32 right-1/4 text-5xl font-bold text-purple-500/60 dark:text-purple-400/40 animate-float cyberpunk-alphabet"
            style={{ animationDelay: "3.5s" }}
          >
            I
          </div>
          <div
            className="absolute bottom-16 left-2/3 text-3xl font-bold text-yellow-500/50 dark:text-yellow-400/30 animate-particle-orbit cyberpunk-alphabet"
            style={{ animationDelay: "5s" }}
          >
            J
          </div>

          <div
            className="absolute top-1/3 left-12 text-4xl font-bold text-red-500/60 dark:text-red-400/40 animate-particle-bounce cyberpunk-alphabet"
            style={{ animationDelay: "1.2s" }}
          >
            K
          </div>
          <div
            className="absolute top-1/2 right-12 text-2xl font-bold text-green-500/50 dark:text-green-400/30 animate-float cyberpunk-alphabet"
            style={{ animationDelay: "2.7s" }}
          >
            L
          </div>
          <div
            className="absolute top-2/3 left-8 text-5xl font-bold text-blue-500/70 dark:text-blue-400/50 animate-particle-bounce cyberpunk-alphabet"
            style={{ animationDelay: "4.2s" }}
          >
            M
          </div>
          <div
            className="absolute bottom-1/3 right-8 text-3xl font-bold text-indigo-500/60 dark:text-indigo-400/40 animate-particle-trail cyberpunk-alphabet"
            style={{ animationDelay: "3.8s" }}
          >
            N
          </div>
          <div
            className="absolute top-1/4 right-1/2 text-4xl font-bold text-teal-500/50 dark:text-teal-400/30 animate-particle-orbit cyberpunk-alphabet"
            style={{ animationDelay: "5.5s" }}
          >
            O
          </div>

          <div
            className="absolute top-3/4 left-1/4 text-2xl font-bold text-orange-500/60 dark:text-orange-400/40 animate-float cyberpunk-alphabet"
            style={{ animationDelay: "6s" }}
          >
            P
          </div>
          <div
            className="absolute top-1/6 right-1/6 text-5xl font-bold text-emerald-500/70 dark:text-emerald-400/50 animate-particle-bounce cyberpunk-alphabet"
            style={{ animationDelay: "2.3s" }}
          >
            Q
          </div>
          <div
            className="absolute bottom-1/6 left-1/6 text-3xl font-bold text-rose-500/50 dark:text-rose-400/30 animate-float cyberpunk-alphabet"
            style={{ animationDelay: "4.7s" }}
          >
            R
          </div>
          <div
            className="absolute top-5/6 right-2/3 text-4xl font-bold text-violet-500/60 dark:text-violet-400/40 animate-particle-trail cyberpunk-alphabet"
            style={{ animationDelay: "3.2s" }}
          >
            S
          </div>
          <div
            className="absolute top-1/8 left-3/4 text-2xl font-bold text-amber-500/50 dark:text-amber-400/30 animate-particle-orbit cyberpunk-alphabet"
            style={{ animationDelay: "5.8s" }}
          >
            T
          </div>

          <div
            className="absolute bottom-1/8 right-3/4 text-5xl font-bold text-lime-500/70 dark:text-lime-400/50 animate-float cyberpunk-alphabet"
            style={{ animationDelay: "1.8s" }}
          >
            U
          </div>
          <div
            className="absolute top-7/8 left-1/8 text-3xl font-bold text-sky-500/60 dark:text-sky-400/40 animate-particle-bounce cyberpunk-alphabet"
            style={{ animationDelay: "4.5s" }}
          >
            V
          </div>
          <div
            className="absolute top-3/8 right-1/8 text-4xl font-bold text-fuchsia-500/50 dark:text-fuchsia-400/30 animate-float cyberpunk-alphabet"
            style={{ animationDelay: "6.2s" }}
          >
            W
          </div>
          <div
            className="absolute bottom-3/8 left-7/8 text-2xl font-bold text-zinc-500/60 dark:text-zinc-400/40 animate-particle-trail cyberpunk-alphabet"
            style={{ animationDelay: "2.9s" }}
          >
            X
          </div>
          <div
            className="absolute top-5/8 right-7/8 text-5xl font-bold text-slate-500/70 dark:text-slate-400/50 animate-particle-orbit cyberpunk-alphabet"
            style={{ animationDelay: "5.3s" }}
          >
            Y
          </div>
          <div
            className="absolute bottom-5/8 left-5/8 text-3xl font-bold text-stone-500/50 dark:text-stone-400/30 animate-float cyberpunk-alphabet"
            style={{ animationDelay: "3.7s" }}
          >
            Z
          </div>

          {/* Holographic effects */}
          <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-gradient-radial from-electric-500/30 dark:from-electric-400/20 via-electric-500/15 dark:via-electric-400/10 to-transparent animate-hologram"></div>
          <div
            className="absolute bottom-1/2 left-1/5 w-32 h-32 rounded-full bg-gradient-radial from-cyber-500/25 dark:from-cyber-400/15 via-cyber-500/12 dark:via-cyber-400/8 to-transparent animate-hologram"
            style={{ animationDelay: "3s" }}
          ></div>
        </div>

        {/* Dynamic light sweeps */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-electric-500/20 dark:via-electric-500/15 to-transparent animate-light-sweep"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-cyber-500/15 dark:via-cyber-500/10 to-transparent animate-light-sweep-reverse"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-nova-500/20 dark:from-nova-500/15 via-transparent to-electric-500/20 dark:to-electric-500/15 animate-vertical-sweep"></div>

        {/* Gaming atmosphere overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-nova-200/20 dark:from-nova-900/40 via-transparent to-electric-200/20 dark:to-electric-900/30"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 overflow-hidden min-h-[60vh] sm:min-h-[80vh] flex items-center">
        {/* Gaming arena atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-br from-nova-500/30 dark:from-nova-500/20 via-transparent to-electric-500/30 dark:to-electric-500/20 animate-arena-pulse"></div>

        {/* HUD overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-8 left-8 text-electric-600 dark:text-electric-400/60 font-mono text-xs animate-pulse hud-element">
            [ARENA INITIALIZED]
          </div>
          <div
            className="absolute top-8 right-8 text-cyber-600 dark:text-cyber-400/60 font-mono text-xs animate-pulse hud-element"
            style={{ animationDelay: "1s" }}
          >
            [SYSTEMS ONLINE]
          </div>
          <div
            className="absolute bottom-8 left-8 text-nova-600 dark:text-nova-400/60 font-mono text-xs animate-pulse hud-element"
            style={{ animationDelay: "2s" }}
          >
            [READY FOR COMBAT]
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 w-full">
          <div className="text-center space-y-6 sm:space-y-8 mb-8 sm:mb-12">
            {/* Cyberpunk Gaming Icons */}
            <div
              className="flex justify-center items-center space-x-6 sm:space-x-8 mb-6 opacity-0 animate-fadeIn"
              style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
            >
              <div className="relative group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-electric-500 to-electric-600 rounded-2xl flex items-center justify-center glow-electric transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 gaming-icon border-2 border-electric-400/50">
                  <Gamepad2 className="h-8 w-8 sm:h-10 sm:w-10 text-white animate-pulse" />
                </div>
                <div className="absolute -inset-3 bg-gradient-to-br from-electric-500/40 to-electric-600/40 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-electric-400/80 rounded-t-2xl animate-loading-bar"></div>
              </div>

              <div className="relative group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyber-500 to-cyber-600 rounded-2xl flex items-center justify-center glow-cyber transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 gaming-icon border-2 border-cyber-400/50">
                  <Timer
                    className="h-8 w-8 sm:h-10 sm:w-10 text-white animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  />
                </div>
                <div
                  className="absolute -inset-3 bg-gradient-to-br from-cyber-500/40 to-cyber-600/40 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute top-0 left-0 w-full h-1 bg-cyber-400/80 rounded-t-2xl animate-loading-bar"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>

              <div className="relative group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-nova-500 to-nova-600 rounded-2xl flex items-center justify-center glow transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 gaming-icon border-2 border-nova-400/50">
                  <Puzzle
                    className="h-8 w-8 sm:h-10 sm:w-10 text-white animate-pulse"
                    style={{ animationDelay: "1s" }}
                  />
                </div>
                <div
                  className="absolute -inset-3 bg-gradient-to-br from-nova-500/40 to-nova-600/40 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute top-0 left-0 w-full h-1 bg-nova-400/80 rounded-t-2xl animate-loading-bar"
                  style={{ animationDelay: "2s" }}
                ></div>
              </div>
            </div>

            {/* Main Heading with Clear Cyberpunk Effects */}
            <h1
              className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight opacity-0 animate-fadeIn"
              style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
            >
              <span className="relative inline-block mb-4">
                {/* Clear, sharp cyberpunk title */}
                <span className="relative z-10 block font-black text-center px-6 py-4 rounded-xl bg-gradient-to-r from-electric-600 via-cyan-500 to-cyber-600 dark:from-electric-400 dark:via-cyan-400 dark:to-cyber-400 bg-clip-text text-transparent tracking-wide sharp-text">
                  LEVEL UP YOUR LANGUAGE:
                </span>

                {/* Reduced glow effect - no blur on text layer */}
                <div className="absolute -inset-6 bg-gradient-to-r from-electric-500/20 via-cyan-500/25 to-cyber-500/20 blur-2xl animate-pulse rounded-xl -z-10"></div>

                {/* Subtle corner brackets */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-l-2 border-t-2 border-electric-400/70 dark:border-electric-300/50"></div>
                <div className="absolute -top-1 -right-1 w-6 h-6 border-r-2 border-t-2 border-cyber-400/70 dark:border-cyber-300/50"></div>
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-2 border-b-2 border-electric-400/70 dark:border-electric-300/50"></div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-2 border-b-2 border-cyber-400/70 dark:border-cyber-300/50"></div>
              </span>

              <br />

              <span className="relative inline-block mt-4">
                <span className="relative z-10 font-bold text-foreground dark:text-foreground text-center block gaming-subtitle">
                  WELCOME TO THE GAME ARENA!
                </span>
                <div className="absolute -inset-1 bg-gradient-to-r from-electric-500/15 to-cyber-500/15 blur-md rounded"></div>
              </span>
            </h1>

            {/* Gaming Subtext */}
            <div
              className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed opacity-0 animate-fadeIn gaming-subtext"
              style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
            >
              <p className="text-muted-foreground mb-2">
                <span className="font-mono text-electric-600 dark:text-electric-400">
                  [MISSION BRIEFING]
                </span>{" "}
                Sharpen your English through exciting, interactive games.
              </p>
              <p className="text-cyber-600 dark:text-cyber-400 font-bold text-xl animate-pulse">
                NOT YOUR AVERAGE GRAMMAR LESSON — IT'S AN ADVENTURE!
              </p>
              <div className="flex justify-center mt-4 space-x-4 text-sm font-mono">
                <span className="text-nova-600 dark:text-nova-400 animate-pulse hud-element">
                  [READY]
                </span>
                <span
                  className="text-electric-600 dark:text-electric-400 animate-pulse hud-element"
                  style={{ animationDelay: "0.5s" }}
                >
                  [AIM]
                </span>
                <span
                  className="text-cyber-600 dark:text-cyber-400 animate-pulse hud-element"
                  style={{ animationDelay: "1s" }}
                >
                  [FIRE]
                </span>
              </div>
            </div>

            {/* Gaming Action Buttons */}
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 opacity-0 animate-fadeIn"
              style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
            >
              <Button
                onClick={scrollToGameModes}
                size="lg"
                className="relative bg-gradient-to-r from-electric-500 to-cyber-500 hover:from-electric-400 hover:to-cyber-400 text-white font-bold px-8 py-4 rounded-xl glow-electric transition-all duration-300 hover:scale-110 text-lg w-full sm:w-auto min-w-[220px] gaming-button border-2 border-electric-400/50 overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  <Swords className="h-5 w-5 mr-2 animate-pulse" />
                  ENTER THE ARENA
                  <ArrowDown className="h-5 w-5 ml-2 animate-bounce" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 animate-button-shine"></div>
              </Button>

              <Button
                onClick={scrollToHowItWorks}
                variant="outline"
                size="lg"
                className="relative border-2 border-cyber-500/80 dark:border-cyber-400/60 hover:border-cyber-600 dark:hover:border-cyber-400 text-cyber-600 dark:text-cyber-400 hover:bg-cyber-500/20 dark:hover:bg-cyber-400/20 hover:text-background dark:hover:text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-110 text-lg w-full sm:w-auto min-w-[220px] gaming-button-outline backdrop-blur-sm bg-background/30 dark:bg-black/30"
              >
                <span className="relative z-10 flex items-center">
                  <Shield className="h-5 w-5 mr-2 animate-pulse" />
                  HOW IT WORKS
                  <HelpCircle className="h-5 w-5 ml-2" />
                </span>
                <div className="absolute inset-0 bg-cyber-500/15 dark:bg-cyber-400/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              </Button>
            </div>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <Card className="bg-card/90 dark:bg-card/80 backdrop-blur-md border-border hover:border-electric-500/70 dark:hover:border-electric-500/50 transition-all duration-300 hover:scale-105 gaming-card">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Crown className="h-5 w-5 text-yellow-400 mr-2" />
                  <span className="text-lg sm:text-2xl font-bold text-foreground">
                    {userLevel}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Level
                </p>
                <div className="mt-2">
                  <Progress value={getLevelProgress()} className="h-1.5" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {userXP}/{nextLevelXP} XP
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/90 dark:bg-card/80 backdrop-blur-md border-border hover:border-cyber-500/70 dark:hover:border-cyber-500/50 transition-all duration-300 hover:scale-105 gaming-card">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Coins className="h-5 w-5 text-yellow-400 mr-2" />
                  <span className="text-lg sm:text-2xl font-bold text-foreground">
                    {userCoins.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Coins
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/90 dark:bg-card/80 backdrop-blur-md border-border hover:border-nova-500/70 dark:hover:border-nova-500/50 transition-all duration-300 hover:scale-105 gaming-card">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="h-5 w-5 text-electric-400 mr-2" />
                  <span className="text-lg sm:text-2xl font-bold text-foreground">
                    47
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Wins</p>
              </CardContent>
            </Card>

            <Card className="bg-card/90 dark:bg-card/80 backdrop-blur-md border-border hover:border-red-500/70 dark:hover:border-red-500/50 transition-all duration-300 hover:scale-105 gaming-card">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Flame className="h-5 w-5 text-red-400 mr-2" />
                  <span className="text-lg sm:text-2xl font-bold text-foreground">
                    12
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Streak
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Gaming section background overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/90 dark:via-background/80 to-background z-0 rounded-3xl"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Modes */}
          <div id="game-modes-section" className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center">
                <Play className="h-6 w-6 sm:h-8 sm:w-8 text-electric-400 mr-3" />
                Game Modes
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {gameModes.map((mode, index) => (
                <Card
                  key={mode.id}
                  className={`bg-card/90 dark:bg-card/80 backdrop-blur-md border transition-all duration-500 hover:scale-105 cursor-pointer group relative overflow-hidden gaming-card ${
                    mode.isLocked
                      ? "border-border hover:border-muted opacity-75"
                      : "border-border hover:border-electric-500/70 dark:hover:border-electric-500/50 glow-electric"
                  }`}
                  onClick={() => {
                    if (mode.isLocked) return;
                    if (mode.id === "grammar-detective") {
                      navigate("/game/grammar-detective");
                    } else {
                      setSelectedMode(mode.id);
                    }
                  }}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-foreground/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-br ${mode.color} glow`}
                      >
                        {mode.icon}
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge
                          variant="outline"
                          className={getDifficultyColor(mode.difficulty)}
                        >
                          {mode.difficulty}
                        </Badge>
                        {mode.isLocked && (
                          <Badge
                            variant="outline"
                            className="bg-muted/50 text-muted-foreground border-muted"
                          >
                            🔒 Locked
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-foreground text-lg sm:text-xl mt-4 group-hover:text-electric-400 transition-colors duration-300">
                      {mode.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {mode.description}
                    </p>

                    {mode.isLocked && mode.requirementText && (
                      <p className="text-yellow-400 text-xs font-medium bg-yellow-500/10 px-3 py-2 rounded-lg border border-yellow-500/20">
                        {mode.requirementText}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {mode.players === 1
                            ? "Solo"
                            : `${mode.players} players`}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {mode.duration}
                        </span>
                      </div>
                      <span className="flex items-center text-yellow-400 font-medium">
                        <Coins className="h-4 w-4 mr-1" />+{mode.reward}
                      </span>
                    </div>

                    <Button
                      className={`w-full ${
                        mode.isLocked
                          ? "bg-muted hover:bg-muted/80 text-muted-foreground cursor-not-allowed"
                          : "bg-gradient-to-r from-electric-500 to-cyber-500 hover:from-electric-600 hover:to-cyber-600 text-white glow-electric"
                      } transition-all duration-300`}
                      disabled={mode.isLocked}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!mode.isLocked) {
                          if (mode.id === "word-building-battles") {
                            setShowWordBattles(true);
                          } else if (mode.id === "grammar-detective") {
                            navigate("/game/grammar-detective");
                          } else {
                            setSelectedMode(mode.id);
                          }
                        }
                      }}
                    >
                      {mode.isLocked ? "Locked" : "Play Now"}
                      {!mode.isLocked && (
                        <ChevronRight className="h-4 w-4 ml-2" />
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="space-y-6">
            <Card className="bg-card/90 dark:bg-card/80 backdrop-blur-md border-border gaming-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Trophy className="h-5 w-5 text-yellow-400 mr-2" />
                  Global Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                      entry.isCurrentUser
                        ? "bg-electric-500/20 border border-electric-500/30 glow-electric"
                        : "bg-muted/30 hover:bg-muted/50"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${
                        entry.rank === 1
                          ? "bg-yellow-500 text-black"
                          : entry.rank === 2
                            ? "bg-gray-300 text-black"
                            : entry.rank === 3
                              ? "bg-orange-500 text-white"
                              : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {entry.rank}
                    </div>

                    <Avatar className="h-8 w-8">
                      <AvatarFallback
                        className={`text-sm font-bold ${
                          entry.isCurrentUser
                            ? "bg-electric-500 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {entry.avatar}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          entry.isCurrentUser
                            ? "text-electric-400"
                            : "text-foreground"
                        }`}
                      >
                        {entry.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Level {entry.level}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-cyan-400">
                        {entry.score.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                ))}

                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground hover:text-foreground mt-4"
                >
                  View Full Leaderboard
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Daily Challenges */}
            <Card className="bg-card/90 dark:bg-card/80 backdrop-blur-md border-border gaming-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-2" />
                  Daily Challenges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-nova-500/30 dark:from-nova-500/20 to-electric-500/30 dark:to-electric-500/20 rounded-xl border border-nova-500/50 dark:border-nova-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">
                      Word Master
                    </h3>
                    <Badge
                      variant="outline"
                      className="bg-nova-500/30 dark:bg-nova-500/20 text-nova-600 dark:text-nova-400 border-nova-500/50 dark:border-nova-500/30"
                    >
                      2/3 Complete
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Complete 3 Word Building Battles today
                  </p>
                  <div className="flex items-center justify-between">
                    <Progress value={66} className="flex-1 mr-3 h-2" />
                    <span className="text-xs text-yellow-400 font-medium flex items-center">
                      <Coins className="h-3 w-3 mr-1" />
                      +100
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-cyber-500/30 dark:from-cyber-500/20 to-green-500/30 dark:to-green-500/20 rounded-xl border border-cyber-500/50 dark:border-cyber-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">
                      Accent Expert
                    </h3>
                    <Badge
                      variant="outline"
                      className="bg-cyber-500/30 dark:bg-cyber-500/20 text-cyber-600 dark:text-cyber-400 border-cyber-500/50 dark:border-cyber-500/30"
                    >
                      1/5 Complete
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Master 5 different accents in Accent Arena
                  </p>
                  <div className="flex items-center justify-between">
                    <Progress value={20} className="flex-1 mr-3 h-2" />
                    <span className="text-xs text-yellow-400 font-medium flex items-center">
                      <Award className="h-3 w-3 mr-1" />
                      Badge
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div
        id="how-it-works-section"
        className="relative py-16 sm:py-24 overflow-hidden"
      >
        {/* Section background with gaming effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-nova-100/20 dark:via-nova-900/10 to-background"></div>
        <div className="absolute inset-0 opacity-15 dark:opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(138, 43, 226, 0.4) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.4) 0%, transparent 50%)
              `,
              animation: "gradient 15s ease infinite",
            }}
          ></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              <span className="bg-gradient-to-r from-electric-400 via-cyber-400 to-nova-400 bg-clip-text text-transparent">
                Why Gaming Works
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your learning experience through the power of
              gamification and interactive challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-electric-500 to-electric-600 rounded-2xl flex items-center justify-center glow-electric group-hover:scale-110 transition-all duration-300">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                Instant Feedback
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Get immediate corrections and tips as you play. No waiting, no
                confusion — just rapid improvement through real-time guidance.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-cyber-500 to-cyber-600 rounded-2xl flex items-center justify-center glow-cyber group-hover:scale-110 transition-all duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                Social Learning
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Challenge friends and learners worldwide. Competition and
                collaboration make learning memorable and motivating.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-nova-500 to-nova-600 rounded-2xl flex items-center justify-center glow group-hover:scale-110 transition-all duration-300">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                Adaptive Difficulty
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Smart algorithms adjust challenge levels to your skill. Always
                in the perfect learning zone — never too easy, never
                overwhelming.
              </p>
            </div>
          </div>

          <div className="text-center mt-12 sm:mt-16">
            <Button
              onClick={scrollToGameModes}
              size="lg"
              className="bg-gradient-to-r from-nova-500 to-electric-500 hover:from-nova-600 hover:to-electric-600 text-white font-semibold px-8 py-4 rounded-xl glow transition-all duration-300 hover:scale-105 text-lg"
            >
              Start Your Adventure
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Word Building Battles Game Modal */}
      {showWordBattles && (
        <WordBuildingBattles
          onClose={() => setShowWordBattles(false)}
          duration={60}
          rackSize={7}
          minLength={3}
          aiEnabled={false}
        />
      )}
    </div>
  );
};

export default GameArena;
