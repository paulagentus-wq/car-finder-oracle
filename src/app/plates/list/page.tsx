"use client";

import { useState } from "react";
import Link from "next/link";

export default function ListPlatePage() {
  const [form, setForm] = useState({
    registration: "",
    price: "",
    description: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-4">
        <div className="text-center">
          <span className="text-6xl block mb-4">✅</span>
          <h2 className="text-2xl font-bold text-white mb-2">
            Plate Listed Successfully!
          </h2>
          <p className="text-zinc-400 mb-6">
            Your plate &quot;{form.registration || "---"}&quot; is now live on
            the marketplace.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/plates"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition"
            >
              View Marketplace
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setForm({
                  registration: "",
                  price: "",
                  description: "",
                  contactName: "",
                  contactEmail: "",
                  contactPhone: "",
                });
              }}
              className="px-6 py-3 bg-white/5 border border-white/10 text-zinc-300 rounded-xl hover:bg-white/10 transition"
            >
              List Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        <Link
          href="/plates"
          className="text-amber-500 text-sm hover:text-amber-400 transition"
        >
          &larr; Back to Marketplace
        </Link>
        <h1 className="text-3xl font-bold text-white mt-3">List a Plate</h1>
        <p className="text-zinc-400 mt-1">
          Sell your personalised plate on the Car Finder Oracle marketplace.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Plate Details */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">Plate Details</h2>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Registration
              </label>
              <input
                type="text"
                value={form.registration}
                onChange={(e) =>
                  update("registration", e.target.value.toUpperCase())
                }
                placeholder="e.g. B1G BOSS"
                maxLength={8}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition font-mono text-lg tracking-wider uppercase"
              />
            </div>

            {/* Preview */}
            {form.registration && (
              <div className="flex justify-center py-2">
                <div className="bg-amber-500 rounded-lg py-3 px-8">
                  <span className="text-black font-bold text-2xl tracking-wider font-mono">
                    {form.registration}
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Asking Price (&pound;)
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                placeholder="e.g. 5000"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Tell buyers about this plate..."
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition resize-none"
              />
            </div>
          </div>

          {/* Contact */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">
              Contact Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                value={form.contactName}
                onChange={(e) => update("contactName", e.target.value)}
                placeholder="John Smith"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => update("contactEmail", e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  value={form.contactPhone}
                  onChange={(e) => update("contactPhone", e.target.value)}
                  placeholder="07700 900000"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition text-lg"
          >
            🔢 List My Plate
          </button>
        </form>
      </div>
    </div>
  );
}
