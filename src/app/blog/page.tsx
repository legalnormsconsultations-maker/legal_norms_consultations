import { ArticlesRepository } from "@/repositories/articles-repository";
import Link from "next/link";
import { BookOpen, Calendar, Clock, ChevronRight } from "lucide-react";
import Image from "next/image";
import DynamicCards from "@/components/dynamic-cards";

export const metadata = {
  title: "Regulatory Blog & Knowledge Hub",
  description: "Stay updated with the latest in regulatory compliance, medical device licensing, and cosmetic registrations.",
};

export default async function BlogPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || "";
  const articles = await ArticlesRepository.getPublishedArticles({ type: "Blog", limit: 20, search: query });

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-6 lg:px-24">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Section */}
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center justify-center space-x-2 text-orange-600 font-semibold uppercase tracking-wider mb-2">
            <BookOpen size={20} />
            <span>Knowledge Hub</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Regulatory Insights
          </h1>
          <p className="text-lg text-slate-600">
            Deep dives, industry analysis, and compliance strategies authored by our regulatory experts.
          </p>
          <div className="flex justify-center max-w-lg mx-auto relative mt-8">
            <form action="/blog" method="GET" className="w-full">
              <input 
                type="text" 
                name="q" 
                defaultValue={query}
                placeholder="Search articles..." 
                className="w-full px-6 py-4 rounded-full border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
              />
              <button type="submit" className="absolute right-2 top-2 bg-orange-600 text-black dark:text-white p-2 px-6 rounded-full font-semibold hover:bg-orange-700 transition">
                Search
              </button>
            </form>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map(({ article, authority }) => (
            <Link key={article.id} href={`/blog/${article.slug}`} className="group flex flex-col bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
              {/* Image Placeholder or actual Image */}
              <div className="aspect-[16/10] bg-slate-200 relative overflow-hidden">
                {article.featuredImage ? (
                  <Image src={article.featuredImage} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium">
                    No Image Provided
                  </div>
                )}
                {authority && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">
                    {authority.name}
                  </div>
                )}
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center text-xs text-slate-500 space-x-4 mb-4">
                  <span className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Draft'}</span>
                  </span>
                  {article.readingTime && (
                    <span className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{article.readingTime} min read</span>
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                  {article.excerpt || "Click to read the full article..."}
                </p>
                
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center text-orange-600 font-semibold group-hover:gap-2 transition-all">
                  <span>Read Article</span>
                  <ChevronRight size={18} />
                </div>
              </div>
            </Link>
          ))}
          {articles.length === 0 && (
            <div className="col-span-full text-center py-24 bg-white rounded-3xl border border-slate-200">
              <p className="text-slate-500 text-lg">No articles found matching "{query}".</p>
            </div>
          )}
        </section>
        
        {/* Dynamic Content Cards */}
        <section>
          <DynamicCards pageName="blog" />
        </section>
      </div>
    </main>
  );
}
