"use client";

import { ArrowUpRight, BookOpen, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RegulatoryLibraryForm } from "./regulatory-library-form";

type Resource = {
  id: string;
  authority: string;
  title: string;
  url: string;
  description: string;
  category: string;
};

export function RegulatoryLibrary({
  initialResources,
}: {
  initialResources: Resource[];
}) {
  const router = useRouter();
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All topics");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const normalizedQuery = query.trim().toLowerCase();

  const categories = [
    "All topics",
    ...new Set(resources.map((resource) => resource.category)),
  ];

  const filteredResources = resources.filter((resource) => {
    const categoryMatches =
      category === "All topics" || resource.category === category;
    const queryMatches =
      !normalizedQuery ||
      `${resource.authority} ${resource.category} ${resource.title} ${resource.description}`
        .toLowerCase()
        .includes(normalizedQuery);
    return categoryMatches && queryMatches;
  });

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="border-b border-border pb-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-800">
              Primary-source directory
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-foreground">
              Regulatory knowledge library
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Find official authority portals by compliance area. Use primary
              sources for current rules, forms, fees, and filing instructions.
            </p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 text-sm font-medium"
          >
            + Add Resource
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-center">
        <label className="relative block flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            size={17}
          />
          <span className="sr-only">Search regulatory sources</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search authority, topic, or service"
            className="h-10 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Topic</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-10 min-w-52 rounded-md border border-border bg-card px-3 text-sm text-foreground"
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{filteredResources.length} official sources</span>
        <span>Directory links open in a new tab</span>
      </div>

      {filteredResources.length === 0 ? (
        <div className="py-12 text-center">
          <BookOpen className="mx-auto text-teal-800" size={26} />
          <p className="mt-3 text-sm font-medium text-foreground">
            No sources match this search
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try another authority or topic.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-neutral-200">
          {filteredResources.map((resource) => (
            <article
              key={resource.authority}
              className="grid gap-3 py-5 sm:grid-cols-[190px_minmax(0,1fr)_auto] sm:items-start"
            >
              <div>
                <span className="inline-flex rounded bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-900">
                  {resource.category}
                </span>
                <p className="mt-2 text-xs font-medium text-muted-foreground">
                  {resource.authority}
                </p>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  {resource.title}
                </h2>
                <p className="mt-1 max-w-3xl text-sm leading-5 text-muted-foreground">
                  {resource.description}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center gap-2 text-sm font-semibold text-teal-900 hover:underline"
                >
                  Open source <ArrowUpRight size={15} />
                </a>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setEditingResource(resource);
                      setIsFormOpen(true);
                    }}
                    className="text-xs font-medium text-orange-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (
                        !confirm(
                          "Are you sure you want to delete this resource?",
                        )
                      )
                        return;
                      await fetch(`/api/regulatory-library/${resource.id}`, {
                        method: "DELETE",
                      });
                      router.refresh();
                      setResources(
                        resources.filter((r) => r.id !== resource.id),
                      );
                    }}
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {isFormOpen && (
        <RegulatoryLibraryForm
          initialData={editingResource}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingResource(null);
          }}
          onSuccess={() => {
            setIsFormOpen(false);
            setEditingResource(null);
            router.refresh();
            window.location.reload(); // Simple sync
          }}
        />
      )}

      <p className="border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
        This library links to authority sites; it does not reproduce their
        guidance. Requirements change, so confirm the latest notification and
        product-specific route directly with the competent authority.
      </p>
    </div>
  );
}
