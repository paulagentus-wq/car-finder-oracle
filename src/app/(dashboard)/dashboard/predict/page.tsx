"use client";

import { useState, useMemo } from "react";

const CARS = [
  { id: 1, name: "BMW M340i xDrive", currentPrice: 41200, depRate: 12.5, confidence: 87 },
  { id: 2, name: "Audi RS3 Sportback", currentPrice: 48750, depRate: 10.2, confidence: 91 },
  { id: 3, name: "Toyota GR Supra 3.0", currentPrice: 44200, depRate: 8.5, confidence: 93 },
  { id: 4, name: "Porsche 718 Cayman", currentPrice: 52900, depRate: 7.1, confidence: 89 },
  { id: 5, name: "VW Golf R", currentPrice: 38500, depRate: 14.3, confidence: 85 },
  { id: 6, name: "Mercedes-AMG C43", currentPrice: 46500, depRate: 13.8, confidence: 82 },
];

const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

export default function PredictPage() {
  const [selectedId, setSelectedId] = useState(1);

  const car = CARS.find((c) => c.id === selectedId)!;

  // Generate 12-month price prediction
  const predictions = useMemo(() => {
    const monthly = car.depRate / 12 / 100;
    return MONTHS.map((month, i) => {
      const base = car.currentPrice * (1 - monthly * (i + 1));
      const variance = car.currentPrice * 0.02;
      return {
        month,
        predicted: Math.round(base),
        low: Math.round(base - variance),
        high: Math.round(base + variance),
      };
    });
  }, [car]);

  const minPrice = Math.min(...predictions.map((p) => p.low));
  const maxPrice = Math.max(car.currentPrice, ...predictions.map((p) => p.high));
  const range = maxPrice - minPrice;

  const toY = (val: number) => ((maxPrice - val) / range) * 200;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Price Predictor</h1>
        <p className="text-zinc-400 mt-1">
          AI-powered 12-month price forecasts with confidence intervals.
        </p>
      </div>

      {/* Car Selector */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Select a Car
        </label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(Number(e.target.value))}
          className="w-full md:w-96 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition appearance-none"
        >
          {CARS.map((c) => (
            <option key={c.id} value={c.id} className="bg-zinc-900">
              {c.name} — &pound;{c.currentPrice.toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-sm text-zinc-400 mb-1">Current Price</p>
          <p className="text-2xl font-bold text-white">
            &pound;{car.currentPrice.toLocaleString()}
          </p>
        </div>
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-sm text-zinc-400 mb-1">Annual Depreciation</p>
          <p className="text-2xl font-bold text-red-400">{car.depRate}%</p>
        </div>
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-sm text-zinc-400 mb-1">Prediction Confidence</p>
          <p className="text-2xl font-bold text-amber-500">{car.confidence}%</p>
        </div>
      </div>

      {/* Chart */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">
          12-Month Price Forecast
        </h2>
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 700 260`} className="w-full min-w-[600px]" preserveAspectRatio="xMidYMid meet">
            {/* Confidence band */}
            <path
              d={
                `M ${50} ${toY(predictions[0].high) + 20} ` +
                predictions
                  .map((p, i) => `L ${50 + i * 55} ${toY(p.high) + 20}`)
                  .join(" ") +
                " " +
                [...predictions]
                  .reverse()
                  .map((p, i) => `L ${50 + (predictions.length - 1 - i) * 55} ${toY(p.low) + 20}`)
                  .join(" ") +
                " Z"
              }
              fill="rgba(245, 158, 11, 0.08)"
            />

            {/* Predicted line */}
            <polyline
              points={predictions.map((p, i) => `${50 + i * 55},${toY(p.predicted) + 20}`).join(" ")}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {predictions.map((p, i) => (
              <circle
                key={i}
                cx={50 + i * 55}
                cy={toY(p.predicted) + 20}
                r="4"
                fill="#f59e0b"
              />
            ))}

            {/* Month labels */}
            {predictions.map((p, i) => (
              <text
                key={i}
                x={50 + i * 55}
                y={245}
                textAnchor="middle"
                fill="#71717a"
                fontSize="11"
              >
                {p.month}
              </text>
            ))}

            {/* Price labels (start and end) */}
            <text x={46} y={toY(predictions[0].predicted) + 16} textAnchor="end" fill="#f59e0b" fontSize="10">
              &pound;{(predictions[0].predicted / 1000).toFixed(1)}k
            </text>
            <text
              x={50 + 11 * 55 + 8}
              y={toY(predictions[11].predicted) + 24}
              textAnchor="start"
              fill="#f59e0b"
              fontSize="10"
            >
              &pound;{(predictions[11].predicted / 1000).toFixed(1)}k
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-amber-500 rounded" />
            Predicted Price
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-amber-500/10 rounded" />
            Confidence Interval
          </div>
        </div>
      </div>

      {/* Prediction Table */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-6 py-4 text-zinc-400 font-medium">Month</th>
                <th className="text-right px-6 py-4 text-zinc-400 font-medium">Predicted</th>
                <th className="text-right px-6 py-4 text-zinc-400 font-medium">Low</th>
                <th className="text-right px-6 py-4 text-zinc-400 font-medium">High</th>
                <th className="text-right px-6 py-4 text-zinc-400 font-medium">Change</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((p, i) => {
                const change = ((p.predicted - car.currentPrice) / car.currentPrice) * 100;
                return (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-6 py-3 text-white">{p.month} 2026</td>
                    <td className="px-6 py-3 text-right text-white font-medium">
                      &pound;{p.predicted.toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-right text-zinc-500">
                      &pound;{p.low.toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-right text-zinc-500">
                      &pound;{p.high.toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-right text-red-400">
                      {change.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
