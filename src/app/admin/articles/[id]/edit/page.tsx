import { ArticleForm } from "../../new/article-form";
import { ArticlesRepository } from "@/repositories/articles-repository";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Article | Admin",
};

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const articleResult = await ArticlesRepository.getArticleById(id);

  if (!articleResult) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Edit Article</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Update your guide, blog post, or regulatory update.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
        <ArticleForm initialData={articleResult.article} articleId={id} />
      </div>
    </div>
  );
}
