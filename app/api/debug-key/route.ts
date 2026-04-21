export async function GET() {
  const raw = process.env.ANTHROPIC_API_KEY ?? "";
  const trimmed = raw.trim().replace(/^["']|["']$/g, "");
  return Response.json({
    rawLength: raw.length,
    trimmedLength: trimmed.length,
    prefix: trimmed.slice(0, 10),
    suffix: trimmed.slice(-4),
    startsCorrectly: trimmed.startsWith("sk-ant-"),
  });
}
