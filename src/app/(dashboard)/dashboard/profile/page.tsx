"use client";

import { useState } from "react";

const SAVED_SEARCHES = [
  { id: 1, query: "BMW under 50k with less than 30k miles", date: "2026-03-18", results: 4 },
  { id: 2, query: "Hot hatch under 35k manual", date: "2026-03-15", results: 6 },
  { id: 3, query: "Sports car under 55k low mileage", date: "2026-03-12", results: 3 },
  { id: 4, query: "Reliable SUV diesel under 40k", date: "2026-03-08", results: 8 },
];

const TIERS = [
  { name: "Free", price: "£0", features: ["5 searches/day", "Basic alerts", "1 campaign"] },
  { name: "Pro", price: "£19/mo", features: ["Unlimited searches", "Priority alerts", "10 campaigns", "AI Concierge", "Price Predictor"], current: true },
  { name: "Enterprise", price: "£49/mo", features: ["Everything in Pro", "API access", "Unlimited campaigns", "Dedicated concierge", "Fleet management"] },
];

export default function ProfilePage() {
  const [name, setName] = useState("Ben Mitchell");
  const [email, setEmail] = useState("ben@openclaw.com");

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="text-zinc-400 mt-1">Manage your account and subscription.</p>
      </div>

      {/* Profile Info */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Account Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition"
            />
          </div>
        </div>
        <button className="mt-4 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition text-sm">
          Save Changes
        </button>
      </div>

      {/* Subscription */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Subscription</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl p-5 border transition ${
                tier.current
                  ? "bg-amber-500/10 border-amber-500/30"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-semibold ${tier.current ? "text-amber-500" : "text-white"}`}>
                  {tier.name}
                </h3>
                {tier.current && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-amber-500/20 text-amber-400 rounded-full">
                    Current
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-white mb-3">{tier.price}</p>
              <ul className="space-y-1.5">
                {tier.features.map((f) => (
                  <li key={f} className="text-sm text-zinc-400 flex items-center gap-2">
                    <span className="text-amber-500 text-xs">&#10003;</span> {f}
                  </li>
                ))}
              </ul>
              {!tier.current && (
                <button className="mt-4 w-full py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-zinc-300 hover:bg-white/10 transition">
                  {tier.name === "Free" ? "Downgrade" : "Upgrade"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Saved Searches */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Saved Searches</h2>
        <div className="space-y-2">
          {SAVED_SEARCHES.map((search) => (
            <div
              key={search.id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">&quot;{search.query}&quot;</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {search.date} &middot; {search.results} results
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-medium rounded-lg hover:bg-amber-500/20 transition">
                  Run Again
                </button>
                <button className="px-3 py-1.5 bg-white/5 border border-white/10 text-zinc-400 text-xs rounded-lg hover:bg-white/10 transition">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
