import { ArticlesRepository } from "@/repositories/articles-repository";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Calendar, CheckCircle2, Clock, Share2, ShieldCheck, User } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const data = await ArticlesRepository.getArticleBySlug(resolvedParams.slug);
  if (!data?.article) return { title: "Article Not Found" };
  
  return {
    title: data.article.seoTitle || `${data.article.title} | Regulatory Insights`,
    description: data.article.seoDescription || data.article.excerpt,
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const data = await ArticlesRepository.getArticleBySlug(resolvedParams.slug);
  
  if (!data?.article) {
    notFound();
  }

  const { article, authority } = data;

  return (
    <main className="bg-slate-50 min-h-screen pb-24">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 pt-12 pb-16 px-6 lg:px-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <Link href="/blog" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-orange-600 transition">
            <ArrowLeft size={16} className="mr-2" />
            Back to All Articles
          </Link>
          
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm font-bold tracking-wide uppercase border border-orange-100">
                {article.type}
              </span>
              {authority && (
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-bold tracking-wide uppercase border border-slate-200">
                  {authority.name}
                </span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-slate-500 font-medium">
              <div className="flex items-center space-x-2">
                <Calendar size={18} className="text-slate-400" />
                <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Draft'}</span>
              </div>
              {article.readingTime && (
                <div className="flex items-center space-x-2">
                  <Clock size={18} className="text-slate-400" />
                  <span>{article.readingTime} min read</span>
                </div>
              )}
              {article.reviewerId && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                  <ShieldCheck size={16} />
                  <span>Regulatory Reviewed</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {article.featuredImage && (
        <div className="max-w-5xl mx-auto -mt-8 px-6 lg:px-0">
          <div className="relative aspect-[21/9] w-full rounded-2xl shadow-xl overflow-hidden border-4 border-white">
            <Image src={article.featuredImage} alt={article.title} fill className="object-cover" />
          </div>
        </div>
      )}

      {/* Content Layout */}
      <div className="max-w-7xl mx-auto px-6 lg:px-24 py-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Main Content */}
        <article className="lg:col-span-3 prose prose-lg prose-blue max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600">
          {/* Note: In a real app, this content would be parsed MD/HTML. Here we just display safely or use a markdown component. For now, simple render: */}
          <div dangerouslySetInnerHTML={{ __html: article.content || "<p>Content goes here.</p>" }} />

          <hr className="my-12 border-slate-200" />
          
          <div className="bg-slate-100 p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Disclaimer</h3>
            <p className="text-sm text-slate-600 m-0">
              Regulatory guidelines are subject to change. Always verify against the latest official {authority?.name || "authority"} notifications before taking compliance actions.
            </p>
          </div>
        </article>

        {/* Sticky Sidebar */}
        <aside className="lg:col-span-1 space-y-8">
          {/* Table of Contents (Placeholder logic) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-8">
            <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Table of Contents</h4>
            <ul className="space-y-3 text-sm text-slate-600 font-medium">
              <li className="hover:text-orange-600 cursor-pointer transition">1. Introduction</li>
              <li className="hover:text-orange-600 cursor-pointer transition">2. Key Requirements</li>
              <li className="hover:text-orange-600 cursor-pointer transition">3. Timeline & Fees</li>
              <li className="hover:text-orange-600 cursor-pointer transition">4. Conclusion</li>
            </ul>
          </div>

          {/* Consultation CTA */}
          <div className="bg-gradient-to-b from-orange-600 to-orange-800 p-6 rounded-2xl shadow-lg text-white text-center space-y-4">
            <h4 className="font-bold text-xl">Need Expert Help?</h4>
            <p className="text-orange-100 text-sm">Get tailored compliance strategies from our regulatory experts.</p>
            <Link href="/contact" className="block w-full bg-white text-orange-700 font-bold py-3 rounded-xl hover:bg-slate-100 transition shadow-sm">
              Request Consultation
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
