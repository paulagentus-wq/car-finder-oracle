"use client";

const RESULTS = [
  { id: 1, name: "BMW M340i xDrive", price: 41200, score: 8.7, miles: 18400, year: 2024, flags: ["Price Drop", "Low Miles"], bhp: 374 },
  { id: 2, name: "Audi RS3 Sportback", price: 48750, score: 9.1, miles: 12300, year: 2024, flags: ["Top Deal", "Low Miles"], bhp: 394 },
  { id: 3, name: "Toyota GR Supra 3.0", price: 44200, score: 8.9, miles: 8900, year: 2024, flags: ["New Listing", "Low Miles"], bhp: 382 },
  { id: 4, name: "Porsche 718 Cayman", price: 52900, score: 9.3, miles: 15600, year: 2023, flags: ["Top Deal"], bhp: 300 },
  { id: 5, name: "VW Golf R", price: 38500, score: 8.2, miles: 9200, year: 2024, flags: ["Great Value", "Low Miles"], bhp: 328 },
  { id: 6, name: "Mercedes-AMG C43", price: 46500, score: 8.4, miles: 21000, year: 2023, flags: ["Hybrid"], bhp: 402 },
  { id: 7, name: "Ford Focus ST", price: 29995, score: 7.8, miles: 14500, year: 2023, flags: ["Budget Pick"], bhp: 276 },
  { id: 8, name: "Hyundai i30 N", price: 31200, score: 8.0, miles: 11200, year: 2024, flags: ["Great Value", "Low Miles"], bhp: 276 },
];

const flagStyles: Record<string, string> = {
  "Price Drop": "bg-green-500/10 text-green-400 border-green-500/20",
  "Top Deal": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Low Miles": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "New Listing": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Great Value": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Hybrid: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  "Budget Pick": "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

function ScoreRing({ score }: { score: number }) {
  const pct = (score / 10) * 100;
  const color =
    score >= 9 ? "text-green-400" : score >= 8 ? "text-amber-400" : "text-zinc-400";
  return (
    <div className="relative w-16 h-16">
      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-white/5"
        />
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={`${pct} 100`}
          strokeLinecap="round"
          className={color}
        />
      </svg>
      <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${color}`}>
        {score}
      </span>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Results</h1>
        <p className="text-zinc-400 mt-1">
          {RESULTS.length} cars matched across all campaigns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {RESULTS.map((car) => (
          <div
            key={car.id}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-amber-500/20 transition group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white group-hover:text-amber-500 transition">
                  {car.name}
                </h3>
                <p className="text-sm text-zinc-500">
                  {car.year} &middot; {car.miles.toLocaleString()} mi &middot;{" "}
                  {car.bhp} bhp
                </p>
              </div>
              <ScoreRing score={car.score} />
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {car.flags.map((flag) => (
                <span
                  key={flag}
                  className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${
                    flagStyles[flag] || "bg-white/5 text-zinc-400 border-white/10"
                  }`}
                >
                  {flag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-white">
                &pound;{car.price.toLocaleString()}
              </p>
              <button className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-medium rounded-xl hover:bg-amber-500/20 transition">
                View Deal
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
