"use client";

import { Edit3, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { deleteArticleAction } from "@/app/actions/articles";

export function ArticleActions({ articleId }: { articleId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
      startTransition(async () => {
        const result = await deleteArticleAction(articleId);
        if (result?.error) {
          alert(`Failed to delete article: ${result.error}`);
        } else {
          alert("Article deleted successfully.");
        }
      });
    }
  };

  return (
    <div className="flex space-x-2">
      <Link href={`/admin/articles/${articleId}/edit`} className="text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 p-2 rounded-lg transition" title="Edit">
        <Edit3 size={18} />
      </Link>
      <button 
        onClick={handleDelete}
        disabled={isPending}
        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-lg transition disabled:opacity-50" 
        title="Delete"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
