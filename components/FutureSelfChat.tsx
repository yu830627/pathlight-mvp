"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import type { UserProfile } from "@/app/page";

type SelfType = "success" | "realistic" | "regret";

export type MemoryEntry = {
  date: string;
  selfType: SelfType;
  userMessages: string[];
  completed: boolean | null;
};

export function loadMemories(): MemoryEntry[] {
  try {
    const raw = localStorage.getItem("pathlight_memories");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveMemory(entry: MemoryEntry) {
  const memories = loadMemories();
  const idx = memories.findIndex((m) => m.date === entry.date && m.selfType === entry.selfType);
  if (idx >= 0) memories[idx] = entry;
  else memories.unshift(entry);
  localStorage.setItem("pathlight_memories", JSON.stringify(memories.slice(0, 10)));
}

const SELF_CONFIG = {
  success: {
    label: "成功版",
    labelEn: "Aspiration Self",
    accent: "#D97706",
    accentSoft: "rgba(217,119,6,0.12)",
    border: "rgba(217,119,6,0.25)",
    opening: (name: string) =>
      `${name}，我在等你。你今天準備做什麼？`,
  },
  realistic: {
    label: "現實版",
    labelEn: "Realistic Self",
    accent: "#0284C7",
    accentSoft: "rgba(2,132,199,0.12)",
    border: "rgba(2,132,199,0.25)",
    opening: (name: string) =>
      `${name}，我是你最可能成為的那個版本。說說你今天的狀況？`,
  },
  regret: {
    label: "後悔版",
    labelEn: "Regret Self",
    accent: "#DC2626",
    accentSoft: "rgba(220,38,38,0.12)",
    border: "rgba(220,38,38,0.25)",
    opening: (name: string) =>
      `${name}，我希望你比我更勇敢。你今天，打算怎麼做？`,
  },
};

export default function FutureSelfChat({
  profile,
  selfType,
  onBack,
  onResult,
}: {
  profile: UserProfile;
  selfType: SelfType;
  onBack: () => void;
  onResult: (completed: boolean, selfType: SelfType) => void;
}) {
  const config = SELF_CONFIG[selfType];
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const userMessagesRef = useRef<string[]>([]);

  const memories = loadMemories().slice(0, 5);

  const openingMessages = [
    {
      id: "opening",
      role: "assistant" as const,
      parts: [{ type: "text" as const, text: config.opening(profile.name) }],
    },
  ];

  const [apiError, setApiError] = useState<string | null>(null);

  const { messages, sendMessage, status } = useChat({
    onError: (err) => setApiError(err.message || "AI 回覆失敗，請檢查網路或稍後再試"),
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        selfType,
        name: profile.name,
        mainGoal: profile.mainGoal,
        currentChallenge: profile.currentChallenge,
        memories,
      },
    }),
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || status !== "ready") return;
    userMessagesRef.current.push(input.trim());
    sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleResult = (completed: boolean) => {
    const today = new Date().toISOString().split("T")[0];
    saveMemory({
      date: today,
      selfType,
      userMessages: userMessagesRef.current.slice(-3),
      completed,
    });
    onResult(completed, selfType);
  };

  return (
    <div
      className="flex flex-col w-full max-w-xl"
      style={{ minHeight: "100dvh", background: "#EDE0CF" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 pt-12 pb-4 border-b"
        style={{ borderColor: "rgba(0,0,0,0.08)", background: "#EDE0CF" }}
      >
        <button onClick={onBack} style={{ color: "#555" }}>←</button>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: config.accent }}
          >
            未
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>
              {config.label}的你
            </p>
            <p className="text-xs" style={{ color: "#888" }}>{config.labelEn}</p>
          </div>
        </div>
        {memories.length > 0 && (
          <span className="ml-auto text-xs px-2 py-1 rounded-full" style={{ background: "rgba(0,0,0,0.06)", color: "#666" }}>
            記憶 {memories.length}
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-4">
        {[...openingMessages, ...messages].map((msg) => {
          const text = msg.parts
            .filter((p) => p.type === "text")
            .map((p) => (p as { type: "text"; text: string }).text)
            .join("");

          const isUser = msg.role === "user";

          return (
            <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              {!isUser && (
                <div
                  className="w-7 h-7 rounded-full flex-none flex items-center justify-center text-xs font-bold text-white mr-2 mt-1"
                  style={{ backgroundColor: config.accent }}
                >
                  未
                </div>
              )}
              <div
                className="max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
                style={
                  isUser
                    ? { background: "#1A2035", color: "#fff", borderRadius: "18px 18px 4px 18px" }
                    : { background: "#fff", color: "#1A1208", borderRadius: "4px 18px 18px 18px", border: `1px solid ${config.border}` }
                }
              >
                {text}
              </div>
            </div>
          );
        })}

        {status === "streaming" && (
          <div className="flex justify-start">
            <div
              className="w-7 h-7 rounded-full flex-none flex items-center justify-center text-xs font-bold text-white mr-2"
              style={{ backgroundColor: config.accent }}
            >
              未
            </div>
            <div className="bg-white rounded-2xl px-4 py-3 flex gap-1 items-center" style={{ border: `1px solid ${config.border}` }}>
              <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: config.accent, animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: config.accent, animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: config.accent, animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        {apiError && (
          <div className="mx-2 px-4 py-3 rounded-2xl text-sm text-red-700 bg-red-50 border border-red-200">
            ⚠️ {apiError}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Check-in CTA */}
      <div
        className="px-4 py-3 border-t space-y-2"
        style={{ borderColor: "rgba(0,0,0,0.08)", background: "#EDE0CF" }}
      >
        <p className="text-xs text-center" style={{ color: "#888" }}>今天，你做到了嗎？</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleResult(true)}
            className="py-3 rounded-2xl text-sm font-semibold text-white transition-transform active:scale-95"
            style={{ backgroundColor: "#C4861A" }}
          >
            做到了！
          </button>
          <button
            onClick={() => handleResult(false)}
            className="py-3 rounded-2xl text-sm font-semibold transition-transform active:scale-95"
            style={{ background: "#fff", color: "#6B5B3E", border: "1px solid rgba(0,0,0,0.12)" }}
          >
            今天沒做到
          </button>
        </div>
      </div>

      {/* Input */}
      <div className="px-4 pb-6 pt-2 flex gap-2" style={{ background: "#EDE0CF" }}>
        <input
          className="flex-1 rounded-2xl px-4 py-3 text-sm bg-white border focus:outline-none"
          style={{ borderColor: "rgba(0,0,0,0.1)", color: "#1a1a1a" }}
          placeholder="跟未來的你說話..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={status === "streaming"}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || status === "streaming"}
          className="w-11 h-11 rounded-full flex items-center justify-center text-white transition-all active:scale-95 disabled:opacity-40"
          style={{ backgroundColor: config.accent }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
