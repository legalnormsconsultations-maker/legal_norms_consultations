import { db } from "../db";
import { leads } from "../db/schema";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";

export const LeadCreateSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  company: z.string().optional(),
  country: z.string().optional(),
  mobileNumber: z.string().min(5, "Valid mobile number is required"),
  email: z.string().email("Valid email is required"),
  businessType: z.string().optional(),
  productCategory: z.string().optional(),
  authorityId: z.string().uuid().optional(),
  serviceId: z.string().uuid().optional(),
  numberOfSkus: z.string().optional(),
  message: z.string().optional(),
  sourceUrl: z.string().optional(),
});

export type LeadInsert = z.infer<typeof LeadCreateSchema>;

export class LeadsRepository {
  /**
   * Creates a new lead in the system with validation and defaults
   */
  static async createLead(data: LeadInsert) {
    // 1. Validate data
    const validatedData = LeadCreateSchema.parse(data);

    // 2. Store lead
    const [newLead] = await db
      .insert(leads)
      .values({
        ...validatedData,
        status: "New",
        priority: "Medium",
      })
      .returning();

    // 3. Notify admin & trigger email (placeholder for event-driven hook)
    // await NotificationService.sendLeadAlert(newLead);
    
    return newLead;
  }

  /**
   * Gets a paginated list of leads for the admin CMS
   */
  static async getLeads(params: { limit?: number; offset?: number; status?: string }) {
    const { limit = 20, offset = 0, status } = params;
    
    const query = db.select().from(leads).orderBy(desc(leads.createdAt));
    
    if (status) {
      query.where(eq(leads.status, status));
    }

    return await query.limit(limit).offset(offset);
  }

  /**
   * Gets stats for the admin CMS dashboard
   */
  static async getLeadsStats() {
    const allLeads = await db.select().from(leads);
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    let newLeadsThisWeek = 0;
    let consultationsScheduled = 0;
    let proposalsSent = 0;
    let totalLeads = allLeads.length;
    let convertedLeads = 0;

    for (const lead of allLeads) {
      if (lead.status === 'New' && lead.createdAt && new Date(lead.createdAt) >= oneWeekAgo) {
        newLeadsThisWeek++;
      }
      // Assuming these are the status values used or can be used
      if (lead.status === 'Consultation Scheduled' || lead.status === 'Contacted') {
        consultationsScheduled++;
      }
      if (lead.status === 'Proposal Sent' || lead.status === 'Qualified') {
        proposalsSent++;
      }
      if (lead.status === 'Closed Won') {
        convertedLeads++;
      }
    }

    const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

    return {
      newLeadsThisWeek,
      consultationsScheduled,
      proposalsSent,
      conversionRate
    };
  }

  /**
   * Update lead status (e.g., from 'New' to 'Contacted')
   */
  static async updateLeadStatus(leadId: string, newStatus: string, notes?: string) {
    const [updatedLead] = await db
      .update(leads)
      .set({ 
        status: newStatus,
        notes: notes ? notes : undefined,
        updatedAt: new Date()
      })
      .where(eq(leads.id, leadId))
      .returning();
      
    return updatedLead;
  }

  /**
   * Updates a lead's full details
   */
  static async updateLead(leadId: string, data: Partial<LeadInsert>) {
    // Only update allowed fields
    const allowedFields = ["fullName", "company", "country", "mobileNumber", "email", "businessType", "productCategory", "numberOfSkus", "message", "sourceUrl"];
    const updateData: any = { updatedAt: new Date() };
    
    for (const key of allowedFields) {
      if ((data as any)[key] !== undefined) {
        updateData[key] = (data as any)[key];
      }
    }

    const [updatedLead] = await db
      .update(leads)
      .set(updateData)
      .where(eq(leads.id, leadId))
      .returning();
      
    return updatedLead;
  }

  /**
   * Deletes a lead
   */
  static async deleteLead(leadId: string) {
    const [deletedLead] = await db
      .delete(leads)
      .where(eq(leads.id, leadId))
      .returning();
      
    return deletedLead;
  }
}
