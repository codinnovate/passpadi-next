"use client";

import Link from "next/link";
import { BotMessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AIChatTrigger() {
  return (
    <div className="rounded-xl bg-gradient-to-br from-app-primary to-blue-600 p-5 text-white">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center size-10 rounded-lg bg-white/20">
          <BotMessageSquare size={20} />
        </div>
        <div>
          <h3 className="text-sm font-semibold">AI Study Assistant</h3>
          <p className="text-xs text-white/70">Need help studying?</p>
        </div>
      </div>
      <Button
        variant="secondary"
        size="sm"
        className="w-full rounded-full h-9 text-xs font-semibold bg-white text-app-primary hover:bg-white/90"
        asChild
      >
        <Link href="/ai">Chat with AI</Link>
      </Button>
    </div>
  );
}
