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

// ── 個人設定 ─────────────────────────────
const NAME = "你的名字"   // ← 改成你的名字
const APP_URL = "https://pathlight-mvp-ffo2.vercel.app"
// ─────────────────────────────────────────

const BLOB = "https://1t3glvrash0h45y1.public.blob.vercel-storage.com"

// 快取圖片（避免每次重載）
const imageCache = {}
async function getCachedImage(url) {
  if (imageCache[url]) return imageCache[url]
  try {
    const req = new Request(url)
    const img = await req.loadImage()
    imageCache[url] = img
    return img
  } catch (e) { return null }
}

const VERSIONS = {
  success: {
    label: "成功版",
    accentColor: new Color("#C4861A"),
    borderColor: new Color("#E8C97A"),
    photoUrl: `${BLOB}/success-banner-v2.png`,
    quotes: [
      { main: "一個人的態度，\n決定他的高度。", sub: "調整心態重新出發，你的韌性是你最強大的力量！" },
      { main: "每一個做到，\n都在縮短距離。", sub: "你今天的行動，就是成功版未來的基石。" },
      { main: "你以為這是小事，\n但這一天是關鍵的。", sub: "從未來回頭看，今天你做的決定改變了一切。" },
      { main: "態度決定高度，\n你的每一步都在建造未來。", sub: "堅持下去，成功版的你在等著你。" },
    ],
  },
  realistic: {
    label: "現實版",
    accentColor: new Color("#0284C7"),
    borderColor: new Color("#7ABFE8"),
    photoUrl: `${BLOB}/realistic-banner-v2.png`,
    quotes: [
      { main: "今天進步 1%，\n一年後的你\n會比現在強大 37 倍", sub: "願意起步，就已經贏過還在猶豫的自己。" },
      { main: "不完美的行動，\n勝過完美的等待。", sub: "你今天已經在走了，這就是最重要的事。" },
      { main: "你願意誠實\n面對自己，\n這本身就是進步。", sub: "明天，再往前一步。繼續。" },
      { main: "每一天的累積，\n都是最好版本\n在成形。", sub: "現實版的你，比你想像的更有力量。" },
    ],
  },
  regret: {
    label: "後悔版",
    accentColor: new Color("#DC2626"),
    borderColor: new Color("#F08080"),
    photoUrl: `${BLOB}/regret-banner-v2.png`,
    quotes: [
      { main: "後悔，\n是最沒用的情緒。", sub: "假如有重新選擇的機會，你會怎樣做？" },
      { main: "我希望你\n比我更勇敢。", sub: "今天，給自己一個不同的選擇。" },
      { main: "後悔版的我，\n就是從這些「算了」\n慢慢累積出來的。", sub: "你還有機會改變這條路。" },
      { main: "現在開始，\n就是最好的時機。", sub: "別讓今天的你，成為明天後悔的原因。" },
    ],
  },
}

function getVersion() {
  const param = args.widgetParameter?.trim().toLowerCase()
  if (param && VERSIONS[param]) return VERSIONS[param]
  const dayIdx = new Date().getDay() % 3
  return Object.values(VERSIONS)[dayIdx]
}

function getDailyQuote(version) {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  return version.quotes[seed % version.quotes.length]
}

async function buildWidget() {
  const version = getVersion()
  const quote = getDailyQuote(version)
  const photo = await getCachedImage(version.photoUrl)

  const w = new ListWidget()
  w.url = APP_URL
  w.backgroundColor = new Color("#EDE0CF")
  w.setPadding(14, 14, 14, 14)

  // ── 主體：左右排列 ──
  const mainRow = w.addStack()
  mainRow.layoutHorizontally()
  mainRow.centerAlignContent()

  // ── 左：照片 ──
  const photoStack = mainRow.addStack()
  photoStack.size = new Size(100, 100)
  photoStack.cornerRadius = 16

  if (photo) {
    photoStack.backgroundImage = photo
  } else {
    // 無照片：顯示 gradient 色塊 + 名字縮寫
    photoStack.backgroundColor = version.accentColor
    photoStack.layoutVertically()
    photoStack.centerAlignContent()
    photoStack.addSpacer()
    const init = photoStack.addText(NAME.slice(0, 1))
    init.font = Font.boldSystemFont(40)
    init.textColor = Color.white()
    init.centerAlignText()
    photoStack.addSpacer()
  }

  mainRow.addSpacer(14)

  // ── 右：文字區塊 ──
  const textStack = mainRow.addStack()
  textStack.layoutVertically()
  textStack.centerAlignContent()

  // 版本標籤
  const labelEl = textStack.addText(version.label + "的你")
  labelEl.font = Font.systemFont(10)
  labelEl.textColor = version.accentColor

  textStack.addSpacer(4)

  // 主引言（大字）
  const mainEl = textStack.addText(quote.main)
  mainEl.font = Font.boldSystemFont(17)
  mainEl.textColor = new Color("#1A1208")
  mainEl.minimumScaleFactor = 0.7

  textStack.addSpacer(6)

  // 副標題（小字）
  const subEl = textStack.addText(quote.sub)
  subEl.font = Font.systemFont(11)
  subEl.textColor = new Color("#6B5B3E")
  subEl.minimumScaleFactor = 0.75

  w.addSpacer(10)

  // ── 底部：點擊提示 ──
  const hintRow = w.addStack()
  hintRow.layoutHorizontally()
  hintRow.centerAlignContent()

  const dot = hintRow.addText("● ")
  dot.font = Font.systemFont(8)
  dot.textColor = version.accentColor

  const hint = hintRow.addText("點擊與" + version.label + "的你對話")
  hint.font = Font.systemFont(10)
  hint.textColor = new Color("#9B8B6E")

  hintRow.addSpacer()

  const brand = hintRow.addText("引路")
  brand.font = Font.boldSystemFont(10)
  brand.textColor = version.accentColor

  return w
}

const widget = await buildWidget()

if (config.runsInWidget) {
  Script.setWidget(widget)
} else {
  await widget.presentMedium()
}

Script.complete()
