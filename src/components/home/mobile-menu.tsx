"use client";

import { Brain, Briefcase, FileStack, Menu, X, Info, Settings, Newspaper, Mail, Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function MobileHomeMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 md:hidden"
        aria-label="Open Menu"
      >
        <Menu
          size={28}
          color="#FFD700"
          strokeWidth={3}
          className="text-[#FFD700] drop-shadow-md"
        />
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
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-card shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-border shrink-0">
          <span className="font-heading font-bold text-lg text-foreground">
            Menu
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 -mr-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <Link
            href="/intelligence"
            className="flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <Brain className="text-primary w-5 h-5" />
            Intelligence
          </Link>
          <Link
            href="/portfolio"
            className="flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <Briefcase className="text-primary w-5 h-5" />
            Portfolio
          </Link>
          <Link
            href="/resources"
            className="flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <FileStack className="text-primary w-5 h-5" />
            Resources
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <Info className="text-primary w-5 h-5" />
            About Us
          </Link>
          <Link
            href="/service"
            className="flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <Settings className="text-primary w-5 h-5" />
            Service
          </Link>
          <Link
            href="/blog"
            className="flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <Newspaper className="text-primary w-5 h-5" />
            Blog
          </Link>
          <Link
            href="/regulatory-updates"
            className="flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <Bell className="text-primary w-5 h-5" />
            Regulatory Updates
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <Mail className="text-primary w-5 h-5" />
            Contact Us
          </Link>
        </nav>
      </div>
    </>
  );
}
