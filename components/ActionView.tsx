"use client";

import { useState } from "react";

export default function ActionView({
  completed,
  onContinue,
}: {
  completed: boolean;
  onContinue: (action: string) => void;
}) {
  const [action, setAction] = useState("");

  const handleSubmit = (text: string) => {
    if (text.trim()) {
      const today = new Date().toISOString().split("T")[0];
      try {
        const history = JSON.parse(localStorage.getItem("pathlight_daily_actions") || "[]");
        const existing = history.findIndex((h: { date: string }) => h.date === today);
        const entry = { date: today, text: text.trim(), completed };
        if (existing >= 0) history[existing] = entry;
        else history.unshift(entry);
        localStorage.setItem("pathlight_daily_actions", JSON.stringify(history.slice(0, 30)));
      } catch {}
    }
    onContinue(text.trim());
  };

  return (
    <div
      className="w-full max-w-lg flex flex-col items-center justify-center min-h-screen px-5 py-10 space-y-6 animate-in fade-in duration-500"
      style={{ background: "#EDE0CF" }}
    >
      <div className="text-center space-y-2">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-2"
          style={{ background: completed ? "#FDF0D5" : "#F5E8E8" }}
        >
          {completed ? "✦" : "◇"}
        </div>
        <h1 className="text-xl font-bold text-stone-800">
          今天，你能做的一步是什麼？
        </h1>
        <p className="text-sm text-stone-500">
          {completed
            ? "你已經做到了，再往前踏一步吧"
            : "沒關係，明天還有機會。先承諾一個小行動"}
        </p>
      </div>

      <div className="w-full space-y-3">
        <textarea
          className="w-full min-h-[120px] rounded-2xl p-4 text-sm resize-none focus:outline-none shadow-sm border"
          style={{ background: "white", color: "#1a1a1a", borderColor: "rgba(0,0,0,0.1)" }}
          placeholder="例如：今天花 15 分鐘研究一個職缺、傳一封信給老友..."
          value={action}
          onChange={(e) => setAction(e.target.value)}
          autoFocus
        />

        <button
          onClick={() => handleSubmit(action)}
          disabled={!action.trim()}
          className="w-full py-3 rounded-2xl text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-40"
          style={{ backgroundColor: "#C4861A" }}
        >
          承諾這一步 →
        </button>
        <button
          onClick={() => handleSubmit("")}
          className="w-full py-2 text-xs text-stone-400"
        >
          跳過
        </button>
      </div>
    </div>
  );
}
