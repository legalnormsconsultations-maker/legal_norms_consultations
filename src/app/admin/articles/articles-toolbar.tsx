"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function ArticlesToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") || "";
  const currentType = searchParams.get("type") || "All Types";

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set("search", value);
      else params.delete("search");
      router.push(`?${params.toString()}`);
    });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "All Types") params.set("type", value);
      else params.delete("type");
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm opacity-100 transition-opacity">
      <div className="relative w-full max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input 
          type="text" 
          placeholder="Search articles..." 
          defaultValue={currentSearch}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-slate-100"
        />
      </div>
      <div className="flex gap-2">
        <select 
          defaultValue={currentType}
          onChange={handleTypeChange}
          className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 outline-none"
        >
          <option value="All Types">All Types</option>
          <option value="Guide">Guide</option>
          <option value="Blog">Blog</option>
          <option value="Case Study">Case Study</option>
          <option value="Service Explanation">Service Explanation</option>
        </select>
      </div>
    </div>
  );
}
