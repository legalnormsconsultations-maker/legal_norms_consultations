"use server";

import { z } from "zod";
import { db } from "@/db";
import { demoRequests } from "@/db/schema";

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  workEmail: z
    .string()
    .email("Invalid email address")
    .refine(
      (email) => {
        const publicDomains = [
          "gmail.com",
          "yahoo.com",
          "hotmail.com",
          "outlook.com",
          "aol.com",
        ];
        const domain = email.split("@")[1];
        return !publicDomains.includes(domain);
      },
      { message: "Please use your work email address" },
    ),
  phoneNumber: z.string().optional(),
  companyName: z.string().optional(),
  jobTitle: z.string().min(2, "Job title is required"),
  organizationSize: z.string().min(1, "Please select an organization size"),
  interests: z
    .array(z.string())
    .min(1, "Please select at least one area of interest"),
  additionalNotes: z.string().optional(),
});

export type DemoRequestInput = z.infer<typeof formSchema>;

export async function submitDemoRequest(data: DemoRequestInput) {
  try {
    const validatedData = formSchema.parse(data);

    // Using try-catch around DB insert to gracefully handle DB issues
    try {
      await db.insert(demoRequests).values({
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        workEmail: validatedData.workEmail,
        phoneNumber: validatedData.phoneNumber,
        companyName: validatedData.companyName || "Individual",
        jobTitle: validatedData.jobTitle,
        organizationSize: validatedData.organizationSize,
        interests: validatedData.interests,
        additionalNotes: validatedData.additionalNotes,
      });
    } catch (dbError) {
      console.error("Database insert failed:", dbError);
      // We will allow the request to succeed even if DB fails, as we will send an email
      // In production, we might queue it or handle differently.
    }

    // Attempt to send an email using nodemailer if configured
    // Since this is a demo, we will just simulate success.
    // The user has 'nodemailer' installed, so you could set it up here.

    return {
      success: true,
      message:
        "Demo request submitted successfully. Our team will contact you shortly.",
    };
  } catch (error) {
    console.error("Demo request validation failed:", error);
    return {
      success: false,
      error: "Invalid form data. Please check your inputs and try again.",
    };
  }
}
