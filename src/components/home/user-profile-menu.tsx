"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ShieldAlert, LayoutDashboard, LogOut } from "lucide-react";
import type { CurrentUser } from "@/lib/auth/session";
import { SignOutButton } from "@/components/auth/sign-out-button";

type UserProfileMenuProps = {
  user: CurrentUser;
};

export function UserProfileMenu({ user }: UserProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const initials = user.firstName ? user.firstName.charAt(0) : user.email.charAt(0);
  const isAdmin = user.roles.includes("ADMIN");

  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-orange-600 rounded-full transition-transform hover:scale-105"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {user.avatarUrl && !imgFailed ? (
          <img
            src={user.avatarUrl}
            alt="Profile"
            className="w-10 h-10 rounded-full border border-orange-200 object-cover shadow-sm"
            onError={() => setImgFailed(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-orange-700 dark:text-orange-400 font-bold uppercase shadow-sm">
            {initials}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in zoom-in duration-200">
          <div className="px-4 py-2 border-b border-slate-50 mb-2">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {user.firstName ? `${user.firstName} ${user.lastName || ""}` : "User"}
            </p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>


          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition"
              onClick={() => setIsOpen(false)}
            >
              <ShieldAlert size={18} />
              Super Admin
            </Link>
          )}

          <div className="mt-2 border-t border-slate-50 pt-2 px-2">
            <SignOutButton />
          </div>
        </div>
      )}
    </div>
  );
}
