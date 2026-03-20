"use client";

import Link from "next/link";

const CAMPAIGNS = [
  {
    id: 1,
    name: "Dream Sports Car Hunt",
    status: "Active",
    created: "2026-03-12",
    carsFound: 8,
    budget: "£35k — £55k",
    criteria: "Sports coupe, under 30k miles, 300+ bhp",
  },
  {
    id: 2,
    name: "Family SUV Finder",
    status: "Paused",
    created: "2026-03-05",
    carsFound: 14,
    budget: "£25k — £45k",
    criteria: "7-seater, diesel or hybrid, ISOFIX",
  },
  {
    id: 3,
    name: "Track Day Weapon",
    status: "Complete",
    created: "2026-02-20",
    carsFound: 5,
    budget: "£20k — £35k",
    criteria: "Hot hatch or coupe, manual, lightweight",
  },
];

const statusStyles: Record<string, string> = {
  Active: "bg-green-500/10 text-green-400 border-green-500/20",
  Paused: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Complete: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

export default function CampaignsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Campaigns</h1>
          <p className="text-zinc-400 mt-1">
            Automated car search campaigns running on your behalf.
          </p>
        </div>
        <Link
          href="/dashboard/campaigns/new"
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition text-sm"
        >
          + New Campaign
        </Link>
      </div>

      <div className="space-y-4">
        {CAMPAIGNS.map((campaign) => (
          <div
            key={campaign.id}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-amber-500/20 transition"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    {campaign.name}
                  </h3>
                  <span
                    className={`px-3 py-0.5 text-xs font-medium rounded-full border ${statusStyles[campaign.status]}`}
                  >
                    {campaign.status}
                  </span>
                </div>
                <p className="text-sm text-zinc-400">{campaign.criteria}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500">
                  <span>📅 {campaign.created}</span>
                  <span>💰 {campaign.budget}</span>
                  <span>🚗 {campaign.carsFound} cars found</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-zinc-300 hover:bg-white/10 transition">
                  View Results
                </button>
                <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-zinc-300 hover:bg-white/10 transition">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
