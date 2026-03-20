"use client";

import { useState } from "react";
import Link from "next/link";

const DEMO_PLATES = [
  { id: 1, reg: "B1G BOSS", price: 12500, category: "Premium" },
  { id: 2, reg: "M 340I", price: 8900, category: "Car Model" },
  { id: 3, reg: "SP33D", price: 4500, category: "Performance" },
  { id: 4, reg: "DR1FT", price: 3200, category: "Performance" },
  { id: 5, reg: "GO FAST", price: 7800, category: "Performance" },
  { id: 6, reg: "1 CFO", price: 15000, category: "Premium" },
  { id: 7, reg: "RS3 AUD", price: 6200, category: "Car Model" },
  { id: 8, reg: "V8 POWR", price: 5400, category: "Performance" },
  { id: 9, reg: "MY 911", price: 9800, category: "Car Model" },
  { id: 10, reg: "R4CER", price: 2800, category: "Performance" },
  { id: 11, reg: "K1NG", price: 11000, category: "Premium" },
  { id: 12, reg: "SUP3R", price: 3600, category: "Performance" },
];

export default function PlatesPage() {
  const [search, setSearch] = useState("");

  const filtered = DEMO_PLATES.filter((p) =>
    p.reg.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#09090b] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-amber-500 text-sm hover:text-amber-400 transition">
              &larr; Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-white mt-3">
              🔢 Plates Marketplace
            </h1>
            <p className="text-zinc-400 mt-1">
              Find your perfect personalised number plate.
            </p>
          </div>
          <Link
            href="/plates/list"
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition text-sm"
          >
            + List a Plate
          </Link>
        </div>

        {/* Search */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-2 mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search plates..."
            className="w-full px-4 py-3 bg-transparent text-white placeholder-zinc-500 focus:outline-none text-lg"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((plate) => (
            <div
              key={plate.id}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-amber-500/30 transition group text-center"
            >
              {/* Plate Display */}
              <div className="bg-amber-500 rounded-lg py-3 px-4 mb-4 inline-block">
                <span className="text-black font-bold text-xl tracking-wider font-mono">
                  {plate.reg}
                </span>
              </div>

              <p className="text-xs text-zinc-500 mb-2">{plate.category}</p>
              <p className="text-xl font-bold text-white mb-4">
                &pound;{plate.price.toLocaleString()}
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
      </div>
    </div>
  );
}
