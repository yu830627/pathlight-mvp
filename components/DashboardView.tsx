"use client";

import { useRef, useState } from "react";
import type { UserProfile } from "@/app/page";
import VoiceMemo from "@/components/VoiceMemo";

type SelfType = "success" | "realistic" | "regret";

const BANNERS = [
  {
    type: "success" as const,
    image: "https://1t3glvrash0h45y1.public.blob.vercel-storage.com/success-banner-v2.png",
    fallback: (name: string) => ({
      quote: `${name}，一個人的態度，\n決定他的高度。`,
      sub: "調整心態重新出發，你的韌性是你最強大的力量！",
    }),
  },
  {
    type: "realistic" as const,
    image: "https://1t3glvrash0h45y1.public.blob.vercel-storage.com/realistic-banner-v2.png",
    fallback: (name: string) => ({
      quote: `${name}，今天進步 1%，\n一年後的你會比現在強大 37 倍`,
      sub: "願意起步，就已經贏過還在猶豫的自己。",
    }),
  },
  {
    type: "regret" as const,
    image: "https://1t3glvrash0h45y1.public.blob.vercel-storage.com/regret-banner-v2.png",
    fallback: (name: string) => ({
      quote: `${name}，後悔\n是最沒用的情緒`,
      sub: "假如有重新選擇的機會，你會怎樣做？",
    }),
  },
];

const FEATURE_CARDS = [
  {
    id: "notebook",
    title: "人生筆記本",
    desc: "紀錄今天發生的事",
    emoji: "📔",
    bg: "#2C3D35",
    accent: "#4A6B58",
    placeholder: "今天發生了什麼？寫下來...",
  },
  {
    id: "decision",
    title: "決策日記",
    desc: "今天做了什麼決定？",
    emoji: "🗓",
    bg: "#3D5449",
    accent: "#5C7A68",
    placeholder: "今天你做了什麼決定？為什麼？",
  },
  {
    id: "goal",
    title: "目標追蹤",
    desc: "今天的目標進展",
    emoji: "🎯",
    bg: "#6B3A2A",
    accent: "#8C5240",
    placeholder: "今天的目標進展如何？",
  },
  {
    id: "mood",
    title: "情緒紀錄",
    desc: "今天心情怎麼樣？",
    emoji: "💭",
    bg: "#7A5C22",
    accent: "#9C7A38",
    placeholder: "今天的心情是？發生了什麼讓你有這種感受？",
  },
];

type AiMessages = Partial<Record<"success" | "realistic" | "regret", { quote: string; sub: string }>>;
type CardEntry = { date: string; text: string };

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function loadEntries(cardId: string): CardEntry[] {
  try {
    const raw = localStorage.getItem(`pathlight_card_${cardId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEntry(cardId: string, text: string) {
  const entries = loadEntries(cardId);
  const today = getTodayString();
  const existing = entries.findIndex((e) => e.date === today);
  if (existing >= 0) {
    entries[existing].text = text;
  } else {
    entries.unshift({ date: today, text });
  }
  localStorage.setItem(`pathlight_card_${cardId}`, JSON.stringify(entries.slice(0, 30)));
}

export default function DashboardView({
  profile,
  streak,
  onGoalSet,
  onOpenChat,
}: {
  profile: UserProfile;
  streak: number;
  onGoalSet: (goal: string) => void;
  onOpenChat: (type: SelfType) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [aiMessages, setAiMessages] = useState<AiMessages>({});
  const [openCard, setOpenCard] = useState<string | null>(null);
  const [cardText, setCardText] = useState("");
  const [cardEntries, setCardEntries] = useState<CardEntry[]>([]);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [mood, setMood] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pathlight_mood");
      return saved ? parseInt(saved) : 3;
    }
    return 3;
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const idx = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
    setActiveIndex(idx);
  };

  const scrollTo = (i: number) => {
    scrollRef.current?.scrollTo({ left: i * (scrollRef.current.offsetWidth), behavior: "smooth" });
  };

  const getBannerContent = (banner: typeof BANNERS[0]) => {
    const ai = aiMessages[banner.type];
    return ai ?? banner.fallback(profile.name);
  };

  const handleOpenCard = (cardId: string) => {
    const entries = loadEntries(cardId);
    const todayEntry = entries.find((e) => e.date === getTodayString());
    setCardText(todayEntry?.text ?? "");
    setCardEntries(entries);
    setSavedFeedback(false);
    setOpenCard(cardId);
  };

  const activeCard = FEATURE_CARDS.find((c) => c.id === openCard);

  if (openCard && activeCard) {
    const pastEntries = cardEntries.filter((e) => e.date !== getTodayString());
    return (
      <div className="w-full max-w-xl min-h-screen flex flex-col" style={{ background: "#EDE0CF" }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-12 pb-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <button
            onClick={() => { setOpenCard(null); setCardText(""); }}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.06)" }}
          >
            <span className="text-stone-600 text-sm">←</span>
          </button>
          <span className="text-2xl">{activeCard.emoji}</span>
          <div>
            <h2 className="text-base font-bold text-stone-800">{activeCard.title}</h2>
            <p className="text-xs text-stone-400">{activeCard.desc}</p>
          </div>
        </div>

        <div className="flex-1 px-5 py-4 space-y-4 overflow-y-auto pb-8">
          {/* Today's Entry */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">今天</p>
            <textarea
              className="w-full min-h-[160px] rounded-2xl p-4 text-sm resize-none focus:outline-none shadow-sm"
              style={{ background: "white", border: `2px solid ${activeCard.bg}20`, color: "#1a1a1a" }}
              placeholder={activeCard.placeholder}
              value={cardText}
              onChange={(e) => setCardText(e.target.value)}
              autoFocus
            />
            <button
              onClick={() => {
                if (!cardText.trim()) return;
                saveEntry(activeCard.id, cardText.trim());
                const updated = loadEntries(activeCard.id);
                setCardEntries(updated);
                setSavedFeedback(true);
                setTimeout(() => {
                  setOpenCard(null);
                  setCardText("");
                  setSavedFeedback(false);
                }, 800);
              }}
              className="w-full py-3 rounded-2xl font-semibold text-white text-sm active:scale-95 transition-transform"
              style={{ backgroundColor: savedFeedback ? "#4A9B6F" : activeCard.bg }}
            >
              {savedFeedback ? "已儲存 ✓" : "儲存"}
            </button>
          </div>

          {/* Past Entries */}
          {pastEntries.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">過去記錄</p>
              <div className="space-y-2">
                {pastEntries.map((entry) => (
                  <div
                    key={entry.date}
                    className="rounded-2xl p-4 space-y-1"
                    style={{ background: "white" }}
                  >
                    <p className="text-xs font-semibold" style={{ color: activeCard.bg }}>{formatDate(entry.date)}</p>
                    <p className="text-sm text-stone-700 leading-relaxed">{entry.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl pb-24 space-y-6 animate-in fade-in duration-500" style={{ background: "#EDE0CF", minHeight: "100vh" }}>
      <div className="px-5 pt-14 pb-2 flex items-start justify-between">
        <div>
          <p className="text-xs text-stone-400 font-mono tracking-widest uppercase">引路 Pathlight</p>
          <h1 className="text-xl font-semibold text-stone-700 mt-0.5">
            你好，{profile.name}
          </h1>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full mt-1" style={{ background: "#FDF0D5" }}>
            <span className="text-sm">🔥</span>
            <span className="text-xs font-bold text-amber-700">{streak} 天</span>
          </div>
        )}
      </div>

      {/* Swipeable Banner */}
      <div className="space-y-3 px-5">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", gap: 0 }}
        >
          {BANNERS.map((banner) => {
            const content = getBannerContent(banner);
            return (
              <div
                key={banner.type}
                className="flex-none w-full snap-center"
                style={{ paddingRight: 1 }}
              >
                <button
                  onClick={() => onOpenChat(banner.type)}
                  className="w-full bg-white rounded-3xl shadow-sm p-5 flex gap-4 items-center text-left active:scale-[0.98] transition-transform duration-150"
                  style={{ height: 156 }}
                >
                  <div className="flex-none w-28 h-28 rounded-2xl overflow-hidden bg-stone-100">
                    <img
                      src={banner.image}
                      alt="future self"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center gap-1.5 overflow-hidden">
                    <p className="text-lg font-bold text-stone-800 leading-snug whitespace-pre-line line-clamp-3">
                      {content.quote}
                    </p>
                    <p className="text-xs text-stone-500 leading-snug line-clamp-2">{content.sub}</p>
                    <p className="text-xs text-stone-400">
                      點擊與{["成功版", "現實版", "後悔版"][BANNERS.findIndex(b => b.type === banner.type)]}對話 →
                    </p>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`rounded-full transition-all duration-300 ${
                activeIndex === i ? "w-5 h-2 bg-stone-500" : "w-2 h-2 bg-stone-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Voice Memo */}
      <div className="px-5">
        <VoiceMemo />
      </div>

      {/* Mood Slider */}
      <div className="px-5">
        <div className="bg-white rounded-3xl px-5 py-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-stone-700">今天的心情</p>
            <p className="text-xs text-stone-400">
              {["😢 很低落", "😕 有點差", "😐 還好", "🙂 不錯", "😊 很棒！"][mood - 1]}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl">😢</span>
            <div className="relative flex-1 h-8 flex items-center">
              <div className="absolute w-full h-2 rounded-full" style={{
                background: "linear-gradient(to right, #93C5FD, #6EE7B7, #FCD34D, #FCA5A5, #F97316)"
              }} />
              <input
                type="range"
                min={1}
                max={5}
                value={mood}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setMood(val);
                  localStorage.setItem("pathlight_mood", String(val));
                }}
                className="relative w-full h-2 appearance-none bg-transparent cursor-pointer"
                style={{ WebkitAppearance: "none" }}
              />
            </div>
            <span className="text-xl">😊</span>
          </div>
        </div>
      </div>

      {/* 4 Feature Cards */}
      <div className="px-5 grid grid-cols-2 gap-3">
        {FEATURE_CARDS.map((card) => {
          const entries = loadEntries(card.id);
          const todayDone = entries.some((e) => e.date === getTodayString());
          const count = entries.length;
          return (
            <button
              key={card.id}
              onClick={() => handleOpenCard(card.id)}
              className="rounded-3xl text-left transition-transform duration-200 active:scale-95 overflow-hidden"
              style={{ backgroundColor: card.bg, minHeight: 156 }}
            >
              <div className="p-4 flex flex-col h-full gap-2">
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
                    style={{ background: "rgba(255,255,255,0.18)" }}>
                    {card.emoji}
                  </div>
                  {todayDone && (
                    <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
                        <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                      </svg>
                    </div>
                  )}
                </div>
                {/* Title */}
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm leading-tight">{card.title}</p>
                  <p className="text-white/60 text-xs mt-0.5">{card.desc}</p>
                </div>
                {/* Bottom pill */}
                <div className="flex items-center gap-2">
                  <div className="rounded-full px-3 py-1" style={{ background: "rgba(255,255,255,0.15)" }}>
                    <span className="text-white/90 text-xs font-medium">
                      {count > 0 ? `${count} 則記錄` : "開始紀錄"}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
