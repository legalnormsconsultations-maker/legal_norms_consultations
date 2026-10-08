import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
// @ts-expect-error - module has no default export according to types but works in runtime
import pdfParse from "pdf-parse";
import { z } from "zod";
import { db } from "../db";
import { fdaGuidances } from "../db/schema";

// Define the exact schema we want the AI to return based on our database design
const fdaIntelligenceSchema = z.object({
  executiveSummary: z.object({
    whatChanged: z.object({ text: z.string(), citation: z.string() }),
    whyItMatters: z.object({ text: z.string(), citation: z.string() }),
    whoIsAffected: z.object({ text: z.string(), citation: z.string() }),
    actionRequired: z.object({ text: z.string(), citation: z.string() }),
    deadline: z.object({ text: z.string(), citation: z.string() }),
    ifIgnored: z.object({ text: z.string(), citation: z.string() }),
  }),
  diffAnalysis: z.array(
    z.object({
      area: z.string(),
      previous: z.string(),
      new: z.string(),
      impact: z.enum(["High", "Medium", "Low"]),
    }),
  ),
  regulatoryImpact: z.array(
    z.object({
      function: z.string(),
      impact: z.enum(["High", "Medium", "Low"]),
      action: z.string(),
      owner: z.string(),
      deadline: z.string(),
      status: z.string(),
    }),
  ),
});

export async function processFdaPdf(
  pdfBuffer: Buffer,
  metadata: {
    title: string;
    type: string;
    status: string;
    center: string;
    office: string;
    topic: string;
    docketNumber: string;
    issueDate: Date;
    commentClosingDate?: Date;
  },
) {
  console.log(`Starting processing for docket ${metadata.docketNumber}...`);

  // 1. Parse PDF Text
  const pdfData = await pdfParse(pdfBuffer);
  const rawText = pdfData.text;

  console.log(
    `Successfully parsed PDF. Extracted ${rawText.length} characters.`,
  );

  // 2. Generate structured payload via Gemini
  // Note: For massive PDFs, we might need to chunk or use Gemini 1.5 Pro's huge context window directly.
  console.log(
    "Sending prompt to Gemini 1.5 Pro to generate intelligence payload...",
  );
  const { object } = await generateObject({
    model: google("gemini-1.5-pro"),
    schema: fdaIntelligenceSchema,
    prompt: `
    You are an expert FDA Regulatory Affairs analyst.
    Below is the raw text of a newly published FDA Guidance document. 
    Analyze this text and generate the required structured JSON response.

    DOCUMENT TITLE: ${metadata.title}
    DOCUMENT TEXT:
    ${rawText.substring(0, 100000)} // Ensure we don't exceed token limits, though 1.5 Pro handles a lot.

    Instructions:
    1. Extract the executive summary focusing on actionable changes, affected parties, and penalties. Include citations (like "[Section IV, Pg 5]") based on the text.
    2. Build a diff analysis highlighting what exactly changed from previous norms or previous guidances mentioned.
    3. Generate a regulatory impact matrix estimating which internal departments (e.g. Clinical, QMS, Engineering) are affected, what they must do, and an estimated deadline/owner profile.
    `,
  });

  console.log("Successfully generated AI Intelligence. Saving to database...");

  // 3. Save to database
  const [record] = await db
    .insert(fdaGuidances)
    .values({
      title: metadata.title,
      type: metadata.type,
      status: metadata.status,
      center: metadata.center,
      office: metadata.office,
      topic: metadata.topic,
      docketNumber: metadata.docketNumber,
      issueDate: metadata.issueDate,
      commentClosingDate: metadata.commentClosingDate,
      aiExecutiveSummary: object.executiveSummary,
      aiDiffAnalysis: object.diffAnalysis,
      aiRegulatoryImpact: object.regulatoryImpact,
    })
    .returning();

  console.log(
    `✅ Fully processed and saved guidance ${record.docketNumber} to database (ID: ${record.id})`,
  );
  return record;
}
