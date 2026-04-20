"use client";

import { Card, CardContent } from "@/components/ui/card";
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
    <div className="w-full max-w-lg space-y-8 text-center animate-in fade-in duration-500">
      <div className="space-y-2">
        <span className="text-xs text-muted-foreground font-mono tracking-widest uppercase">引路 Pathlight</span>
        <h1 className="text-2xl font-semibold mt-2">
          {profile.name}，你今天做到了嗎？
        </h1>
        <p className="text-sm text-muted-foreground">未來的你在等你的回答</p>
      </div>

      <Card className="border-border/40 bg-card/50 text-left">
        <CardContent className="pt-5 pb-5 space-y-1.5">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">今天的目標</p>
          <p className="text-base font-medium leading-relaxed">{record.goal}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onCheckIn(true)}
          className="group flex flex-col items-center gap-3 p-7 rounded-2xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 hover:border-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <span className="text-4xl group-hover:scale-110 transition-transform duration-200">✓</span>
          <div>
            <p className="font-semibold text-amber-300">做到了！</p>
            <p className="text-xs text-muted-foreground mt-0.5">完成今天的目標</p>
          </div>
        </button>

        <button
          onClick={() => onCheckIn(false)}
          className="group flex flex-col items-center gap-3 p-7 rounded-2xl border border-border/40 bg-card/40 hover:bg-card/70 hover:border-border/70 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <span className="text-4xl group-hover:scale-110 transition-transform duration-200 opacity-60">✗</span>
          <div>
            <p className="font-semibold text-muted-foreground">沒做到</p>
            <p className="text-xs text-muted-foreground mt-0.5">今天沒有完成</p>
          </div>
        </button>
      </div>

      <p className="text-xs text-muted-foreground/60">
        誠實回答，未來的你需要真實的數據
      </p>
    </div>
  );
}
