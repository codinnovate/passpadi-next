"use client";

import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import type { RootState } from "@/store/store";
import { useAiChatMutation } from "@/store/api";
import { Button } from "@/components/ui/button";
import { BotMessageSquare, Send, Loader2, ArrowLeft, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function AIChatPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [aiChat, { isLoading }] = useAiChatMutation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const fullname = user?.personal_info?.fullname || user?.fullname || "";
  const initials = fullname
    ? fullname
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setInput("");

    try {
      const res = await aiChat({
        message: trimmed,
        history: messages,
      }).unwrap();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.message },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process your request right now. Please try again.",
        },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-5rem)]">
      {/* Chat Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-white/10">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => router.back()}
        >
          <ArrowLeft size={18} />
        </Button>
        <div className="flex items-center justify-center size-10 rounded-xl bg-gradient-to-br from-app-primary to-blue-600 text-white">
          <BotMessageSquare size={20} />
        </div>
        <div className="flex-1">
          <h1 className="font-semibold text-base">Passpadi AI</h1>
          <p className="text-xs text-muted-foreground">
            Your study assistant
          </p>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            onClick={() => setMessages([])}
          >
            <Trash2 size={16} />
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="flex items-center justify-center size-16 rounded-2xl bg-gradient-to-br from-app-primary to-blue-600 text-white mb-4">
              <BotMessageSquare size={28} />
            </div>
            <h2 className="text-lg font-semibold">Hi {fullname.split(" ")[0] || "there"}!</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              I&apos;m your AI study assistant. Ask me anything about your subjects, exam prep, or study strategies.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {[
                "Explain quadratic equations",
                "Tips for JAMB English",
                "Help me with Chemistry bonding",
                "Create a study schedule",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setInput(suggestion);
                    inputRef.current?.focus();
                  }}
                  className="text-xs px-3 py-2 rounded-full border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="flex items-start justify-center size-8 rounded-lg bg-gradient-to-br from-app-primary to-blue-600 text-white shrink-0 mt-0.5">
                <BotMessageSquare size={16} className="mt-1.5" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-app-primary text-white rounded-br-md"
                  : "bg-gray-100 dark:bg-white/10 rounded-bl-md"
              }`}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <Avatar className="size-8 shrink-0 mt-0.5">
                <AvatarImage
                  src={
                    user?.personal_info?.profile_img ||
                    `https://api.dicebear.com/9.x/initials/svg?seed=${initials}`
                  }
                />
                <AvatarFallback className="bg-app-primary text-xs text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="flex items-start justify-center size-8 rounded-lg bg-gradient-to-br from-app-primary to-blue-600 text-white shrink-0 mt-0.5">
              <BotMessageSquare size={16} className="mt-1.5" />
            </div>
            <div className="bg-gray-100 dark:bg-white/10 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 size={14} className="animate-spin" />
                Thinking...
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 dark:border-white/10 pt-3 pb-1">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your studies..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-app-primary/30 focus:border-app-primary transition-colors"
            style={{ maxHeight: "120px" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = Math.min(target.scrollHeight, 120) + "px";
            }}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="rounded-xl h-11 w-11 bg-app-primary hover:bg-app-primary/90 shrink-0"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
