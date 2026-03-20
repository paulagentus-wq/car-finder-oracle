"use client";

import { useState } from "react";
import Link from "next/link";

const FEATURES = [
  "Automatic Transmission",
  "Manual Transmission",
  "Sunroof / Panoramic Roof",
  "Heated Seats",
  "Apple CarPlay / Android Auto",
  "Adaptive Cruise Control",
  "360 Camera",
  "Leather Interior",
  "Sport Suspension",
  "All-Wheel Drive",
  "Low Mileage (< 20k)",
  "Full Service History",
];

export default function NewCampaignPage() {
  const [name, setName] = useState("");
  const [budgetMin, setBudgetMin] = useState(15000);
  const [budgetMax, setBudgetMax] = useState(50000);
  const [makes, setMakes] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleFeature = (f: string) =>
    setFeatures((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <span className="text-6xl mb-4">🎯</span>
        <h2 className="text-2xl font-bold text-white mb-2">
          Campaign Created!
        </h2>
        <p className="text-zinc-400 mb-6">
          Your campaign &quot;{name || "Untitled"}&quot; is now scanning the
          market.
        </p>
        <Link
          href="/dashboard/campaigns"
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition"
        >
          View All Campaigns
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <Link
          href="/dashboard/campaigns"
          className="text-amber-500 text-sm hover:text-amber-400 transition"
        >
          &larr; Back to Campaigns
        </Link>
        <h1 className="text-3xl font-bold text-white mt-3">New Campaign</h1>
        <p className="text-zinc-400 mt-1">
          Set up an automated search campaign. We&apos;ll scan listings 24/7 and
          alert you to matches.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campaign Name */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Campaign Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Weekend Sports Car"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition"
          />
        </div>

        {/* Budget Range */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <label className="block text-sm font-medium text-zinc-300 mb-4">
            Budget Range
          </label>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-zinc-400">Minimum</span>
                <span className="text-amber-500 font-medium">
                  &pound;{budgetMin.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={5000}
                max={100000}
                step={1000}
                value={budgetMin}
                onChange={(e) => setBudgetMin(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-zinc-400">Maximum</span>
                <span className="text-amber-500 font-medium">
                  &pound;{budgetMax.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={5000}
                max={200000}
                step={1000}
                value={budgetMax}
                onChange={(e) => setBudgetMax(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Make / Model */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Preferred Makes / Models
          </label>
          <input
            type="text"
            value={makes}
            onChange={(e) => setMakes(e.target.value)}
            placeholder="e.g. BMW, Audi RS3, Porsche 718"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition"
          />
          <p className="text-xs text-zinc-500 mt-2">
            Comma-separated. Leave blank for all makes.
          </p>
        </div>

        {/* Features */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <label className="block text-sm font-medium text-zinc-300 mb-4">
            Must-Have Features
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {FEATURES.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => toggleFeature(f)}
                className={`px-4 py-2.5 rounded-xl text-sm text-left transition border ${
                  features.includes(f)
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                    : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20"
                }`}
              >
                {features.includes(f) ? "✓ " : ""}
                {f}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition text-lg"
        >
          🎯 Create Campaign
        </button>
      </form>
    </div>
  );
}
