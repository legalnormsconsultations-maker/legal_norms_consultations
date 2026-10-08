"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ManufacturerDetailClient({
  manufacturer,
  isAdmin,
}: {
  manufacturer: any;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this manufacturer?")) return;
    setLoading(true);
    await fetch(`/api/manufacturers/${manufacturer.id}`, { method: "DELETE" });
    router.push("/admin/dashboard/manufacturers");
  }

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      headquarters: formData.get("headquarters"),
      country: formData.get("country"),
      websiteUrl: formData.get("websiteUrl"),
      companyProfile: formData.get("companyProfile"),
    };

    await fetch(`/api/manufacturers/${manufacturer.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);
    setIsEditing(false);
    router.refresh();
  }

  if (isEditing) {
    return (
      <form
        onSubmit={handleEdit}
        className="space-y-4 max-w-2xl bg-card p-6 rounded-lg border border-border"
      >
        <div>
          <label className="text-sm font-medium">Name</label>
          <input
            required
            defaultValue={manufacturer.name}
            name="name"
            className="w-full mt-1 h-9 rounded-md border border-input px-3"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Headquarters</label>
            <input
              defaultValue={manufacturer.headquarters}
              name="headquarters"
              className="w-full mt-1 h-9 rounded-md border border-input px-3"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Country</label>
            <input
              defaultValue={manufacturer.country}
              name="country"
              className="w-full mt-1 h-9 rounded-md border border-input px-3"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Website</label>
          <input
            defaultValue={manufacturer.websiteUrl || ""}
            type="url"
            name="websiteUrl"
            className="w-full mt-1 h-9 rounded-md border border-input px-3"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Company Profile</label>
          <textarea
            defaultValue={manufacturer.companyProfile}
            name="companyProfile"
            className="w-full mt-1 rounded-md border border-input px-3 py-2 min-h-[100px]"
          />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            type="submit"
            className="px-4 py-2 text-sm bg-teal-700 text-white hover:bg-teal-800 rounded-md disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="font-semibold text-lg mb-4">Details</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Country</dt>
              <dd className="font-medium mt-1">
                {manufacturer.country || "Not specified"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Headquarters</dt>
              <dd className="font-medium mt-1">
                {manufacturer.headquarters || "Not specified"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Website</dt>
              <dd className="font-medium mt-1">
                {manufacturer.websiteUrl ? (
                  <a
                    href={manufacturer.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:underline"
                  >
                    {manufacturer.websiteUrl}
                  </a>
                ) : (
                  "Not listed"
                )}
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="font-semibold text-lg mb-4">Company Profile</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {manufacturer.companyProfile || "No profile available."}
          </p>
        </div>
      </div>

      {isAdmin && (
        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md"
          >
            Edit
          </button>
          <button
            disabled={loading}
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 rounded-md disabled:opacity-50"
          >
            Delete Manufacturer
          </button>
        </div>
      )}
    </div>
  );
}
