"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

type MobileNavProps = {
  isLoggedIn: boolean;
};

export function MobileNav({ isLoggedIn }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {isOpen && (
        <div className="absolute top-20 left-0 right-0 bg-white border-b border-slate-200 shadow-lg p-6 flex flex-col gap-6 z-50">
          <Link
            href="/about"
            className="text-lg font-medium text-slate-600 hover:text-orange-600"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            href="/services"
            className="text-lg font-medium text-slate-600 hover:text-orange-600"
            onClick={() => setIsOpen(false)}
          >
            Services
          </Link>
          <Link
            href="/portfolio"
            className="text-lg font-medium text-slate-600 hover:text-orange-600"
            onClick={() => setIsOpen(false)}
          >
            Portfolio
          </Link>
          <Link
            href="/blog"
            className="text-lg font-medium text-slate-600 hover:text-orange-600"
            onClick={() => setIsOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className="text-lg font-medium text-slate-600 hover:text-orange-600"
            onClick={() => setIsOpen(false)}
          >
            Contact Us
          </Link>
          
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-4">
            {!isLoggedIn && (
              <Link
                href="/login"
                className="w-full text-center px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-orange-600 transition shadow-sm font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
