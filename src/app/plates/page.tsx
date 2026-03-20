"use client";

import { useState } from "react";
import Link from "next/link";

const PLATES = [
  { id: 1, reg: "B3N 007", price: 4995, style: "rear" as const },
  { id: 2, reg: "M4 CFO", price: 8500, style: "front" as const },
  { id: 3, reg: "RS3 AAA", price: 3200, style: "rear" as const },
  { id: 4, reg: "P911 RR", price: 12750, style: "front" as const },
  { id: 5, reg: "P4UL X", price: 6400, style: "rear" as const },
  { id: 6, reg: "D4VE Y", price: 2495, style: "front" as const },
  { id: 7, reg: "J4MES", price: 3800, style: "rear" as const },
  { id: 8, reg: "CL4SS", price: 5200, style: "front" as const },
];

function PlateDisplay({ reg, style }: { reg: string; style: "front" | "rear" }) {
  const bgColor = style === "rear" ? "bg-amber-400" : "bg-white";
  return (
    <div
      className={`mx-auto w-72 rounded-lg border-2 border-zinc-700 ${bgColor} py-4 px-6 text-center`}
    >
      <span className="font-mono text-4xl font-black tracking-wider text-zinc-900">
        {reg}
      </span>
    </div>
  );
}

export default function PlatesPage() {
  const [search, setSearch] = useState("");

  const filtered = PLATES.filter((p) =>
    p.reg.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Private Plates</h1>
        <p className="text-zinc-400 mt-1">
          Browse, value, and buy private number plates.
        </p>
      </div>

      {/* Search */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search plates..."
          className="w-full px-4 py-3 bg-transparent text-white placeholder-zinc-500 focus:outline-none text-lg"
        />
      </div>

      {/* Plate Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((plate) => (
          <div
            key={plate.id}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 hover:bg-white/[0.08] transition group text-center"
          >
            <PlateDisplay reg={plate.reg} style={plate.style} />

            <p className="text-xs text-zinc-500 mt-4 mb-1">
              {plate.style === "rear" ? "Rear Plate" : "Front Plate"}
            </p>
            <p className="text-2xl font-bold text-white mb-4">
              £{plate.price.toLocaleString()}
            </p>

            <button className="w-full py-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-medium rounded-xl hover:bg-amber-500/20 transition">
              Enquire
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <span className="text-4xl block mb-3">🔍</span>
          <p className="text-zinc-400">No plates match your search.</p>
        </div>
      )}

      {/* List Your Plate CTA */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
        <h3 className="text-xl font-bold text-white mb-2">
          Have a plate to sell?
        </h3>
        <p className="text-zinc-400 text-sm mb-5">
          List your private plate on our marketplace and reach thousands of buyers.
        </p>
        <Link
          href="/plates/list"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition text-sm"
        >
          List Your Plate →
        </Link>
      </div>
    </div>
  );
}
