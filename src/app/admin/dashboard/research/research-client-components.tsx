"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ResearchFormModal({
  onSuccess,
  onCancel,
  initialData,
}: {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: any;
}) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      abstract: formData.get("abstract"),
      publisher: formData.get("publisher"),
      doi: formData.get("doi"),
      url: formData.get("url"),
    };

    const method = initialData ? "PATCH" : "POST";
    const url = initialData
      ? `/api/research/${initialData.id}`
      : "/api/research";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);
    onSuccess();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-card p-6 shadow-xl border border-border">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Edit Article" : "Add New Article"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              required
              defaultValue={initialData?.title}
              name="title"
              className="w-full mt-1 h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Publisher</label>
            <input
              defaultValue={initialData?.publisher}
              name="publisher"
              className="w-full mt-1 h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm font-medium">DOI</label>
            <input
              defaultValue={initialData?.doi}
              name="doi"
              className="w-full mt-1 h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Abstract</label>
            <textarea
              defaultValue={initialData?.abstract}
              name="abstract"
              className="w-full mt-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[100px]"
            />
          </div>
          <div>
            <label className="text-sm font-medium">URL</label>
            <input
              defaultValue={initialData?.url}
              name="url"
              type="url"
              className="w-full mt-1 h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-teal-700 text-white hover:bg-teal-800 rounded-md disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Article"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ResearchArticleItem({
  article,
  isAdmin,
}: {
  article: any;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  if (isDeleted) return null;

  return (
    <>
      <article className="py-5">
        <h2 className="text-base font-semibold text-foreground">
          {article.url ? (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-teal-900 hover:underline"
            >
              {article.title}
            </a>
          ) : (
            article.title
          )}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {[
            article.publisher,
            article.publicationDate
              ? new Date(article.publicationDate).toLocaleDateString()
              : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
        {article.abstract && (
          <p className="mt-3 max-w-4xl text-sm leading-6 text-muted-foreground">
            {article.abstract}
          </p>
        )}
        {article.doi && (
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            DOI: {article.doi}
          </p>
        )}

        {isAdmin && (
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs font-medium text-orange-600 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={async () => {
                if (!confirm("Delete this article?")) return;
                await fetch(`/api/research/${article.id}`, {
                  method: "DELETE",
                });
                setIsDeleted(true);
                router.refresh();
              }}
              className="text-xs font-medium text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        )}
      </article>

      {isEditing && (
        <ResearchFormModal
          initialData={article}
          onCancel={() => setIsEditing(false)}
          onSuccess={() => {
            setIsEditing(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}

export function AddResearchButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 text-sm font-medium"
      >
        + Add Article
      </button>

      {isOpen && (
        <ResearchFormModal
          onCancel={() => setIsOpen(false)}
          onSuccess={() => {
            setIsOpen(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
