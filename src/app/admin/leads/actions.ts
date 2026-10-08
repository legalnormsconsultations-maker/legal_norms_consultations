"use server";

import { LeadsRepository, LeadInsert } from "@/repositories/leads-repository";
import { revalidatePath } from "next/cache";

export async function updateLeadStatusAction(leadId: string, newStatus: string) {
  try {
    await LeadsRepository.updateLeadStatus(leadId, newStatus);
    revalidatePath("/admin/leads");
    return { success: true };
  } catch (error) {
    console.error("Error updating lead status:", error);
    return { success: false, error: "Failed to update lead status" };
  }
}

export async function createManualLeadAction(data: LeadInsert) {
  try {
    await LeadsRepository.createLead(data);
    revalidatePath("/admin/leads");
    return { success: true };
  } catch (error) {
    console.error("Error creating manual lead:", error);
    return { success: false, error: "Failed to create manual lead" };
  }
}

export async function updateLeadAction(leadId: string, data: Partial<LeadInsert>) {
  try {
    await LeadsRepository.updateLead(leadId, data);
    revalidatePath("/admin/leads");
    return { success: true };
  } catch (error) {
    console.error("Error updating lead:", error);
    return { success: false, error: "Failed to update lead" };
  }
}

export async function deleteLeadAction(leadId: string) {
  try {
    await LeadsRepository.deleteLead(leadId);
    revalidatePath("/admin/leads");
    return { success: true };
  } catch (error) {
    console.error("Error deleting lead:", error);
    return { success: false, error: "Failed to delete lead" };
  }
}
