"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { UserProfile } from "@/app/page";

const FUTURE_SELVES = [
  {
    type: "success" as const,
    label: "成功版",
    labelEn: "Aspiration Self",
    badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    cardClass: "border-amber-500/20 bg-amber-500/5",
    glowClass: "shadow-amber-500/10",
    message: (name: string) =>
      `${name}，我知道你現在覺得很遠。但你每往前一步，都在縮短我們之間的距離。今天這一步，就是給我的禮物。`,
    description: "讓你看見可能性的天花板",
  },
  {
    type: "realistic" as const,
    label: "現實版",
    labelEn: "Realistic Self",
    badgeClass: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    cardClass: "border-sky-500/20 bg-sky-500/5",
    glowClass: "shadow-sky-500/10",
    message: (name: string) =>
      `${name}，你不需要完美。今天做到 30% 也比昨天多。我走到這裡，是因為每一個「雖然不完美但我做了」累積出來的。`,
    description: "最像真實的你，最容易被相信",
  },
  {
    type: "regret" as const,
    label: "後悔版",
    labelEn: "Regret Self",
    badgeClass: "bg-red-500/20 text-red-300 border-red-500/30",
    cardClass: "border-red-500/20 bg-red-500/5",
    glowClass: "shadow-red-500/10",
    message: (name: string) =>
      `${name}，你現在的「再等一下」，是我最後悔的那些時刻。我不是來嚇你的。我只是希望你，比我更勇敢一點。`,
    description: "呈現不行動的代價",
  },
];

export default function DashboardView({
  profile,
  onGoalSet,
}: {
  profile: UserProfile;
  onGoalSet: (goal: string) => void;
}) {
  const [goal, setGoal] = useState("");
  const [activeSelf, setActiveSelf] = useState<"success" | "realistic" | "regret">("success");

  const activeData = FUTURE_SELVES.find((s) => s.type === activeSelf)!;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "早安";
    if (hour < 18) return "午安";
    return "晚安";
  };

  return (
    <div className="w-full max-w-xl space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-mono tracking-widest uppercase">引路 Pathlight</span>
        </div>
        <h1 className="text-2xl font-semibold">
          {greeting()}，{profile.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          你的目標：<span className="text-foreground/80">{profile.mainGoal}</span>
        </p>
      </div>

      {/* Future Self Tabs */}
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-widest">三種未來的你</p>
        <div className="flex gap-2">
          {FUTURE_SELVES.map((s) => (
            <button
              key={s.type}
              onClick={() => setActiveSelf(s.type)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                activeSelf === s.type
                  ? s.badgeClass + " border-current"
                  : "border-border/50 text-muted-foreground hover:border-border"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Active Future Self Card */}
        <Card className={`${activeData.cardClass} border shadow-lg ${activeData.glowClass} transition-all duration-300`}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-xs ${activeData.badgeClass}`}>
                {activeData.label}
              </Badge>
              <span className="text-xs text-muted-foreground">{activeData.description}</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-foreground/90 italic">
              &ldquo;{activeData.message(profile.name)}&rdquo;
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Goal */}
      <div className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">今天的一步</p>
          <p className="text-sm text-muted-foreground mt-1">
            不需要做很多，只要今天能做到的那一步
          </p>
        </div>
        <Textarea
          className="min-h-[80px] resize-none bg-card/50 text-base border-border/50 focus:border-primary/50"
          placeholder="例如：寫完一頁企劃書、運動 20 分鐘、傳一封 email..."
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
        <Button
          className="w-full font-medium"
          onClick={() => goal.trim() && onGoalSet(goal.trim())}
          disabled={!goal.trim()}
        >
          我今天要做到這件事
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        設定後，今天結束前回來告訴未來的自己你做到了
      </p>
    </div>
  );
}
