"use client";

import { useEffect, useState } from "react";
import OnboardingView from "@/components/OnboardingView";
import DashboardView from "@/components/DashboardView";
import CheckInView from "@/components/CheckInView";
import ResultView from "@/components/ResultView";
import ActionView from "@/components/ActionView";
import FutureSelfChat from "@/components/FutureSelfChat";
import ExploreView from "@/components/ExploreView";
import ProfessionalRolesView from "@/components/ProfessionalRolesView";
import BottomNav, { type Tab } from "@/components/BottomNav";

export type UserProfile = {
  name: string;
  mainGoal: string;
  currentChallenge: string;
  occupation?: string;
  coreValue?: string;
  photoUrl?: string;
};

export type DailyRecord = {
  date: string;
  goal: string;
  completed: boolean | null;
  selfType?: "success" | "realistic" | "regret";
};

type View = "onboarding" | "dashboard" | "chat" | "checkin" | "action" | "result";
type SelfType = "success" | "realistic" | "regret";

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

// ── Streak helpers ────────────────────────────────────────────
function loadCheckinHistory(): string[] {
  try { return JSON.parse(localStorage.getItem("pathlight_checkin_history") || "[]"); }
  catch { return []; }
}

function recordCheckin(date: string) {
  const history = loadCheckinHistory();
  if (!history.includes(date)) {
    history.unshift(date);
    localStorage.setItem("pathlight_checkin_history", JSON.stringify(history.slice(0, 60)));
  }
}

function calcStreak(history: string[]): number {
  if (history.length === 0) return 0;
  const sorted = [...history].sort((a, b) => b.localeCompare(a));
  const today = getTodayString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().split("T")[0];

  if (sorted[0] !== today && sorted[0] !== yStr) return 0;
  let streak = 0;
  let expected = sorted[0];
  for (const d of sorted) {
    if (d === expected) {
      streak++;
      const prev = new Date(expected);
      prev.setDate(prev.getDate() - 1);
      expected = prev.toISOString().split("T")[0];
    } else break;
  }
  return streak;
}

// ── Weekly stats ──────────────────────────────────────────────
export function getWeeklyStats() {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split("T")[0];

  const memories = JSON.parse(localStorage.getItem("pathlight_memories") || "[]");
  const voiceMemos = JSON.parse(localStorage.getItem("pathlight_voice_memos") || "[]");
  const moodHistory: { date: string; value: number }[] = JSON.parse(localStorage.getItem("pathlight_mood_history") || "[]");
  const history = loadCheckinHistory();

  const chats = memories.filter((m: { date: string }) => m.date >= weekAgoStr).length;
  const voice = voiceMemos.filter((m: { date: string }) => m.date >= weekAgoStr).length;
  const checkins = history.filter((d: string) => d >= weekAgoStr).length;
  const streak = calcStreak(history);

  const recentMoods = moodHistory.filter((m) => m.date >= weekAgoStr);
  const moodAvg = recentMoods.length > 0
    ? Math.round(recentMoods.reduce((s, m) => s + m.value, 0) / recentMoods.length * 10) / 10
    : null;

  // 7-day checkin map
  const checkinMap = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - 6 + i);
    const ds = d.toISOString().split("T")[0];
    return { date: ds, label: `${d.getMonth() + 1}/${d.getDate()}`, done: history.includes(ds) };
  });

  return { chats, voice, checkins, streak, moodAvg, checkinMap };
}

export default function Home() {
  const [view, setView] = useState<View | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [todayRecord, setTodayRecord] = useState<DailyRecord | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [chatSelfType, setChatSelfType] = useState<SelfType>("success");
  const [streak, setStreak] = useState(0);
  const [pendingCompleted, setPendingCompleted] = useState<boolean>(false);

  useEffect(() => {
    // 每日推播提醒
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    // 若今天未打卡且現在 >= 晚上8點，顯示提醒通知
    if ("Notification" in window && Notification.permission === "granted") {
      const now = new Date();
      const history: string[] = JSON.parse(localStorage.getItem("pathlight_checkin_history") || "[]");
      const today = getTodayString();
      if (!history.includes(today) && now.getHours() >= 20) {
        new Notification("引路 Pathlight", {
          body: "今天還沒有和未來的你對話，現在來打卡吧 ✦",
          icon: "/icon.svg",
        });
      }
    }

    const savedProfile = localStorage.getItem("pathlight_profile");
    const savedRecord = localStorage.getItem("pathlight_today");

    if (!savedProfile) { setView("onboarding"); return; }

    const parsedProfile: UserProfile = JSON.parse(savedProfile);
    setProfile(parsedProfile);
    setStreak(calcStreak(loadCheckinHistory()));

    const today = getTodayString();
    if (savedRecord) {
      const parsed: DailyRecord = JSON.parse(savedRecord);
      if (parsed.date === today) {
        setTodayRecord(parsed);
        setView(parsed.completed === null ? "checkin" : "result");
        return;
      }
    }
    setView("dashboard");
  }, []);

  const handleOnboardingComplete = (data: UserProfile) => {
    localStorage.setItem("pathlight_profile", JSON.stringify(data));
    setProfile(data);
    setView("dashboard");
  };

  const handleOpenChat = (type: SelfType) => {
    setChatSelfType(type);
    setView("chat");
  };

  const handleGoalSet = (goal: string) => {
    const record: DailyRecord = { date: getTodayString(), goal, completed: null };
    localStorage.setItem("pathlight_today", JSON.stringify(record));
    setTodayRecord(record);
    setView("checkin");
  };

  const handleChatResult = (completed: boolean, selfType: SelfType) => {
    const today = getTodayString();
    const record: DailyRecord = { date: today, goal: "今天的目標", completed, selfType };
    localStorage.setItem("pathlight_today", JSON.stringify(record));
    setTodayRecord(record);
    if (completed) { recordCheckin(today); setStreak(calcStreak(loadCheckinHistory())); }
    setPendingCompleted(completed);
    setView("action");
  };

  const handleActionContinue = () => {
    setView("result");
  };

  const handleCheckIn = (completed: boolean) => {
    if (!todayRecord) return;
    const today = getTodayString();
    const updated = { ...todayRecord, completed };
    localStorage.setItem("pathlight_today", JSON.stringify(updated));
    setTodayRecord(updated);
    if (completed) { recordCheckin(today); setStreak(calcStreak(loadCheckinHistory())); }
    setView("result");
  };

  const handleNewDay = () => {
    localStorage.removeItem("pathlight_today");
    setTodayRecord(null);
    setView("dashboard");
  };

  const showBottomNav = view !== "onboarding" && view !== "chat" && view !== "action" && view !== null;

  if (view === null) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#EDE0CF" }}>
        <div className="w-6 h-6 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <>
      <main className="flex flex-col items-center">
        {view === "onboarding" && (
          <div className="flex min-h-screen flex-col items-center justify-center p-4 w-full">
            <OnboardingView onComplete={handleOnboardingComplete} />
          </div>
        )}

        {view === "chat" && profile && (
          <FutureSelfChat
            profile={profile}
            selfType={chatSelfType}
            onBack={() => setView("dashboard")}
            onResult={handleChatResult}
          />
        )}

        {view === "dashboard" && activeTab === "home" && profile && (
          <DashboardView profile={profile} streak={streak} onGoalSet={handleGoalSet} onOpenChat={handleOpenChat} />
        )}
        {view === "dashboard" && activeTab === "explore" && <ExploreView />}
        {view === "dashboard" && activeTab === "roles" && <ProfessionalRolesView />}
        {view === "dashboard" && activeTab === "account" && profile && (
          <AccountView
            profile={profile}
            onReset={() => { localStorage.removeItem("pathlight_today"); setTodayRecord(null); setView("dashboard"); setActiveTab("home"); }}
            onFullReset={() => { ["pathlight_profile","pathlight_today","pathlight_memories","pathlight_voice_memos","pathlight_checkin_history","pathlight_mood"].forEach(k => localStorage.removeItem(k)); setProfile(null); setTodayRecord(null); setStreak(0); setView("onboarding"); }}
          />
        )}

        {view === "action" && (
          <ActionView completed={pendingCompleted} onContinue={handleActionContinue} />
        )}

        {view === "checkin" && profile && todayRecord && (
          <div className="flex min-h-screen flex-col items-center justify-center p-4 w-full pb-28">
            <CheckInView profile={profile} record={todayRecord} onCheckIn={handleCheckIn} />
          </div>
        )}
        {view === "result" && profile && todayRecord && (
          <div className="flex min-h-screen flex-col items-center justify-center p-4 w-full pb-28">
            <ResultView profile={profile} record={todayRecord} onNewDay={handleNewDay} />
          </div>
        )}
      </main>

      {showBottomNav && (
        <BottomNav
          active={activeTab}
          onChange={(tab) => { setActiveTab(tab); if (view !== "dashboard") setView("dashboard"); }}
        />
      )}
    </>
  );
}

// ── Account View ──────────────────────────────────────────────
function AccountView({ profile, onReset, onFullReset }: {
  profile: UserProfile;
  onReset: () => void;
  onFullReset: () => void;
}) {
  const stats = getWeeklyStats();

  const statItems = [
    { label: "本週對話", value: stats.chats, unit: "次" },
    { label: "語音備忘", value: stats.voice, unit: "則" },
    { label: "連續打卡", value: stats.streak, unit: "天" },
    { label: "本週打卡", value: stats.checkins, unit: "次" },
  ];

  return (
    <div className="flex min-h-screen flex-col p-5 pt-14 pb-28 w-full max-w-sm mx-auto gap-4" style={{ background: "#EDE0CF" }}>
      <p className="text-xs text-stone-400 font-mono tracking-widest uppercase text-center mb-2">帳戶</p>

      {/* Profile card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm space-y-1">
        <p className="text-base font-bold text-stone-800">{profile.name}</p>
        {profile.occupation && <p className="text-xs text-stone-500">{profile.occupation}</p>}
        <p className="text-xs text-stone-400 mt-1 leading-relaxed">{profile.mainGoal}</p>
        {profile.coreValue && (
          <span className="inline-block text-xs px-2 py-0.5 rounded-full mt-1" style={{ background: "#EDE0CF", color: "#6B5B3E" }}>
            核心價值：{profile.coreValue}
          </span>
        )}
      </div>

      {/* Weekly stats */}
      <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
        <p className="text-sm font-semibold text-stone-700">本週使用統計</p>
        <div className="grid grid-cols-2 gap-3">
          {statItems.map((s) => (
            <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: "#F5F0E8" }}>
              <p className="text-2xl font-bold text-stone-800">{s.value}<span className="text-sm font-normal text-stone-500 ml-0.5">{s.unit}</span></p>
              <p className="text-xs text-stone-400 mt-0.5">{s.label}</p>
            </div>
          ))}
          {stats.moodAvg !== null && (
            <div className="rounded-2xl p-3 text-center" style={{ background: "#F5F0E8" }}>
              <p className="text-2xl font-bold text-stone-800">{stats.moodAvg}<span className="text-sm font-normal text-stone-500 ml-0.5">分</span></p>
              <p className="text-xs text-stone-400 mt-0.5">平均心情</p>
            </div>
          )}
        </div>

        {/* 7-day checkin bars */}
        <div>
          <p className="text-xs text-stone-500 mb-2">本週打卡紀錄</p>
          <div className="flex gap-2 items-end justify-between">
            {(stats.checkinMap ?? []).map((day) => (
              <div key={day.date} className="flex flex-col items-center gap-1 flex-1">
                <div
                  className="w-full rounded-lg transition-all"
                  style={{
                    height: day.done ? 36 : 20,
                    backgroundColor: day.done ? "#C4861A" : "#D6CFC5",
                  }}
                />
                <span className="text-[9px]" style={{ color: day.done ? "#C4861A" : "#9B8B6E" }}>
                  {day.label}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-stone-400">打卡日：金色長條</span>
            <span className="text-[10px] text-stone-400">未打卡：灰色短條</span>
          </div>
        </div>

        {stats.streak >= 3 && (
          <p className="text-xs text-center text-amber-600 font-medium">
            🔥 已連續打卡 {stats.streak} 天，繼續保持！
          </p>
        )}
      </div>

      {/* Plan */}
      <div className="bg-white rounded-3xl p-5 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-stone-700">目前方案</p>
          <p className="text-xs text-stone-400 mt-0.5">Free — 每日 10 次對話</p>
        </div>
        <button className="text-xs font-semibold px-3 py-2 rounded-xl text-white" style={{ backgroundColor: "#C4861A" }}>
          升級 Pro
        </button>
      </div>

      {/* Actions */}
      <button onClick={onReset} className="w-full py-3 rounded-2xl text-sm font-semibold text-stone-700 bg-white shadow-sm border border-stone-200">
        重置今日記錄
      </button>
      <button onClick={onFullReset} className="w-full py-3 rounded-2xl text-sm font-semibold text-white shadow-sm" style={{ backgroundColor: "#6B3A2A" }}>
        重新設定個人資料
      </button>
    </div>
  );
}
