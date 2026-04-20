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

  const stepConfig = {
    1: {
      label: "你好，我是引路",
      question: "請問你的名字是？",
      placeholder: "輸入你的名字...",
      value: name,
      onChange: setName,
      hint: "這樣未來的你才能直接叫你的名字",
    },
    2: {
      label: "認識你",
      question: "你最重要的一個人生目標是什麼？",
      placeholder: "例如：轉職到產品設計、財務自由、完成第一本書...",
      value: mainGoal,
      onChange: setMainGoal,
      hint: "不必完美，說出你心裡最真實的那個",
    },
    3: {
      label: "了解你",
      question: "你現在最大的挑戰或卡關點是什麼？",
      placeholder: "例如：不知道從哪裡開始、每天拖延、缺乏自信...",
      value: currentChallenge,
      onChange: setCurrentChallenge,
      hint: "未來的你需要知道你現在卡在哪裡",
    },
  };

  const config = stepConfig[step];

  return (
    <div className="w-full max-w-lg space-y-8">
      {/* Logo */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-primary">引路</span>
          <span className="text-sm text-muted-foreground font-mono">Pathlight</span>
        </div>
        <p className="text-sm text-muted-foreground">照亮前方的路</p>
      </div>

      {/* Progress */}
      <div className="flex gap-2">
        {([1, 2, 3] as Step[]).map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              s <= step ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">{config.label}</p>
          <h2 className="text-xl font-semibold leading-tight">{config.question}</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 ? (
            <input
              type="text"
              className="w-full bg-input/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-base"
              placeholder={config.placeholder}
              value={config.value}
              onChange={(e) => config.onChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNext()}
              autoFocus
            />
          ) : (
            <Textarea
              className="min-h-[100px] resize-none bg-input/50 text-base"
              placeholder={config.placeholder}
              value={config.value}
              onChange={(e) => config.onChange(e.target.value)}
              autoFocus
            />
          )}
          <p className="text-xs text-muted-foreground">{config.hint}</p>
          <Button
            className="w-full"
            onClick={handleNext}
            disabled={!config.value.trim()}
          >
            {step === 3 ? "開始引路" : "繼續"}
          </Button>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        你的資料只存在這個裝置上，不會上傳到任何地方
      </p>
    </div>
  );
}
