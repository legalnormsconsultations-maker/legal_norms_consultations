"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X,
  LayoutDashboard,
  Users,
  FileText,
  ShieldCheck,
  Settings,
  LogOut,
  Bell,
  Activity,
  Search
} from "lucide-react";

export function AdminMobileSidebar() {
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
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          active
            ? "bg-slate-800 text-white"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
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
        className="p-2 -ml-2 mr-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 lg:hidden focus:outline-none"
        aria-label="Open Menu"
      >
        <Menu size={24} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 dark:bg-slate-950 shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
          <div className="flex items-center">
            <ShieldCheck size={24} className="text-orange-500 mr-3" />
            <span className="text-xl font-bold text-white tracking-tight">
              LN Consultations
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 -mr-2 text-slate-400 hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-1 px-3">
            <NavItem href="/admin" icon={<LayoutDashboard size={20} className="text-orange-500" />} label="Dashboard" />
            
            <div className="pt-4 pb-2 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              Operations
            </div>
            <NavItem href="/admin/dashboard" icon={<Activity size={20} />} label="Client Dashboard" />
            <NavItem href="/admin/intelligence" icon={<ShieldCheck size={20} />} label="Intelligence" />
            <NavItem href="/admin/search" icon={<Search size={20} />} label="Search" />
            <NavItem href="/admin/leads" icon={<Users size={20} />} label="User Query Info" />
            <NavItem href="/admin/projects" icon={<ShieldCheck size={20} />} label="Client Projects" />
            <NavItem href="/admin/team" icon={<Users size={20} />} label="Team Management" />
            <NavItem href="/admin/messages" icon={<Activity size={20} />} label="Msg Checklist" />

            <div className="pt-4 pb-2 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              Client Tools
            </div>
            <NavItem href="/admin/dashboard/portfolio" icon={<ShieldCheck size={20} />} label="Portfolio" />
            <NavItem href="/admin/dashboard/manufacturers" icon={<Users size={20} />} label="Manufacturers" />
            <NavItem href="/admin/dashboard/alerts" icon={<Bell size={20} />} label="Regulatory Alerts" />
            <NavItem href="/admin/dashboard/documents" icon={<FileText size={20} />} label="My Documents" />
            <NavItem href="/admin/dashboard/research" icon={<Search size={20} />} label="Research" />
            <NavItem href="/admin/dashboard/import-compliance" icon={<ShieldCheck size={20} />} label="Import Compliance" />
            <NavItem href="/admin/dashboard/regulatory-library" icon={<FileText size={20} />} label="Regulatory Library" />
            
            <div className="pt-4 pb-2 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              CMS
            </div>
            <NavItem href="/admin/content" icon={<FileText size={20} />} label="Page Content" />
            <NavItem href="/admin/legal" icon={<ShieldCheck size={20} />} label="Legal Pages" />
            <NavItem href="/admin/brands" icon={<FileText size={20} />} label="Trusted Brands" />
            <NavItem href="/admin/testimonials" icon={<FileText size={20} />} label="Client Testimonials" />
            <NavItem href="/admin/locations" icon={<FileText size={20} />} label="Company Locations" />
            <NavItem href="/admin/services" icon={<FileText size={20} />} label="Service Catalogue" />
            <NavItem href="/admin/articles" icon={<FileText size={20} />} label="Knowledge Base" />
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <Link href="/admin/settings" className="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition font-medium text-sm text-slate-300">
            <Settings size={18} className="mr-3" />
            Settings
          </Link>
          <button className="w-full flex items-center px-3 py-2.5 rounded-lg hover:bg-red-900/50 hover:text-red-400 transition font-medium text-sm mt-1 text-slate-300">
            <LogOut size={18} className="mr-3" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
