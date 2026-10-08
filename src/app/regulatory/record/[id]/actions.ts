"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import {
  regulatoryAssignments,
  regulatoryImpactAssessments,
  regulatoryIntelligence,
  regulatorySubscriptions,
  users,
  drugs,
} from "@/db/schema";

// Action 1: Toggle Subscription
export async function toggleRecordSubscription(
  recordId: string,
  userId: string = "demo-user-id",
) {
  try {
    // Check if subscription exists
    const existing = await db
      .select()
      .from(regulatorySubscriptions)
      .where(
        and(
          eq(regulatorySubscriptions.recordId, recordId),
          eq(regulatorySubscriptions.userId, userId),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      // Unsubscribe
      await db
        .delete(regulatorySubscriptions)
        .where(eq(regulatorySubscriptions.id, existing[0].id));
      return { isTracking: false, success: true };
    } else {
      // Subscribe
      await db.insert(regulatorySubscriptions).values({
        recordId,
        userId,
      });
      return { isTracking: true, success: true };
    }
  } catch (error) {
    console.error("Error toggling subscription:", error);
    throw new Error("Failed to toggle subscription");
  }
}

// Action 2: Assign Review
export async function assignRecordReview(
  recordId: string,
  assigneeName: string,
  message?: string,
) {
  try {
    await db.insert(regulatoryAssignments).values({
      recordId,
      assigneeName,
      message: message || null,
      status: "pending",
    });
    return { success: true };
  } catch (error) {
    console.error("Error assigning record:", error);
    throw new Error("Failed to assign record");
  }
}

// Action 3: Save Impact Assessment
export async function saveImpactAssessment(
  recordId: string,
  impactLevel: string,
  affectedProducts: string[],
  complianceDeadline: string,
) {
  try {
    await db.insert(regulatoryImpactAssessments).values({
      recordId,
      impactLevel,
      affectedProducts: JSON.stringify(affectedProducts),
      complianceDeadline: complianceDeadline || null,
    });
    revalidatePath(`/regulatory/record/${recordId}`);
    return { success: true };
  } catch (error) {
    console.error("Error saving impact assessment:", error);
    throw new Error("Failed to save impact assessment");
  }
}

// Action 4: Generate AI Summary (Simulated API call for AI)
export async function generateAISummary(recordId: string) {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    success: true,
    summary: `Based on the latest FDA guidance (${recordId}), manufacturers of Class II and III cardiovascular devices must implement updated cybersecurity protocols by Oct 15, 2024. 
      
Key changes include:
• Mandatory software bill of materials (SBOM) submission.
• Coordinated vulnerability disclosure processes.
• Real-time threat modeling requirements during premarket submission.

Impact on your portfolio: Products X and Y will require retroactive SBOM documentation before the Q4 audit.`,
  };
}

// Action 5: Get Users for Assignment
export async function getRealtimeUsers() {
  const allUsers = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      title: users.title,
      email: users.email,
    })
    .from(users);
  return allUsers;
}

// Action 6: Get Intelligence Record
export async function getIntelligenceRecord(id: string) {
  // Validate UUID format before querying to avoid Postgres crashes
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return null;
  }

  const record = await db
    .select()
    .from(regulatoryIntelligence)
    .where(eq(regulatoryIntelligence.id, id))
    .limit(1);
  return record.length > 0 ? record[0] : null;
}

// Action 7: Update Record
export async function updateIntelligenceRecord(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const agency = formData.get("agency") as string;
  const status = formData.get("status") as string;
  const impactLevel = formData.get("impactLevel") as string;

  await db
    .update(regulatoryIntelligence)
    .set({
      title,
      agency,
      status,
      impactLevel,
    })
    .where(eq(regulatoryIntelligence.id, id));

  revalidatePath(`/regulatory/record/${id}`);
  return { success: true };
}

// Action 8: Delete Record
export async function deleteIntelligenceRecord(id: string) {
  await db
    .delete(regulatoryIntelligence)
    .where(eq(regulatoryIntelligence.id, id));
  revalidatePath(`/admin/intelligence`);
  return { success: true };
}

// Action 9: Get Impact Assessment
export async function getImpactAssessment(recordId: string) {
  const assessment = await db
    .select()
    .from(regulatoryImpactAssessments)
    .where(eq(regulatoryImpactAssessments.recordId, recordId))
    .limit(1);
  return assessment.length > 0 ? assessment[0] : null;
}

// Action 10: Get Drugs
export async function getDrugs() {
  const allDrugs = await db
    .select({
      id: drugs.id,
      drugName: drugs.drugName,
      status: drugs.status,
    })
    .from(drugs);
  return allDrugs;
}
