"use client";

const PACKAGES = [
  {
    id: "coach",
    emoji: "🧠",
    title: "AI Coach",
    desc: "一對一引導，幫你拆解人生卡關",
    detail: "每週 3 次深度對話，AI Coach 根據你的語言模式、決策記錄，提供個人化建議與下一步行動。",
    price: "Ultra",
    color: "#2C3D35",
    tags: ["職涯規劃", "人際關係", "財務決策"],
  },
  {
    id: "simulation",
    emoji: "🎭",
    title: "人生情境模擬",
    desc: "模擬你的重大決定會怎麼走",
    detail: "輸入一個你正在猶豫的決定，AI 為你模擬「選擇了」vs「沒選擇」十年後的三種可能結果。",
    price: "Ultra",
    color: "#6B3A2A",
    tags: ["換工作", "創業", "感情決策"],
  },
  {
    id: "persona",
    emoji: "✨",
    title: "人格升級包",
    desc: "打造你想成為的那個版本",
    detail: "基於你的目標與挑戰，AI 幫你建立專屬人格藍圖，包含習慣清單、語言模式、每日儀式。",
    price: "Ultra",
    color: "#7A5C22",
    tags: ["自信力", "執行力", "思維升級"],
  },
];

export default function ProfessionalRolesView() {
  return (
    <div className="w-full max-w-xl min-h-screen pb-24" style={{ background: "#EDE0CF" }}>
      <div className="px-5 pt-14 pb-4">
        <p className="text-xs text-stone-400 font-mono tracking-widest uppercase">專業角色</p>
        <h1 className="text-xl font-semibold text-stone-700 mt-0.5">Ultra 加購方案</h1>
        <p className="text-xs text-stone-400 mt-1">讓 AI 真正成為你的人生軍師</p>
      </div>

      {/* Ultra banner */}
      <div className="mx-5 mb-5 rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1A2035, #2C3D35)" }}>
        <div className="p-5 space-y-2">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">Ultra Plan</p>
          <p className="text-2xl font-bold text-white">NT$499 <span className="text-sm font-normal text-white/60">/ 月</span></p>
          <p className="text-sm text-white/70">解鎖以下所有專業功能，讓未來的你真正開始引導現在的你。</p>
          <button
            className="mt-2 w-full py-3 rounded-2xl text-sm font-semibold text-stone-800 active:scale-95 transition-transform"
            style={{ background: "#C4861A", color: "white" }}
          >
            立即升級 Ultra →
          </button>
        </div>
      </div>

      {/* Feature cards */}
      <div className="px-5 space-y-4">
        {PACKAGES.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 space-y-3">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-none"
                  style={{ background: pkg.color + "20" }}
                >
                  {pkg.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-stone-800">{pkg.title}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold text-white" style={{ backgroundColor: pkg.color }}>
                      {pkg.price}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">{pkg.desc}</p>
                </div>
              </div>

              {/* Detail */}
              <p className="text-sm text-stone-600 leading-relaxed">{pkg.detail}</p>

              {/* Tags */}
              <div className="flex gap-2 flex-wrap">
                {pkg.tags.map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full" style={{ background: pkg.color + "15", color: pkg.color }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <button
                className="w-full py-2.5 rounded-2xl text-sm font-semibold border-2 transition-all active:scale-95"
                style={{ borderColor: pkg.color, color: pkg.color }}
              >
                了解更多
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
