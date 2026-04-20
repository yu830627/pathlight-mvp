"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { UserProfile } from "@/app/page";

type Step = 1 | 2 | 3;

export default function OnboardingView({
  onComplete,
}: {
  onComplete: (data: UserProfile) => void;
}) {
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState("");
  const [mainGoal, setMainGoal] = useState("");
  const [currentChallenge, setCurrentChallenge] = useState("");

  const handleNext = () => {
    if (step === 1 && name.trim()) setStep(2);
    else if (step === 2 && mainGoal.trim()) setStep(3);
    else if (step === 3 && currentChallenge.trim()) {
      onComplete({ name: name.trim(), mainGoal: mainGoal.trim(), currentChallenge: currentChallenge.trim() });
    }
  };

  const steps = {
    1: {
      tag: "Step 1 of 3",
      question: "你的名字是？",
      placeholder: "輸入你的名字...",
      value: name,
      onChange: setName,
      hint: "未來的你會直接叫你的名字",
      isText: true,
    },
    2: {
      tag: "Step 2 of 3",
      question: "你最重要的一個人生目標是什麼？",
      placeholder: "例如：轉職到產品設計、財務自由、完成第一本書...",
      value: mainGoal,
      onChange: setMainGoal,
      hint: "說出你心裡最真實的那個，不必完美",
      isText: false,
    },
    3: {
      tag: "Step 3 of 3",
      question: "你現在最大的卡關點是什麼？",
      placeholder: "例如：不知道從哪裡開始、每天拖延、缺乏自信...",
      value: currentChallenge,
      onChange: setCurrentChallenge,
      hint: "未來的你需要知道你現在卡在哪裡",
      isText: false,
    },
  };

  const config = steps[step];

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
        {([1, 2, 3] as Step[]).map((s) => (
          <div
            key={s}
            className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${
              s <= step ? "bg-primary" : "bg-border"
            }`}
          />
        ))}
      </div>

      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <p className="text-xs text-muted-foreground font-mono tracking-widest uppercase">{config.tag}</p>
          <h2 className="text-xl font-semibold leading-snug mt-1">{config.question}</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {config.isText ? (
            <input
              type="text"
              className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 text-base transition-colors"
              placeholder={config.placeholder}
              value={config.value}
              onChange={(e) => config.onChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNext()}
              autoFocus
            />
          ) : (
            <Textarea
              className="min-h-[100px] resize-none bg-background/50 border-border/50 text-base focus:border-primary/50"
              placeholder={config.placeholder}
              value={config.value}
              onChange={(e) => config.onChange(e.target.value)}
              autoFocus
            />
          )}
          <p className="text-xs text-muted-foreground">{config.hint}</p>
          <Button
            className="w-full font-medium bg-primary hover:bg-primary/90 transition-all"
            onClick={handleNext}
            disabled={!config.value.trim()}
          >
            {step === 3 ? "開始引路" : "繼續 →"}
          </Button>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground/60">
        你的資料只存在這個裝置上
      </p>
    </div>
  );
}
