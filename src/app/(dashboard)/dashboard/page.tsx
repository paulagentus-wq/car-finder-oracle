"use client";

import Link from "next/link";

const STATS = [
  { label: "Active Campaigns", value: "3", icon: "🎯", change: "+1 this week" },
  { label: "Alerts", value: "7", icon: "🔔", change: "2 unread" },
  { label: "Cars Tracked", value: "12", icon: "🚗", change: "+4 today" },
  { label: "Deal Score Avg", value: "7.4", icon: "⭐", change: "Above market" },
];

const HEATMAP = [
  { segment: "Sports Coupe", heat: 0.9, color: "from-red-500/30 to-amber-500/30" },
  { segment: "SUV", heat: 0.7, color: "from-amber-500/30 to-yellow-500/20" },
  { segment: "Saloon", heat: 0.5, color: "from-yellow-500/20 to-green-500/10" },
  { segment: "Hot Hatch", heat: 0.85, color: "from-orange-500/30 to-red-500/20" },
];

const LIVE_FEED = [
  { time: "2 min ago", msg: "Price drop detected", car: "BMW M340i — now £41,200", type: "price" },
  { time: "18 min ago", msg: "New listing match", car: "Toyota GR Supra 3.0", type: "match" },
  { time: "1 hr ago", msg: "Campaign complete", car: "SUV Campaign finished scanning", type: "campaign" },
  { time: "3 hrs ago", msg: "Deal alert", car: "Audi RS3 scored 9.1/10", type: "deal" },
  { time: "5 hrs ago", msg: "Price prediction updated", car: "Porsche 718 Cayman", type: "predict" },
];

const QUICK_ACTIONS = [
  { label: "Search", href: "/search", icon: "🔍" },
  { label: "New Campaign", href: "/dashboard/campaigns/new", icon: "🎯" },
  { label: "Price Predict", href: "/dashboard/predict", icon: "📈" },
  { label: "Concierge", href: "/dashboard/concierge", icon: "🤵" },
];

const typeIcons: Record<string, string> = {
  price: "💰",
  match: "🔍",
  campaign: "🎯",
  deal: "⭐",
  predict: "📈",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 mt-1">
          Your car search command centre at a glance.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-amber-500/20 transition"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-xs text-zinc-500">{stat.change}</span>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-zinc-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Heatmap */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            🌡️ Market Heatmap
          </h2>
          <div className="space-y-3">
            {HEATMAP.map((item) => (
              <div key={item.segment}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-zinc-300">{item.segment}</span>
                  <span className="text-xs text-zinc-500">
                    {Math.round(item.heat * 100)}% demand
                  </span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-700`}
                    style={{ width: `${item.heat * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Feed */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            ⚡ Live Feed
          </h2>
          <div className="space-y-3">
            {LIVE_FEED.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition"
              >
                <span className="text-lg mt-0.5">
                  {typeIcons[item.type] || "📋"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium">{item.msg}</p>
                  <p className="text-xs text-zinc-400 truncate">{item.car}</p>
                </div>
                <span className="text-xs text-zinc-500 whitespace-nowrap">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">
          ⚡ Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:border-amber-500/30 hover:bg-amber-500/5 transition group"
            >
              <span className="text-3xl block mb-2">{action.icon}</span>
              <span className="text-sm text-zinc-300 group-hover:text-amber-500 transition">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
