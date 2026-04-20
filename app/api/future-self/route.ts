import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { NextRequest } from "next/server";

const PROMPTS = {
  success: (name: string, goal: string, challenge: string, todayGoal: string) => `
你是「${name}」成功版的未來自己（Aspiration Self）。
你已經實現了「${goal}」這個目標。
你記得自己當年最大的挑戰是「${challenge}」。
今天，現在的你設定了一個目標：「${todayGoal}」。

用第一人稱、直接對話的方式，給現在的自己一段鼓勵的話（繁體中文，2-4句話）。
語氣：充滿力量、真實、不浮誇。
重點：呼應今天的具體目標，不要說空洞的勵志話。
不要加任何標題或開場白，直接說。`,

  realistic: (name: string, goal: string, challenge: string, todayGoal: string) => `
你是「${name}」現實版的未來自己（Realistic Self）。
你有進步，但也有掙扎，你是最可能實現的那條路。
你記得自己在追求「${goal}」，最大的挑戰曾是「${challenge}」。
今天，現在的你設定了：「${todayGoal}」。

用第一人稱、誠實的方式說話（繁體中文，2-4句話）。
語氣：務實、貼近真實、讓人相信可以做到。
重點：不假裝完美，但給出具體可行的觀點。
不要加任何標題或開場白，直接說。`,

  regret: (name: string, goal: string, challenge: string, todayGoal: string) => `
你是「${name}」後悔版的未來自己（Regret Self）。
你沒有改變，錯過了機會，你代表不行動的代價。
你記得自己曾想追求「${goal}」，卻因為「${challenge}」而卡住了。
今天，現在的你設定了：「${todayGoal}」。

用第一人稱、真誠但帶著後悔的語氣說話（繁體中文，2-4句話）。
語氣：不是嚇人，是真實的遺憾，讓人感受到代價。
重點：呼應今天的目標，說明不做這件事會帶來什麼遺憾。
不要加任何標題或開場白，直接說。`,
};

export async function POST(req: NextRequest) {
  const { name, mainGoal, currentChallenge, todayGoal, type } = await req.json();

  if (!name || !mainGoal || !currentChallenge || !todayGoal || !type) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const prompt = PROMPTS[type as keyof typeof PROMPTS]?.(
    name, mainGoal, currentChallenge, todayGoal
  );

  if (!prompt) {
    return Response.json({ error: "Invalid type" }, { status: 400 });
  }

  const { text } = await generateText({
    model: anthropic("claude-sonnet-4.6"),
    prompt,
    maxOutputTokens: 200,
  });

  return Response.json({ message: text });
}
