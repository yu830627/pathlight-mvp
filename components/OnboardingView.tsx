"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/app/page";

const OCCUPATIONS = [
  "學生", "上班族", "創業者 / 自由工作者", "主管 / 管理職",
  "轉職中", "待業中", "其他",
];

const VALUES = [
  "財務自由", "職涯成就", "健康與體能", "人際關係",
  "創意與表達", "學習與成長", "家庭與陪伴", "社會影響力",
];

export default function OnboardingView({
  onComplete,
}: {
  onComplete: (data: UserProfile) => void;
}) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [mainGoal, setMainGoal] = useState("");
  const [currentChallenge, setCurrentChallenge] = useState("");
  const [occupation, setOccupation] = useState("");
  const [coreValue, setCoreValue] = useState("");

  const totalSteps = 5;

  const canNext = () => {
    if (step === 1) return name.trim().length > 0;
    if (step === 2) return mainGoal.trim().length > 0;
    if (step === 3) return currentChallenge.trim().length > 0;
    if (step === 4) return occupation.length > 0;
    if (step === 5) return coreValue.length > 0;
    return false;
  };

  const handleNext = () => {
    if (!canNext()) return;
    if (step < totalSteps) {
      setStep((s) => s + 1);
    } else {
      onComplete({
        name: name.trim(),
        mainGoal: mainGoal.trim(),
        currentChallenge: currentChallenge.trim(),
        occupation,
        coreValue,
      });
    }
  };

  return (
    <div className="w-full max-w-lg space-y-8 animate-in fade-in duration-500">
      {/* Logo */}
      <div className="text-center space-y-2">
        <div className="inline-flex flex-col items-center gap-1">
          <span className="text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
            引路
          </span>
          <span className="text-xs text-muted-foreground font-mono tracking-[0.3em] uppercase">Pathlight</span>
        </div>
        <p className="text-sm text-muted-foreground">照亮前方的路</p>
      </div>

      {/* Progress */}
      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${
              i + 1 <= step ? "bg-primary" : "bg-border"
            }`}
          />
        ))}
      </div>

      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <p className="text-xs text-muted-foreground font-mono tracking-widest uppercase">
            Step {step} of {totalSteps}
          </p>

          {step === 1 && <h2 className="text-xl font-semibold leading-snug mt-1">你的名字是？</h2>}
          {step === 2 && <h2 className="text-xl font-semibold leading-snug mt-1">你最重要的一個人生目標是什麼？</h2>}
          {step === 3 && <h2 className="text-xl font-semibold leading-snug mt-1">你現在最大的卡關點是什麼？</h2>}
          {step === 4 && <h2 className="text-xl font-semibold leading-snug mt-1">你目前的身份 / 職業？</h2>}
          {step === 5 && <h2 className="text-xl font-semibold leading-snug mt-1">你最核心的價值觀是？</h2>}
        </CardHeader>

        <CardContent className="space-y-4">
          {step === 1 && (
            <input
              type="text"
              className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 text-base transition-colors"
              placeholder="輸入你的名字..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNext()}
              autoFocus
            />
          )}

          {step === 2 && (
            <textarea
              className="w-full min-h-[100px] resize-none bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 text-base transition-colors"
              placeholder="例如：轉職到產品設計、財務自由、完成第一本書..."
              value={mainGoal}
              onChange={(e) => setMainGoal(e.target.value)}
              autoFocus
            />
          )}

          {step === 3 && (
            <textarea
              className="w-full min-h-[100px] resize-none bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 text-base transition-colors"
              placeholder="例如：不知道從哪裡開始、每天拖延、缺乏自信..."
              value={currentChallenge}
              onChange={(e) => setCurrentChallenge(e.target.value)}
              autoFocus
            />
          )}

          {step === 4 && (
            <div className="grid grid-cols-2 gap-2">
              {OCCUPATIONS.map((o) => (
                <button
                  key={o}
                  onClick={() => setOccupation(o)}
                  className="px-3 py-3 rounded-xl text-sm font-medium text-left transition-all border"
                  style={
                    occupation === o
                      ? { background: "#C4861A", color: "white", borderColor: "#C4861A" }
                      : { background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }
                  }
                >
                  {o}
                </button>
              ))}
            </div>
          )}

          {step === 5 && (
            <div className="grid grid-cols-2 gap-2">
              {VALUES.map((v) => (
                <button
                  key={v}
                  onClick={() => setCoreValue(v)}
                  className="px-3 py-3 rounded-xl text-sm font-medium text-left transition-all border"
                  style={
                    coreValue === v
                      ? { background: "#C4861A", color: "white", borderColor: "#C4861A" }
                      : { background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }
                  }
                >
                  {v}
                </button>
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            {step === 1 && "未來的你會直接叫你的名字"}
            {step === 2 && "說出你心裡最真實的那個，不必完美"}
            {step === 3 && "未來的你需要知道你現在卡在哪裡"}
            {step === 4 && "幫助 AI 更準確地理解你的處境"}
            {step === 5 && "你最在乎的事，決定你最需要哪種引導"}
          </p>

          <Button
            className="w-full font-medium bg-primary hover:bg-primary/90 transition-all"
            onClick={handleNext}
            disabled={!canNext()}
          >
            {step === totalSteps ? "開始引路 →" : "繼續 →"}
          </Button>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground/60">
        你的資料只存在這個裝置上
      </p>
    </div>
  );
}
