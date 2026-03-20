"use client";

import { useState } from "react";

const DEMO_ALERTS = [
  {
    id: 1,
    type: "price_drop",
    icon: "💰",
    message: "Price dropped by £1,795",
    car: "BMW M340i xDrive — now £41,200",
    time: "2 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "new_match",
    icon: "🔍",
    message: "New listing matches your campaign",
    car: "Toyota GR Supra 3.0 — £44,200",
    time: "18 minutes ago",
    read: false,
  },
  {
    id: 3,
    type: "deal_score",
    icon: "⭐",
    message: "High deal score detected (9.1/10)",
    car: "Audi RS3 Sportback — £48,750",
    time: "1 hour ago",
    read: true,
  },
  {
    id: 4,
    type: "prediction",
    icon: "📈",
    message: "Price predicted to drop 3% next month",
    car: "Porsche 718 Cayman — £52,900",
    time: "3 hours ago",
    read: true,
  },
  {
    id: 5,
    type: "campaign",
    icon: "🎯",
    message: "Campaign scan complete — 3 new results",
    car: "Dream Sports Car Hunt campaign",
    time: "5 hours ago",
    read: true,
  },
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(DEMO_ALERTS);

  const markRead = (id: number) =>
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );

  const markAllRead = () =>
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Alerts</h1>
          <p className="text-zinc-400 mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread alert${unreadCount !== 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-zinc-300 hover:bg-white/10 transition"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <button
            key={alert.id}
            onClick={() => markRead(alert.id)}
            className={`w-full text-left backdrop-blur-xl border rounded-2xl p-5 transition ${
              alert.read
                ? "bg-white/5 border-white/10 hover:border-white/20"
                : "bg-amber-500/5 border-amber-500/20 hover:border-amber-500/30"
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Unread dot */}
              <div className="pt-1.5">
                {!alert.read ? (
                  <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse" />
                ) : (
                  <div className="w-2.5 h-2.5 bg-zinc-700 rounded-full" />
                )}
              </div>

              {/* Icon */}
              <span className="text-2xl">{alert.icon}</span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    alert.read ? "text-zinc-300" : "text-white"
                  }`}
                >
                  {alert.message}
                </p>
                <p className="text-sm text-zinc-500 mt-0.5 truncate">
                  {alert.car}
                </p>
              </div>

              {/* Time */}
              <span className="text-xs text-zinc-500 whitespace-nowrap">
                {alert.time}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
