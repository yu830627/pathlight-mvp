"use client";

import { useEffect, useState } from "react";
import OnboardingView from "@/components/OnboardingView";
import DashboardView from "@/components/DashboardView";
import CheckInView from "@/components/CheckInView";
import ResultView from "@/components/ResultView";
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

type View = "onboarding" | "dashboard" | "checkin" | "result";

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

  const handleGoalSet = (goal: string) => {
    const record: DailyRecord = {
      date: getTodayString(),
      goal,
      completed: null,
    };
    localStorage.setItem("pathlight_today", JSON.stringify(record));
    setTodayRecord(record);
    setView("checkin");
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

  const showBottomNav = view !== "onboarding" && view !== null;

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

        {view === "dashboard" && profile && activeTab === "home" && (
          <DashboardView profile={profile} onGoalSet={handleGoalSet} />
        )}
        {view === "dashboard" && activeTab === "explore" && (
          <ComingSoon title="探索" />
        )}
        {view === "dashboard" && activeTab === "roles" && (
          <ComingSoon title="專業角色" />
        )}
        {view === "dashboard" && activeTab === "account" && (
          <ComingSoon title="帳戶" />
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
