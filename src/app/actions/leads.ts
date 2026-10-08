"use server";

import { LeadsRepository, LeadInsert } from "@/repositories/leads-repository";
import { revalidatePath } from "next/cache";

import { COUNTRIES } from "@/lib/countries";

export async function submitLeadAction(prevState: any, formData: FormData) {
  try {
    const countryCode = formData.get("countryCode") as string;
    const mobileNumber = formData.get("mobileNumber") as string;
    const countryName = COUNTRIES.find(c => c.code === countryCode)?.name || "";

    const rawData = {
      fullName: formData.get("fullName") as string,
      company: formData.get("company") as string,
      email: formData.get("email") as string,
      mobileNumber: `${countryCode} ${mobileNumber}`,
      country: countryName,
      serviceId: formData.get("serviceId") ? (formData.get("serviceId") as string) : undefined,
      sourceUrl: formData.get("sourceUrl") as string | undefined,
    };

    // Advanced logic to clean/transform input before repository validation if needed
    
    await LeadsRepository.createLead(rawData);

    // Revalidate paths if we were showing metrics on frontend, though mostly for CMS
    revalidatePath("/admin/leads");
    
    return { success: true, message: "Your consultation request has been submitted successfully." };
  } catch (error) {
    console.error("Lead submission error:", error);
    return { success: false, message: "Failed to submit request. Please ensure all required fields are valid." };
  }
}
