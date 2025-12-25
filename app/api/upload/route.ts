import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import PDFParser from "pdf2json"; // 👈 New, stable library

// Force Node.js runtime (Critical for file processing)
export const runtime = "nodejs";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ------------------------------------------------------------------
// 🚀 THE API ROUTE
// ------------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    console.log("📥 [API] Starting upload...");

    // 1️⃣ Validate File
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    // 2️⃣ Convert to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3️⃣ Parse PDF (Using the helper function below)
    let text = "";
    try {
      text = await parsePDFBuffer(buffer);
      // Limit to 50,000 chars (approx 15-20 pages) for speed
      text = text.slice(0, 50000);
    } catch (e: any) {
      console.error("❌ PDF Parse Error:", e);
      return NextResponse.json(
        { error: "Failed to read PDF" },
        { status: 500 }
      );
    }

    console.log("📄 [API] PDF Read Success. Length:", text.length);

    // 4️⃣ Send to AI (Groq)
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a Contract Extraction Engine. Extract data into strictly valid JSON.
          
          JSON SCHEMA:
          {
            "summary": "2 sentence summary of what is being delivered",
            "parties": ["Client Name", "Vendor Name"],
            "total_value": "Total cost if found, else 'Not specified'",
            "milestones": [
              {
                "title": "Short title of deliverable",
                "due_date": "YYYY-MM-DD or 'Not specified'",
                "criteria": "Exact acceptance criteria"
              }
            ]
          }
          
          RULES:
          1. OUTPUT ONLY JSON. No markdown.
          2. Infer missing dates from context.`,
        },
        {
          role: "user",
          content: `Contract Text:\n\n${text}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      stream: false,
      response_format: { type: "json_object" },
    });

    const rawContent = completion.choices[0]?.message?.content;
    if (!rawContent) throw new Error("AI returned empty response");

    const projectData = JSON.parse(rawContent);

    console.log("✅ [API] Success:", projectData.summary?.substring(0, 30));

    return NextResponse.json({ success: true, data: projectData });
  } catch (error: any) {
    console.error("🔥 Critical Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ------------------------------------------------------------------
// 🛠️ HELPER: Wrap pdf2json in a clean Promise
// ------------------------------------------------------------------
function parsePDFBuffer(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    // ❌ OLD: new PDFParser(null, 1);
    // ✅ NEW: Change '1' to 'true' to fix TypeScript error
    const pdfParser = new PDFParser(null, true); 

    pdfParser.on("pdfParser_dataError", (errData: any) => {
      reject(new Error(errData.parserError));
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      // pdf2json returns text in URL-encoded format sometimes, strictly clean it here
      const rawText = pdfParser.getRawTextContent(); 
      resolve(rawText);
    });

    // Start parsing
    pdfParser.parseBuffer(buffer);
  });
}
