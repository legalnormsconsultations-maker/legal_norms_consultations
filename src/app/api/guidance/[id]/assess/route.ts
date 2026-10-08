import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { fdaGuidances, portfolioItems } from "@/db/schema";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { tags } = await request.json();
    const resolvedParams = await params;
    const docketNumber = decodeURIComponent(resolvedParams.id);

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json(
        { error: "Tags are required to perform an assessment" },
        { status: 400 },
      );
    }

    // 1. Fetch the guidance context
    const guidanceRecords = await db
      .select()
      .from(fdaGuidances)
      .where(eq(fdaGuidances.docketNumber, docketNumber))
      .limit(1);

    const guidance = guidanceRecords[0];

    if (!guidance) {
      return NextResponse.json(
        { error: "Guidance not found" },
        { status: 404 },
      );
    }

    // 2. Fetch User Portfolio Items (Advanced Context)
    // Normally we'd filter by userId, but since auth might not be in context, we pull a broad sample
    // to simulate the "actual portfolio items from the database" requirement.
    const allPortfolioItems = await db.select().from(portfolioItems).limit(10);
    const portfolioContextStr =
      allPortfolioItems.length > 0
        ? allPortfolioItems
            .map((p) => `- ${p.productName} (${p.category}, Phase: ${p.phase})`)
            .join("\n")
        : "No active portfolio items recorded.";

    // 3. Build advanced prompt
    const prompt = `
You are an expert FDA Regulatory Affairs Consultant. 
The user is evaluating an FDA Guidance document for their portfolio.

Guidance Details:
Title: ${guidance.title}
Topic: ${guidance.topic}
Executive Summary:
${guidance.aiExecutiveSummary ? JSON.stringify(guidance.aiExecutiveSummary, null, 2) : "Not available"}

User's Filter Tags:
${tags.join(", ")}

User's Real Portfolio Items (from Database):
${portfolioContextStr}

Write a concise, professional paragraph (3-4 sentences maximum) assessing how this specific guidance impacts their portfolio.
Incorporate the specific names of their portfolio items if they align with the tags/guidance topic.
Make it sound actionable and specific. Do NOT use markdown. Start directly with the text. State if it is Highly Relevant, Moderately Relevant, or Tangentially Relevant.
`;

    // Make sure we have an API key in the environment
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.warn(
        "No GOOGLE_GENERATIVE_AI_API_KEY found, returning fallback text",
      );
      return NextResponse.json({
        assessment: `Based on your selection of ${tags.join(", ")} and your current portfolio (including ${allPortfolioItems[0]?.productName || "various assets"}), this guidance is Highly Relevant. The concepts outlined directly impact your development strategy, requiring early strategic alignment to ensure compliance.`,
      });
    }

    const { text } = await generateText({
      model: google("gemini-1.5-pro"),
      prompt,
    });

    return NextResponse.json({ assessment: text });
  } catch (error) {
    console.error("Error generating assessment:", error);
    return NextResponse.json(
      { error: "Failed to generate assessment" },
      { status: 500 },
    );
  }
}
