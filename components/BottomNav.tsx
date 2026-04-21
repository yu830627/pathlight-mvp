"use client";

export type Tab = "home" | "explore" | "roles" | "account";

const TABS = [
  {
    id: "home" as Tab,
    label: "首頁",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "#C4861A" : "#888"}>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
    ),
  },
  {
    id: "explore" as Tab,
    label: "探索",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#C4861A" : "#888"} strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        <path d="M8 11h6M11 8v6"/>
      </svg>
    ),
  },
  {
    id: "roles" as Tab,
    label: "專業角色",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#C4861A" : "#888"} strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
  },
  {
    id: "account" as Tab,
    label: "帳戶",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#C4861A" : "#888"} strokeWidth="2" strokeLinecap="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

export default function BottomNav({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (tab: Tab) => void;
}) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{ background: "#1A2035" }}
    >
      <div className="flex items-center justify-around max-w-xl mx-auto px-2 py-3">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex flex-col items-center gap-1 px-3 transition-all duration-200"
          >
            {tab.icon(active === tab.id)}
            <span
              className="text-[10px] font-medium"
              style={{ color: active === tab.id ? "#C4861A" : "#888" }}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
