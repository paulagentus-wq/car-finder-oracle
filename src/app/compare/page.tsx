'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Car, CarFull } from '@/lib/types'

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

function CompareCell({ val, best, isNumber, lowerBetter }: {
  val: number | string
  best?: number
  isNumber?: boolean
  lowerBetter?: boolean
}) {
  if (!isNumber || best === undefined) {
    return <div className="text-sm font-mono text-white">{val}</div>
  }
  const numVal = Number(val)
  const isBest = lowerBetter ? numVal <= best : numVal >= best
  return (
    <div className={`text-sm font-mono font-bold ${isBest ? 'text-cfo-green' : 'text-white'}`}>
      {val} {isBest && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded ml-1">BEST</span>}
    </div>
  )
}

export default function ComparePage() {
  const [allCars, setAllCars] = useState<Car[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [carsData, setCarsData] = useState<Record<string, CarFull>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cars')
      .then(r => r.json())
      .then(data => {
        setAllCars(data)
        setSelectedIds(data.slice(0, 3).map((c: Car) => c.id))
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    for (const id of selectedIds) {
      if (!carsData[id]) {
        fetch(`/api/cars/${id}/full`)
          .then(r => r.json())
          .then(data => setCarsData(prev => ({ ...prev, [id]: data })))
      }
    }
  }, [selectedIds])

  const selected = selectedIds.map(id => carsData[id]).filter(Boolean)

  const toggleCar = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < 3 ? [...prev, id] : prev
    )
  }

  const bestPrice = selected.length > 0 ? Math.min(...selected.map(c => c.price)) : 0
  const bestScore = selected.length > 0 ? Math.max(...selected.map(c => c.dealScore)) : 0
  const bestCost = selected.length > 0 ? Math.min(...selected.map(c => c.annualCost)) : 0
  const bestDeprec = selected.length > 0 ? Math.min(...selected.map(c => c.depreciationYear)) : 0
  const bestFaults = selected.length > 0 ? Math.min(...selected.map(c => c.faults?.length || 0)) : 0

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
                <span className="text-white">Compare Cars</span>
              </span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cfo-green to-cfo-cyan flex items-center justify-center text-white font-bold text-xs">BM</div>
        </div>
      </nav>

      <div className="pt-20 p-4 md:p-6 max-w-7xl mx-auto">
        {/* Car picker */}
        <div className="glass rounded-2xl p-4 mb-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-dark-200 mb-3">Select up to 3 cars to compare</div>
          <div className="flex flex-wrap gap-2">
            {allCars.map(car => (
              <button
                key={car.id}
                onClick={() => toggleCar(car.id)}
                className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                  selectedIds.includes(car.id)
                    ? 'bg-cfo-blue/20 text-cfo-blue border-cfo-blue/40'
                    : 'text-dark-200 border-dark-500/30 hover:border-dark-400/40 hover:text-white'
                }`}
              >
                <span>{car.emoji}</span>
                <span>{car.shortName}</span>
                {selectedIds.includes(car.id) && <span>✓</span>}
              </button>
            ))}
          </div>
        </div>

        {loading || selected.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center text-dark-300">
            {loading ? 'Loading cars...' : 'Select at least one car to compare'}
          </div>
        ) : (
          <div>
            {/* Car Headers */}
            <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: `200px repeat(${selected.length}, 1fr)` }}>
              <div/>
              {selected.map(car => (
                <div key={car.id} className="glass rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-2">{car.emoji}</div>
                  <div className="text-sm font-bold text-white">{car.shortName}</div>
                  <div className="text-xs text-dark-300">{car.year}</div>
                  <div className="text-lg font-black font-mono text-white mt-2">£{car.price.toLocaleString()}</div>
                  <div className="mt-2 inline-block text-xs font-bold px-2 py-0.5 rounded-full" style={{
                    color: scoreColor(car.dealScore),
                    background: scoreColor(car.dealScore) + '20',
                  }}>
                    {car.dealScore}/10
                  </div>
                  <div className="mt-2">
                    <Link href={`/car/${car.id}`} className="text-[10px] text-cfo-blue hover:underline">Full Analysis →</Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison rows */}
            {[
              { label: '💰 Price', key: 'price', prefix: '£', isNumber: true, lowerBetter: true, best: bestPrice },
              { label: '🎯 Deal Score', key: 'dealScore', isNumber: true, best: bestScore },
              { label: '📏 Mileage', key: 'mileage', suffix: ' mi', isNumber: true, lowerBetter: true, best: Math.min(...selected.map(c => c.mileage)) },
              { label: '💸 Annual Cost', key: 'annualCost', prefix: '£', isNumber: true, lowerBetter: true, best: bestCost },
              { label: '📉 Depreciation/yr', key: 'depreciationYear', prefix: '£', isNumber: true, lowerBetter: true, best: bestDeprec },
              { label: '⚙️ Engine', key: 'engine' },
              { label: '🏎️ Power', key: 'power' },
              { label: '⚡ 0-62mph', key: 'accel' },
              { label: '🏁 Top Speed', key: 'topSpeed' },
              { label: '🔄 Gearbox', key: 'gearbox' },
              { label: '🔑 MOT Status', key: 'motStatus' },
            ].map(row => (
              <div key={row.label} className="grid gap-4 mb-2" style={{ gridTemplateColumns: `200px repeat(${selected.length}, 1fr)` }}>
                <div className="glass-light rounded-xl p-3 flex items-center">
                  <span className="text-xs font-semibold text-dark-200">{row.label}</span>
                </div>
                {selected.map(car => {
                  const rawVal = (car as any)[row.key]
                  const displayVal = row.prefix ? `${row.prefix}${Number(rawVal).toLocaleString()}` : row.suffix ? `${Number(rawVal).toLocaleString()}${row.suffix}` : rawVal
                  const isBest = row.isNumber && row.best !== undefined && (
                    row.lowerBetter ? Number(rawVal) <= row.best : Number(rawVal) >= row.best
                  )
                  return (
                    <div key={car.id} className={`glass-light rounded-xl p-3 ${isBest ? 'border border-emerald-500/20' : ''}`}>
                      <div className={`text-sm font-mono ${isBest ? 'text-cfo-green font-bold' : 'text-white'}`}>
                        {displayVal}
                        {isBest && <span className="ml-1 text-[9px] bg-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded">BEST</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}

            {/* Faults comparison */}
            <div className="grid gap-4 mt-6" style={{ gridTemplateColumns: `200px repeat(${selected.length}, 1fr)` }}>
              <div className="glass-light rounded-xl p-3 flex items-center">
                <span className="text-xs font-semibold text-dark-200">⚠️ Known Faults</span>
              </div>
              {selected.map(car => {
                const total = car.faults?.length || 0
                const critical = car.faults?.filter(f => f.severity === 'critical').length || 0
                const isBest = total <= bestFaults
                return (
                  <div key={car.id} className={`glass-light rounded-xl p-3 ${isBest ? 'border border-emerald-500/20' : ''}`}>
                    <div className={`text-sm font-mono font-bold ${isBest ? 'text-cfo-green' : 'text-white'}`}>
                      {total} total {isBest && <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded ml-1">BEST</span>}
                    </div>
                    {critical > 0 && <div className="text-[10px] text-cfo-red">{critical} critical</div>}
                  </div>
                )
              })}
            </div>

            {/* Verdict comparison */}
            <div className="grid gap-4 mt-6 mb-4" style={{ gridTemplateColumns: `repeat(${selected.length}, 1fr)` }}>
              {selected.map(car => (
                <div key={car.id} className="glass rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded bg-gradient-to-br from-cfo-purple to-cfo-blue flex items-center justify-center text-white text-[9px] font-bold">AI</div>
                    <span className="text-xs font-semibold text-dark-200">{car.shortName} Verdict</span>
                  </div>
                  <p className="text-xs text-dark-100 leading-relaxed">{car.verdict}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
