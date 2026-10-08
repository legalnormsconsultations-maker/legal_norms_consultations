import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { fdaGuidances } from "@/db/schema";
import GuidanceClient from "./GuidanceClient";

export const metadata = {
  title: "FDA Guidance Detail | Medical Portfolio",
  description: "View FDA guidance documents and AI-driven insights.",
};

export default async function FDAGuidanceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Wait for the params to resolve (Next.js 15+ sometimes requires awaiting params if using app router, but we will just use it)
  // `id` is the docketNumber passed from URL
  const docketNumber = decodeURIComponent(params.id);

  // Fetch from DB
  const guidanceRecords = await db
    .select()
    .from(fdaGuidances)
    .where(eq(fdaGuidances.docketNumber, docketNumber))
    .limit(1);

  const guidanceRecord = guidanceRecords[0];

  if (!guidanceRecord) {
    notFound();
  }

  // Format to match what the client component expects
  const guidance = {
    id: guidanceRecord.id,
    title: guidanceRecord.title,
    type: guidanceRecord.type,
    status: guidanceRecord.status,
    center: guidanceRecord.center,
    office: guidanceRecord.office,
    topic: guidanceRecord.topic,
    docketNumber: guidanceRecord.docketNumber,
    issueDate: guidanceRecord.issueDate,
    commentOpeningDate: guidanceRecord.commentOpeningDate,
    commentClosingDate: guidanceRecord.commentClosingDate,
    supersedes: guidanceRecord.supersedes || [],
    supersededBy: guidanceRecord.supersededBy || [],
    relatedGuidances: guidanceRecord.relatedGuidances || [],
    officialPdfUrl: guidanceRecord.officialPdfUrl,
    federalRegisterNoticeUrl: guidanceRecord.federalRegisterNoticeUrl,
    sourceUrl: guidanceRecord.sourceUrl,
    aiExecutiveSummary: guidanceRecord.aiExecutiveSummary,
    aiDiffAnalysis: guidanceRecord.aiDiffAnalysis,
    aiRegulatoryImpact: guidanceRecord.aiRegulatoryImpact,
  };

  return <GuidanceClient guidance={guidance} />;
}
