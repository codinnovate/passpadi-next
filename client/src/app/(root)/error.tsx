"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <h1 className="text-6xl font-bold text-app-primary">Oops!</h1>
      <p className="max-w-md text-lg text-app-secondary/70">
        Something went wrong. Don&apos;t worry, your progress is safe.
      </p>
      <Button
        onClick={reset}
        className="mt-2 rounded-xl bg-app-primary text-white hover:bg-app-primary/90"
      >
        <RotateCcw size={16} />
        Try again
      </Button>
    </div>
  );
}
