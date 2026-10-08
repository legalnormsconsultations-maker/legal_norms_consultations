import { ArticleForm } from "./article-form";

export const metadata = {
  title: "Write New Article | Admin",
};

export default function NewArticlePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Write New Article</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Create a new guide, blog post, or regulatory update.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
        <ArticleForm />
      </div>
    </div>
  );
}
