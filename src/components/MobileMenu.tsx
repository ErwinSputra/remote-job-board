"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

type NavLink = {
  href: string;
  label: string;
  highlight?: boolean;
};

export default function MobileMenu({ links }: { links: NavLink[] }) {
  const [isOpen, setIsOpen] = useState(false);

  if (links.length === 0) return null;

  return (
    <div className="relative md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div
            className="absolute right-0 top-10 z-50 w-52 rounded-xl border border-white/10 shadow-xl py-2 flex flex-col"
            style={{ backgroundColor: "#1A1A2E" }}
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`mx-2 my-0.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  link.highlight
                    ? "text-[#1A1A2E] font-semibold"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
                style={
                  link.highlight ? { backgroundColor: "#FFE97D" } : undefined
                }
              >
                {link.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
