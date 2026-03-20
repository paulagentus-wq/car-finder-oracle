'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  ArcElement, Tooltip, Legend, Filler
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'
import { CarFull, Fault, MotHistory, PriceHistory, MileageHistory, Extra, Spec, Cost, Community, ServiceSchedule } from '@/lib/types'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler)

const TABS = [
  { id: 'overview', label: '📊 Overview' },
  { id: 'history', label: '📈 History' },
  { id: 'faults', label: '⚠️ Known Faults' },
  { id: 'spec', label: '📋 Spec & Extras' },
  { id: 'costs', label: '💰 Running Costs' },
  { id: 'community', label: '🏁 Community' },
  { id: 'service', label: '🔩 Service' },
]

function scoreColor(s: number) {
  if (s >= 8) return '#10b981'
  if (s >= 7) return '#3b82f6'
  if (s >= 6) return '#f59e0b'
  return '#ef4444'
}

function scoreBadge(s: number) {
  if (s >= 8.5) return 'EXCELLENT'
  if (s >= 7.5) return 'GOOD DEAL'
  if (s >= 6.5) return 'FAIR'
  return 'CAUTION'
}

function DealGauge({ score }: { score: number }) {
  const circumference = 326.7
  const offset = circumference - (circumference * score / 10)
  return (
    <div className="relative w-36 h-36">
      <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(51,65,85,.3)" strokeWidth="8"/>
        <circle cx="60" cy="60" r="52" fill="none"
          stroke={scoreColor(score)} strokeWidth="8" strokeLinecap="round"
          className="gauge-ring"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black text-white">{score}</span>
        <span className="text-xs text-dark-300">/10</span>
      </div>
    </div>
  )
}

function OverviewTab({ car }: { car: CarFull }) {
  return (
    <div className="fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-dark-200 mb-4">CFO Deal Score</div>
          <DealGauge score={car.dealScore} />
          <div className="mt-4 text-sm font-semibold" style={{ color: scoreColor(car.dealScore) }}>
            {scoreBadge(car.dealScore)}
          </div>
        </div>
        <div className="glass rounded-2xl p-6 md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cfo-purple to-cfo-blue flex items-center justify-center text-white text-xs font-bold">AI</div>
            <span className="text-xs font-semibold uppercase tracking-wider text-dark-200">Deal Verdict</span>
          </div>
          <p className="text-sm text-dark-100 leading-relaxed">{car.verdict}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {[
              { val: car.accel, label: '0-62 mph' },
              { val: car.topSpeed, label: 'Top Speed' },
              { val: car.power, label: 'Power' },
              { val: `£${car.annualCost.toLocaleString()}`, label: 'Annual Cost' },
            ].map(s => (
              <div key={s.label} className="glass-light rounded-xl p-3 text-center">
                <div className="text-lg font-bold font-mono text-white">{s.val}</div>
                <div className="text-[10px] text-dark-300 uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function HistoryTab({ car }: { car: CarFull }) {
  const priceLabels = car.priceHistory.map(p => p.date)
  const priceData = car.priceHistory.map(p => p.price)
  const mileLabels = car.mileageHistory.map(m => m.date)
  const mileData = car.mileageHistory.map(m => m.mileage)

  const chartOptions = (yCallback: (v: number | string) => string) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(51,65,85,.2)' } },
      y: { ticks: { color: '#64748b', font: { size: 10 }, callback: yCallback }, grid: { color: 'rgba(51,65,85,.2)' } }
    }
  })

  return (
    <div className="fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-dark-200 mb-4">📉 Market Price History</div>
          <div className="h-56">
            <Line
              data={{
                labels: priceLabels,
                datasets: [{
                  data: priceData,
                  borderColor: '#3b82f6',
                  backgroundColor: 'rgba(59,130,246,0.15)',
                  fill: true,
                  tension: 0.4,
                  pointRadius: 4,
                  pointBackgroundColor: '#3b82f6',
                }]
              }}
              options={chartOptions((v) => '£' + Number(v).toLocaleString()) as any}
            />
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-dark-200 mb-4">📏 Mileage Timeline</div>
          <div className="h-56">
            <Line
              data={{
                labels: mileLabels,
                datasets: [{
                  data: mileData,
                  borderColor: '#10b981',
                  backgroundColor: 'rgba(16,185,129,0.15)',
                  fill: true,
                  tension: 0.4,
                  pointRadius: 4,
                  pointBackgroundColor: '#10b981',
                }]
              }}
              options={chartOptions((v) => Number(v).toLocaleString() + ' mi') as any}
            />
          </div>
        </div>
      </div>
      <div className="glass rounded-2xl p-6 mt-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-dark-200 mb-4">🔧 MOT History</div>
        <div className="space-y-3">
          {car.motHistory.map((mot, i) => (
            <div key={i} className={`glass-light rounded-xl p-4 ${mot.notes?.toLowerCase().includes('advisory') ? 'mot-advisory' : mot.result === 'FAIL' ? 'mot-fail' : 'mot-pass'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-white">{mot.date}</span>
                  <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${mot.result === 'PASS' && !mot.notes?.toLowerCase().includes('advisory') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {mot.result}
                  </span>
                </div>
                {mot.mileage && <span className="text-xs font-mono text-dark-200">{mot.mileage.toLocaleString()} mi</span>}
              </div>
              {mot.notes && <div className="text-xs text-dark-200 mt-1">{mot.notes}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FaultsTab({ car }: { car: CarFull }) {
  const counts = {
    critical: car.faults.filter(f => f.severity === 'critical').length,
    high: car.faults.filter(f => f.severity === 'high').length,
    medium: car.faults.filter(f => f.severity === 'medium').length,
    low: car.faults.filter(f => f.severity === 'low').length,
  }
  return (
    <div className="fade-in">
      <div className="glass rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-dark-200">⚠️ Known Faults & Issues</div>
          <div className="flex flex-wrap gap-2">
            {counts.critical > 0 && <span className="text-[10px] severity-critical px-2 py-0.5 rounded-full font-bold">{counts.critical} Critical</span>}
            {counts.high > 0 && <span className="text-[10px] severity-high px-2 py-0.5 rounded-full font-bold">{counts.high} High</span>}
            {counts.medium > 0 && <span className="text-[10px] severity-medium px-2 py-0.5 rounded-full font-bold">{counts.medium} Medium</span>}
            {counts.low > 0 && <span className="text-[10px] severity-low px-2 py-0.5 rounded-full font-bold">{counts.low} Low</span>}
          </div>
        </div>
        <div className="space-y-2">
          {car.faults.map((fault, i) => (
            <div key={i} className="glass-light rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 severity-${fault.severity}`}>
                  {fault.severity}
                </span>
                <div>
                  <div className="text-sm font-semibold text-white">{fault.name}</div>
                  <div className="text-xs text-dark-200 mt-0.5">{fault.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SpecTab({ car }: { car: CarFull }) {
  return (
    <div className="fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-dark-200 mb-4">📋 Full Specification</div>
          <div className="space-y-1">
            {car.specs.map((s, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-dark-500/20">
                <span className="text-xs text-dark-300">{s.label}</span>
                <span className="text-xs font-mono font-medium text-white">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-dark-200 mb-4">✨ Optional Extras</div>
          <div className="space-y-2">
            {car.extras.map((ex, i) => (
              <div key={i} className={`rounded-xl px-4 py-3 flex items-center justify-between ${ex.fitted ? 'extra-fitted' : 'extra-not'}`}>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{ex.fitted ? '✅' : '➖'}</span>
                  <span className={`text-xs font-medium ${ex.fitted ? 'text-emerald-300' : 'text-dark-300'}`}>{ex.name}</span>
                </div>
                <span className={`text-xs font-mono ${ex.fitted ? 'text-emerald-400' : 'text-dark-400'}`}>£{ex.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CostsTab({ car }: { car: CarFull }) {
  return (
    <div className="fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-dark-200 mb-4">💰 Annual Running Costs</div>
          <div className="h-64">
            <Doughnut
              data={{
                labels: car.costs.map(c => c.label),
                datasets: [{
                  data: car.costs.map(c => c.value),
                  backgroundColor: car.costs.map(c => c.color),
                  borderWidth: 0,
                  hoverOffset: 8,
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      color: '#94a3b8',
                      font: { size: 11 },
                      padding: 12,
                      usePointStyle: true,
                      pointStyleWidth: 8,
                    }
                  }
                }
              }}
            />
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-dark-200 mb-4">Breakdown</div>
          <div className="space-y-3">
            {car.costs.map((c, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-dark-200">{c.label}</span>
                  <span className="text-xs font-mono font-semibold text-white">£{c.value.toLocaleString()}</span>
                </div>
                <div className="w-full bg-dark-600/30 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full transition-all" style={{ width: `${(c.value / car.annualCost * 100)}%`, background: c.color }}/>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-dark-500/20 flex justify-between">
            <span className="text-sm font-semibold text-white">Total Annual Cost</span>
            <span className="text-lg font-black font-mono text-white">£{car.annualCost.toLocaleString()}</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-xs text-dark-300">Monthly Equivalent</span>
            <span className="text-sm font-bold font-mono text-cfo-cyan">£{Math.round(car.annualCost / 12).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CommunityTab({ car }: { car: CarFull }) {
  return (
    <div className="fade-in">
      <div className="glass rounded-2xl p-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-dark-200 mb-4">🏁 Owner Communities & Forums</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {car.communities.map((c, i) => (
            <a key={i} href={c.url === '#' ? undefined : c.url} target={c.url !== '#' ? '_blank' : undefined} rel="noopener noreferrer"
              className="glass-light rounded-xl p-4 hover:border-cfo-blue/30 transition-all cursor-pointer block">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-white">{c.name}</div>
                  <div className="text-[10px] text-dark-300">{c.type}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

function ServiceTab({ car }: { car: CarFull }) {
  return (
    <div className="fade-in">
      <div className="glass rounded-2xl p-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-dark-200 mb-4">🔩 Service Schedule</div>
        <div className="space-y-2">
          {car.serviceSchedule.map((svc, i) => (
            <div key={i} className="glass-light rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white">{svc.item}</div>
                <div className="text-xs text-dark-300">Every {svc.interval}</div>
              </div>
              <div className="text-right">
                <div className={`text-xs font-mono font-semibold ${svc.urgent ? 'text-cfo-red' : 'text-cfo-green'}`}>{svc.nextDue}</div>
                <div className={`text-[10px] ${svc.urgent ? 'text-red-400' : 'text-dark-300'}`}>{svc.urgent ? '⚠️ DUE SOON' : '✅ OK'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CarDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [car, setCar] = useState<CarFull | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`/api/cars/${id}/full`)
      .then(r => r.json())
      .then(data => {
        setCar(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3 pulse-glow">🔍</div>
          <div className="text-sm text-dark-200">Loading car data...</div>
        </div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">❌</div>
          <div className="text-sm text-dark-200">Car not found</div>
          <Link href="/" className="mt-4 inline-block text-xs text-cfo-blue hover:underline">← Back to dashboard</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-dark-500/30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-9 h-9 rounded-lg bg-gradient-to-br from-cfo-blue to-cfo-purple flex items-center justify-center font-bold text-white text-sm">CFO</Link>
            <div>
              <div className="flex items-center gap-2">
                <Link href="/" className="font-bold text-lg text-white tracking-tight hover:text-cfo-blue transition-colors">Car Finder Oracle</Link>
                <span className="text-[10px] font-bold bg-gradient-to-r from-cfo-blue to-cfo-purple text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Pro</span>
              </div>
              <span className="text-[11px] text-dark-200 tracking-wide flex items-center gap-1">
                <Link href="/" className="hover:text-white transition-colors">Dashboard</Link>
                <span>›</span>
                <span className="text-white">{car.shortName}</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/compare" className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-dark-200 hover:text-white bg-dark-600/40 hover:bg-dark-600/70 px-3 py-1.5 rounded-lg transition-all border border-dark-500/30">
              ⚖️ Compare
            </Link>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cfo-green to-cfo-cyan flex items-center justify-center text-white font-bold text-xs">BM</div>
          </div>
        </div>
      </nav>

      <div className="pt-16 min-h-screen">
        <div className="flex">
          {/* MAIN */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6" style={{ maxHeight: 'calc(100vh - 64px)' }}>
            <div className="fade-in max-w-6xl mx-auto">
              {/* Car Header */}
              <div className="glass rounded-2xl p-6 mb-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{car.emoji}</span>
                      <div>
                        <h1 className="text-2xl font-bold text-white">{car.name}</h1>
                        <p className="text-sm text-dark-200">{car.year} • {car.color} • {car.mileage.toLocaleString()} miles</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {[car.engine, car.power, car.gearbox, car.accel].map(tag => (
                        <span key={tag} className="text-xs font-mono bg-dark-600/50 px-2.5 py-1 rounded-lg text-dark-100">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-3xl font-black text-white font-mono">£{car.price.toLocaleString()}</div>
                    <div className="text-xs text-dark-300 mt-1">VIN: <span className="font-mono text-dark-200">{car.vin}</span></div>
                    <div className="mt-2 flex gap-2 justify-end">
                      <div className={`text-xs font-bold px-3 py-1 rounded-full border`} style={{
                        color: scoreColor(car.dealScore),
                        background: scoreColor(car.dealScore) + '20',
                        borderColor: scoreColor(car.dealScore) + '40',
                      }}>
                        {car.dealScore}/10 — {scoreBadge(car.dealScore)}
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${car.motStatus === 'Clean' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        MOT: {car.motStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mb-4 overflow-x-auto pb-2">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`text-xs font-medium px-4 py-2 rounded-lg border border-transparent whitespace-nowrap transition-all ${activeTab === tab.id ? 'tab-active' : 'text-dark-200 hover:text-white hover:bg-dark-600/30'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && <OverviewTab car={car} />}
              {activeTab === 'history' && <HistoryTab car={car} />}
              {activeTab === 'faults' && <FaultsTab car={car} />}
              {activeTab === 'spec' && <SpecTab car={car} />}
              {activeTab === 'costs' && <CostsTab car={car} />}
              {activeTab === 'community' && <CommunityTab car={car} />}
              {activeTab === 'service' && <ServiceTab car={car} />}
            </div>
          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="w-64 min-w-[256px] border-l border-dark-500/20 p-4 hidden xl:block overflow-y-auto" style={{ maxHeight: 'calc(100vh - 64px)' }}>
            <div className="text-xs font-semibold uppercase tracking-wider text-dark-200 mb-4">Quick Stats</div>
            <div className="space-y-3">
              <div className="glass-light rounded-xl p-3">
                <div className="text-[10px] text-dark-300 uppercase mb-1">Price vs Market</div>
                <div className={`text-lg font-bold font-mono ${car.priceVsMarket < 0 ? 'text-cfo-green' : 'text-cfo-red'}`}>
                  {car.priceVsMarket < 0 ? '' : '+'}{car.priceVsMarket}%
                </div>
              </div>
              <div className="glass-light rounded-xl p-3">
                <div className="text-[10px] text-dark-300 uppercase mb-1">Avg Miles/Year</div>
                <div className="text-lg font-bold font-mono text-white">
                  {Math.round(car.mileage / (new Date().getFullYear() - car.year + 1)).toLocaleString()}
                </div>
              </div>
              <div className="glass-light rounded-xl p-3">
                <div className="text-[10px] text-dark-300 uppercase mb-1">MOT Status</div>
                <div className={`text-sm font-bold ${car.motStatus === 'Clean' ? 'text-cfo-green' : 'text-cfo-amber'}`}>{car.motStatus}</div>
              </div>
              <div className="glass-light rounded-xl p-3">
                <div className="text-[10px] text-dark-300 uppercase mb-1">Known Faults</div>
                <div className="text-lg font-bold font-mono text-white">{car.faults.length}</div>
                <div className="text-[10px] text-cfo-red">{car.faults.filter(f => f.severity === 'critical').length} critical</div>
              </div>
              <div className="glass-light rounded-xl p-3">
                <div className="text-[10px] text-dark-300 uppercase mb-1">Depreciation (1yr)</div>
                <div className="text-lg font-bold font-mono text-cfo-amber">-£{car.depreciationYear.toLocaleString()}</div>
              </div>
              <div className="glass-light rounded-xl p-3">
                <div className="text-[10px] text-dark-300 uppercase mb-1">Total 1yr Cost</div>
                <div className="text-lg font-bold font-mono text-white">£{(car.annualCost + car.depreciationYear).toLocaleString()}</div>
                <div className="text-[10px] text-dark-300">£{Math.round((car.annualCost + car.depreciationYear) / 12).toLocaleString()}/mo</div>
              </div>
              <div className="glass-light rounded-xl p-3">
                <div className="text-[10px] text-dark-300 uppercase mb-1">Service Items Due</div>
                <div className="text-lg font-bold font-mono text-cfo-red">{car.serviceSchedule.filter(s => s.urgent).length}</div>
                <div className="text-[10px] text-dark-300">{car.serviceSchedule.filter(s => !s.urgent).length} up to date</div>
              </div>
            </div>

            {/* Alerts */}
            <div className="mt-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-dark-200 mb-3">🔔 Alerts</div>
              {car.faults.filter(f => f.severity === 'critical').map((f, i) => (
                <div key={i} className="glass-light rounded-xl p-3 border-l-2 border-cfo-red mb-2">
                  <div className="text-[10px] text-cfo-red font-semibold">CRITICAL FAULT</div>
                  <div className="text-xs text-dark-100">{f.name}</div>
                </div>
              ))}
              {car.serviceSchedule.filter(s => s.urgent).slice(0, 2).map((s, i) => (
                <div key={i} className="glass-light rounded-xl p-3 border-l-2 border-cfo-amber mb-2">
                  <div className="text-[10px] text-cfo-amber font-semibold">SERVICE DUE</div>
                  <div className="text-xs text-dark-100">{s.item}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
