"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ManufacturerCreateClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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

    const res = await fetch("/api/manufacturers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const json = await res.json();
      router.push(`/dashboard/manufacturers/${json.manufacturer.id}`);
      router.refresh();
    } else {
      setLoading(false);
      alert("Failed to create manufacturer");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-card p-6 rounded-lg border border-border"
    >
      <div>
        <label className="text-sm font-medium">Name</label>
        <input
          required
          name="name"
          className="w-full mt-1 h-9 rounded-md border border-input px-3"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Headquarters</label>
          <input
            name="headquarters"
            className="w-full mt-1 h-9 rounded-md border border-input px-3"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Country</label>
          <input
            name="country"
            className="w-full mt-1 h-9 rounded-md border border-input px-3"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Website</label>
        <input
          type="url"
          name="websiteUrl"
          className="w-full mt-1 h-9 rounded-md border border-input px-3"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Company Profile</label>
        <textarea
          name="companyProfile"
          className="w-full mt-1 rounded-md border border-input px-3 py-2 min-h-[100px]"
        />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Link
          href="/admin/dashboard/manufacturers"
          className="px-4 py-2 text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md flex items-center"
        >
          Cancel
        </Link>
        <button
          disabled={loading}
          type="submit"
          className="px-4 py-2 text-sm bg-teal-700 text-white hover:bg-teal-800 rounded-md disabled:opacity-50 flex items-center"
        >
          {loading ? "Creating..." : "Create Manufacturer"}
        </button>
      </div>
    </form>
  );
}
