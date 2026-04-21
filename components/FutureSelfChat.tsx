"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import type { UserProfile } from "@/app/page";

type SelfType = "success" | "realistic" | "regret";

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
  onResult: (completed: boolean) => void;
}) {
  const config = SELF_CONFIG[selfType];
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const openingMessages = [
    {
      id: "opening",
      role: "assistant" as const,
      parts: [{ type: "text" as const, text: config.opening(profile.name) }],
    },
  ];

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        selfType,
        name: profile.name,
        mainGoal: profile.mainGoal,
        currentChallenge: profile.currentChallenge,
      },
    }),
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || status !== "ready") return;
    sendMessage({ text: input.trim() });
    setInput("");
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
        <button onClick={onBack} className="text-stone-500 hover:text-stone-800 transition-colors">
          ←
        </button>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: config.accent }}
          >
            未
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-800">
              {config.label}的你
            </p>
            <p className="text-xs text-stone-400">{config.labelEn}</p>
          </div>
        </div>
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
            <div
              key={msg.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
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
        <div ref={messagesEndRef} />
      </div>

      {/* Check-in CTA */}
      <div
        className="px-4 py-3 border-t space-y-2"
        style={{ borderColor: "rgba(0,0,0,0.08)", background: "#EDE0CF" }}
      >
        <p className="text-xs text-center text-stone-400">今天，你做到了嗎？</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onResult(true)}
            className="py-3 rounded-2xl text-sm font-semibold text-white transition-transform active:scale-95"
            style={{ backgroundColor: "#C4861A" }}
          >
            做到了！
          </button>
          <button
            onClick={() => onResult(false)}
            className="py-3 rounded-2xl text-sm font-semibold transition-transform active:scale-95"
            style={{ background: "#fff", color: "#6B5B3E", border: "1px solid rgba(0,0,0,0.12)" }}
          >
            今天沒做到
          </button>
        </div>
      </div>

      {/* Input */}
      <div
        className="px-4 pb-6 pt-2 flex gap-2"
        style={{ background: "#EDE0CF" }}
      >
        <input
          className="flex-1 rounded-2xl px-4 py-3 text-sm bg-white border focus:outline-none"
          style={{ borderColor: "rgba(0,0,0,0.1)" }}
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
