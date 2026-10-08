import "server-only";

import nodemailer from "nodemailer";

type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export async function sendEmail(message: EmailMessage): Promise<void> {
  const provider = process.env.AUTH_EMAIL_PROVIDER;

  if (provider === "resend") {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.AUTH_EMAIL_FROM;
    if (!apiKey || !from) {
      throw new Error("Configure RESEND_API_KEY and AUTH_EMAIL_FROM.");
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, ...message }),
    });
    if (!response.ok) {
      throw new Error(`Email delivery failed with status ${response.status}.`);
    }
    return;
  }

  if (provider === "smtp") {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT ?? "587");
    const from = process.env.AUTH_EMAIL_FROM;
    if (!host || !from) {
      throw new Error("Configure SMTP_HOST and AUTH_EMAIL_FROM.");
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
    });
    await transporter.sendMail({ from, ...message });
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(
      `[Local auth email] ${message.to} | ${message.subject}\n${message.text}`,
    );
    return;
  }

  throw new Error(
    "Set AUTH_EMAIL_PROVIDER to smtp or resend before enabling auth in production.",
  );
}

export async function sendSms(to: string, body: string): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!accountSid || !authToken || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[Local auth SMS] ${to} | ${body}`);
      return;
    }
    throw new Error(
      "Configure the Twilio account, token, and sender before enabling phone auth.",
    );
  }

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: to, From: from, Body: body }),
    },
  );
  if (!response.ok) {
    throw new Error(`SMS delivery failed with status ${response.status}.`);
  }
}
