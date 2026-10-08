import {
  Activity,
  AlertTriangle,
  BookmarkPlus,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileDigit,
  FlaskConical,
  History,
  Share,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  BodyText,
  Display,
  HelperText,
  LabelText,
  MetadataText,
  PageHeading,
  SectionHeading,
} from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { CatalogService } from "@/services/catalog.service";

export default async function DrugDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  let drug = null;
  try {
    drug = await CatalogService.getDrugDetail(resolvedParams.id);
  } catch (error) {
    console.error("Database connection error, falling back to 404.", error);
  }

  if (!drug) {
    notFound();
  }

  const brandNames = (drug.brandNames as string[]) || [];
  const activeIngredients = (drug.activeIngredients as string[]) || [];
  const dosageForms = (drug.dosageForms as string[]) || [];
  const therapeuticCategories = (drug.therapeuticCategories as string[]) || [];
  const routeOfAdmin = (drug.routeOfAdministration as string[]) || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Platform Public Navbar */}
      <nav className="w-full border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="p-1.5 bg-primary rounded shadow-sm">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Legalnorms consultations
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link
              href="/intelligence"
              className="hover:text-primary transition-colors"
            >
              Intelligence
            </Link>
            <Link href="/drugs" className="text-primary font-bold">
              Drug Database
            </Link>
            <Link
              href="/login"
              className="px-5 py-2 bg-foreground text-background font-semibold rounded-md shadow-sm"
            >
              System Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Drug Profile Header */}
      <header className="w-full bg-card border-b border-border pt-12 pb-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-semibold tracking-wide uppercase">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {drug.status}
              </span>
              <MetadataText>Drug Profile</MetadataText>
            </div>

            <Display className="mb-2 text-4xl md:text-5xl">
              {drug.drugName}
            </Display>
            <PageHeading className="text-xl md:text-2xl text-muted-foreground font-normal mb-4">
              {drug.genericName}
            </PageHeading>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-foreground/80">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium hover:text-primary cursor-pointer transition-colors">
                  {drug.manufacturer ||
                    drug.manufacturerData?.name ||
                    "Unknown Manufacturer"}
                </span>
              </div>
              {therapeuticCategories.length > 0 && (
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-muted-foreground" />
                  <span>{therapeuticCategories[0]}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground font-medium rounded hover:bg-secondary/80 border border-border transition-colors"
            >
              <Share className="w-4 h-4" /> Share
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded hover:bg-primary/90 shadow-sm transition-colors"
            >
              <BookmarkPlus className="w-4 h-4" /> Save to Portfolio
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout with Sticky Sidebar */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col lg:flex-row gap-12">
        {/* Sticky Contextual Navigation Panel */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <LabelText className="block mb-4 uppercase tracking-wider text-muted-foreground text-xs font-bold">
              Contents
            </LabelText>
            <nav className="space-y-1 border-l-2 border-border/50">
              <NavItem href="#overview" label="Overview" active />
              <NavItem
                href="#regulatory"
                label="Regulatory Status & Timeline"
              />
              <NavItem
                href="#ingredients"
                label="Active Ingredients & Dosage"
              />
              <NavItem href="#manufacturer" label="Manufacturer Details" />
              <NavItem href="#clinical" label="Clinical / Scientific" />
              <NavItem href="#safety" label="Safety & Warnings" />
              <NavItem href="#documents" label="Documents & References" />
              <NavItem href="#related" label="Related Medicines" />
            </nav>
            <div className="mt-10 p-4 bg-muted/30 rounded border border-border text-xs text-muted-foreground">
              <div className="flex items-center gap-2 font-semibold text-foreground mb-1">
                <History className="w-3.5 h-3.5" /> Source Metadata
              </div>
              <p className="mb-2">
                Data synced with FDA Orange Book and EMA Register.
              </p>
              <p>Last Verified: 2 hrs ago</p>
            </div>
          </div>
        </aside>

        {/* Content Sections */}
        <div className="flex-1 min-w-0 pb-32">
          <Section id="overview" title="1. Overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card border border-border p-6 rounded-lg">
              <DataPair
                label="Generic Name"
                value={drug.genericName || "N/A"}
              />
              <DataPair
                label="Brand Names"
                value={brandNames.length > 0 ? brandNames.join(", ") : "N/A"}
              />
              <DataPair
                label="Active Ingredients"
                value={
                  activeIngredients.length > 0
                    ? activeIngredients.join(", ")
                    : "N/A"
                }
              />
              <DataPair
                label="Route of Admin"
                value={
                  routeOfAdmin.length > 0 ? routeOfAdmin.join(", ") : "N/A"
                }
              />
            </div>
          </Section>

          <Section id="regulatory" title="2. Regulatory Status & Timeline">
            {drug.regulatoryEvents.length === 0 ? (
              <BodyText className="mb-6 text-muted-foreground">
                No regulatory events recorded.
              </BodyText>
            ) : (
              <div className="border-l-2 border-primary/20 ml-3 pl-6 space-y-8 py-2">
                {drug.regulatoryEvents.map((event) => (
                  <TimelineEvent
                    key={event.id}
                    date={new Date(event.occurredAt).toLocaleDateString()}
                    title={`${event.authority || ""} ${event.eventType}`.trim()}
                    description={event.title}
                  />
                ))}
              </div>
            )}
          </Section>

          <Section id="ingredients" title="3. Active Ingredients & Dosage">
            <div className="overflow-x-auto border border-border rounded-lg shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Ingredient</th>
                    <th className="px-4 py-3 font-medium">Dosage Form</th>
                    <th className="px-4 py-3 font-medium">Strength</th>
                    <th className="px-4 py-3 font-medium">
                      Reference Standard
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {activeIngredients.map((ingredient, i) => (
                    <tr key={ingredient + i.toString()}>
                      <td className="px-4 py-4 font-medium text-foreground">
                        {ingredient}
                      </td>
                      <td className="px-4 py-4">
                        {dosageForms[i] || dosageForms[0] || "N/A"}
                      </td>
                      <td className="px-4 py-4">N/A</td>
                      <td className="px-4 py-4">N/A</td>
                    </tr>
                  ))}
                  {activeIngredients.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-4 text-center text-muted-foreground"
                      >
                        No active ingredients listed.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="manufacturer" title="4. Manufacturer Details">
            <div className="bg-card border border-border p-6 rounded-lg flex items-start gap-4">
              <div className="p-3 bg-secondary rounded-lg">
                <Building2 className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-1">
                  {drug.manufacturer ||
                    drug.manufacturerData?.name ||
                    "Unknown Manufacturer"}
                </h4>
                {drug.manufacturerData && (
                  <>
                    <HelperText className="mb-4">
                      {drug.manufacturerData.country || "Unknown Location"}
                    </HelperText>
                    <Link
                      href={`/manufacturers/${drug.manufacturerData.id}`}
                      className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                    >
                      View Full Manufacturer Profile{" "}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </Section>

          <Section id="clinical" title="5. Clinical / Scientific Information">
            <div className="space-y-6">
              <div>
                <LabelText className="block mb-2 text-muted-foreground uppercase text-xs font-bold">
                  Mechanism of Action
                </LabelText>
                <BodyText>
                  {drug.mechanismOfAction ||
                    "Mechanism of action not available."}
                </BodyText>
              </div>
              <div>
                <LabelText className="block mb-2 text-muted-foreground uppercase text-xs font-bold">
                  Pharmacological Class
                </LabelText>
                <BodyText>
                  {drug.pharmacologicalClass ||
                    "Pharmacological class not available."}
                </BodyText>
              </div>
            </div>
          </Section>

          <Section id="safety" title="6. Safety & Warnings">
            <div className="bg-destructive/5 border border-destructive/20 p-6 rounded-lg">
              <div className="flex items-center gap-2 text-destructive font-bold mb-4">
                <AlertTriangle className="w-5 h-5" />
                BOXED WARNING
              </div>
              <BodyText className="text-foreground/90 font-medium">
                {drug.safetyUpdates.length === 0
                  ? "No active boxed warnings recorded."
                  : drug.safetyUpdates[0].description}
              </BodyText>
            </div>
          </Section>

          <Section id="documents" title="7. Documents & References">
            {drug.documents.length === 0 ? (
              <BodyText className="text-muted-foreground">
                No public regulatory documents available.
              </BodyText>
            ) : (
              drug.documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  title={doc.title}
                  type={doc.documentType}
                  date={`Published: ${doc.publishedDate ? new Date(doc.publishedDate).toLocaleDateString() : "N/A"}`}
                />
              ))
            )}
          </Section>
        </div>
      </main>
    </div>
  );
}

// --- Helper UI Components ---

function NavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className={cn(
        "block px-4 py-2.5 text-sm transition-colors border-l-2 -ml-[2px]",
        active
          ? "border-primary text-primary font-semibold"
          : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
      )}
    >
      {label}
    </a>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="pt-24 -mt-12 mb-16">
      <SectionHeading className="mb-6 pb-2 border-b border-border/50">
        {title}
      </SectionHeading>
      {children}
    </section>
  );
}

function DataPair({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <LabelText className="block text-muted-foreground text-xs uppercase font-bold tracking-wider mb-1">
        {label}
      </LabelText>
      <div className="font-medium text-foreground">{value}</div>
    </div>
  );
}

function TimelineEvent({
  date,
  title,
  description,
}: {
  date: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative">
      <div className="absolute -left-[31px] mt-1.5 w-3 h-3 bg-background border-2 border-primary rounded-full" />
      <MetadataText className="text-primary block mb-1">{date}</MetadataText>
      <h4 className="font-semibold text-foreground text-base mb-1">{title}</h4>
      <BodyText className="text-sm">{description}</BodyText>
    </div>
  );
}

function DocumentCard({
  title,
  type,
  date,
}: {
  title: string;
  type: string;
  date: string;
}) {
  return (
    <div className="p-4 bg-card border border-border rounded-lg flex gap-3 hover:border-primary/40 hover:bg-secondary/30 transition-colors cursor-pointer group">
      <FileDigit className="w-8 h-8 text-muted-foreground shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
      <div>
        <h5 className="font-medium text-sm text-foreground leading-snug mb-1 group-hover:text-primary transition-colors">
          {title}
        </h5>
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-muted-foreground">{type}</span>
          <span className="text-muted-foreground/50">•</span>
          <span className="text-muted-foreground">{date}</span>
        </div>
      </div>
    </div>
  );
}
