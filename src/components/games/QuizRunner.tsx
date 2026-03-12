"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import type { GameQuestion, GameResult } from "./types";

interface QuizRunnerProps {
  questions: GameQuestion[];
  onGameOver: (result: GameResult) => void;
}

const MAX_LIVES = 3;
const GATE_SPEED_INITIAL = 0.008;
const GATE_SPEED_INCREMENT = 0.0003;

interface Gate {
  id: number;
  questionIndex: number;
  options: string[]; // 3 options, one per lane
  correctLane: number; // 0, 1, or 2
  z: number; // 0 (far) to 1 (player position)
  passed: boolean;
  hit: boolean;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export default function QuizRunner({ questions, onGameOver }: QuizRunnerProps) {
  const [playerLane, setPlayerLane] = useState(1); // center
  const [targetLane, setTargetLane] = useState(1);
  const [lives, setLives] = useState(MAX_LIVES);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [gates, setGates] = useState<Gate[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [speed, setSpeed] = useState(GATE_SPEED_INITIAL);
  const [isRunning, setIsRunning] = useState(true);
  const [crashFlash, setCrashFlash] = useState(false);
  const [successFlash, setSuccessFlash] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [showQuestion, setShowQuestion] = useState("");
  const [started, setStarted] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);

  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const gateIdRef = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef(Date.now());
  const livesRef = useRef(lives);
  const scoreRef = useRef(score);
  const correctRef = useRef(correct);
  const wrongRef = useRef(wrong);
  const bestStreakRef = useRef(bestStreak);

  // Keep refs in sync
  useEffect(() => { livesRef.current = lives; }, [lives]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { correctRef.current = correct; }, [correct]);
  useEffect(() => { wrongRef.current = wrong; }, [wrong]);
  useEffect(() => { bestStreakRef.current = bestStreak; }, [bestStreak]);

  const spawnGate = useCallback(() => {
    const q = questions[currentQuestion % questions.length]!;
    const opts = [...q.options].sort(() => Math.random() - 0.5).slice(0, 3);

    // If we have fewer than 3 options, pad with wrong answers
    while (opts.length < 3) {
      opts.push("—");
    }

    // Find which lane has the correct answer
    let correctLaneIdx = opts.findIndex((o) => o === q.answer);
    if (correctLaneIdx === -1) {
      // Correct answer wasn't in shuffled options, force it into a random lane
      const forceLane = Math.floor(Math.random() * 3);
      opts[forceLane] = q.answer;
      correctLaneIdx = forceLane;
    }

    const gate: Gate = {
      id: gateIdRef.current++,
      questionIndex: currentQuestion % questions.length,
      options: opts,
      correctLane: correctLaneIdx,
      z: 0,
      passed: false,
      hit: false,
    };

    setShowQuestion(stripHtml(q.question));
    setGates((prev) => [...prev, gate]);
    setCurrentQuestion((p) => p + 1);
  }, [currentQuestion, questions]);

  // Start game
  const handleStart = useCallback(() => {
    setStarted(true);
    startTimeRef.current = Date.now();
    spawnGate();
  }, [spawnGate]);

  // Smooth lane transition
  useEffect(() => {
    setPlayerLane(targetLane);
  }, [targetLane]);

  // Handle keyboard
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!started && (e.key === " " || e.key === "Enter")) {
        handleStart();
        return;
      }
      if (!isRunning) return;
      if (e.key === "ArrowLeft" || e.key === "a") {
        setTargetLane((p) => Math.max(0, p - 1));
      } else if (e.key === "ArrowRight" || e.key === "d") {
        setTargetLane((p) => Math.min(2, p + 1));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isRunning, started, handleStart]);

  // Handle touch/swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !isRunning) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    const dx = touch.clientX - touchStartRef.current.x;
    if (Math.abs(dx) > 30) {
      if (dx < 0) setTargetLane((p) => Math.max(0, p - 1));
      else setTargetLane((p) => Math.min(2, p + 1));
    }
    touchStartRef.current = null;
  };

  // Tap on lane
  const handleLaneTap = (lane: number) => {
    if (!started) {
      handleStart();
      return;
    }
    if (!isRunning) return;
    setTargetLane(lane);
  };

  // End game
  const endGame = useCallback(() => {
    setIsRunning(false);
    cancelAnimationFrame(animFrameRef.current);
    setTimeout(() => {
      onGameOver({
        score: scoreRef.current,
        total: correctRef.current + wrongRef.current,
        correct: correctRef.current,
        wrong: wrongRef.current,
        timeSpent: Math.round((Date.now() - startTimeRef.current) / 1000),
        streak: bestStreakRef.current,
      });
    }, 800);
  }, [onGameOver]);

  // Spawn particles
  const spawnParticles = useCallback((color: string) => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: 50 + (Math.random() - 0.5) * 40,
      y: 70 + (Math.random() - 0.5) * 20,
      color,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 600);
  }, []);

  // Game loop
  useEffect(() => {
    if (!started || !isRunning) return;

    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      setGates((prevGates) => {
        const updated = prevGates.map((gate) => ({
          ...gate,
          z: gate.z + speed * delta,
        }));

        // Check for gate passing (z >= 0.85 is player position)
        const stillActive: Gate[] = [];
        for (const gate of updated) {
          if (gate.z >= 0.88 && !gate.passed && !gate.hit) {
            // Player reaches this gate
            if (playerLane === gate.correctLane) {
              // Correct!
              gate.passed = true;
              setScore((p) => p + 10);
              setCorrect((p) => p + 1);
              setStreak((p) => {
                const ns = p + 1;
                setBestStreak((b) => Math.max(b, ns));
                return ns;
              });
              setSuccessFlash(true);
              setTimeout(() => setSuccessFlash(false), 200);
              spawnParticles("#10b981");
            } else {
              // Wrong!
              gate.hit = true;
              setWrong((p) => p + 1);
              setStreak(0);
              setLives((p) => {
                const newLives = p - 1;
                if (newLives <= 0) {
                  setTimeout(() => endGame(), 300);
                }
                return newLives;
              });
              setCrashFlash(true);
              setScreenShake(true);
              setTimeout(() => setCrashFlash(false), 300);
              setTimeout(() => setScreenShake(false), 400);
              spawnParticles("#ef4444");
            }
          }

          // Remove gates that have gone past
          if (gate.z < 1.3) {
            stillActive.push(gate);
          }
        }

        // Spawn new gate when current one is at ~50%
        const needsNew = stillActive.every((g) => g.z > 0.45);
        if (needsNew && stillActive.length < 2) {
          // Will spawn via effect
          setTimeout(() => spawnGate(), 0);
        }

        return stillActive;
      });

      setDistance((p) => p + speed * delta * 10);
      setSpeed((p) => p + GATE_SPEED_INCREMENT * (delta / 10000));

      animFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [started, isRunning, speed, playerLane, spawnGate, endGame, spawnParticles]);

  const playerX = playerLane === 0 ? 16.5 : playerLane === 1 ? 50 : 83.5;

  return (
    <div className="flex flex-col gap-2 w-full max-w-lg mx-auto select-none">
      {/* HUD */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1">
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-300",
                i < lives
                  ? "bg-red-500 text-white shadow-md shadow-red-500/30"
                  : "bg-gray-300 dark:bg-gray-700"
              )}
            >
              {i < lives ? "♥" : ""}
            </div>
          ))}
        </div>
        <div className="text-right">
          <div className="text-xl font-black tabular-nums">{score}</div>
          <div className="text-[10px] text-muted-foreground">{Math.floor(distance)}m</div>
        </div>
      </div>

      {/* Question bar */}
      {showQuestion && started && (
        <div className="rounded-xl bg-gray-900 dark:bg-gray-800 text-white px-4 py-2 text-center text-sm font-medium min-h-[44px] flex items-center justify-center leading-snug">
          {showQuestion}
        </div>
      )}

      {/* 3D Scene */}
      <div
        ref={gameContainerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={cn(
          "relative w-full rounded-2xl overflow-hidden cursor-pointer",
          screenShake && "animate-shake"
        )}
        style={{ aspectRatio: "9/16", maxHeight: "65vh" }}
      >
        {/* Sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200 dark:from-indigo-950 dark:via-purple-950 dark:to-slate-900" />

        {/* Horizon mountains/buildings */}
        <div className="absolute left-0 right-0 top-[18%] h-[15%] overflow-hidden">
          <div className="absolute bottom-0 left-[5%] w-[15%] h-[80%] bg-slate-400/40 dark:bg-slate-700/40 rounded-t-lg" />
          <div className="absolute bottom-0 left-[15%] w-[10%] h-[100%] bg-slate-500/30 dark:bg-slate-600/30 rounded-t-lg" />
          <div className="absolute bottom-0 left-[30%] w-[20%] h-[60%] bg-slate-400/40 dark:bg-slate-700/40 rounded-t-lg" />
          <div className="absolute bottom-0 right-[20%] w-[12%] h-[90%] bg-slate-500/30 dark:bg-slate-600/30 rounded-t-lg" />
          <div className="absolute bottom-0 right-[5%] w-[18%] h-[70%] bg-slate-400/40 dark:bg-slate-700/40 rounded-t-lg" />
        </div>

        {/* Road - 3D Perspective */}
        <div
          className="absolute left-0 right-0 bottom-0"
          style={{
            height: "72%",
            perspective: "400px",
            perspectiveOrigin: "50% 15%",
          }}
        >
          {/* Road surface */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-gray-500 to-gray-600 dark:from-gray-700 dark:to-gray-800"
            style={{
              transformOrigin: "bottom center",
              transform: "rotateX(55deg)",
              backgroundImage: `
                repeating-linear-gradient(
                  to bottom,
                  transparent,
                  transparent 40px,
                  rgba(255,255,255,0.05) 40px,
                  rgba(255,255,255,0.05) 42px
                )
              `,
            }}
          >
            {/* Lane dividers */}
            <div className="absolute left-[33.3%] top-0 bottom-0 w-[2px] bg-white/30" />
            <div className="absolute left-[66.6%] top-0 bottom-0 w-[2px] bg-white/30" />

            {/* Road edges */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-yellow-400/60" />
            <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-yellow-400/60" />

            {/* Animated road lines */}
            <div
              className="absolute left-[50%] top-0 bottom-0 w-[3px] overflow-hidden"
              style={{ transform: "translateX(-50%)" }}
            >
              <div
                className="w-full h-[200%] bg-repeat-y"
                style={{
                  backgroundImage: "repeating-linear-gradient(to bottom, white 0px, white 20px, transparent 20px, transparent 50px)",
                  animation: started ? `scrollRoad ${2 / (speed * 100)}s linear infinite` : "none",
                  opacity: 0.5,
                }}
              />
            </div>
          </div>
        </div>

        {/* Answer Gates */}
        {gates.map((gate) => {
          // Map z (0-1) to visual position
          const visualScale = 0.15 + gate.z * 0.85;
          const visualY = 28 + gate.z * 52; // percentage from top
          const opacity = Math.min(1, gate.z * 2.5);

          return (
            <div
              key={gate.id}
              className="absolute left-0 right-0 flex justify-center pointer-events-none"
              style={{
                top: `${visualY}%`,
                transform: `scale(${visualScale})`,
                opacity: gate.hit ? 0 : opacity,
                transition: gate.hit ? "opacity 0.3s" : undefined,
              }}
            >
              <div className="flex gap-[4%] w-[90%] justify-center">
                {gate.options.map((opt, laneIdx) => {
                  const isCorrectOpt = laneIdx === gate.correctLane;

                  return (
                    <div
                      key={laneIdx}
                      onClick={() => handleLaneTap(laneIdx)}
                      className={cn(
                        "flex-1 rounded-lg flex items-center justify-center text-center font-bold text-white px-1 py-3 border-2 transition-colors pointer-events-auto",
                        "bg-gradient-to-b from-blue-500/70 to-indigo-600/70 border-blue-300/40",
                        gate.passed && isCorrectOpt && "from-emerald-400 to-emerald-500 border-emerald-300",
                        gate.hit && !isCorrectOpt && "from-red-500 to-red-600 border-red-400",
                      )}
                      style={{
                        minHeight: `${32 + visualScale * 16}px`,
                        fontSize: `${Math.max(9, visualScale * 13)}px`,
                      }}
                    >
                      <span className="line-clamp-2 leading-tight">
                        {stripHtml(opt).slice(0, 40)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Player character */}
        <div
          className="absolute bottom-[8%] z-20 transition-all duration-200 ease-out"
          style={{ left: `${playerX}%`, transform: "translateX(-50%)" }}
        >
          {/* Character body */}
          <div className="relative">
            {/* Glow */}
            <div className={cn(
              "absolute -inset-3 rounded-full blur-lg transition-colors duration-200",
              crashFlash ? "bg-red-500/50" : successFlash ? "bg-emerald-500/50" : "bg-blue-500/20"
            )} />

            {/* Runner body */}
            <div className="relative w-10 h-14 flex flex-col items-center">
              {/* Head */}
              <div className="w-6 h-6 rounded-full bg-amber-300 dark:bg-amber-400 border-2 border-amber-500 z-10" />
              {/* Body */}
              <div className="w-8 h-7 -mt-1 rounded-t-lg bg-blue-500 dark:bg-blue-600 border-2 border-blue-600 dark:border-blue-700 relative">
                {/* Arms */}
                <div
                  className={cn(
                    "absolute -left-2 top-1 w-2 h-5 bg-blue-500 dark:bg-blue-600 rounded-full origin-top",
                    started && "animate-runArm"
                  )}
                />
                <div
                  className={cn(
                    "absolute -right-2 top-1 w-2 h-5 bg-blue-500 dark:bg-blue-600 rounded-full origin-top",
                    started && "animate-runArmAlt"
                  )}
                />
              </div>
              {/* Legs */}
              <div className="flex gap-1 -mt-0.5">
                <div
                  className={cn(
                    "w-2.5 h-5 bg-gray-700 dark:bg-gray-600 rounded-b-md origin-top",
                    started && "animate-runLeg"
                  )}
                />
                <div
                  className={cn(
                    "w-2.5 h-5 bg-gray-700 dark:bg-gray-600 rounded-b-md origin-top",
                    started && "animate-runLegAlt"
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Speed lines */}
        {started && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-[1px] bg-white/20 animate-speedLine"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  height: `${10 + Math.random() * 15}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${0.6 + Math.random() * 0.4}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute w-2 h-2 rounded-full animate-particle pointer-events-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              backgroundColor: p.color,
              boxShadow: `0 0 6px ${p.color}`,
            }}
          />
        ))}

        {/* Crash overlay */}
        {crashFlash && (
          <div className="absolute inset-0 bg-red-500/30 animate-in fade-in duration-100 z-30 pointer-events-none" />
        )}

        {/* Success overlay */}
        {successFlash && (
          <div className="absolute inset-0 bg-emerald-500/15 animate-in fade-in duration-100 z-30 pointer-events-none" />
        )}

        {/* Start overlay */}
        {!started && (
          <div
            className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm cursor-pointer"
            onClick={handleStart}
          >
            <div className="text-white text-center">
              <div className="text-4xl font-black mb-2">QUIZ RUNNER</div>
              <div className="text-lg font-medium mb-6 text-white/80">
                Dodge wrong answers. Run through the right one!
              </div>
              <div className="space-y-2 text-sm text-white/70">
                <p>Swipe or tap lanes to move</p>
                <p>Arrow keys on desktop</p>
              </div>
              <div className="mt-8 bg-white/20 backdrop-blur rounded-xl px-8 py-3 text-lg font-bold animate-pulse">
                TAP TO START
              </div>
            </div>
          </div>
        )}

        {/* Lane tap zones (invisible, for touch) */}
        {started && (
          <div className="absolute inset-0 z-10 flex">
            {[0, 1, 2].map((lane) => (
              <div
                key={lane}
                className="flex-1"
                onClick={() => handleLaneTap(lane)}
              />
            ))}
          </div>
        )}

        {/* Streak banner */}
        {streak >= 3 && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 bg-orange-500/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-in zoom-in duration-200">
            🔥 {streak} STREAK
          </div>
        )}
      </div>

      {/* Controls hint */}
      <div className="flex justify-center gap-4 text-xs text-muted-foreground">
        <span>← Swipe or tap to switch lanes →</span>
      </div>

      <style jsx>{`
        @keyframes scrollRoad {
          0% { transform: translateY(0); }
          100% { transform: translateY(50%); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px) rotate(-1deg); }
          40% { transform: translateX(6px) rotate(1deg); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        @keyframes speedLine {
          0% { transform: translateY(-100%); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(calc(65vh + 100%)); opacity: 0; }
        }
        .animate-speedLine {
          animation: speedLine 0.8s linear infinite;
        }
        @keyframes particle {
          0% { transform: scale(1) translate(0, 0); opacity: 1; }
          100% { transform: scale(0) translate(var(--tx, 20px), var(--ty, -30px)); opacity: 0; }
        }
        .animate-particle {
          --tx: ${Math.random() > 0.5 ? "" : "-"}${20 + Math.random() * 30}px;
          --ty: -${20 + Math.random() * 40}px;
          animation: particle 0.6s ease-out forwards;
        }
        @keyframes runLeg {
          0%, 100% { transform: rotate(-20deg); }
          50% { transform: rotate(20deg); }
        }
        @keyframes runLegAlt {
          0%, 100% { transform: rotate(20deg); }
          50% { transform: rotate(-20deg); }
        }
        @keyframes runArm {
          0%, 100% { transform: rotate(25deg); }
          50% { transform: rotate(-25deg); }
        }
        @keyframes runArmAlt {
          0%, 100% { transform: rotate(-25deg); }
          50% { transform: rotate(25deg); }
        }
        .animate-runLeg { animation: runLeg 0.35s ease-in-out infinite; }
        .animate-runLegAlt { animation: runLegAlt 0.35s ease-in-out infinite; }
        .animate-runArm { animation: runArm 0.35s ease-in-out infinite; }
        .animate-runArmAlt { animation: runArmAlt 0.35s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
