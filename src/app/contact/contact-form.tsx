"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { H1, Paragraph } from "@/components/ui/typography";
import { submitContactMessage } from "./actions";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get("fullName") as string,
      workEmail: formData.get("workEmail") as string,
      message: formData.get("message") as string,
    };

    try {
      const response = await submitContactMessage(data);
      if (response.success) {
        setIsSuccess(true);
      } else {
        setError(response.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 pt-12 pb-24 text-center">
        <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-success" />
        </div>
        <H1>Message Sent</H1>
        <Paragraph className="text-lg text-muted-foreground">
          Thank you for reaching out to Legalnorms. Our team will get back to
          you shortly.
        </Paragraph>
        <Link
          href="/"
          className="inline-flex items-center justify-center mt-6 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
        >
          Return to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-card p-8 rounded-xl shadow-sm border border-border"
      >
        <div className="space-y-2">
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-muted-foreground"
          >
            Full Name
          </label>
          <input
            required
            id="fullName"
            name="fullName"
            type="text"
            className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 bg-background"
            placeholder="Jane Doe"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="workEmail"
            className="block text-sm font-medium text-muted-foreground"
          >
            Work Email
          </label>
          <input
            required
            id="workEmail"
            name="workEmail"
            type="email"
            className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 bg-background"
            placeholder="jane@company.com"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-muted-foreground"
          >
            Message
          </label>
          <textarea
            required
            id="message"
            name="message"
            rows={4}
            className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 bg-background"
            placeholder="How can we help?"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-slate-900 text-white font-medium py-2 px-4 rounded-md hover:bg-slate-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {isSubmitting ? (
            <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Send Message
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
