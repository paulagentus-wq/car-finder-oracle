"use client";

const REQUESTS = [
  {
    id: 1,
    title: "BMW M340i Negotiation",
    car: "BMW M340i xDrive — £41,200",
    status: "In Progress",
    currentStep: 2,
    steps: [
      { label: "Listing Verified", done: true },
      { label: "Dealer Contacted", done: true },
      { label: "Price Negotiation", done: false },
      { label: "Inspection Arranged", done: false },
      { label: "Deal Closed", done: false },
    ],
  },
  {
    id: 2,
    title: "Audi RS3 Pre-Purchase Inspection",
    car: "Audi RS3 Sportback — £48,750",
    status: "In Progress",
    currentStep: 1,
    steps: [
      { label: "Request Submitted", done: true },
      { label: "Inspector Assigned", done: false },
      { label: "Inspection Complete", done: false },
      { label: "Report Delivered", done: false },
    ],
  },
];

const COMPLETED = [
  {
    id: 3,
    title: "Golf R Finance Quote",
    car: "VW Golf R — £38,500",
    result: "Best rate: 6.9% APR via BlackHorse. Saved £1,200 vs dealer finance.",
  },
];

export default function ConciergePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">AI Concierge</h1>
        <p className="text-zinc-400 mt-1">
          Your personal car-buying assistant is working on{" "}
          <span className="text-amber-500 font-medium">
            {REQUESTS.length} active request{REQUESTS.length !== 1 ? "s" : ""}
          </span>
          .
        </p>
      </div>

      {/* Active Requests */}
      <div className="space-y-4">
        {REQUESTS.map((req) => (
          <div
            key={req.id}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-semibold text-white">
                    {req.title}
                  </h3>
                  <span className="px-3 py-0.5 text-xs font-medium rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {req.status}
                  </span>
                </div>
                <p className="text-sm text-zinc-500">{req.car}</p>
              </div>
              <span className="text-3xl">🤵</span>
            </div>

            {/* Progress Steps */}
            <div className="relative">
              <div className="flex items-center justify-between">
                {req.steps.map((step, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center relative z-10"
                    style={{ width: `${100 / req.steps.length}%` }}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition ${
                        step.done
                          ? "bg-amber-500 border-amber-500 text-black"
                          : i === req.currentStep
                          ? "bg-amber-500/20 border-amber-500 text-amber-500 animate-pulse"
                          : "bg-white/5 border-white/20 text-zinc-500"
                      }`}
                    >
                      {step.done ? "✓" : i + 1}
                    </div>
                    <p
                      className={`text-xs mt-2 text-center ${
                        step.done
                          ? "text-amber-500"
                          : i === req.currentStep
                          ? "text-zinc-300"
                          : "text-zinc-600"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
              {/* Progress line */}
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-white/10 -z-0 mx-[8%]">
                <div
                  className="h-full bg-amber-500 transition-all duration-500"
                  style={{
                    width: `${(req.currentStep / (req.steps.length - 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Completed */}
      {COMPLETED.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            Completed Requests
          </h2>
          <div className="space-y-3">
            {COMPLETED.map((item) => (
              <div
                key={item.id}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-green-400">✓</span>
                  <h3 className="text-sm font-medium text-white">
                    {item.title}
                  </h3>
                  <span className="text-xs text-zinc-500">{item.car}</span>
                </div>
                <p className="text-sm text-zinc-400 ml-7">{item.result}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Request */}
      <div className="backdrop-blur-xl bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 text-center">
        <span className="text-4xl block mb-3">🤵</span>
        <h3 className="text-lg font-semibold text-white mb-2">
          Need help with a car purchase?
        </h3>
        <p className="text-zinc-400 text-sm mb-4">
          Your AI concierge can negotiate prices, arrange inspections, compare
          finance, and more.
        </p>
        <button className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition">
          Start New Request
        </button>
      </div>
    </div>
  );
}
