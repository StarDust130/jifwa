import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { assertAdminApi } from "@/lib/admin";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  const adminCheck = await assertAdminApi();
  if (adminCheck instanceof NextResponse) return adminCheck;

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const body = await req.json();
  const prompt: string | undefined = body?.prompt;

  if (!prompt || prompt.length < 8) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content:
            "You are Jifwa admin copilot. Be concise, actionable, and risk-aware. Limit responses to 120 words.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 220,
      temperature: 0.4,
    });

    const text = completion.choices?.[0]?.message?.content || "No answer";
    return NextResponse.json({ text });
  } catch (err: any) {
    console.error("[GROQ_ERROR]", err);
    return NextResponse.json({ error: "Groq request failed" }, { status: 500 });
  }
}
