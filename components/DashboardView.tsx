"use client";

import { useRef, useState } from "react";
import type { UserProfile } from "@/app/page";

type SelfType = "success" | "realistic" | "regret";

const BANNERS = [
  {
    type: "success" as const,
    image: "https://1t3glvrash0h45y1.public.blob.vercel-storage.com/success-banner.png",
    fallback: (name: string) => ({
      quote: `${name}，一個人的態度，\n決定他的高度。`,
      sub: "調整心態重新出發，你的韌性是你最強大的力量！",
    }),
  },
  {
    type: "realistic" as const,
    image: "https://1t3glvrash0h45y1.public.blob.vercel-storage.com/realistic-banner.png",
    fallback: (name: string) => ({
      quote: `${name}，今天進步 1%，\n一年後的你會比現在強大 37 倍`,
      sub: "願意起步，就已經贏過還在猶豫的自己。",
    }),
  },
  {
    type: "regret" as const,
    image: "https://1t3glvrash0h45y1.public.blob.vercel-storage.com/regret-banner.png",
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
    desc: "紀錄發生什麼事",
    icon: "◎",
    bg: "#2C3D35",
    placeholder: "今天發生了什麼？寫下來...",
  },
  {
    id: "decision",
    title: "決策日記",
    desc: "今天的大決定？",
    icon: "◈",
    bg: "#3D5449",
    placeholder: "今天你做了什麼決定？為什麼？",
  },
  {
    id: "goal",
    title: "目標追蹤",
    desc: "好好保持紀錄！",
    icon: "≡",
    bg: "#6B3A2A",
    placeholder: "今天的目標進展如何？",
  },
  {
    id: "mood",
    title: "情緒紀錄",
    desc: "寫下你今天的心情",
    icon: "◉",
    bg: "#7A5C22",
    placeholder: "今天的心情是？發生了什麼讓你有這種感受？",
  },
];

type AiMessages = Partial<Record<"success" | "realistic" | "regret", { quote: string; sub: string }>>;

export default function DashboardView({
  profile,
  onGoalSet,
  onOpenChat,
}: {
  profile: UserProfile;
  onGoalSet: (goal: string) => void;
  onOpenChat: (type: SelfType) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [aiMessages, setAiMessages] = useState<AiMessages>({});
  const [openCard, setOpenCard] = useState<string | null>(null);
  const [cardText, setCardText] = useState("");
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

  const activeCard = FEATURE_CARDS.find((c) => c.id === openCard);

  if (openCard && activeCard) {
    return (
      <div className="w-full max-w-xl min-h-screen flex flex-col" style={{ background: "#EDE0CF" }}>
        <div className="flex items-center gap-3 p-5 pt-12">
          <button onClick={() => { setOpenCard(null); setCardText(""); }} className="text-sm text-muted-foreground">
            ← 返回
          </button>
          <h2 className="text-lg font-bold" style={{ color: activeCard.bg }}>{activeCard.title}</h2>
        </div>
        <div className="flex-1 px-5 space-y-4">
          <p className="text-sm text-muted-foreground">{activeCard.desc}</p>
          <textarea
            className="w-full min-h-[200px] rounded-2xl p-4 text-base resize-none focus:outline-none border border-white/60 bg-white/80"
            placeholder={activeCard.placeholder}
            value={cardText}
            onChange={(e) => setCardText(e.target.value)}
            autoFocus
          />
          <button
            onClick={() => {
              if (activeCard.id === "goal" && cardText.trim()) onGoalSet(cardText.trim());
              setOpenCard(null);
              setCardText("");
            }}
            className="w-full py-3 rounded-2xl font-semibold text-white text-sm"
            style={{ backgroundColor: activeCard.bg }}
          >
            儲存
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl pb-24 space-y-6 animate-in fade-in duration-500" style={{ background: "#EDE0CF", minHeight: "100vh" }}>
      <div className="px-5 pt-14 pb-2">
        <p className="text-xs text-stone-400 font-mono tracking-widest uppercase">引路 Pathlight</p>
        <h1 className="text-xl font-semibold text-stone-700 mt-0.5">
          你好，{profile.name}
        </h1>
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
                  style={{ minHeight: 140 }}
                >
                  {/* Photo */}
                  <div className="flex-none w-28 h-28 rounded-2xl overflow-hidden bg-stone-100">
                    <img
                      src={banner.image}
                      alt="future self"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Text */}
                  <div className="flex-1 space-y-2">
                    <p className="text-xl font-bold text-stone-800 leading-snug whitespace-pre-line">
                      {content.quote}
                    </p>
                    <p className="text-sm text-stone-500 leading-snug">{content.sub}</p>
                    <p className="text-xs text-stone-400 flex items-center gap-1">
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

      {/* 4 Feature Cards */}
      <div className="px-5 grid grid-cols-2 gap-3">
        {FEATURE_CARDS.map((card) => (
          <button
            key={card.id}
            onClick={() => setOpenCard(card.id)}
            className="rounded-3xl overflow-hidden text-left transition-transform duration-200 active:scale-95"
            style={{ backgroundColor: card.bg, minHeight: 160 }}
          >
            <div className="p-4 space-y-2">
              {/* Icon + Title */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">
                    {card.icon}
                  </div>
                  <span className="text-white font-semibold text-sm">{card.title}</span>
                </div>
                <span className="text-white/60 text-sm">↩</span>
              </div>
              {/* CTA Button */}
              <div className="inline-block bg-white rounded-full px-3 py-1.5">
                <span className="text-xs font-semibold" style={{ color: card.bg }}>{card.desc}</span>
              </div>
            </div>
            {/* Bottom decorative area */}
            <div className="h-16 opacity-20" style={{
              background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.3))"
            }} />
          </button>
        ))}
      </div>
    </div>
  );
}
