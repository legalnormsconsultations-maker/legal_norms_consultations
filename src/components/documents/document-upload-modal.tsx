"use client";

import { Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DocumentUploadModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        body: form, // send as multipart/form-data
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Failed to upload document");
      }
      setIsOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-teal-900 px-4 text-sm font-semibold text-white hover:bg-teal-800"
      >
        <Upload size={16} />
        Upload Document
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-xl border border-border relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-6">Upload Document</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  name="title"
                  required
                  className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Document Type
                </label>
                <select
                  name="documentType"
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
              <div>
                <label className="block text-sm font-medium mb-1">File</label>
                <input
                  name="file"
                  type="file"
                  required
                  className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-900 hover:file:bg-teal-100"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-teal-900 hover:bg-teal-800 rounded-md disabled:opacity-50"
                >
                  {isSubmitting ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
