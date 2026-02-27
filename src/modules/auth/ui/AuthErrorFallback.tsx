"use client";

import { Button } from "@/components/ui/button";
import type { FallbackProps } from "react-error-boundary";

export default function AuthErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <div className="flex flex-col items-center gap-4 p-6 text-center">
      <p className="text-sm text-destructive">
        Something went wrong. Please try again.
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={resetErrorBoundary}
        className="rounded-xl"
      >
        Try again
      </Button>
    </div>
  );
}
