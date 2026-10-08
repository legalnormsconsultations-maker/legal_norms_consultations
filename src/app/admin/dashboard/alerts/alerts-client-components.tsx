"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RegulatoryEventFormModal({
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
      eventType: formData.get("eventType"),
      eventTitle: formData.get("eventTitle"),
      eventTimestamp: formData.get("eventTimestamp"),
      milestonePhase: formData.get("milestonePhase"),
      sourceUrl: formData.get("sourceUrl"),
      sourceName: formData.get("sourceName"),
    };

    const method = initialData ? "PATCH" : "POST";
    const url = initialData ? `/api/events/${initialData.id}` : "/api/events";

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
          {initialData ? "Edit Event" : "Add Regulatory Event"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Event Title</label>
            <input
              required
              defaultValue={initialData?.title || initialData?.eventTitle}
              name="eventTitle"
              className="w-full mt-1 h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Event Type</label>
              <input
                required
                defaultValue={initialData?.eventType}
                name="eventType"
                className="w-full mt-1 h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Date</label>
              <input
                required
                type="date"
                defaultValue={
                  initialData?.occurredAt
                    ? new Date(initialData.occurredAt)
                        .toISOString()
                        .split("T")[0]
                    : initialData?.eventTimestamp
                      ? new Date(initialData.eventTimestamp)
                          .toISOString()
                          .split("T")[0]
                      : ""
                }
                name="eventTimestamp"
                className="w-full mt-1 h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Milestone Phase</label>
            <input
              defaultValue={initialData?.phase || initialData?.milestonePhase}
              name="milestonePhase"
              className="w-full mt-1 h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Source Name</label>
            <input
              defaultValue={initialData?.sourceName}
              name="sourceName"
              className="w-full mt-1 h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Source URL</label>
            <input
              defaultValue={initialData?.sourceUrl}
              name="sourceUrl"
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
              {loading ? "Saving..." : "Save Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function SafetyUpdateFormModal({
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
      severity: formData.get("severity"),
      description: formData.get("description"),
      issuedDate: formData.get("issuedDate"),
    };

    const method = initialData ? "PATCH" : "POST";
    const url = initialData
      ? `/api/safety-updates/${initialData.id}`
      : "/api/safety-updates";

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
          {initialData ? "Edit Update" : "Add Safety Update"}
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Severity</label>
              <select
                required
                defaultValue={initialData?.severity || "Warning"}
                name="severity"
                className="w-full mt-1 h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="Information">Information</option>
                <option value="Warning">Warning</option>
                <option value="Recall">Recall</option>
                <option value="Boxed Warning">Boxed Warning</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Issued Date</label>
              <input
                required
                type="date"
                defaultValue={
                  initialData?.issuedDate
                    ? new Date(initialData.issuedDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                name="issuedDate"
                className="w-full mt-1 h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              required
              defaultValue={initialData?.description}
              name="description"
              className="w-full mt-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[100px]"
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
              {loading ? "Saving..." : "Save Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function RegulatoryEventItem({
  event,
  isAdmin,
}: {
  event: any;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  if (isDeleted) return null;

  return (
    <>
      <article className="py-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{event.authority ?? "Authority not listed"}</span>
          {event.phase && <span>· {event.phase}</span>}
          <time dateTime={event.occurredAt.toISOString()}>
            · {new Date(event.occurredAt).toLocaleDateString()}
          </time>
        </div>
        <h3 className="mt-1 text-sm font-semibold text-foreground">
          <Link href={`/events/${event.id}`} className="hover:underline">
            {event.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {event.drugId ? (
            <Link
              href={`/drugs/${event.drugId}`}
              className="text-teal-900 hover:underline"
            >
              {event.drugName ?? "View linked product"}
            </Link>
          ) : (
            "Platform regulatory record"
          )}
          {event.sourceName && ` · Source: ${event.sourceName}`}
        </p>
        <div className="flex items-center justify-between mt-2">
          {event.sourceUrl && (
            <a
              href={event.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs font-medium text-teal-900 hover:underline"
            >
              Open source
            </a>
          )}

          {isAdmin && (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs font-medium text-orange-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={async () => {
                  if (!confirm("Delete this event?")) return;
                  await fetch(`/api/events/${event.id}`, { method: "DELETE" });
                  setIsDeleted(true);
                  router.refresh();
                }}
                className="text-xs font-medium text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </article>

      {isEditing && (
        <RegulatoryEventFormModal
          initialData={event}
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

export function SafetyUpdateItem({
  update,
  isAdmin,
}: {
  update: any;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  if (isDeleted) return null;

  return (
    <>
      <article className="py-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded bg-amber-50 px-2 py-1 font-semibold text-amber-900">
            {update.severity}
          </span>
          <span>{update.authority ?? "Authority not listed"}</span>
          <time dateTime={update.issuedDate.toISOString()}>
            · {new Date(update.issuedDate).toLocaleDateString()}
          </time>
        </div>
        <h3 className="mt-2 text-sm font-semibold text-foreground">
          <Link href={`/safety/${update.id}`} className="hover:underline">
            {update.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">
          {update.description}
        </p>
        <div className="flex items-center justify-between mt-2">
          {update.drugId && (
            <Link
              href={`/drugs/${update.drugId}`}
              className="inline-block text-xs font-medium text-teal-900 hover:underline"
            >
              {update.drugName ?? "View product"}
            </Link>
          )}

          {isAdmin && (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs font-medium text-orange-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={async () => {
                  if (!confirm("Delete this update?")) return;
                  await fetch(`/api/safety-updates/${update.id}`, {
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
        </div>
      </article>

      {isEditing && (
        <SafetyUpdateFormModal
          initialData={update}
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

export function AddAlertsButtons() {
  const router = useRouter();
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  return (
    <div className="flex gap-3">
      <button
        onClick={() => setIsEventOpen(true)}
        className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 text-sm font-medium"
      >
        + Add Event
      </button>
      <button
        onClick={() => setIsUpdateOpen(true)}
        className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 text-sm font-medium"
      >
        + Add Update
      </button>

      {isEventOpen && (
        <RegulatoryEventFormModal
          onCancel={() => setIsEventOpen(false)}
          onSuccess={() => {
            setIsEventOpen(false);
            router.refresh();
          }}
        />
      )}

      {isUpdateOpen && (
        <SafetyUpdateFormModal
          onCancel={() => setIsUpdateOpen(false)}
          onSuccess={() => {
            setIsUpdateOpen(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
