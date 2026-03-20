"use client";

import Link from "next/link";
import cars from "@/data/cars.json";

const FEATURES = [
  {
    icon: "🎯",
    title: "AI Deal Scoring",
    desc: "Every car rated 0-10 with detailed analysis",
    href: "/search",
  },
  {
    icon: "⚠️",
    title: "Known Faults Database",
    desc: "Community-sourced fault data for every model",
    href: "/search",
  },
  {
    icon: "📋",
    title: "MOT History",
    desc: "Full MOT pass/fail history and advisories",
    href: "/search",
  },
  {
    icon: "📈",
    title: "Price Tracking",
    desc: "Historical prices and depreciation curves",
    href: "/pricing",
  },
  {
    icon: "🤝",
    title: "Concierge Service",
    desc: "We find, negotiate, and buy for you",
    href: "/pricing",
  },
  {
    icon: "🔢",
    title: "Private Plates",
    desc: "Browse, value, and buy private plates",
    href: "/plates",
  },
];

function scoreColor(s: number) {
  if (s >= 8) return "text-emerald-400";
  if (s >= 7) return "text-amber-400";
  return "text-red-400";
}

function scoreBgColor(s: number) {
  if (s >= 8) return "bg-emerald-500/20 border-emerald-500/40";
  if (s >= 7) return "bg-amber-500/20 border-amber-500/40";
  return "bg-red-500/20 border-red-500/40";
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative pt-24 pb-20 md:pt-36 md:pb-28 scroll-mt-20">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-6">
            Find your perfect car.
            <br />
            <span className="text-amber-500">Before it finds someone else.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI deal scoring, fault intelligence, price tracking.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition-colors text-base"
            >
              Search Cars
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <a
              href="#featured"
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              View Demo Cars &darr;
            </a>
          </div>
        </div>
      </section>

      {/* ── Featured Cars ─────────────────────────────────── */}
      <section id="featured" className="py-20 md:py-28 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4">
            Featured <span className="text-amber-500">Cars</span>
          </h2>
          <p className="text-white/40 text-center mb-12 max-w-xl mx-auto">
            Real intelligence on real cars from our live database.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {cars.map((car) => (
              <div
                key={car.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all group"
              >
                {/* Color gradient bar */}
                <div
                  className="h-2 w-full"
                  style={{ backgroundColor: car.colorHex }}
                />

                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-lg mb-1">{car.emoji}</p>
                      <h3 className="text-sm font-semibold text-white leading-tight">
                        {car.shortName}
                      </h3>
                    </div>
                    <div
                      className={`w-10 h-10 rounded-full border flex items-center justify-center text-xs font-bold ${scoreBgColor(car.dealScore)} ${scoreColor(car.dealScore)}`}
                    >
                      {car.dealScore}
                    </div>
                  </div>

                  <p className="text-xs text-white/40 mb-3">
                    {car.year} &middot; {car.mileage.toLocaleString()} miles
                  </p>

                  <p className="text-lg font-bold text-amber-500 mb-4">
                    &pound;{car.price.toLocaleString()}
                  </p>

                  <Link
                    href={`/car/${car.id}`}
                    className="text-xs font-medium text-amber-500 hover:text-amber-400 transition-colors group-hover:underline"
                  >
                    View Intelligence &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────────────── */}
      <section className="py-20 md:py-28 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12">
            Everything You <span className="text-amber-500">Need</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <Link
                key={f.title}
                href={f.href}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 transition-all group"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  {f.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="py-20 md:py-28 scroll-mt-20 relative">
        <div className="absolute inset-0 bg-amber-500/[0.02] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Ready to make a smarter car purchase?
          </h2>
          <p className="text-white/40 text-lg mb-10">
            Join thousands of smart buyers using AI to find better deals.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition-colors text-base"
          >
            Get Started Free
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            &copy; 2026 Car Finder Oracle &middot; Built with AI
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
