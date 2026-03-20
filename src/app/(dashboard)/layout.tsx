"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: "📊" },
  { label: "Campaigns", href: "/dashboard/campaigns", icon: "🎯" },
  { label: "Alerts", href: "/dashboard/alerts", icon: "🔔" },
  { label: "Results", href: "/dashboard/results", icon: "🏆" },
  { label: "Concierge", href: "/dashboard/concierge", icon: "🤵" },
  { label: "Predict", href: "/dashboard/predict", icon: "📈" },
  { label: "Profile", href: "/dashboard/profile", icon: "👤" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-2xl">🏎️</span>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">
              Car Finder Oracle
            </h1>
            <p className="text-xs text-amber-500">v6 Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
              isActive(item.href)
                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
            {isActive(item.href) && (
              <div className="ml-auto w-1.5 h-1.5 bg-amber-500 rounded-full" />
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5">
        <Link
          href="/search"
          className="flex items-center gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-sm font-medium hover:bg-amber-500/20 transition"
        >
          🤖 Car Whisperer Search
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09090b] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 border-r border-white/5 bg-[#09090b] fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-[#0a0a0c] border-r border-white/5 z-50 transform transition-transform lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-20 backdrop-blur-xl bg-[#09090b]/80 border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-zinc-400 hover:text-white transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <span className="text-white font-semibold">🏎️ CFO</span>
          <div className="w-10" />
        </div>

        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
