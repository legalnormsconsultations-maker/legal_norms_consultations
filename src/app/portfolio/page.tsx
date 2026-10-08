import {
  Activity,
  BriefcaseMedical,
  FileDigit,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { CatalogService } from "@/services/catalog.service";
import DynamicCards from "@/components/dynamic-cards";

export const metadata = {
  title: "Medical Portfolio | Legalnorms",
  description: "Secure medical portfolio and asset management.",
};

export default async function PortfolioPage() {
  const user = await getCurrentUser();
  let portfolioItems: any[] = [];

  if (user) {
    portfolioItems = await CatalogService.listPortfolio(user);
  }

  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      {/* Navigation Header */}
      <header className="w-full bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="p-1.5 bg-teal-900 rounded shadow-sm">
              <Activity className="w-5 h-5 text-teal-50" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Legalnorms
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-teal-900"
            >
              Home
            </Link>
            {user ? (
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.firstName ?? "User"}
                    className="w-9 h-9 rounded-full object-cover border border-border shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#FF9933] border border-[#E68A2E] flex items-center justify-center text-white font-semibold text-sm">
                    {user.firstName?.[0]?.toUpperCase() ??
                      user.email[0].toUpperCase()}
                  </div>
                )}
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-sm font-semibold text-teal-900 hover:underline"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto pt-10">
          <BriefcaseMedical className="w-16 h-16 text-primary/80 mx-auto mb-6" />
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
            Medical Portfolio Management
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Securely build, track, and share your clinical assets, product
            pipelines, and research documentation in one compliant vault.
          </p>
        </div>

        {user ? (
          <div className="bg-card rounded-xl shadow-sm border border-border p-8">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                Your Portfolio Assets
              </h2>
              <Link
                href="/admin/dashboard/portfolio"
                className="text-sm font-medium text-teal-700 hover:underline"
              >
                Manage in Dashboard &rarr;
              </Link>
            </div>
            {portfolioItems.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 border border-border rounded-lg hover:border-teal-300 transition-colors bg-secondary/50"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-foreground">
                        {item.productName}
                      </h3>
                      <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded">
                        {item.phase ?? "Unknown"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {item.description ?? "No description provided."}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-secondary rounded-lg border border-dashed border-border">
                <FileDigit className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-foreground">
                  No portfolio items
                </h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  You haven't added any products or clinical assets yet.
                </p>
                <Link
                  href="/admin/dashboard/portfolio"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90"
                >
                  Add Asset
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 items-center bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="p-8 md:p-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Enterprise-grade security for your intellectual property
              </h2>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">
                    AES-256 encryption at rest and TLS 1.3 in transit.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Role-based access control (RBAC) for stakeholders.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Immutable audit logs for all regulatory actions.
                  </span>
                </li>
              </ul>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 transition-colors w-full sm:w-auto"
              >
                Sign in to manage portfolio
              </Link>
            </div>
            <div className="bg-primary/5 dark:bg-primary/10 h-full p-8 hidden md:block">
              {/* Decorative element */}
              <div className="space-y-4 opacity-50">
              </div>
            </div>
          </div>
        )}

        <div className="mt-16">
          <DynamicCards pageName="portfolio" />
        </div>
      </main>
    </div>
  );
}
