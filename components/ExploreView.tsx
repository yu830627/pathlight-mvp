"use client";

import { useState } from "react";

const PLANS = [
  {
    name: "Free",
    price: "免費",
    features: ["3 種未來自我對話", "每日目標打卡", "情緒紀錄", "語音備忘"],
    current: true,
    color: "#6B5B3E",
  },
  {
    name: "Pro",
    price: "NT$199 / 月",
    features: ["以上全部", "長期記憶 AI 學習", "決策分析報告", "每週進度摘要", "無限對話次數"],
    current: false,
    color: "#C4861A",
  },
  {
    name: "Ultra",
    price: "NT$499 / 月",
    features: ["以上全部", "AI Coach 一對一引導", "人生情境模擬", "人格升級包", "優先客服支援"],
    current: false,
    color: "#2C3D35",
  },
];

const RESOURCES = [
  { emoji: "📚", title: "《原子習慣》", desc: "微小改變創造巨大成果的方法論", tag: "推薦書單" },
  { emoji: "🎙", title: "《人生路引》Podcast", desc: "每週 20 分鐘，和頂尖人士對話", tag: "Podcast" },
  { emoji: "🌐", title: "引路 社群", desc: "和同樣在改變的人一起前進", tag: "社群" },
  { emoji: "📝", title: "每週反思模板", desc: "10 個問題幫你看清這週的自己", tag: "工具" },
];

function CalendarRow({ day, quote, done }: { day: string; quote: string; done?: boolean }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-stone-100 last:border-0">
      <div className="flex-none text-center w-8">
        <p className="text-xs text-stone-400">{day}</p>
        {done !== undefined && (
          <div className={`w-4 h-4 rounded-full mx-auto mt-0.5 flex items-center justify-center text-[9px] font-bold text-white ${done ? "bg-amber-500" : "bg-stone-200"}`}>
            {done ? "✓" : ""}
          </div>
        )}
      </div>
      <p className="text-xs text-stone-600 leading-relaxed flex-1">{quote}</p>
    </div>
  );
}

export default function ExploreView() {
  const [activeSection, setActiveSection] = useState<"calendar" | "resources" | "plans">("calendar");

  const sections = [
    { id: "calendar" as const, label: "📅 AI 日曆" },
    { id: "resources" as const, label: "🌱 社群資源" },
    { id: "plans" as const, label: "✨ 方案升級" },
  ];

  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - 6 + i);
    return {
      day: `${d.getMonth() + 1}/${d.getDate()}`,
      done: i < 5 ? Math.random() > 0.3 : undefined,
      quote: [
        "態度決定高度，你的每一步都在建造未來。",
        "不完美的行動，勝過完美的等待。",
        "後悔是最沒用的情緒，現在開始改變。",
        "今天進步 1%，一年後強大 37 倍。",
        "你的韌性是你最強大的力量。",
        "願意起步，就已贏過還在猶豫的自己。",
        "每一個做到，都在縮短你和目標的距離。",
      ][i],
    };
  });

  return (
    <div className="w-full max-w-xl min-h-screen pb-24" style={{ background: "#EDE0CF" }}>
      <div className="px-5 pt-14 pb-4">
        <p className="text-xs text-stone-400 font-mono tracking-widest uppercase">探索</p>
        <h1 className="text-xl font-semibold text-stone-700 mt-0.5">發現更多</h1>
      </div>

      {/* Tabs */}
      <div className="px-5 flex gap-2 mb-5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className="flex-none px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={
              activeSection === s.id
                ? { background: "#1A2035", color: "white" }
                : { background: "white", color: "#6B5B3E" }
            }
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="px-5 space-y-4">
        {/* AI Calendar */}
        {activeSection === "calendar" && (
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <div className="px-5 pt-4 pb-2">
              <p className="text-sm font-semibold text-stone-700">本週 AI 鼓勵日曆</p>
              <p className="text-xs text-stone-400 mt-0.5">每天一句話，來自未來的你</p>
            </div>
            <div className="px-5 pb-4">
              {days.map((d, i) => (
                <CalendarRow key={i} day={d.day} quote={d.quote} done={d.done} />
              ))}
            </div>
            <div className="px-5 pb-4">
              <div className="rounded-2xl p-4 text-center" style={{ background: "#FDF6E8" }}>
                <p className="text-xs text-stone-500">升級 Pro 解鎖</p>
                <p className="text-sm font-semibold text-stone-700 mt-1">個人化 AI 每日訊息</p>
                <p className="text-xs text-stone-400 mt-0.5">根據你的目標與挑戰量身撰寫</p>
              </div>
            </div>
          </div>
        )}

        {/* Resources */}
        {activeSection === "resources" && (
          <div className="space-y-3">
            {RESOURCES.map((r, i) => (
              <div key={i} className="bg-white rounded-3xl p-4 shadow-sm flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-none" style={{ background: "#F5F0E8" }}>
                  {r.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-stone-700">{r.title}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: "#EDE0CF", color: "#6B5B3E" }}>{r.tag}</span>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">{r.desc}</p>
                </div>
              </div>
            ))}
            <div className="bg-white rounded-3xl p-4 shadow-sm text-center space-y-2">
              <p className="text-sm font-semibold text-stone-700">🌐 引路社群即將上線</p>
              <p className="text-xs text-stone-400">和同樣在改變的人一起前進</p>
              <button className="text-xs text-amber-600 font-semibold underline">通知我上線</button>
            </div>
          </div>
        )}

        {/* Plans */}
        {activeSection === "plans" && (
          <div className="space-y-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className="rounded-3xl overflow-hidden shadow-sm"
                style={{ background: plan.current ? "white" : plan.name === "Ultra" ? plan.color : "white" }}
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-base" style={{ color: plan.current || plan.name !== "Ultra" ? plan.color : "white" }}>
                        {plan.name}
                      </p>
                      <p className="text-sm font-semibold mt-0.5" style={{ color: plan.name === "Ultra" ? "rgba(255,255,255,0.9)" : "#1a1a1a" }}>
                        {plan.price}
                      </p>
                    </div>
                    {plan.current && (
                      <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: "#EDE0CF", color: "#6B5B3E" }}>
                        目前方案
                      </span>
                    )}
                  </div>
                  <ul className="space-y-1.5">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm"
                        style={{ color: plan.name === "Ultra" ? "rgba(255,255,255,0.85)" : "#555" }}>
                        <span style={{ color: plan.name === "Ultra" ? "#6EE7B7" : plan.color }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  {!plan.current && (
                    <button
                      className="w-full py-3 rounded-2xl text-sm font-semibold transition-all active:scale-95"
                      style={
                        plan.name === "Ultra"
                          ? { background: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }
                          : { backgroundColor: plan.color, color: "white" }
                      }
                    >
                      升級 {plan.name} →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
