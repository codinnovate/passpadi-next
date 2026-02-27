"use client";

const motivationalMessages = [
  "Small steps every day lead to big results.",
  "You're one study session closer to your goal.",
  "Consistency beats intensity. Keep going!",
  "Great things never come from comfort zones.",
  "Your future self will thank you for studying today.",
  "Every expert was once a beginner.",
  "The secret to getting ahead is getting started.",
];

function getGreetingTime() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getDailyMessage() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86_400_000
  );
  return motivationalMessages[dayOfYear % motivationalMessages.length];
}

interface WelcomeSectionProps {
  userName?: string;
}

export default function WelcomeSection({ userName }: WelcomeSectionProps) {
  const firstName = userName?.split(" ")[0];
  const greeting = getGreetingTime();

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-bold tracking-tight">
        {greeting}
        {firstName ? `, ${firstName}` : ""}
      </h1>
      <p className="text-sm text-muted-foreground">{getDailyMessage()}</p>
    </div>
  );
}
