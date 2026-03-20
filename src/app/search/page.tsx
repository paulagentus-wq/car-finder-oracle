"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import cars from "@/data/cars.json";

const FILTER_PILLS = ["All", "BMW", "Audi", "Porsche", "Land Rover"];

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

function motBadge(status: string) {
  if (status === "Clean") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
        Clean MOT
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400">
      Advisory
    </span>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = useMemo(() => {
    return cars.filter((car) => {
      // Filter pill matching
      if (activeFilter !== "All") {
        const filterLower = activeFilter.toLowerCase();
        const nameLower = car.name.toLowerCase();
        // "Land Rover" matches "Range Rover"
        if (filterLower === "land rover") {
          if (!nameLower.includes("range rover") && !nameLower.includes("land rover")) return false;
        } else {
          if (!nameLower.includes(filterLower)) return false;
        }
      }

      // Search query matching
      if (query.trim()) {
        const q = query.toLowerCase();
        const searchable = `${car.name} ${car.shortName} ${car.engine} ${car.color}`.toLowerCase();
        const words = q.split(/\s+/);
        return words.every((word) => searchable.includes(word));
      }

      return true;
    });
  }, [query, activeFilter]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
            Search <span className="text-amber-500">Cars</span>
          </h1>
          <p className="text-white/40 text-lg">
            Browse our intelligence database. Every car scored and analysed.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-6 max-w-2xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center gap-3 px-5 py-4">
            <span className="text-xl text-white/30">🔍</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by make, model, or keyword..."
              className="flex-1 bg-transparent text-white text-base placeholder-white/30 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-white/30 hover:text-white/60 transition-colors text-sm"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {FILTER_PILLS.map((pill) => (
            <button
              key={pill}
              onClick={() => setActiveFilter(pill)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === pill
                  ? "bg-amber-500 text-black"
                  : "bg-white/5 border border-white/10 text-white/60 hover:border-amber-500/30 hover:text-white"
              }`}
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Car Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((car) => (
              <div
                key={car.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all group"
              >
                {/* Color bar */}
                <div
                  className="h-2 w-full"
                  style={{ backgroundColor: car.colorHex }}
                />

                <div className="p-5">
                  {/* Top: emoji + name + score */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-lg mb-1">{car.emoji}</p>
                      <h3 className="text-base font-semibold text-white leading-tight truncate">
                        {car.name}
                      </h3>
                    </div>
                    <div
                      className={`w-11 h-11 rounded-full border flex items-center justify-center text-sm font-bold flex-shrink-0 ml-3 ${scoreBgColor(car.dealScore)} ${scoreColor(car.dealScore)}`}
                    >
                      {car.dealScore}
                    </div>
                  </div>

                  {/* Details */}
                  <p className="text-xs text-white/40 mb-1">
                    {car.year} &middot; {car.mileage.toLocaleString()} miles &middot; {car.engine}
                  </p>

                  {/* Price */}
                  <p className="text-xl font-bold text-amber-500 mt-3 mb-3">
                    &pound;{car.price.toLocaleString()}
                  </p>

                  {/* MOT badge */}
                  <div className="mb-4">
                    {motBadge(car.motStatus)}
                  </div>

                  {/* Link */}
                  <div className="pt-3 border-t border-white/[0.06]">
                    <Link
                      href={`/car/${car.id}`}
                      className="text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors group-hover:underline"
                    >
                      View Full Report &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl mb-2">🔍</p>
            <p className="text-white/40 text-lg">No cars match your search</p>
            <button
              onClick={() => {
                setQuery("");
                setActiveFilter("All");
              }}
              className="mt-4 text-sm text-amber-500 hover:text-amber-400 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
