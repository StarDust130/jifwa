import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import PDFParser from "pdf2json";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getPlanId } from "@/lib/plans";
import { resolveOwnerContext } from "@/lib/owner";

// Force Node.js runtime
export const runtime = "nodejs";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    console.log("📥 [API] Upload started...");

    const { userId } = auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const ctx = await resolveOwnerContext(userId);
    const plan = getPlanId(ctx?.ownerUser?.plan);

    // 1️⃣ File Validation
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    // 2️⃣ Parse Text
    let text = "";
    try {
      text = await parsePDFBuffer(buffer);
      // Clean up text to save tokens and reduce noise
      text = text.replace(/\s+/g, " ").slice(0, 45000);
    } catch (e) {
      return NextResponse.json({ error: "PDF Parse Error" }, { status: 500 });
    }

    // 3️⃣ AI Extraction & Validation
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a Senior Project Manager & Contract Analyst.
          
          TASK:
          1. Verify if the text is a valid contract/SOW/Agreement.
          2. If valid, break it down into execution milestones.

          JSON SCHEMA:
          {
            "is_contract": boolean,
            "error_message": "If false, explain why (short). If true, null.",
            "data": { 
               "contractName": "Generate a short, professional title (e.g. 'Project Gemini - Backend Overhaul')",
               "summary": "2 sentence executive summary of the scope.",
               "parties": ["Client Name", "Vendor Name"],
               "total_value": "Total value (e.g. '$50,000') or 'TBD'",
               "effective_date": "YYYY-MM-DD or 'TBD'",
               "milestones": [
                  { 
                    "title": "Action-oriented title (e.g. 'Phase 1: Infrastructure Setup')", 
                    "criteria": "Specific acceptance criteria or deliverables.", 
                    "due_date": "YYYY-MM-DD or 'TBD'", 
                    "status": "pending" 
                  }
               ]
            }
          }

          CRITICAL RULES:
          - You MUST extract at least 3 milestones. If not explicitly listed, INFER them based on the scope (e.g., 'Planning', 'Development', 'Deployment').
          - Format currency professionally ($10,000.00).
          - Output STRICT JSON.
          - ${
            plan === "agency"
              ? "Provide richer milestone criteria and include risk-aware notes in each criteria block."
              : plan === "starter"
              ? "Keep milestones concise but actionable; avoid generic placeholders."
              : "If plan is free, still validate but keep summaries terse."
          }
            `,
        },
        {
          role: "user",
          content: `Document Text:\n\n${text}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty AI response");

    const result = JSON.parse(raw);

    // 🛑 Reject Invalid Files
    if (result.is_contract === false) {
      return NextResponse.json(
        {
          success: false,
          error: result.error_message || "Not a valid contract.",
        },
        { status: 200 }
      );
    }

    // ✅ Return Data
    return NextResponse.json({ success: true, data: result.data });
  } catch (error: any) {
    console.error("🔥 API Error:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}

// Helper
function parsePDFBuffer(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, true);
    pdfParser.on("pdfParser_dataError", (e: any) => reject(e));
    pdfParser.on("pdfParser_dataReady", () =>
      resolve(pdfParser.getRawTextContent())
    );
    pdfParser.parseBuffer(buffer);
  });
}
