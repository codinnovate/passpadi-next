"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AIStudyRecommendation() {
  return (
    <div className="relative overflow-hidden rounded-xl border bg-gradient-to-r from-app-primary/5 via-blue-500/5 to-purple-500/5 p-5">
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center size-10 rounded-lg bg-app-primary/10 shrink-0">
          <Sparkles size={20} className="text-app-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold">AI Study Recommendation</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Based on your recent performance, we recommend focusing on Mathematics
            and English comprehension. Consistent practice in these areas will boost
            your overall score.
          </p>
          <Button asChild size="sm" className="mt-3 rounded-full h-8 px-4 text-xs">
            <Link href="/cbt">Study Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
