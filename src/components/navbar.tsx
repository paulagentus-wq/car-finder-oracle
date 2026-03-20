"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/compare", label: "Compare" },
  { href: "/plates", label: "Plates" },
  { href: "/pricing", label: "Pricing" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏎️</span>
            <span className="text-xl font-bold tracking-tight text-white">
              Car Finder <span className="text-amber-500">Oracle</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-white/70 border border-white/10 rounded-lg hover:border-white/20 hover:text-white transition-all"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium bg-amber-500 hover:bg-amber-400 text-black rounded-lg transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col items-center justify-center w-10 h-10 gap-1.5"
            aria-label="Toggle menu"
          >
            {open ? (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <>
                <span className="block w-5 h-0.5 bg-white/70" />
                <span className="block w-5 h-0.5 bg-white/70" />
                <span className="block w-5 h-0.5 bg-white/70" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Nav */}
      {open && (
        <div className="md:hidden bg-zinc-950/95 backdrop-blur-xl border-b border-white/[0.06] px-4 pb-4">
          <div className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm text-white/60 hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/5 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/[0.06]">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 text-sm font-medium text-white/70 border border-white/10 rounded-lg text-center hover:border-white/20 hover:text-white transition-all"
            >
              Login
            </Link>
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 text-sm font-medium bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-center transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
