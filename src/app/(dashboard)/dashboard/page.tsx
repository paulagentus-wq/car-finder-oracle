"use client";

import Link from "next/link";
import cars from "@/data/cars.json";
import faults from "@/data/faults.json";

const avgDealScore = (cars.reduce((sum, c) => sum + c.dealScore, 0) / cars.length).toFixed(1);

const ALERTS = [
  { msg: "BMW M4 Competition price dropped £500", color: "amber" },
  { msg: "New MOT advisory found on Audi RS3", color: "red" },
  { msg: "Porsche 911 deal score upgraded to 8.5", color: "green" },
];

const alertStyles: Record<string, string> = {
  amber: "border-amber-500/30 bg-amber-500/5 text-amber-400",
  red: "border-red-500/30 bg-red-500/5 text-red-400",
  green: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400",
};

const alertIcons: Record<string, string> = {
  amber: "💰",
  red: "🚨",
  green: "✅",
};

function scoreColor(s: number) {
  if (s >= 8) return "text-emerald-400";
  if (s >= 7) return "text-amber-400";
  return "text-red-400";
}

function motBadge(status: string) {
  if (status === "Clean")
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
        Clean
      </span>
    );
  return (
    <span className="inline-flex items-center rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-medium text-amber-400">
      Advisory
    </span>
  );
}

export default function DashboardPage() {
  const stats = [
    { icon: "🚗", label: "Cars Tracked", value: cars.length },
    { icon: "🎯", label: "Avg Deal Score", value: avgDealScore },
    { icon: "⚠️", label: "Known Faults", value: faults.length },
    { icon: "🔔", label: "Active Alerts", value: 7 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 mt-1">
          Your car search command centre at a glance.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-amber-500/20 transition"
          >
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
            <p className="text-sm text-zinc-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Your Cars Table */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Your Cars</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Car</th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Year</th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Price</th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Mileage</th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Score</th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">MOT</th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr
                  key={car.id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{car.emoji}</span>
                      <span className="text-sm font-medium text-white">{car.shortName}</span>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-sm text-zinc-300">{car.year}</td>
                  <td className="py-4 pr-4 text-sm font-mono font-semibold text-white">
                    £{car.price.toLocaleString()}
                  </td>
                  <td className="py-4 pr-4 text-sm text-zinc-300">
                    {car.mileage.toLocaleString()}mi
                  </td>
                  <td className="py-4 pr-4">
                    <span className={`text-sm font-bold font-mono ${scoreColor(car.dealScore)}`}>
                      {car.dealScore}
                    </span>
                  </td>
                  <td className="py-4 pr-4">{motBadge(car.motStatus)}</td>
                  <td className="py-4">
                    <Link
                      href={`/car/${car.id}`}
                      className="text-sm text-amber-500 hover:text-amber-400 font-medium transition"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "🔍", label: "Search Cars", href: "/search" },
            { icon: "📊", label: "Compare Cars", href: "/compare" },
            { icon: "📈", label: "Price Predict", href: "/dashboard/predict" },
            { icon: "🤝", label: "Concierge", href: "/dashboard/concierge" },
          ].map((action) => (
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

      {/* Recent Alerts */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Recent Alerts</h2>
        <div className="space-y-3">
          {ALERTS.map((alert, i) => (
            <div
              key={i}
              className={`backdrop-blur-xl rounded-xl p-4 border ${alertStyles[alert.color]}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{alertIcons[alert.color]}</span>
                <span className="text-sm font-medium">{alert.msg}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
