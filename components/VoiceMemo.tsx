"use client";

import { useState, useRef, useEffect } from "react";

export type VoiceMemoEntry = { date: string; transcript: string };

export function loadVoiceMemos(): VoiceMemoEntry[] {
  try {
    const raw = localStorage.getItem("pathlight_voice_memos");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveTodayVoiceMemo(transcript: string) {
  const memos = loadVoiceMemos();
  const today = new Date().toISOString().split("T")[0];
  const idx = memos.findIndex((m) => m.date === today);
  if (idx >= 0) memos[idx].transcript = transcript;
  else memos.unshift({ date: today, transcript });
  localStorage.setItem("pathlight_voice_memos", JSON.stringify(memos.slice(0, 30)));
}

function formatDate(d: string) {
  const dt = new Date(d);
  return `${dt.getMonth() + 1}/${dt.getDate()}`;
}

export default function VoiceMemo() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [saved, setSaved] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [memos, setMemos] = useState<VoiceMemoEntry[]>([]);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finalRef = useRef("");

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) setSupported(false);
    const allMemos = loadVoiceMemos();
    setMemos(allMemos);
    const today = new Date().toISOString().split("T")[0];
    const todayMemo = allMemos.find((m) => m.date === today);
    if (todayMemo) { setTranscript(todayMemo.transcript); setSaved(true); }
  }, []);

  const stopRecording = () => {
    recognitionRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    setTimeLeft(60);
  };

  const startRecording = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    finalRef.current = "";
    const recognition = new SR();
    recognition.lang = "zh-TW";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) finalRef.current += event.results[i][0].transcript;
        else interim = event.results[i][0].transcript;
      }
      setTranscript(finalRef.current + interim);
    };

    recognition.onerror = () => stopRecording();
    recognition.start();
    setIsRecording(true);
    setSaved(false);
    setTimeLeft(60);

    let secs = 60;
    timerRef.current = setInterval(() => {
      secs--;
      setTimeLeft(secs);
      if (secs <= 0) stopRecording();
    }, 1000);
  };

  const handleSave = () => {
    if (!transcript.trim()) return;
    saveTodayVoiceMemo(transcript.trim());
    setSaved(true);
    setMemos(loadVoiceMemos());
  };

  const today = new Date().toISOString().split("T")[0];
  const pastMemos = memos.filter((m) => m.date !== today);

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎙</span>
          <div>
            <p className="text-sm font-semibold text-stone-700">語音備忘</p>
            <p className="text-xs text-stone-400">每天 60 秒說出今天的狀態</p>
          </div>
        </div>
        {pastMemos.length > 0 && (
          <button
            onClick={() => setShowHistory((v) => !v)}
            className="text-xs text-stone-400 underline"
          >
            {showHistory ? "收起" : `歷史 (${pastMemos.length})`}
          </button>
        )}
      </div>

      {/* Recording area */}
      <div className="px-5 pb-4 space-y-3">
        {!supported ? (
          <p className="text-xs text-stone-400 text-center py-2">請使用 Chrome 或 Safari 以啟用語音功能</p>
        ) : (
          <>
            {/* Mic button + timer */}
            <div className="flex items-center gap-4">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className="w-14 h-14 rounded-full flex items-center justify-center flex-none transition-all active:scale-95"
                style={{
                  background: isRecording
                    ? "linear-gradient(135deg, #ef4444, #dc2626)"
                    : "linear-gradient(135deg, #C4861A, #A06A10)",
                  boxShadow: isRecording ? "0 0 0 6px rgba(239,68,68,0.2)" : "none",
                }}
              >
                {isRecording ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    <line x1="12" y1="19" x2="12" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="8" y1="23" x2="16" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )}
              </button>
              <div className="flex-1">
                {isRecording ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <p className="text-sm font-semibold text-red-500">錄音中</p>
                    </div>
                    <p className="text-xs text-stone-400">剩餘 {timeLeft} 秒</p>
                    <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-red-400 transition-all duration-1000"
                        style={{ width: `${(timeLeft / 60) * 100}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-stone-500">
                    {saved ? "✓ 今天已記錄" : "點麥克風開始說話"}
                  </p>
                )}
              </div>
            </div>

            {/* Transcript */}
            {transcript && (
              <div
                className="rounded-2xl p-3 text-sm text-stone-700 leading-relaxed min-h-[60px]"
                style={{ background: "#F5F0E8" }}
              >
                {transcript}
              </div>
            )}

            {/* Save button */}
            {transcript && !saved && (
              <button
                onClick={handleSave}
                className="w-full py-2.5 rounded-2xl text-sm font-semibold text-white"
                style={{ backgroundColor: "#C4861A" }}
              >
                儲存語音備忘
              </button>
            )}
          </>
        )}

        {/* History */}
        {showHistory && pastMemos.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="h-px bg-stone-100" />
            {pastMemos.slice(0, 5).map((m) => (
              <div key={m.date} className="space-y-0.5">
                <p className="text-xs font-semibold text-stone-400">{formatDate(m.date)}</p>
                <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">{m.transcript}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
