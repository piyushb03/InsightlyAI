"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Loader2, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ChatDrawer({ uploadId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isTyping]);

  async function handleSend(e) {
    e.preventDefault();
    if (!query.trim() || isTyping) return;

    const userMessage = { role: "user", content: query };
    setHistory((prev) => [...prev, userMessage]);
    setQuery("");
    setIsTyping(true);

    try {
      const res = await fetch(`/api/insights/${uploadId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMessage.content,
          history: history.slice(-6), // Keep last 6 messages for context
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Chat failed");

      setHistory((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-violet-600 hover:bg-violet-500 shadow-2xl shadow-violet-600/40 border-0 z-50 group"
      >
        <MessageSquare className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
        <div className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-violet-500 border-2 border-background"></span>
        </div>
      </Button>

      {/* Drawer Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-[450px] bg-sidebar border-l border-white/5 z-[70] shadow-2xl transition-transform duration-500 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-500/20">
                <Sparkles className="h-4 w-4 text-violet-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Data Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-emerald-500/80 font-medium">Online</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white/40 hover:text-white hover:bg-white/5"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10"
          >
            {history.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-6">
                <div className="p-4 rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/20">
                  <Bot className="h-10 w-10 text-violet-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white/90">Ask me anything about your data</h4>
                  <p className="text-sm text-white/40 mt-1 leading-relaxed">
                    Try: "What was the total revenue last month?" or "Which category is performing best?"
                  </p>
                </div>
              </div>
            )}

            {history.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-3",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div
                  className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 shadow-lg",
                    msg.role === "user" 
                      ? "bg-violet-600/20 ring-1 ring-violet-600/30" 
                      : "bg-white/5 ring-1 ring-white/10"
                  )}
                >
                  {msg.role === "user" ? (
                    <User className="h-4 w-4 text-violet-400" />
                  ) : (
                    <Bot className="h-4 w-4 text-white/60" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-violet-600 text-white rounded-tr-none"
                      : "bg-white/5 text-white/80 border border-white/5 rounded-tl-none"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/5 ring-1 ring-white/10 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-white/60" />
                </div>
                <div className="bg-white/5 text-white/80 border border-white/5 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="p-4 border-t border-white/5 bg-white/[0.01]">
            <form onSubmit={handleSend} className="relative">
              <Input
                placeholder="Ask a question..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isTyping}
                className="pr-12 bg-white/5 border-white/10 focus:border-violet-500/50 h-12"
              />
              <Button
                type="submit"
                disabled={!query.trim() || isTyping}
                size="icon"
                className="absolute right-1.5 top-1.5 h-9 w-9 bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-900/20"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-[10px] text-white/20 mt-3 text-center">
              Powered by Groq LLama-3.3 • Insights based on current dataset.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
