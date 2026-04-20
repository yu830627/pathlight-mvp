"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { UserProfile, DailyRecord } from "@/app/page";

const SUCCESS_MESSAGES = [
  "你今天做到了。這就是未來的你被建造的方式 — 一天一塊磚。",
  "每一個做到，都在縮短你和成功版未來的距離。今天的你，讓我驕傲。",
  "你以為這是小事。但從這裡回頭看，這一天是關鍵的。",
];

const REGRET_MESSAGES = [
  "沒關係。承認「沒做到」需要誠實，而誠實比假裝更有力量。明天再來。",
  "後悔版的我，就是從這些「算了」慢慢累積出來的。你還有機會改變這條路。",
  "今天沒做到，不代表你是失敗的人。但明天，給自己一個不同的選擇。",
];

function getRandomMessage(messages: string[]) {
  return messages[Math.floor(Math.random() * messages.length)];
}

export default function ResultView({
  profile,
  record,
  onNewDay,
}: {
  profile: UserProfile;
  record: DailyRecord;
  onNewDay: () => void;
}) {
  const completed = record.completed === true;
  const videoSrc = completed
    ? "https://1t3glvrash0h45y1.public.blob.vercel-storage.com/videos/success.mp4"
    : "https://1t3glvrash0h45y1.public.blob.vercel-storage.com/videos/regret.mp4";
  const message = completed
    ? getRandomMessage(SUCCESS_MESSAGES)
    : getRandomMessage(REGRET_MESSAGES);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setVideoPlaying(true);
    }
  };

  return (
    <div className="w-full max-w-lg space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs text-muted-foreground font-mono tracking-widest uppercase">引路 Pathlight</span>
        <h1 className="text-2xl font-semibold mt-2">
          {completed ? `${profile.name}，你做到了` : `${profile.name}，明天還有機會`}
        </h1>
        <p className="text-sm text-muted-foreground">
          {completed ? "未來的你有話要說" : "後悔版的你有話要說"}
        </p>
      </div>

      {/* Video Player */}
      <div className={`relative rounded-xl overflow-hidden border ${
        completed ? "border-amber-500/30" : "border-red-500/20"
      } bg-black aspect-video`}>
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-cover"
          playsInline
          onEnded={() => setVideoEnded(true)}
          onPlay={() => setVideoPlaying(true)}
        />
        {!videoPlaying && (
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 hover:bg-black/50 transition-colors group"
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all group-hover:scale-105 ${
              completed
                ? "border-amber-400 bg-amber-500/20"
                : "border-red-400 bg-red-500/20"
            }`}>
              <svg className="w-6 h-6 ml-1 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="text-sm text-white/80">
              {completed ? "聽未來的你說" : "聽後悔版的你說"}
            </span>
          </button>
        )}
      </div>

      {/* Message */}
      <Card className={`border ${completed ? "border-amber-500/20 bg-amber-500/5" : "border-border/50"}`}>
        <CardContent className="pt-5">
          <p className="text-sm leading-relaxed text-foreground/80 italic">
            &ldquo;{message}&rdquo;
          </p>
        </CardContent>
      </Card>

      {/* Tomorrow */}
      {(videoEnded || true) && (
        <div className="space-y-3">
          <p className="text-center text-xs text-muted-foreground">
            明天，繼續面對未來的自己
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={onNewDay}
          >
            設定明天的目標
          </Button>
        </div>
      )}
    </div>
  );
}
