"use client";

import { useState } from "react";
import Link from "next/link";
import cars from "@/data/cars.json";
import faults from "@/data/faults.json";
import specs from "@/data/specs.json";
import costs from "@/data/costs.json";

type Car = (typeof cars)[number];

function faultCount(carId: string) {
  return faults.filter((f) => f.carId === carId).length;
}

function annualCost(carId: string) {
  return costs
    .filter((c) => c.carId === carId)
    .reduce((sum, c) => sum + c.value, 0);
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

function highlightLower(a: number, b: number) {
  if (a < b) return { aClass: "text-emerald-400 font-bold", bClass: "text-white" };
  if (b < a) return { aClass: "text-white", bClass: "text-emerald-400 font-bold" };
  return { aClass: "text-white", bClass: "text-white" };
}

function highlightHigher(a: number, b: number) {
  if (a > b) return { aClass: "text-emerald-400 font-bold", bClass: "text-white" };
  if (b > a) return { aClass: "text-white", bClass: "text-emerald-400 font-bold" };
  return { aClass: "text-white", bClass: "text-white" };
}

export default function ComparePage() {
  const [car1Id, setCar1Id] = useState("m4");
  const [car2Id, setCar2Id] = useState("911");

  const car1 = cars.find((c) => c.id === car1Id)!;
  const car2 = cars.find((c) => c.id === car2Id)!;

  const car1Faults = faultCount(car1Id);
  const car2Faults = faultCount(car2Id);
  const car1Cost = annualCost(car1Id);
  const car2Cost = annualCost(car2Id);

  const higherScoreCar = car1.dealScore >= car2.dealScore ? car1 : car2;
  const cheaperCar = car1.price <= car2.price ? car1 : car2;
  const priceDiff = Math.abs(car1.price - car2.price);

  const rows: {
    label: string;
    val1: string | React.ReactNode;
    val2: string | React.ReactNode;
  }[] = [
    {
      label: "Price",
      val1: (() => {
        const h = highlightLower(car1.price, car2.price);
        return <span className={`font-mono ${h.aClass}`}>£{car1.price.toLocaleString()}</span>;
      })(),
      val2: (() => {
        const h = highlightLower(car1.price, car2.price);
        return <span className={`font-mono ${h.bClass}`}>£{car2.price.toLocaleString()}</span>;
      })(),
    },
    {
      label: "Year",
      val1: <span className="text-white">{car1.year}</span>,
      val2: <span className="text-white">{car2.year}</span>,
    },
    {
      label: "Mileage",
      val1: (() => {
        const h = highlightLower(car1.mileage, car2.mileage);
        return <span className={`font-mono ${h.aClass}`}>{car1.mileage.toLocaleString()}mi</span>;
      })(),
      val2: (() => {
        const h = highlightLower(car1.mileage, car2.mileage);
        return <span className={`font-mono ${h.bClass}`}>{car2.mileage.toLocaleString()}mi</span>;
      })(),
    },
    {
      label: "Engine",
      val1: <span className="text-white">{car1.engine}</span>,
      val2: <span className="text-white">{car2.engine}</span>,
    },
    {
      label: "Power",
      val1: <span className="text-white">{car1.power}</span>,
      val2: <span className="text-white">{car2.power}</span>,
    },
    {
      label: "Deal Score",
      val1: (() => {
        const h = highlightHigher(car1.dealScore, car2.dealScore);
        return <span className={`font-mono ${h.aClass}`}>{car1.dealScore}</span>;
      })(),
      val2: (() => {
        const h = highlightHigher(car1.dealScore, car2.dealScore);
        return <span className={`font-mono ${h.bClass}`}>{car2.dealScore}</span>;
      })(),
    },
    {
      label: "Annual Cost",
      val1: (() => {
        const h = highlightLower(car1Cost, car2Cost);
        return <span className={`font-mono ${h.aClass}`}>£{car1Cost.toLocaleString()}</span>;
      })(),
      val2: (() => {
        const h = highlightLower(car1Cost, car2Cost);
        return <span className={`font-mono ${h.bClass}`}>£{car2Cost.toLocaleString()}</span>;
      })(),
    },
    {
      label: "MOT Status",
      val1: motBadge(car1.motStatus),
      val2: motBadge(car2.motStatus),
    },
    {
      label: "Known Faults",
      val1: (() => {
        const h = highlightLower(car1Faults, car2Faults);
        return <span className={`font-mono ${h.aClass}`}>{car1Faults}</span>;
      })(),
      val2: (() => {
        const h = highlightLower(car1Faults, car2Faults);
        return <span className={`font-mono ${h.bClass}`}>{car2Faults}</span>;
      })(),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Compare Cars</h1>
        <p className="text-zinc-400 mt-1">
          Select two cars to compare side-by-side.
        </p>
      </div>

      {/* Selection Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
            Select Car 1
          </label>
          <select
            value={car1Id}
            onChange={(e) => setCar1Id(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500/50 transition appearance-none"
          >
            {cars.map((c) => (
              <option key={c.id} value={c.id} className="bg-zinc-900 text-white">
                {c.shortName} — £{c.price.toLocaleString()}
              </option>
            ))}
          </select>
        </div>
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
            Select Car 2
          </label>
          <select
            value={car2Id}
            onChange={(e) => setCar2Id(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500/50 transition appearance-none"
          >
            {cars.map((c) => (
              <option key={c.id} value={c.id} className="bg-zinc-900 text-white">
                {c.shortName} — £{c.price.toLocaleString()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-3 border-b border-white/10 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Metric
          </div>
          <div className="text-center">
            <span className="text-sm font-semibold text-white">{car1.emoji} {car1.shortName}</span>
          </div>
          <div className="text-center">
            <span className="text-sm font-semibold text-white">{car2.emoji} {car2.shortName}</span>
          </div>
        </div>

        {/* Rows */}
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`grid grid-cols-3 p-4 ${
              i % 2 === 0 ? "bg-white/[0.02]" : ""
            } border-b border-white/5`}
          >
            <div className="text-sm font-medium text-zinc-400">{row.label}</div>
            <div className="text-center text-sm">{row.val1}</div>
            <div className="text-center text-sm">{row.val2}</div>
          </div>
        ))}
      </div>

      {/* Verdict */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-3">
          Verdict
        </h3>
        <p className="text-sm text-zinc-300 leading-relaxed">
          The <span className="text-amber-500 font-semibold">{higherScoreCar.shortName}</span> scores
          higher overall with a deal score of {higherScoreCar.dealScore}/10. The{" "}
          <span className="text-amber-500 font-semibold">{cheaperCar.shortName}</span> offers better
          value at £{priceDiff.toLocaleString()} less.
        </p>
      </div>

      {/* Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href={`/car/${car1.id}`}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:border-amber-500/30 hover:bg-amber-500/5 transition group"
        >
          <span className="text-sm text-zinc-300 group-hover:text-amber-500 transition">
            View {car1.shortName} Report →
          </span>
        </Link>
        <Link
          href={`/car/${car2.id}`}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:border-amber-500/30 hover:bg-amber-500/5 transition group"
        >
          <span className="text-sm text-zinc-300 group-hover:text-amber-500 transition">
            View {car2.shortName} Report →
          </span>
        </Link>
      </div>
    </div>
  );
}
