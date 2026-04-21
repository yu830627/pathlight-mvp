// ╔══════════════════════════════════════╗
// ║   引路 Pathlight — Scriptable Widget  ║
// ║   使用說明：                           ║
// ║   1. 在 Scriptable 加入此腳本          ║
// ║   2. 長按主畫面 → 新增 Scriptable widget ║
// ║   3. 點 Widget 設定 → Parameter 填入:  ║
// ║      success / realistic / regret     ║
// ║   4. 加三個 widget 疊成 Smart Stack    ║
// ║      即可上下滑切換三種版本            ║
// ╚══════════════════════════════════════╝

// ── 個人設定（必填）──────────────────────
const NAME = "你的名字"   // ← 改成你的名字
const GOAL = "你的目標"   // ← 改成你的目標
const APP_URL = "https://pathlight-mvp-ffo2.vercel.app"
const PHOTO_URL = ""      // ← 貼上你的照片網址（留空則顯示名字縮寫）
// ─────────────────────────────────────────

const VERSIONS = {
  success: {
    label: "成功版",
    labelEn: "Aspiration Self",
    accent: new Color("#D97706"),
    accentHex: "#D97706",
    bgTop: new Color("#1A1A08"),
    bgBot: new Color("#1A2035"),
    icon: "✦",
    quotes: [
      `${NAME}，你今天做到了。\n這就是未來的你被建造的方式 — 一天一塊磚。`,
      `${NAME}，每一個做到，\n都在縮短你和成功版未來的距離。`,
      `${NAME}，一個人的態度，\n決定他的高度。你的韌性是你最強大的力量。`,
      `${NAME}，你以為這是小事。\n但從這裡回頭看，這一天是關鍵的。`,
    ],
  },
  realistic: {
    label: "現實版",
    labelEn: "Realistic Self",
    accent: new Color("#0284C7"),
    accentHex: "#0284C7",
    bgTop: new Color("#081828"),
    bgBot: new Color("#0A1A30"),
    icon: "◈",
    quotes: [
      `${NAME}，不完美的行動，\n勝過完美的等待。你今天已經在走了。`,
      `${NAME}，今天進步 1%，\n一年後的你比現在強大 37 倍。`,
      `${NAME}，你願意誠實面對自己，\n這本身就是進步。明天，再往前一步。`,
      `${NAME}，願意起步，\n就已經贏過還在猶豫的自己。`,
    ],
  },
  regret: {
    label: "後悔版",
    labelEn: "Regret Self",
    accent: new Color("#DC2626"),
    accentHex: "#DC2626",
    bgTop: new Color("#1A0808"),
    bgBot: new Color("#200A0A"),
    icon: "◇",
    quotes: [
      `${NAME}，後悔版的我，\n就是從這些「算了」慢慢累積出來的。`,
      `${NAME}，你還有機會改變這條路。\n現在開始比任何時候都不晚。`,
      `${NAME}，我希望你比我更勇敢。\n今天，給自己一個不同的選擇。`,
      `${NAME}，後悔是最沒用的情緒。\n現在改變，就是最好的時機。`,
    ],
  },
}

// 取得要顯示的版本
function getVersion() {
  // widget parameter 設定：success / realistic / regret
  const param = args.widgetParameter?.trim().toLowerCase()
  if (param && VERSIONS[param]) return VERSIONS[param]
  // 未設定時依星期自動輪換
  const dayIdx = new Date().getDay() % 3
  return Object.values(VERSIONS)[dayIdx]
}

// 取得今日語錄（依日期固定，不每次重整都變）
function getDailyQuote(version) {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  return version.quotes[seed % version.quotes.length]
}

// 建立 widget
async function buildWidget(size) {
  const version = getVersion()
  const quote = getDailyQuote(version)

  const w = new ListWidget()
  w.url = APP_URL

  // 背景漸層
  const grad = new LinearGradient()
  grad.colors = [version.bgTop, version.bgBot]
  grad.locations = [0.0, 1.0]
  w.backgroundGradient = grad
  w.setPadding(14, 14, 14, 14)

  // ── 頂部：版本標籤 + App 名稱 ──
  const topRow = w.addStack()
  topRow.layoutHorizontally()
  topRow.centerAlignContent()

  const pill = topRow.addStack()
  pill.layoutHorizontally()
  pill.centerAlignContent()
  pill.backgroundColor = new Color(version.accentHex + "33")
  pill.cornerRadius = 10
  pill.setPadding(3, 8, 3, 8)
  const pillDot = pill.addText(version.icon + " " + version.label)
  pillDot.font = Font.boldSystemFont(10)
  pillDot.textColor = version.accent

  topRow.addSpacer()

  const brand = topRow.addText("引路")
  brand.font = Font.boldSystemFont(12)
  brand.textColor = new Color("#C4861A")

  w.addSpacer(10)

  // ── 照片頭像 ──
  const avatarRow = w.addStack()
  avatarRow.layoutHorizontally()
  avatarRow.centerAlignContent()

  if (PHOTO_URL) {
    try {
      const req = new Request(PHOTO_URL)
      const img = await req.loadImage()
      const avatarStack = avatarRow.addStack()
      avatarStack.size = new Size(44, 44)
      avatarStack.cornerRadius = 22
      avatarStack.backgroundImage = img
    } catch (e) {
      // 載入失敗則顯示縮寫
      const avatarStack = avatarRow.addStack()
      avatarStack.size = new Size(44, 44)
      avatarStack.cornerRadius = 22
      avatarStack.backgroundColor = new Color(version.accentHex + "44")
      avatarStack.centerAlignContent()
      avatarStack.layoutHorizontally()
      avatarStack.addSpacer()
      const initText = avatarStack.addText(NAME.slice(0, 1))
      initText.font = Font.boldSystemFont(18)
      initText.textColor = version.accent
      avatarStack.addSpacer()
    }
  } else {
    const avatarStack = avatarRow.addStack()
    avatarStack.size = new Size(44, 44)
    avatarStack.cornerRadius = 22
    avatarStack.backgroundColor = new Color(version.accentHex + "44")
    avatarStack.centerAlignContent()
    avatarStack.layoutHorizontally()
    avatarStack.addSpacer()
    const initText = avatarStack.addText(NAME.slice(0, 1))
    initText.font = Font.boldSystemFont(18)
    initText.textColor = version.accent
    avatarStack.addSpacer()
  }

  avatarRow.addSpacer(10)

  const nameLabel = avatarRow.addText(NAME)
  nameLabel.font = Font.boldSystemFont(14)
  nameLabel.textColor = Color.white()

  w.addSpacer(8)

  // ── 語錄 ──
  const quoteEl = w.addText(quote)
  quoteEl.font = Font.systemFont(size === "small" ? 12 : 14)
  quoteEl.textColor = Color.white()
  quoteEl.minimumScaleFactor = 0.75

  w.addSpacer()

  // ── 底部：目標 + 提示 ──
  if (GOAL && GOAL !== "你的目標") {
    const goalEl = w.addText("🎯 " + GOAL)
    goalEl.font = Font.systemFont(9)
    goalEl.textColor = new Color("#AAAAAA")
    goalEl.lineLimit = 1
    w.addSpacer(4)
  }

  const hint = w.addText("點擊與" + version.label + "的你對話 →")
  hint.font = Font.systemFont(9)
  hint.textColor = version.accent

  return w
}

// 執行
const widgetSize = config.widgetFamily || "medium"
const widget = await buildWidget(widgetSize)

if (config.runsInWidget) {
  Script.setWidget(widget)
} else {
  // 預覽模式
  await widget.presentMedium()
}

Script.complete()
