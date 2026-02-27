"use client";

import { Button } from "@/components/ui/button";
import { RotateCw, WifiOff, FileQuestion, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type ErrorVariant = "generic" | "not-found" | "network" | "unauthorized";

interface FeedErrorStateProps {
  message?: string;
  description?: string;
  variant?: ErrorVariant;
  onRetry?: () => void;
  className?: string;
}

const variantConfig: Record<
  ErrorVariant,
  {
    icon: React.ReactNode;
    defaultMessage: string;
    defaultDescription: string;
    iconBg: string;
    accentColor: string;
  }
> = {
  generic: {
    icon: <ShieldAlert className="size-6" />,
    defaultMessage: "Something went wrong",
    defaultDescription: "We couldn't load this content. This might be a temporary issue.",
    iconBg: "bg-orange-500/10 text-orange-500 dark:bg-orange-500/15",
    accentColor: "from-orange-500/20 to-transparent",
  },
  "not-found": {
    icon: <FileQuestion className="size-6" />,
    defaultMessage: "Not found",
    defaultDescription: "This content may have been deleted or the link is incorrect.",
    iconBg: "bg-violet-500/10 text-violet-500 dark:bg-violet-500/15",
    accentColor: "from-violet-500/20 to-transparent",
  },
  network: {
    icon: <WifiOff className="size-6" />,
    defaultMessage: "Connection lost",
    defaultDescription: "Check your internet connection and try again.",
    iconBg: "bg-red-500/10 text-red-500 dark:bg-red-500/15",
    accentColor: "from-red-500/20 to-transparent",
  },
  unauthorized: {
    icon: <ShieldAlert className="size-6" />,
    defaultMessage: "Access denied",
    defaultDescription: "You need to be signed in to view this content.",
    iconBg: "bg-amber-500/10 text-amber-500 dark:bg-amber-500/15",
    accentColor: "from-amber-500/20 to-transparent",
  },
};

export default function FeedErrorState({
  message,
  description,
  variant = "generic",
  onRetry,
  className,
}: FeedErrorStateProps) {
  const config = variantConfig[variant];

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center py-16 px-6 text-center overflow-hidden rounded-xl border bg-card",
        className
      )}
    >
      {/* Subtle gradient background accent */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-32 bg-gradient-to-b opacity-50 pointer-events-none",
          config.accentColor
        )}
      />

      {/* Decorative dots */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-30">
        <div className="size-1 rounded-full bg-muted-foreground" />
        <div className="size-1 rounded-full bg-muted-foreground" />
        <div className="size-1 rounded-full bg-muted-foreground" />
      </div>

      {/* Icon */}
      <div className="relative">
        <div
          className={cn(
            "flex items-center justify-center size-14 rounded-2xl",
            config.iconBg
          )}
        >
          {config.icon}
        </div>
        {/* Glow effect behind icon */}
        <div
          className={cn(
            "absolute inset-0 rounded-2xl blur-xl opacity-40",
            config.iconBg
          )}
        />
      </div>

      {/* Text */}
      <h3 className="relative mt-5 text-base font-semibold text-foreground">
        {message || config.defaultMessage}
      </h3>
      <p className="relative mt-1.5 text-sm text-muted-foreground max-w-xs leading-relaxed">
        {description || config.defaultDescription}
      </p>

      {/* Retry button */}
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          className="relative mt-5 gap-2 shadow-sm"
          onClick={onRetry}
        >
          <RotateCw className="size-3.5" />
          Try again
        </Button>
      )}
    </div>
  );
}
