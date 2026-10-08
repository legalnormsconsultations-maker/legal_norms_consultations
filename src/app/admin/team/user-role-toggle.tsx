"use client";

import { useTransition, useState } from "react";
import { toggleAdminRole } from "@/actions/admin-actions";

type Props = {
  userId: string;
  isAdmin: boolean;
  isOwner: boolean;
  canEdit: boolean;
};

export function UserRoleToggle({ userId, isAdmin, isOwner, canEdit }: Props) {
  const [isPending, startTransition] = useTransition();
  const [optimisticAdmin, setOptimisticAdmin] = useState(isAdmin);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = () => {
    if (!canEdit) return;
    
    setError(null);
    const newValue = !optimisticAdmin;
    setOptimisticAdmin(newValue);

    startTransition(async () => {
      const res = await toggleAdminRole(userId, newValue);
      if (res?.error) {
        setOptimisticAdmin(isAdmin); // Revert on failure
        setError(res.error);
        alert(res.error);
      }
    });
  };

  if (isOwner) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
        Super Admin
      </span>
    );
  }

  if (!canEdit) {
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${optimisticAdmin ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-600'}`}>
        {optimisticAdmin ? "Admin" : "User"}
      </span>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3">
      <span className={`text-xs font-semibold w-12 text-right ${optimisticAdmin ? 'text-orange-600 dark:text-orange-400' : 'text-slate-500 dark:text-slate-400'}`}>
        {optimisticAdmin ? "Admin" : "User"}
      </span>
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
          optimisticAdmin ? "bg-orange-600" : "bg-slate-300 dark:bg-slate-600"
        } ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        role="switch"
        aria-checked={optimisticAdmin}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            optimisticAdmin ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
