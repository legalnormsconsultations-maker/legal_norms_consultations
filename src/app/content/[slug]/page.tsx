import { eq } from "drizzle-orm";
import {
  Activity,
  ArrowLeft,
  Calendar,
  FileText,
  Image as ImageIcon,
  LayoutTemplate,
  Pill,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { cmsCategories, cmsContent } from "@/db/schema";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const data = await db
    .select({ content: cmsContent })
    .from(cmsContent)
    .where(eq(cmsContent.slug, params.slug));

  if (!data || data.length === 0) return { title: "Not Found" };
  const content = data[0].content;
  const meta: any = content.seoMetadata || {};

  return {
    title: meta.title || content.title,
    description: meta.description || content.richTextBody?.substring(0, 160),
    keywords: meta.keywords || "",
  };
}

export default async function ContentDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await db
    .select({ content: cmsContent, category: cmsCategories })
    .from(cmsContent)
    .leftJoin(cmsCategories, eq(cmsContent.categoryId, cmsCategories.id))
    .where(eq(cmsContent.slug, params.slug));

  if (!data || data.length === 0) {
    notFound();
  }

  const { content, category } = data[0];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Activity className="w-5 h-5 text-indigo-500" />;
      case "photo":
        return <ImageIcon className="w-5 h-5 text-pink-500" />;
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />;
      case "figma":
        return <LayoutTemplate className="w-5 h-5 text-purple-500" />;
      case "medicine":
        return <Pill className="w-5 h-5 text-emerald-500" />;
      case "cosmetic":
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      default:
        return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Media Hero Section */}
      {content.contentType === "video" && content.mediaUrl ? (
        <div className="w-full bg-black aspect-video max-h-[70vh] flex justify-center items-center relative group">
          <video
            src={content.mediaUrl}
            controls
            poster={content.thumbnailUrl || undefined}
            className="w-full h-full object-contain"
          />
        </div>
      ) : content.contentType === "pdf" ||
        content.contentType === "document" ? (
        <div className="w-full h-64 bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center relative">
          <div className="text-white flex flex-col items-center gap-4">
            <FileText className="w-16 h-16 opacity-80" />
            <a
              href={content.mediaUrl || "#"}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-white text-rose-600 font-bold rounded-xl shadow-lg hover:bg-rose-50 transition-colors"
            >
              Download / Open PDF
            </a>
          </div>
        </div>
      ) : content.thumbnailUrl || content.mediaUrl ? (
        <div className="w-full h-[40vh] md:h-[60vh] relative bg-slate-100 dark:bg-slate-900 overflow-hidden">
          <img
            src={content.mediaUrl || content.thumbnailUrl || ""}
            alt={content.title}
            className="w-full h-full object-cover blur-xl opacity-50 absolute inset-0"
          />
          <div className="absolute inset-0 bg-black/20" />
          <img
            src={content.mediaUrl || content.thumbnailUrl || ""}
            alt={content.title}
            className="w-full h-full object-contain relative z-10"
          />
        </div>
      ) : (
        <div
          className={`w-full h-48 bg-gradient-to-br ${category?.themeGradient || "from-slate-800 to-slate-900"}`}
        />
      )}

      {/* Content Details */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-lg shadow-sm">
            {getTypeIcon(content.contentType)}
            <span className="text-sm font-semibold capitalize text-foreground">
              {content.contentType}
            </span>
          </div>
          {category && (
            <span
              className={`text-sm font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r ${category.themeGradient} text-white shadow-sm`}
            >
              {category.name}
            </span>
          )}
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm ml-auto">
            <Calendar className="w-4 h-4" />
            {new Date(content.createdAt).toLocaleDateString()}
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-8 leading-tight tracking-tight">
          {content.title}
        </h1>

        {/* Dynamic Metadata Specs */}
        {!!content.metadata &&
          Object.keys(content.metadata as object).length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12 p-6 bg-card border border-border rounded-2xl shadow-sm">
              {Object.entries(content.metadata).map(([key, value]) => (
                <div key={key} className="flex flex-col space-y-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {key}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {value as string}
                  </span>
                </div>
              ))}
            </div>
          )}

        {/* Rich Text Body */}
        {content.richTextBody && (
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary whitespace-pre-wrap">
            {content.richTextBody}
          </div>
        )}
      </div>
    </div>
  );
}
