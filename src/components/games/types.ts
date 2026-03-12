export interface GameQuestion {
  _id: string;
  question: string;
  options: string[];
  answer: string;
  answerDetail?: string;
  subject?: { _id: string; name: string };
}

export interface GameConfig {
  questions: GameQuestion[];
  subjectName: string;
}

export interface GameResult {
  score: number;
  total: number;
  correct: number;
  wrong: number;
  timeSpent: number;
  streak: number;
}

export type GameId = "quiz-runner" | "speed-blitz" | "survival" | "race-track" | "tower-climb" | "time-attack" | "memory-match";

export interface GameInfo {
  id: GameId;
  title: string;
  description: string;
  icon: string;
  color: string;
  darkColor: string;
  difficulty: string;
}

export const GAMES: GameInfo[] = [
  {
    id: "quiz-runner",
    title: "Quiz Runner",
    description: "Endless runner! Dodge wrong answers and run through the correct gate. Subway Surfers meets quiz time!",
    icon: "RUNNER",
    color: "from-cyan-400 to-blue-600",
    darkColor: "dark:from-cyan-500 dark:to-blue-700",
    difficulty: "Medium",
  },
  {
    id: "speed-blitz",
    title: "Speed Blitz",
    description: "Answer as many questions as you can in 60 seconds. Build streaks for bonus points!",
    icon: "ZAP",
    color: "from-amber-400 to-orange-500",
    darkColor: "dark:from-amber-500 dark:to-orange-600",
    difficulty: "Medium",
  },
  {
    id: "survival",
    title: "Survival Mode",
    description: "You have 3 lives. Questions get faster. How long can you survive?",
    icon: "HEART",
    color: "from-red-400 to-rose-500",
    darkColor: "dark:from-red-500 dark:to-rose-600",
    difficulty: "Hard",
  },
  {
    id: "race-track",
    title: "Race Track",
    description: "Race against the AI car! Correct answers boost your speed, wrong answers help the opponent.",
    icon: "CAR",
    color: "from-blue-400 to-indigo-500",
    darkColor: "dark:from-blue-500 dark:to-indigo-600",
    difficulty: "Medium",
  },
  {
    id: "tower-climb",
    title: "Tower Climb",
    description: "Climb the tower floor by floor. Each correct answer takes you higher. Don't fall!",
    icon: "BUILDING",
    color: "from-emerald-400 to-teal-500",
    darkColor: "dark:from-emerald-500 dark:to-teal-600",
    difficulty: "Easy",
  },
  {
    id: "time-attack",
    title: "Time Attack",
    description: "20 questions, 60 seconds. Correct answers add time. Wrong answers cost you!",
    icon: "CLOCK",
    color: "from-purple-400 to-violet-500",
    darkColor: "dark:from-purple-500 dark:to-violet-600",
    difficulty: "Hard",
  },
  {
    id: "memory-match",
    title: "Memory Match",
    description: "Flip cards to match questions with their correct answers. Test your memory!",
    icon: "BRAIN",
    color: "from-pink-400 to-fuchsia-500",
    darkColor: "dark:from-pink-500 dark:to-fuchsia-600",
    difficulty: "Easy",
  },
];
