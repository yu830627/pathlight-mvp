"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { UserProfile, DailyRecord } from "@/app/page";

export default function CheckInView({
  profile,
  record,
  onCheckIn,
}: {
  profile: UserProfile;
  record: DailyRecord;
  onCheckIn: (completed: boolean) => void;
}) {
  return (
    <div className="w-full max-w-lg space-y-8 text-center">
      <div className="space-y-2">
        <span className="text-xs text-muted-foreground font-mono tracking-widest uppercase">引路 Pathlight</span>
        <h1 className="text-2xl font-semibold mt-2">
          {profile.name}，你今天做到了嗎？
        </h1>
        <p className="text-muted-foreground text-sm">未來的你在等待你的回答</p>
      </div>

      <Card className="border-border/50 text-left">
        <CardContent className="pt-6 space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">今天的目標</p>
          <p className="text-base font-medium leading-relaxed">{record.goal}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onCheckIn(true)}
          className="group relative flex flex-col items-center gap-3 p-6 rounded-xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 hover:border-amber-500/50 transition-all duration-200"
        >
          <span className="text-4xl">✓</span>
          <div>
            <p className="font-semibold text-amber-300">做到了！</p>
            <p className="text-xs text-muted-foreground mt-1">我完成了今天的目標</p>
          </div>
        </button>

        <button
          onClick={() => onCheckIn(false)}
          className="group relative flex flex-col items-center gap-3 p-6 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-border transition-all duration-200"
        >
          <span className="text-4xl">✗</span>
          <div>
            <p className="font-semibold text-muted-foreground">沒做到</p>
            <p className="text-xs text-muted-foreground mt-1">今天沒有完成</p>
          </div>
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        誠實回答，未來的你需要真實的數據
      </p>
    </div>
  );
}
