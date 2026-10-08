"use client";

import { useActionState } from "react";
import { createArticleAction, updateArticleAction } from "@/app/actions/articles";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const initialState = {
  success: false,
  error: "",
  articleId: "",
};

export function ArticleForm({ initialData, articleId }: { initialData?: any, articleId?: string }) {
  const actionToUse = articleId ? updateArticleAction.bind(null, articleId) : createArticleAction;
  const [state, formAction, pending] = useActionState(actionToUse as any, initialState);
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");

  useEffect(() => {
    if (state?.success) {
      alert(`Article ${articleId ? 'updated' : 'created'} successfully!`);
      router.push("/admin/articles");
    } else if (state?.error) {
      alert(`Error: ${state.error}`);
    }
  }, [state, router, articleId]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // Auto-generate slug
    setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
  };

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
          <input 
            name="title" 
            required 
            value={title}
            onChange={handleTitleChange}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-orange-500" 
            placeholder="e.g. Navigating FDA Medical Device Regulations" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Slug</label>
          <input 
            name="slug" 
            required 
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-orange-500" 
            placeholder="navigating-fda-medical-device-regulations" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
          <select 
            name="type" 
            required
            defaultValue={initialData?.type || "Guide"}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="Guide">Guide</option>
            <option value="Blog">Blog</option>
            <option value="Case Study">Case Study</option>
            <option value="Service Explanation">Service Explanation</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
          <select 
            name="status" 
            required
            defaultValue={initialData?.status || "Draft"}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="Draft">Draft</option>
            <option value="Internal Review">Internal Review</option>
            <option value="Regulatory Review">Regulatory Review</option>
            <option value="Approved">Approved</option>
            <option value="Published">Published</option>
          </select>
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Industry</label>
          <input 
            name="industry" 
            defaultValue={initialData?.industry || ""}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-orange-500" 
            placeholder="e.g. Medical Devices, Pharmaceuticals" 
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Excerpt</label>
          <textarea 
            name="excerpt" 
            rows={2}
            defaultValue={initialData?.excerpt || ""}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-orange-500" 
            placeholder="A short summary of the article..." 
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Content (Markdown / HTML)</label>
          <textarea 
            name="content" 
            rows={12}
            required
            defaultValue={initialData?.content || ""}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm" 
            placeholder="## Section 1&#10;Write your content here..." 
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button 
          type="button"
          onClick={() => router.push("/admin/articles")}
          className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={pending}
          className="px-4 py-2 text-sm font-bold text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {pending ? "Saving..." : "Save Article"}
        </button>
      </div>
    </form>
  );
}
