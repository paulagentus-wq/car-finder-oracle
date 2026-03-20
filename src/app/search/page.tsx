"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const DEMO_CARS = [
  { id: 1, name: "BMW M340i xDrive", price: 42995, score: 8.7, miles: 18400, engine: "3.0L Turbo I6", year: 2024, fuel: "Petrol", bhp: 374 },
  { id: 2, name: "Audi RS3 Sportback", price: 48750, score: 9.1, miles: 12300, engine: "2.5L Turbo I5", year: 2024, fuel: "Petrol", bhp: 394 },
  { id: 3, name: "Mercedes-AMG C43", price: 46500, score: 8.4, miles: 21000, engine: "2.0L Turbo I4 + EQ", year: 2023, fuel: "Hybrid", bhp: 402 },
  { id: 4, name: "Toyota GR Supra 3.0", price: 44200, score: 8.9, miles: 8900, engine: "3.0L Turbo I6", year: 2024, fuel: "Petrol", bhp: 382 },
  { id: 5, name: "Porsche 718 Cayman", price: 52900, score: 9.3, miles: 15600, engine: "2.0L Turbo Flat-4", year: 2023, fuel: "Petrol", bhp: 300 },
  { id: 6, name: "VW Golf R", price: 38500, score: 8.2, miles: 9200, engine: "2.0L Turbo I4", year: 2024, fuel: "Petrol", bhp: 328 },
  { id: 7, name: "Ford Focus ST", price: 29995, score: 7.8, miles: 14500, engine: "2.3L Turbo I4", year: 2023, fuel: "Petrol", bhp: 276 },
  { id: 8, name: "Hyundai i30 N", price: 31200, score: 8.0, miles: 11200, engine: "2.0L Turbo I4", year: 2024, fuel: "Petrol", bhp: 276 },
  { id: 9, name: "Range Rover Sport", price: 68500, score: 8.5, miles: 22000, engine: "3.0L Turbo I6", year: 2023, fuel: "Diesel", bhp: 346 },
  { id: 10, name: "BMW X3 M40i", price: 51800, score: 8.3, miles: 19500, engine: "3.0L Turbo I6", year: 2024, fuel: "Petrol", bhp: 382 },
];

const EXAMPLES = [
  "BMW under 50k with less than 30k miles",
  "Fast daily driver with good reliability",
  "Sports car under 55k low mileage",
  "Hot hatch under 35k",
  "SUV with turbo engine",
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return DEMO_CARS.filter((car) => {
      const text = `${car.name} ${car.engine} ${car.fuel} ${car.bhp}bhp`.toLowerCase();
      const words = q.split(/\s+/);
      // Check price constraints
      const priceMatch = q.match(/under\s+(\d+)k/);
      if (priceMatch) {
        const maxPrice = parseInt(priceMatch[1]) * 1000;
        if (car.price > maxPrice) return false;
      }
      const milesMatch = q.match(/less than\s+(\d+)k\s+miles/);
      if (milesMatch) {
        const maxMiles = parseInt(milesMatch[1]) * 1000;
        if (car.miles > maxMiles) return false;
      }
      // Keyword matching
      const keywords = words.filter(
        (w) => !["under", "with", "less", "than", "and", "a", "the", "good", "miles"].includes(w)
      );
      if (keywords.length === 0) return true;
      return keywords.some((kw) => text.includes(kw));
    });
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  const handleExample = (example: string) => {
    setQuery(example);
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-[#09090b] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="text-amber-500 text-sm hover:text-amber-400 transition">
            &larr; Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-4">
            🤖 Car Whisperer
          </h1>
          <p className="text-zinc-400 mt-3 text-lg">
            Describe your perfect car in plain English. Our AI does the rest.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative mb-8">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-2 flex items-center gap-2 shadow-2xl shadow-amber-500/5">
            <span className="text-2xl pl-4">🤖</span>
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSearched(false); }}
              placeholder="Describe your perfect car..."
              className="flex-1 px-4 py-4 bg-transparent text-white text-lg placeholder-zinc-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition whitespace-nowrap"
            >
              Search
            </button>
          </div>
        </form>

        {/* Example Searches */}
        {!searched && (
          <div className="mb-12">
            <p className="text-zinc-500 text-sm mb-3 text-center">Try these:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => handleExample(ex)}
                  className="px-4 py-2 backdrop-blur-xl bg-white/5 border border-white/10 rounded-full text-sm text-zinc-300 hover:border-amber-500/50 hover:text-amber-500 transition"
                >
                  &quot;{ex}&quot;
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {searched && (
          <div>
            <p className="text-zinc-400 mb-6">
              {results.length > 0
                ? `Found ${results.length} matching car${results.length !== 1 ? "s" : ""}`
                : "No exact matches found. Try broadening your search."}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((car) => (
                <div
                  key={car.id}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 transition group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-amber-500 transition">
                        {car.name}
                      </h3>
                      <p className="text-zinc-500 text-sm">{car.year} &middot; {car.miles.toLocaleString()} miles</p>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
                      <span className="text-amber-500 font-bold text-sm">{car.score}</span>
                      <span className="text-amber-500/60 text-xs">/10</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-zinc-400 text-sm">{car.engine}</p>
                      <p className="text-zinc-500 text-xs">{car.bhp} bhp &middot; {car.fuel}</p>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      &pound;{car.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
