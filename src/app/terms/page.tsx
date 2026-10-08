import { PageContentsRepository } from "@/repositories/page-contents-repository";
import Link from "next/link";
import { Shield } from "lucide-react";

export const metadata = {
  title: "Terms of Service | LegalNorms Consultations",
  description: "Terms of Service for LegalNorms Consultations.",
};

export const dynamic = "force-dynamic";

export default async function TermsOfServicePage() {
  const pageContent = await PageContentsRepository.getPageContent("terms");
  const content = pageContent?.richTextContent || `
    <p class="text-muted-foreground">The Terms of Service content has not been set yet. Please check back later.</p>
  `;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <nav className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg text-primary-foreground">
              <Shield size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">
              <span className="hidden lg:inline">LegalNorms</span><span className="lg:hidden">LN</span> <span className="text-primary">Consultations</span>
            </span>
          </Link>
          <div className="flex items-center gap-8 font-medium text-muted-foreground">
            <Link href="/" className="hover:text-primary transition text-sm">Back to Home</Link>
          </div>
        </div>
      </nav>
      
      <main className="pt-20 pb-24 flex-1">
        <div className="container mx-auto px-6 max-w-4xl bg-card text-foreground border border-border shadow-sm rounded-xl p-8 mt-12">
          <h1 className="text-3xl font-bold mb-8 pb-4 border-b border-border">Terms of Service</h1>
          <div 
            className="prose prose-slate dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content }} 
          />
        </div>
      </main>

      <footer className="w-full border-t border-border bg-background py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} LegalNorms Consultations. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/privacy" className="hover:text-primary transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
