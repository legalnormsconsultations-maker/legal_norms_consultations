import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { db } from "@/db";
import { regulatoryTasks } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { actionType, guidanceId, docketNumber, assigneeId, dueDate } = body;

    // In an advanced scenario, we would determine title and description dynamically
    // based on actionType or LLM input, but we'll use a strong template here.
    const title = `${actionType} for FDA Guidance ${docketNumber || "Unknown"}`;
    const description = `This is an automated regulatory task triggered from the FDA Intelligence Engine for guidance ID: ${guidanceId}. Please review and align strategy.`;

    const [newTask] = await db
      .insert(regulatoryTasks)
      .values({
        title,
        description,
        status: "pending",
        guidanceId,
        assigneeId: assigneeId || null,
        dueDate: dueDate
          ? new Date(dueDate)
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
      })
      .returning();

    // Send an email if standard action type (using a mock/ethereal transport for local dev if config not present,
    // or just simulate log if nodemailer isn't configured in ENV).
    if (process.env.SMTP_HOST) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD, // Fixed from SMTP_PASS
        },
      });

      await transporter.sendMail({
        from: `"Medical Portfolio Intelligence" <${process.env.AUTH_EMAIL_FROM || process.env.SMTP_USER}>`,
        to: "karanthakur9664@gmail.com", // Sent to user directly for demo
        subject: `New Action Required: ${title}`,
        text: description,
      });
    } else {
      console.log(
        `[Email Simulation] Sent to regulatory-team@example.com: ${title}`,
      );
    }

    return NextResponse.json({
      success: true,
      message: `Task ${newTask.id} created successfully`,
      task: newTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 },
    );
  }
}
