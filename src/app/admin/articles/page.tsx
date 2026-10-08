import { ArticlesRepository } from "@/repositories/articles-repository";
import { Plus, Edit3, Trash2, Search, FileText } from "lucide-react";
import Link from "next/link";
import { ArticleActions } from "./article-actions";

import { ArticlesToolbar } from "./articles-toolbar";

export const metadata = {
  title: "Knowledge Base | Admin",
};

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; type?: string }>;
}) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search || "";
  const type = resolvedParams.type || "All Types";

  const data = await ArticlesRepository.getArticles({ limit: 100, search, type });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Knowledge Base</h2>
          <p className="text-slate-500 text-sm mt-1">Manage articles, guides, and regulatory updates.</p>
        </div>
        <Link href="/admin/articles/new" className="bg-orange-600 text-black dark:text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-700 shadow-sm flex items-center justify-center">
          <Plus size={18} className="mr-2" /> Write New Article
        </Link>
      </div>

      <ArticlesToolbar />

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
              <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Title</th>
              <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status / Type</th>
              <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Publication Date</th>
              <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.article.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="p-4">
                    <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center">
                      <FileText size={16} className="mr-2 text-slate-400 dark:text-slate-500" />
                      {item.article.title}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md truncate">{item.article.excerpt}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        item.article.status === 'Published' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                      }`}>
                        {item.article.status}
                      </span>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {item.article.type}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                    {item.article.publishedAt ? new Date(item.article.publishedAt).toLocaleDateString() : 'Draft'}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <ArticleActions articleId={item.article.id} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500 dark:text-slate-400">
                  No articles found. Start writing content for your knowledge base.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
