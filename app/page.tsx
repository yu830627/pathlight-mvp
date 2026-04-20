"use client";

import { useEffect, useState } from "react";
import OnboardingView from "@/components/OnboardingView";
import DashboardView from "@/components/DashboardView";
import CheckInView from "@/components/CheckInView";
import ResultView from "@/components/ResultView";

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

export default function Home() {
  const [view, setView] = useState<View | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [todayRecord, setTodayRecord] = useState<DailyRecord | null>(null);

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

  if (view === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      {view === "onboarding" && (
        <OnboardingView onComplete={handleOnboardingComplete} />
      )}
      {view === "dashboard" && profile && (
        <DashboardView profile={profile} onGoalSet={handleGoalSet} />
      )}
      {view === "checkin" && profile && todayRecord && (
        <CheckInView
          profile={profile}
          record={todayRecord}
          onCheckIn={handleCheckIn}
        />
      )}
      {view === "result" && profile && todayRecord && (
        <ResultView
          profile={profile}
          record={todayRecord}
          onNewDay={handleNewDay}
        />
      )}
    </main>
  );
}
