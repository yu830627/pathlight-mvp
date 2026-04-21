"use client";

import { useEffect, useState } from "react";
import OnboardingView from "@/components/OnboardingView";
import DashboardView from "@/components/DashboardView";
import CheckInView from "@/components/CheckInView";
import ResultView from "@/components/ResultView";
import FutureSelfChat from "@/components/FutureSelfChat";
import BottomNav, { type Tab } from "@/components/BottomNav";

export type UserProfile = {
  name: string;
  mainGoal: string;
  currentChallenge: string;
};

export type DailyRecord = {
  date: string;
  goal: string;
  completed: boolean | null;
};

type View = "onboarding" | "dashboard" | "chat" | "checkin" | "result";
type SelfType = "success" | "realistic" | "regret";

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 pb-24" style={{ background: "#EDE0CF" }}>
      <p className="text-4xl">🚧</p>
      <p className="text-lg font-semibold text-stone-700">{title}</p>
      <p className="text-sm text-stone-400">即將推出</p>
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState<View | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [todayRecord, setTodayRecord] = useState<DailyRecord | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [chatSelfType, setChatSelfType] = useState<SelfType>("success");

  useEffect(() => {
    const savedProfile = localStorage.getItem("pathlight_profile");
    const savedRecord = localStorage.getItem("pathlight_today");

    if (!savedProfile) {
      setView("onboarding");
      return;
    }

    const parsedProfile: UserProfile = JSON.parse(savedProfile);
    setProfile(parsedProfile);

    const today = getTodayString();
    if (savedRecord) {
      const parsed: DailyRecord = JSON.parse(savedRecord);
      if (parsed.date === today) {
        setTodayRecord(parsed);
        if (parsed.completed === null) {
          setView("checkin");
        } else {
          setView("result");
        }
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

  const handleChatResult = (completed: boolean) => {
    const record: DailyRecord = {
      date: getTodayString(),
      goal: "今天的目標",
      completed,
    };
    localStorage.setItem("pathlight_today", JSON.stringify(record));
    setTodayRecord(record);
    setView("result");
  };

  const handleCheckIn = (completed: boolean) => {
    if (!todayRecord) return;
    const updated = { ...todayRecord, completed };
    localStorage.setItem("pathlight_today", JSON.stringify(updated));
    setTodayRecord(updated);
    setView("result");
  };

  const handleNewDay = () => {
    localStorage.removeItem("pathlight_today");
    setTodayRecord(null);
    setView("dashboard");
  };

  const showBottomNav = view !== "onboarding" && view !== "chat" && view !== null;

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
          <DashboardView profile={profile} onGoalSet={handleGoalSet} onOpenChat={handleOpenChat} />
        )}
        {view === "dashboard" && activeTab === "explore" && <ComingSoon title="探索" />}
        {view === "dashboard" && activeTab === "roles" && <ComingSoon title="專業角色" />}
        {view === "dashboard" && activeTab === "account" && profile && (
          <div className="flex min-h-screen flex-col items-center justify-center p-6 pb-28 w-full gap-4" style={{ background: "#EDE0CF" }}>
            <div className="w-full max-w-sm space-y-3">
              <p className="text-xs text-stone-400 font-mono tracking-widest uppercase text-center mb-6">帳戶</p>
              <div className="bg-white rounded-3xl p-5 space-y-1 shadow-sm">
                <p className="text-sm font-semibold text-stone-700">{profile.name}</p>
                <p className="text-xs text-stone-400">{profile.mainGoal}</p>
              </div>
              <button
                onClick={() => { localStorage.removeItem("pathlight_today"); setTodayRecord(null); setView("dashboard"); setActiveTab("home"); }}
                className="w-full py-3 rounded-2xl text-sm font-semibold text-stone-700 bg-white shadow-sm border border-stone-200"
              >
                重置今日記錄
              </button>
              <button
                onClick={() => { localStorage.removeItem("pathlight_profile"); localStorage.removeItem("pathlight_today"); setProfile(null); setTodayRecord(null); setView("onboarding"); }}
                className="w-full py-3 rounded-2xl text-sm font-semibold text-white shadow-sm"
                style={{ backgroundColor: "#6B3A2A" }}
              >
                重新設定個人資料
              </button>
            </div>
          </div>
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
          onChange={(tab) => {
            setActiveTab(tab);
            if (view !== "dashboard") setView("dashboard");
          }}
        />
      )}
    </>
  );
}
