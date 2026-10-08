"use client";

import { Edit, MoreVertical, Trash, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DocumentRowActions({
  documentId,
  initialTitle,
  initialDocumentType,
}: {
  documentId: string;
  initialTitle: string;
  initialDocumentType: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this document?"))
      return;

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete document");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    }
  }

  async function handleEditSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    const data = {
      title: form.get("title") as string,
      documentType: form.get("documentType") as string,
    };

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Failed to update document");
      }
      setIsEditModalOpen(false);
      setIsOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-muted-foreground hover:text-foreground"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-32 origin-top-right rounded-md bg-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-border">
            <div className="py-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsEditModalOpen(true);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-muted"
              >
                <Edit size={14} className="mr-2" /> Edit
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleDelete();
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash size={14} className="mr-2" /> Delete
              </button>
            </div>
          </div>
        </>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 text-left">
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-xl border border-border relative">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-6 text-foreground">
              Edit Document
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">
                  Title
                </label>
                <input
                  name="title"
                  defaultValue={initialTitle}
                  required
                  className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">
                  Document Type
                </label>
                <select
                  name="documentType"
                  defaultValue={initialDocumentType}
                  required
                  className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                >
                  <option value="guidance">Guidance</option>
                  <option value="dossier">Dossier / Submission</option>
                  <option value="label">Labeling</option>
                  <option value="assessment_report">Assessment Report</option>
                  <option value="public_regulatory">Public Regulatory</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-teal-900 hover:bg-teal-800 rounded-md disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
