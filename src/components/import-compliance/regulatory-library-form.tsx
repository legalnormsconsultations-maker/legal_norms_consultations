"use client";
import { useState } from "react";

export function RegulatoryLibraryForm({
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
      authority: formData.get("authority"),
      title: formData.get("title"),
      category: formData.get("category"),
      description: formData.get("description"),
      url: formData.get("url"),
    };

    const method = initialData ? "PATCH" : "POST";
    const url = initialData
      ? `/api/regulatory-library/${initialData.id}`
      : "/api/regulatory-library";

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
          {initialData ? "Edit Resource" : "Add New Resource"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Authority</label>
            <input
              required
              defaultValue={initialData?.authority}
              name="authority"
              className="w-full mt-1 h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
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
            <label className="text-sm font-medium">Category</label>
            <input
              required
              defaultValue={initialData?.category}
              name="category"
              className="w-full mt-1 h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              required
              defaultValue={initialData?.description}
              name="description"
              className="w-full mt-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm font-medium">URL</label>
            <input
              required
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
              {loading ? "Saving..." : "Save Resource"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
