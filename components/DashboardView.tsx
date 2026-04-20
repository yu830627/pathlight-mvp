"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { UserProfile } from "@/app/page";

const SELF_TYPES = [
  {
    type: "success" as const,
    label: "成功版",
    badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    cardClass: "border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent",
    dotClass: "bg-amber-400",
    description: "看見可能性的天花板",
    fallback: (name: string) =>
      `${name}，我知道你現在覺得很遠。但你每往前一步，都在縮短我們之間的距離。今天這一步，就是給我的禮物。`,
  },
  {
    type: "realistic" as const,
    label: "現實版",
    badgeClass: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    cardClass: "border-sky-500/20 bg-gradient-to-br from-sky-500/5 to-transparent",
    dotClass: "bg-sky-400",
    description: "最像真實的你",
    fallback: (name: string) =>
      `${name}，你不需要完美。今天做到 30% 也比昨天多。我走到這裡，是因為每一個「雖然不完美但我做了」累積出來的。`,
  },
  {
    type: "regret" as const,
    label: "後悔版",
    badgeClass: "bg-red-500/20 text-red-300 border-red-500/30",
    cardClass: "border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent",
    dotClass: "bg-red-400",
    description: "不行動的代價",
    fallback: (name: string) =>
      `${name}，你現在的「再等一下」，是我最後悔的那些時刻。我不是來嚇你的，只是希望你比我更勇敢一點。`,
  },
];

type AiMessages = { success?: string; realistic?: string; regret?: string };

export default function DashboardView({
  profile,
  onGoalSet,
}: {
  profile: UserProfile;
  onGoalSet: (goal: string) => void;
}) {
  const [goal, setGoal] = useState("");
  const [activeType, setActiveType] = useState<"success" | "realistic" | "regret">("success");
  const [aiMessages, setAiMessages] = useState<AiMessages>({});
  const [loadingType, setLoadingType] = useState<string | null>(null);
  const [goalSubmitted, setGoalSubmitted] = useState(false);

  const active = SELF_TYPES.find((s) => s.type === activeType)!;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "早安";
    if (h < 18) return "午安";
    return "晚安";
  };

  const fetchAiMessage = async (type: "success" | "realistic" | "regret", goalText: string) => {
    if (aiMessages[type]) return;
    setLoadingType(type);
    try {
      const res = await fetch("/api/future-self", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          mainGoal: profile.mainGoal,
          currentChallenge: profile.currentChallenge,
          todayGoal: goalText,
          type,
        }),
      });
      const data = await res.json();
      if (data.message) {
        setAiMessages((prev) => ({ ...prev, [type]: data.message }));
      }
    } catch {
      // fallback messages shown on error
    } finally {
      setLoadingType(null);
    }
  };

  const handleGoalSubmit = async () => {
    if (!goal.trim()) return;
    setGoalSubmitted(true);
    // Pre-fetch all three in background
    fetchAiMessage("success", goal.trim());
    fetchAiMessage("realistic", goal.trim());
    fetchAiMessage("regret", goal.trim());
  };

  const handleTabChange = (type: "success" | "realistic" | "regret") => {
    setActiveType(type);
    if (goalSubmitted && goal.trim()) {
      fetchAiMessage(type, goal.trim());
    }
  };

  const currentMessage =
    aiMessages[activeType] ?? (goalSubmitted ? null : active.fallback(profile.name));

  const isLoading = loadingType === activeType;

  return (
    <div className="w-full max-w-xl space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground font-mono tracking-widest uppercase">引路 Pathlight</span>
        <h1 className="text-2xl font-semibold mt-1">
          {greeting()}，{profile.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          目標：<span className="text-foreground/70">{profile.mainGoal}</span>
        </p>
      </div>

      {/* Future Self Tabs */}
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-widest">三種未來的你</p>

        <div className="flex gap-2">
          {SELF_TYPES.map((s) => (
            <button
              key={s.type}
              onClick={() => handleTabChange(s.type)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium border transition-all duration-200 ${
                activeType === s.type
                  ? s.badgeClass + " scale-[1.02] shadow-sm"
                  : "border-border/40 text-muted-foreground hover:border-border bg-card/30"
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${s.dotClass} ${activeType === s.type ? "opacity-100" : "opacity-40"}`} />
                {s.label}
              </span>
            </button>
          ))}
        </div>

        {/* Message Card */}
        <Card className={`${active.cardClass} border min-h-[110px] transition-all duration-300`}>
          <CardHeader className="pb-2 pt-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-xs ${active.badgeClass}`}>
                {active.label}
              </Badge>
              <span className="text-xs text-muted-foreground">{active.description}</span>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            {isLoading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-3 bg-foreground/10 rounded w-full" />
                <div className="h-3 bg-foreground/10 rounded w-4/5" />
                <div className="h-3 bg-foreground/10 rounded w-3/5" />
              </div>
            ) : currentMessage ? (
              <p className="text-sm leading-relaxed text-foreground/85 italic">
                &ldquo;{currentMessage}&rdquo;
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                設定今天的目標後，未來的你會有話說...
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Today's Goal */}
      <div className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">今天的一步</p>
          <p className="text-sm text-muted-foreground mt-1">不需要做很多，只要今天能做到的那一步</p>
        </div>
        <Textarea
          className="min-h-[80px] resize-none bg-card/30 text-base border-border/40 focus:border-primary/50 transition-colors"
          placeholder="例如：寫完一頁企劃書、運動 20 分鐘、傳一封 email..."
          value={goal}
          onChange={(e) => {
            setGoal(e.target.value);
            setGoalSubmitted(false);
            setAiMessages({});
          }}
          disabled={goalSubmitted && Object.keys(aiMessages).length > 0}
        />

        {!goalSubmitted ? (
          <Button
            className="w-full font-medium"
            onClick={handleGoalSubmit}
            disabled={!goal.trim()}
          >
            讓未來的我來說話
          </Button>
        ) : (
          <Button
            className="w-full font-medium"
            onClick={() => onGoalSet(goal.trim())}
          >
            我今天要做到這件事
          </Button>
        )}
      </div>

      {goalSubmitted && (
        <p className="text-center text-xs text-muted-foreground animate-in fade-in duration-500">
          今天結束前，回來告訴未來的自己你做到了
        </p>
      )}
    </div>
  );
}
