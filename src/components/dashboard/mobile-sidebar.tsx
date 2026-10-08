"use client";

import {
  Bell,
  BookOpen,
  BriefcaseMedical,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Menu,
  Pill,
  Settings,
  ShieldAlert,
  X,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SignOutButton } from "@/components/auth/sign-out-button";

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on path change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const NavItem = ({
    href,
    icon,
    label,
  }: {
    href: string;
    icon: React.ReactNode;
    label: string;
  }) => {
    const active = pathname === href || pathname?.startsWith(href + "/");

    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium transition-colors ${
          active
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
      >
        {icon}
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -mr-2 text-muted-foreground hover:text-foreground md:hidden"
        aria-label="Open Menu"
      >
        <Menu size={24} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-72 bg-card shadow-xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-100 shrink-0">
          <Link
            href="/"
            className="font-heading font-semibold text-xl text-foreground tracking-tight"
          >
            Legalnorms.
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 -mr-2 text-muted-foreground hover:bg-muted rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <NavItem
            href="/admin/dashboard"
            icon={<LayoutDashboard size={20} />}
            label="Overview"
          />
          <NavItem
            href="/admin/dashboard/drugs"
            icon={<Pill size={20} />}
            label="Drug Database"
          />
          <NavItem
            href="/admin/dashboard/documents"
            icon={<FileText size={20} />}
            label="Documents"
          />
          <NavItem
            href="/admin/dashboard/portfolio"
            icon={<BriefcaseMedical size={20} />}
            label="Medical Portfolio"
          />
          <NavItem
            href="/admin/dashboard/alerts"
            icon={<Bell size={20} />}
            label="Alerts & Events"
          />
          <NavItem
            href="/intelligence/ema-signals/EMA-PRAC-2026-001"
            icon={<ShieldAlert size={20} />}
            label="EMA Safety Signal"
          />
          <NavItem
            href="/admin/dashboard/import-compliance"
            icon={<ClipboardList size={20} />}
            label="Regulatory pathways"
          />
          <NavItem
            href="/admin/dashboard/regulatory-library"
            icon={<BookOpen size={20} />}
            label="Knowledge library"
          />
          <NavItem
            href="/intelligence/nda-trends"
            icon={<TrendingUp size={20} />}
            label="NDA Trends"
          />
        </nav>

        <div className="p-4 border-t border-neutral-100 space-y-2 shrink-0">
          <NavItem
            href="/admin/dashboard/settings/security"
            icon={<Settings size={20} />}
            label="Account security"
          />
          <div className="px-3 pt-2">
            <SignOutButton />
          </div>
        </div>
      </div>
    </>
  );
}
