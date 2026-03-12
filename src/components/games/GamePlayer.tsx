"use client";

import { useState } from "react";
import { GAMES, type GameId, type GameQuestion, type GameResult } from "./types";
import GameSetup from "./GameSetup";
import GameOver from "./GameOver";
import QuizRunner from "./QuizRunner";
import SpeedBlitz from "./SpeedBlitz";
import SurvivalMode from "./SurvivalMode";
import RaceTrack from "./RaceTrack";
import TowerClimb from "./TowerClimb";
import TimeAttack from "./TimeAttack";
import MemoryMatch from "./MemoryMatch";

interface GamePlayerProps {
  gameId: GameId;
}

type Phase = "setup" | "playing" | "gameover";

export default function GamePlayer({ gameId }: GamePlayerProps) {
  const game = GAMES.find((g) => g.id === gameId);
  const [phase, setPhase] = useState<Phase>("setup");
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [, setSubjectName] = useState("All Subjects");
  const [result, setResult] = useState<GameResult | null>(null);

  if (!game) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Game not found.</p>
      </div>
    );
  }

  const handleStart = (qs: GameQuestion[], subject: string) => {
    setQuestions(qs);
    setSubjectName(subject);
    setPhase("playing");
  };

  const handleGameOver = (gameResult: GameResult) => {
    setResult(gameResult);
    setPhase("gameover");
  };

  const handleReplay = () => {
    setPhase("setup");
    setResult(null);
    setQuestions([]);
  };

  if (phase === "setup") {
    return <GameSetup game={game} onStart={handleStart} />;
  }

  if (phase === "gameover" && result) {
    return <GameOver result={result} game={game} onReplay={handleReplay} />;
  }

  // Playing phase
  const gameProps = { questions, onGameOver: handleGameOver };

  switch (gameId) {
    case "quiz-runner":
      return <QuizRunner {...gameProps} />;
    case "speed-blitz":
      return <SpeedBlitz {...gameProps} />;
    case "survival":
      return <SurvivalMode {...gameProps} />;
    case "race-track":
      return <RaceTrack {...gameProps} />;
    case "tower-climb":
      return <TowerClimb {...gameProps} />;
    case "time-attack":
      return <TimeAttack {...gameProps} />;
    case "memory-match":
      return <MemoryMatch {...gameProps} />;
    default:
      return null;
  }
}
