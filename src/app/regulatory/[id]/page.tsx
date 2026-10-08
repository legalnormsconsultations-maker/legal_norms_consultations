import { eq } from "drizzle-orm";
import {
  AlertTriangle,
  ArrowLeft,
  Building,
  Calendar,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { BodyText, Display, H2, HelperText } from "@/components/ui/typography";
import { db } from "@/db";
import { regulatoryIntelligence } from "@/db/schema";

export default async function RegulatoryIntelligencePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const [intel] = await db
    .select()
    .from(regulatoryIntelligence)
    .where(eq(regulatoryIntelligence.id, id))
    .limit(1);

  if (!intel) {
    notFound();
  }

  const statusColor =
    intel.status === "Critical"
      ? "text-destructive bg-destructive/10 border-destructive/20"
      : intel.status === "Warning"
        ? "text-warning bg-warning/10 border-warning/20"
        : "text-info bg-info/10 border-info/20";

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
          Back to Dashboard
        </Link>

        <div className="mb-8 flex flex-wrap items-center gap-4">
          <span
            className={`px-3 py-1.5 rounded-full text-sm font-bold border ${statusColor} uppercase tracking-wider`}
          >
            {intel.status} Alert
          </span>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
            <Calendar className="w-4 h-4" />
            {intel.dateString}
          </div>
          {intel.agency && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
              <Building className="w-4 h-4" />
              {intel.agency}
            </div>
          )}
        </div>

        <Display className="mb-6">{intel.title}</Display>

        {intel.summary && (
          <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-12 leading-relaxed">
            {intel.summary}
          </p>
        )}

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="col-span-2 space-y-6">
            <H2 className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" /> Full Intelligence
              Brief
            </H2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {intel.fullContent ? (
                intel.fullContent.split("\n\n").map((paragraph, idx) => (
                  <p
                    key={idx}
                    className="text-base text-foreground/90 leading-relaxed mb-4"
                  >
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="italic text-muted-foreground">
                  Full brief content is currently being drafted or is not
                  available for this alert.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
              <H2 className="text-xl mb-4 border-b border-border pb-4">
                Metadata
              </H2>
              <div className="space-y-4">
                <div>
                  <HelperText className="uppercase text-xs font-bold tracking-wider mb-1">
                    Impact Level
                  </HelperText>
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className={`w-4 h-4 ${
                        intel.impactLevel === "High"
                          ? "text-destructive"
                          : intel.impactLevel === "Medium"
                            ? "text-warning"
                            : "text-info"
                      }`}
                    />
                    <span className="font-semibold text-foreground">
                      {intel.impactLevel || "TBD"}
                    </span>
                  </div>
                </div>
                <div>
                  <HelperText className="uppercase text-xs font-bold tracking-wider mb-1">
                    Date Logged
                  </HelperText>
                  <p className="font-medium text-foreground text-sm">
                    {new Date(intel.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
