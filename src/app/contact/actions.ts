"use server";

import { z } from "zod";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
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
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

export type ContactMessageInput = z.infer<typeof formSchema>;

export async function submitContactMessage(data: ContactMessageInput) {
  try {
    const validatedData = formSchema.parse(data);

    try {
      await db.insert(contactMessages).values({
        fullName: validatedData.fullName,
        workEmail: validatedData.workEmail,
        message: validatedData.message,
      });

      // Find admins to notify
      const { users, notifications } = await import("@/db/schema");
      const { sql } = await import("drizzle-orm");
      const admins = await db.select({ id: users.id, email: users.email }).from(users).where(sql`${users.roles} @> '["ADMIN"]'::jsonb`);
      
      if (admins.length > 0) {
        await db.insert(notifications).values(
          admins.map(admin => ({
            userId: admin.id,
            title: "New Contact Message",
            message: `${validatedData.fullName} sent a message.`,
          }))
        );
      }

      // Send email to the system's FROM address (or admin)
      try {
        const { sendEmail } = await import("@/lib/auth/delivery");
        const adminEmail = process.env.AUTH_EMAIL_FROM || "legalnormsconsultations@gmail.com";
        await sendEmail({
          to: adminEmail,
          subject: `New Contact Request from ${validatedData.fullName}`,
          text: `Name: ${validatedData.fullName}\nEmail: ${validatedData.workEmail}\n\nMessage:\n${validatedData.message}`,
          html: `<p><strong>Name:</strong> ${validatedData.fullName}</p><p><strong>Email:</strong> ${validatedData.workEmail}</p><p><strong>Message:</strong></p><p>${validatedData.message.replace(/\n/g, "<br>")}</p>`,
        });
      } catch (emailError) {
        console.error("Failed to send contact notification email:", emailError);
      }
    } catch (dbError) {
      console.error("Database operation failed:", dbError);
    }

    return {
      success: true,
      message:
        "Your message has been sent successfully. Our team will contact you shortly.",
    };
  } catch (error) {
    console.error("Contact form validation failed:", error);
    return {
      success: false,
      error: "Invalid form data. Please check your inputs and try again.",
    };
  }
}
