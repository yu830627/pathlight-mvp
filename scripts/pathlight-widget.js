// ─── 引路 Pathlight Widget ───────────────────────────────
// 在下方填入你的資料
const CONFIG = {
  name: "Jason",
  mainGoal: "財富自由",
  challenge: "你目前的挑戰",
  apiUrl: "https://pathlight-mvp-ffo2.vercel.app/api/future-self",
  appUrl: "https://pathlight-mvp-ffo2.vercel.app",
  cacheKey: "pathlight_widget_cache",
  cacheHours: 4,
};

// ─── 決定顯示哪種未來自我 ────────────────────────────────
function getSelfType() {
  const h = new Date().getHours();
  if (h < 10) return "success";
  if (h < 17) return "realistic";
  return "regret";
}

// ─── 快取 ────────────────────────────────────────────────
function getCache() {
  try {
    const raw = Keychain.get(CONFIG.cacheKey);
    if (!raw) return null;
    const cache = JSON.parse(raw);
    const age = (Date.now() - cache.timestamp) / (1000 * 60 * 60);
    if (age > CONFIG.cacheHours || cache.type !== getSelfType()) return null;
    return { message: cache.message, sub: cache.sub };
  } catch { return null; }
}

function saveCache(message, sub, type) {
  Keychain.set(CONFIG.cacheKey, JSON.stringify({ message, sub, type, timestamp: Date.now() }));
}

// ─── 呼叫 AI API ─────────────────────────────────────────
async function fetchMessage(type) {
  const req = new Request(CONFIG.apiUrl);
  req.method = "POST";
  req.headers = { "Content-Type": "application/json" };
  req.body = JSON.stringify({
    name: CONFIG.name,
    mainGoal: CONFIG.mainGoal,
    currentChallenge: CONFIG.challenge,
    todayGoal: "完成今天最重要的一件事",
    type,
  });
  req.timeoutInterval = 10;
  const res = await req.loadJSON();
  return res.message || null;
}

// ─── 備用金句 ────────────────────────────────────────────
function getFallback(type) {
  const msgs = {
    success: {
      message: "一個人的態度，\n決定他的高度。",
      sub: "你的每一步，都在建造未來的我。",
    },
    realistic: {
      message: "不完美的行動，\n勝過完美的等待。",
      sub: "做到 30%，也比昨天的你更好。",
    },
    regret: {
      message: "今天的每個「等等」，\n都是明天的遺憾。",
      sub: "你還有機會，選擇不同的路。",
    },
  };
  return msgs[type];
}

// ─── 讀取照片 ────────────────────────────────────────────
async function loadPhoto() {
  try {
    const req = new Request("https://1t3glvrash0h45y1.public.blob.vercel-storage.com/%E6%AF%94%E5%A4%A7%E6%8B%87%E6%8C%87%E7%89%88.png");
    return await req.loadImage();
  } catch { return null; }
}

// ─── Widget 主體 ─────────────────────────────────────────
async function buildWidget(message, sub, photo) {
  const w = new ListWidget();
  w.url = CONFIG.appUrl;

  // 暖珊瑚色漸層背景（仿照設計稿）
  const grad = new LinearGradient();
  grad.locations = [0, 1];
  grad.colors = [new Color("#F2846A"), new Color("#E8705A")];
  grad.startPoint = new Point(0, 0);
  grad.endPoint = new Point(1, 1);
  w.backgroundGradient = grad;
  w.setPadding(14, 14, 12, 14);

  const row = w.addStack();
  row.layoutHorizontally();
  row.centerAlignContent();

  // ── 左側：照片 ──────────────────────────────────────────
  if (photo) {
    const imgStack = row.addStack();
    imgStack.size = new Size(88, 100);
    imgStack.cornerRadius = 16;
    imgStack.clipsToBounds = true;
    const img = imgStack.addImage(photo);
    img.imageSize = new Size(88, 100);
    img.centerAlignImage();
  } else {
    const avatarStack = row.addStack();
    avatarStack.size = new Size(88, 100);
    avatarStack.cornerRadius = 16;
    avatarStack.backgroundColor = new Color("#ffffff", 0.25);
    avatarStack.centerAlignContent();
    const initial = avatarStack.addText(CONFIG.name.charAt(0));
    initial.font = Font.boldSystemFont(40);
    initial.textColor = Color.white();
  }

  row.addSpacer(14);

  // ── 右側：文字 ──────────────────────────────────────────
  const rightCol = row.addStack();
  rightCol.layoutVertically();

  // 大字金句
  const quoteText = rightCol.addText(message);
  quoteText.font = Font.boldSystemFont(17);
  quoteText.textColor = Color.white();
  quoteText.minimumScaleFactor = 0.75;

  rightCol.addSpacer(8);

  // 副標題
  const subText = rightCol.addText(sub);
  subText.font = Font.systemFont(12);
  subText.textColor = new Color("#ffffff", 0.8);
  subText.minimumScaleFactor = 0.8;

  rightCol.addSpacer();

  // 品牌標語
  const brand = rightCol.addText("引路 —— 遇見更好的自己");
  brand.font = Font.systemFont(10);
  brand.textColor = new Color("#ffffff", 0.55);

  return w;
}

// ─── 主程式 ──────────────────────────────────────────────
async function main() {
  const type = getSelfType();
  const photo = await loadPhoto();

  let message, sub;
  const cached = getCache();

  if (cached) {
    message = cached.message;
    sub = cached.sub;
  } else {
    try {
      const raw = await fetchMessage(type);
      if (raw) {
        // 把 AI 訊息拆成主句 + 副句
        const sentences = raw.split(/[，。！？\n]/).filter(s => s.trim().length > 3);
        message = sentences.slice(0, 2).join("，\n") + "。";
        sub = sentences.slice(2, 4).join("，") || "你的每一步，都在建造未來的我。";
        saveCache(message, sub, type);
      } else {
        throw new Error("no message");
      }
    } catch {
      const fb = getFallback(type);
      message = fb.message;
      sub = fb.sub;
    }
  }

  const widget = await buildWidget(message, sub, photo);
  Script.setWidget(widget);

  if (!config.runsInWidget) {
    widget.presentMedium();
  }
}

await main();
