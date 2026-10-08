"use client";

import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Globe2,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { submitDemoRequest } from "./actions";

export default function RequestDemoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [interests, setInterests] = useState<string[]>([]);
  const [selectedOrgSize, setSelectedOrgSize] = useState("");

  const handleInterestToggle = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      workEmail: formData.get("workEmail") as string,
      phoneNumber: (formData.get("phoneNumber") as string)
        ? `${formData.get("countryCode")} ${formData.get("phoneNumber")}`
        : "",
      companyName: formData.get("companyName") as string,
      jobTitle: formData.get("jobTitle") as string,
      organizationSize: formData.get("organizationSize") as string,
      interests: interests,
      additionalNotes: formData.get("additionalNotes") as string,
    };

    if (interests.length === 0) {
      setError("Please select at least one area of interest.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await submitDemoRequest(data);
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
      <div className="min-h-screen bg-background flex flex-col">
        <header className="p-6 border-b border-border/50 bg-card">
          <Link href="/" className="flex items-center gap-2 max-w-fit">
            <div className="p-1.5 bg-primary rounded shadow-sm">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Legalnorms.
            </span>
          </Link>
        </header>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-xl p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Request Received
            </h2>
            <p className="text-muted-foreground">
              Thank you for your interest in Legalnorms. One of our enterprise
              product specialists will review your details and reach out within
              24 hours to schedule your personalized demo.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Left Panel - Value Proposition */}
      <div className="hidden md:flex flex-col w-[45%] lg:w-[40%] bg-card border-r border-border p-10 lg:p-16 relative overflow-hidden">
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-background to-background z-0 pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full">
          <Link
            href="/"
            className="flex items-center gap-2 max-w-fit mb-16 hover:opacity-80 transition-opacity"
          >
            <div className="p-2 bg-primary rounded shadow-sm">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">
              Legalnorms.
            </span>
          </Link>

          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 leading-tight">
              Accelerate your regulatory strategy with intelligence
            </h1>
            <p className="text-lg text-muted-foreground mb-12">
              Join leading pharmaceutical and biotech companies who use
              Legalnorms to navigate complex compliance landscapes and bring
              products to market faster.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-primary/10 rounded-lg shrink-0">
                  <Globe2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg mb-1">
                    Global Database Access
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Instantly query over 250,000 regulatory entries across FDA,
                    EMA, and global health authorities.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-primary/10 rounded-lg shrink-0">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg mb-1">
                    Automated Compliance
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Map your entire portfolio against shifting global
                    regulations to ensure continuous compliance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-primary/10 rounded-lg shrink-0">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg mb-1">
                    Enterprise Collaboration
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Secure role-based workspaces for your regulatory, legal, and
                    medical affairs teams.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-12 border-t border-border/50">
            <p className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
              Trusted by Industry Leaders
            </p>
            <div className="flex items-center gap-6 opacity-60 grayscale">
              <div className="flex items-center gap-2 font-bold text-xl">
                <Building2 className="w-5 h-5" /> PharmaCorp
              </div>
              <div className="flex items-center gap-2 font-bold text-xl">
                <Building2 className="w-5 h-5" /> BioGenX
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col bg-background p-6 md:p-10 lg:p-16 overflow-y-auto">
        <div className="md:hidden mb-8">
          <Link href="/" className="flex items-center gap-2 max-w-fit">
            <div className="p-1.5 bg-primary rounded shadow-sm">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Legalnorms.
            </span>
          </Link>
        </div>

        <div className="max-w-2xl w-full mx-auto my-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Request a Personalized Demo
            </h2>
            <p className="text-muted-foreground text-lg">
              Fill out the form below and our team will tailor a demonstration
              specifically for your organization's regulatory needs.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="text-sm font-medium text-foreground"
                >
                  First Name *
                </label>
                <input
                  required
                  id="firstName"
                  name="firstName"
                  type="text"
                  className="w-full h-11 px-4 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="text-sm font-medium text-foreground"
                >
                  Last Name *
                </label>
                <input
                  required
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="w-full h-11 px-4 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="workEmail"
                className="text-sm font-medium text-foreground"
              >
                Work Email *
              </label>
              <input
                required
                id="workEmail"
                name="workEmail"
                type="email"
                className="w-full h-11 px-4 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="john.doe@company.com"
              />
              <p className="text-xs text-muted-foreground">
                Please use your corporate email address.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="phoneNumber"
                  className="text-sm font-medium text-foreground"
                >
                  Phone Number
                </label>
                <div className="flex w-full">
                  <select
                    name="countryCode"
                    defaultValue="+91"
                    className="w-[100px] shrink-0 h-11 px-2 bg-card border border-border border-r-0 rounded-l-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm font-medium"
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+81">🇯🇵 +81</option>
                    <option value="+49">🇩🇪 +49</option>
                    <option value="+33">🇫🇷 +33</option>
                    <option value="+86">🇨🇳 +86</option>
                    <option value="+971">🇦🇪 +971</option>
                  </select>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    className="flex-1 min-w-0 h-11 px-4 bg-card border border-border rounded-r-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="98765 43210"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="jobTitle"
                  className="text-sm font-medium text-foreground"
                >
                  Job Title *
                </label>
                <input
                  required
                  id="jobTitle"
                  name="jobTitle"
                  type="text"
                  className="w-full h-11 px-4 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="VP of Regulatory Affairs"
                />
              </div>
            </div>

            <div
              className={`grid grid-cols-1 gap-6 ${selectedOrgSize === "individual" ? "" : "md:grid-cols-2"}`}
            >
              {selectedOrgSize !== "individual" && (
                <div className="space-y-2">
                  <label
                    htmlFor="companyName"
                    className="text-sm font-medium text-foreground"
                  >
                    Company Name *
                  </label>
                  <input
                    required
                    id="companyName"
                    name="companyName"
                    type="text"
                    className="w-full h-11 px-4 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="Acme Pharmaceuticals"
                  />
                </div>
              )}
              <div className="space-y-2">
                <label
                  htmlFor="organizationSize"
                  className="text-sm font-medium text-foreground"
                >
                  Organization Size *
                </label>
                <select
                  required
                  id="organizationSize"
                  name="organizationSize"
                  defaultValue=""
                  onChange={(e) => setSelectedOrgSize(e.target.value)}
                  className="w-full h-11 px-4 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all appearance-none"
                >
                  <option value="" disabled>
                    Select size...
                  </option>
                  <option value="individual">Individual / Consultant</option>
                  <option value="1-50">1-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-1000">201-1,000 employees</option>
                  <option value="1001-5000">1,001-5,000 employees</option>
                  <option value="5000+">5,000+ employees</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="text-sm font-medium text-foreground">
                What are you most interested in? (Select all that apply) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Global Drug Database",
                  "Regulatory Lifecycle Management",
                  "Import/Export Compliance",
                  "Medical Portfolio Tracking",
                  "Enterprise RBAC & Security",
                  "API Integration",
                ].map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`flex items-center px-4 py-3 border rounded-lg text-sm text-left transition-all ${
                      interests.includes(interest)
                        ? "border-primary bg-primary/5 text-primary font-semibold"
                        : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-sm border mr-3 flex items-center justify-center transition-colors ${
                        interests.includes(interest)
                          ? "bg-primary border-primary"
                          : "border-border"
                      }`}
                    >
                      {interests.includes(interest) && (
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      )}
                    </div>
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label
                htmlFor="additionalNotes"
                className="text-sm font-medium text-foreground"
              >
                Anything else we should know?
              </label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                rows={3}
                className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                placeholder="Tell us about your specific regulatory challenges..."
              ></textarea>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <>
                    Request My Demo
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              <p className="text-xs text-muted-foreground text-center mt-4">
                By submitting this form, you agree to our Privacy Policy and
                Terms of Service.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
