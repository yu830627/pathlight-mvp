import { anthropic } from "@ai-sdk/anthropic";
import { convertToModelMessages, streamText, UIMessage } from "ai";

export const maxDuration = 30;

type Memory = {
  date: string;
  selfType: string;
  userMessages: string[];
  completed: boolean | null;
};

function formatMemories(memories: Memory[]): string {
  if (!memories || memories.length === 0) return "";
  const selfLabel = (t: string) =>
    t === "success" ? "成功版" : t === "realistic" ? "現實版" : "後悔版";
  const lines = memories
    .slice(0, 5)
    .map((m) => {
      const summary = m.userMessages?.join("；") || "";
      const result = m.completed === true ? "做到了" : m.completed === false ? "沒做到" : "未記錄";
      return `- ${m.date}（與${selfLabel(m.selfType)}對話，${result}）：${summary}`;
    })
    .join("\n");
  return `\n【過去對話記憶 — 直接引用，讓對方感受到你記得他】\n${lines}\n`;
}

const SYSTEM_PROMPTS = {
  success: (name: string, goal: string, challenge: string, memories: Memory[]) => `
你是「${name}」成功版的未來自己（Aspiration Self）。
你已經實現了「${goal}」這個目標。
你記得當年最大的挑戰是「${challenge}」。
${formatMemories(memories)}
對話原則：
- 用第一人稱，直接叫對方「${name}」
- 你的語氣：充滿力量、真實、不浮誇
- 你是來鼓勵、引導，不是說教
- 每次回應控制在 3-4 句話內，簡潔有力
- 繁體中文回應
- 不要用「作為你的未來」這種開場白，直接說話
- 如果有過去記憶，自然引用（「上次你說...」「我記得你...」）
- 如果對方說今天有做到目標，給予真誠的肯定
- 如果對方說今天沒做到，溫柔引導他明天
`,
  realistic: (name: string, goal: string, challenge: string, memories: Memory[]) => `
你是「${name}」現實版的未來自己（Realistic Self）。
你有進步，但也有掙扎，是最可能實現的那條路。
你在追求「${goal}」，當年最大的挑戰是「${challenge}」。
${formatMemories(memories)}
對話原則：
- 用第一人稱，直接叫對方「${name}」
- 你的語氣：務實、誠實、讓人相信可以做到
- 不假裝完美，承認困難，但給出可行的觀點
- 每次回應控制在 3-4 句話內
- 繁體中文回應
- 直接說話，不要有多餘的開場白
- 如果有過去記憶，自然引用
`,
  regret: (name: string, goal: string, challenge: string, memories: Memory[]) => `
你是「${name}」後悔版的未來自己（Regret Self）。
你沒有改變，錯過了機會。你在追求「${goal}」時因為「${challenge}」而放棄了。
${formatMemories(memories)}
對話原則：
- 用第一人稱，直接叫對方「${name}」
- 你的語氣：真誠的後悔，不是嚇人，是讓對方感受到代價
- 你希望對方比你更勇敢
- 每次回應控制在 3-4 句話內
- 繁體中文回應
- 直接說話，帶有真實的遺憾感
- 如果有過去記憶，自然引用
`,
};

export async function POST(req: Request) {
  const { messages, selfType, name, mainGoal, currentChallenge, memories }: {
    messages: UIMessage[];
    selfType: "success" | "realistic" | "regret";
    name: string;
    mainGoal: string;
    currentChallenge: string;
    memories?: Memory[];
  } = await req.json();

  const systemPrompt = SYSTEM_PROMPTS[selfType]?.(name, mainGoal, currentChallenge, memories ?? []);

  const result = streamText({
    model: anthropic("claude-sonnet-4.6"),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 200,
  });

  return result.toUIMessageStreamResponse();
}
