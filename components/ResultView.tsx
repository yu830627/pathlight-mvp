"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { UserProfile, DailyRecord } from "@/app/page";

const BLOB = "https://1t3glvrash0h45y1.public.blob.vercel-storage.com/videos";

const SUCCESS_MESSAGES = [
  "你今天做到了。這就是未來的你被建造的方式 — 一天一塊磚。",
  "每一個做到，都在縮短你和成功版未來的距離。今天的你，讓我驕傲。",
  "你以為這是小事。但從這裡回頭看，這一天是關鍵的。",
];
const REALISTIC_MESSAGES = [
  "你願意誠實面對自己，這本身就是進步。明天，再往前一步。",
  "不完美的行動，勝過完美的等待。你今天已經在走了。",
  "每一天的累積，都是現實版最好的版本在成形。繼續。",
];
const REGRET_MESSAGES = [
  "沒關係。承認「沒做到」需要誠實，而誠實比假裝更有力量。明天再來。",
  "後悔版的我，就是從這些「算了」慢慢累積出來的。你還有機會改變這條路。",
  "今天沒做到，不代表你是失敗的人。但明天，給自己一個不同的選擇。",
];

function getVideoSrc(record: DailyRecord): string {
  if (record.completed) {
    if (record.selfType === "realistic") return `${BLOB}/realistic.mp4`;
    return `${BLOB}/success.mp4`;
  }
  return `${BLOB}/regret.mp4`;
}

function getMessage(record: DailyRecord): string {
  const msgs = record.completed
    ? record.selfType === "realistic" ? REALISTIC_MESSAGES : SUCCESS_MESSAGES
    : REGRET_MESSAGES;
  return msgs[Math.floor(Math.random() * msgs.length)];
}

function getAccent(record: DailyRecord) {
  if (!record.completed) return { border: "border-red-500/20", shadow: "shadow-red-500/10", color: "#DC2626" };
  if (record.selfType === "realistic") return { border: "border-sky-500/20", shadow: "shadow-sky-500/10", color: "#0284C7" };
  return { border: "border-amber-500/30", shadow: "shadow-amber-500/10", color: "#D97706" };
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
  const videoSrc = getVideoSrc(record);
  const message = getMessage(record);
  const accent = getAccent(record);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  const handlePlay = () => {
    videoRef.current?.play();
    setVideoPlaying(true);
  };

  const selfLabel = record.selfType === "realistic" ? "現實版" : record.selfType === "regret" ? "後悔版" : "成功版";

  return (
    <div className="w-full max-w-lg space-y-5 animate-in fade-in duration-500">
      <div className="text-center space-y-1.5">
        <span className="text-xs text-muted-foreground font-mono tracking-widest uppercase">引路 Pathlight</span>
        <h1 className="text-2xl font-semibold mt-1.5">
          {completed ? `${profile.name}，你做到了` : `${profile.name}，明天還有機會`}
        </h1>
        <p className="text-sm text-muted-foreground">
          {selfLabel}的你有話要說
        </p>
      </div>

      {/* Video Player */}
      <div className={`relative rounded-2xl overflow-hidden border ${accent.border} bg-black aspect-video shadow-lg`}>
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
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/50 hover:bg-black/40 transition-colors group"
          >
            <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center border-2 transition-all duration-200 group-hover:scale-110"
              style={{ borderColor: accent.color + "cc", backgroundColor: accent.color + "33", boxShadow: `0 8px 24px ${accent.color}40` }}>
              <svg className="w-7 h-7 ml-1 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="text-sm text-white/70 font-medium">
              聽{selfLabel}的你說
            </span>
          </button>
        )}
      </div>

      {/* Message */}
      <Card className={`border ${accent.border} bg-card/40`}>
        <CardContent className="pt-4 pb-4">
          <p className="text-sm leading-relaxed text-foreground/80 italic">
            &ldquo;{message}&rdquo;
          </p>
        </CardContent>
      </Card>

      {/* Next Day */}
      <div className="space-y-2.5 pt-1">
        <p className="text-center text-xs text-muted-foreground/60">明天，繼續面對未來的自己</p>
        <Button variant="outline" className="w-full border-border/50 hover:border-border" onClick={onNewDay}>
          設定明天的目標
        </Button>
      </div>
    </div>
  );
}
