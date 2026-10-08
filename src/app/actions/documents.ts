"use server";

import { generateRegulatoryRoadmap } from "@/lib/document-generator";
import { LeadsRepository } from "@/repositories/leads-repository";
import { ServicesRepository } from "@/repositories/services-repository";

export async function createRoadmapForLeadAction(leadId: string) {
  try {
    // 1. Fetch Lead
    const leads = await LeadsRepository.getLeads({ limit: 100 });
    const lead = leads.find(l => l.id === leadId);
    
    if (!lead || !lead.serviceId) {
      return { success: false, error: "Lead or Service not found." };
    }

    // 2. Fetch Service Slug
    const services = await ServicesRepository.getTopLevelServices({ limit: 100 });
    const service = services.find(s => s.id === lead.serviceId);

    if (!service) {
      return { success: false, error: "Associated service not found." };
    }

    // 3. Generate PDF
    const pdfBuffer = await generateRegulatoryRoadmap(service.slug, lead.company || lead.fullName);
    
    // In a real app, we would save this to S3 and return a URL.
    // For this example, we return base64 string to be handled by the client.
    const base64Pdf = pdfBuffer.toString("base64");

    // 4. Update Lead Status
    await LeadsRepository.updateLeadStatus(leadId, "Qualified");

    return { 
      success: true, 
      pdfBase64: base64Pdf,
      fileName: `${lead.company?.replace(/\s+/g, "_") || "Client"}_Roadmap.pdf`
    };

  } catch (error: any) {
    console.error("Failed to generate roadmap:", error);
    return { success: false, error: error.message || "Failed to generate document" };
  }
}
