'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'

/* ── Animation helpers ────────────────────────────────── */
function FadeInSection({ children, className = '', delay = 0 }: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ── Data ─────────────────────────────────────────────── */
const TICKER_ITEMS = [
  'BMW M4 Competition scored 7.8/10',
  'Porsche 911 Carrera — 3 MOT advisories flagged',
  'Audi RS3 — DSG whine risk detected',
  'Mercedes C63 AMG — Price dropped 4.2% below market',
  'Golf R — Clean MOT, low mileage gem',
  'Range Rover Sport — Air suspension warning',
  'Tesla Model 3 — Battery health 94%',
  'Ford Focus RS — Head gasket risk flagged',
]

const FEATURES = [
  {
    icon: '🎯',
    title: 'AI Deal Scoring',
    desc: 'Every car gets a 0-10 score based on price, condition, history, and market data. Know instantly if it\'s a good deal.',
  },
  {
    icon: '🔍',
    title: 'Fault Intelligence',
    desc: 'Known issues, common failures, and model-specific problems — flagged before you buy, not after.',
  },
  {
    icon: '📊',
    title: 'Price Tracking',
    desc: 'Historical price charts, depreciation curves, and market position. See exactly where a car sits vs the market.',
  },
  {
    icon: '🤖',
    title: 'Car Whisperer',
    desc: 'Search in plain English. "Fast saloon under £30k with low miles" — and get matched results instantly.',
  },
  {
    icon: '📈',
    title: 'Price Predictor',
    desc: 'AI-powered future value estimation. Know what a car will be worth in 1, 2, or 3 years before you commit.',
  },
  {
    icon: '🏆',
    title: 'Negotiation Coach',
    desc: 'Leverage points, price weaknesses, and haggling scripts tailored to each specific car listing.',
  },
]

const PREVIEW_CARS = [
  {
    name: 'BMW M4 Competition',
    year: 2022,
    price: '£52,995',
    score: 7.8,
    stat: '503bhp · 23k miles',
    gradient: 'from-blue-600 to-cyan-500',
    badge: 'GOOD DEAL',
  },
  {
    name: 'Porsche 911 Carrera S',
    year: 2021,
    price: '£89,950',
    score: 8.4,
    stat: '443bhp · 11k miles',
    gradient: 'from-amber-500 to-orange-600',
    badge: 'EXCELLENT',
  },
  {
    name: 'Audi RS3 Sportback',
    year: 2023,
    price: '£48,750',
    score: 6.9,
    stat: '395bhp · 8k miles',
    gradient: 'from-purple-600 to-pink-500',
    badge: 'FAIR',
  },
]

const PRICING_TIERS = [
  {
    name: 'Free',
    price: '£0',
    period: 'forever',
    desc: 'Get started with basic car intelligence.',
    features: [
      '3 car searches per day',
      'Basic deal score',
      'Public MOT data',
      'Community access',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Finder',
    price: '£14.99',
    period: '/mo',
    desc: 'For serious car buyers doing research.',
    features: [
      'Unlimited searches',
      'Full deal scoring (0-10)',
      'Fault intelligence reports',
      'Price history charts',
      'Email alerts for price drops',
      '10 car watchlist',
    ],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '£29.99',
    period: '/mo',
    desc: 'Full intelligence suite for enthusiasts and traders.',
    features: [
      'Everything in Finder',
      'Car Whisperer AI search',
      'Price Predictor (1-3yr)',
      'Negotiation Coach',
      'Depreciation forecasts',
      'Unlimited watchlist',
      'API access',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Concierge',
    price: '£49.99',
    period: '/mo',
    desc: 'White-glove service. We find it for you.',
    features: [
      'Everything in Pro',
      'Personal car-finding agent',
      'Pre-purchase inspection booking',
      'Dealer negotiation on your behalf',
      'Finance comparison tool',
      'Dedicated account manager',
      'Same-day response SLA',
      'Custom market reports',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

/* ── Score Color Util ─────────────────────────────────── */
function scoreColor(s: number) {
  if (s >= 8) return 'text-emerald-400'
  if (s >= 7) return 'text-amber-400'
  return 'text-orange-400'
}

function scoreBg(s: number) {
  if (s >= 8) return 'bg-emerald-500/20 border-emerald-500/30'
  if (s >= 7) return 'bg-amber-500/20 border-amber-500/30'
  return 'bg-orange-500/20 border-orange-500/30'
}

/* ══════════════════════════════════════════════════════════
   LANDING PAGE
   ══════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [email, setEmail] = useState('')

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-white/[0.06]">
        <div className="section-container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-2xl">🏎️</span>
            <span className="text-lg font-bold tracking-tight">
              Car Finder <span className="gradient-text-brand">Oracle</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-white/60 hover:text-white transition-colors">Pricing</a>
            <Link href="/car/m4-comp" className="text-sm text-white/60 hover:text-white transition-colors">Search</Link>
          </div>

          <div className="flex items-center gap-3">
            <button className="btn-ghost text-sm px-4 py-2">Log In</button>
            <button className="btn-brand text-sm px-4 py-2">Sign Up Free</button>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32">
        {/* Background glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] gradient-radial-amber pointer-events-none" />

        <div className="section-container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-2 mb-8 text-sm text-white/70">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              AI-Powered Car Intelligence Platform
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Find Your
            <br />
            <span className="gradient-text-brand">Perfect Car.</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            AI-powered car intelligence. Deal scoring. Fault prediction.
            Price tracking. Everything you need to buy smarter.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button className="btn-brand text-base px-8 py-4 animate-pulse-glow">
              Start Free
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button className="btn-ghost text-base px-8 py-4">
              Watch Demo
            </button>
          </motion.div>

          <motion.p
            className="text-xs text-white/30 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            No credit card required · Free forever plan available
          </motion.p>
        </div>
      </section>

      {/* ── Live Feed Ticker ──────────────────────────── */}
      <section className="border-y border-white/[0.06] bg-white/[0.01] py-4 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-3 mx-6 text-sm text-white/40">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60 flex-shrink-0" />
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────────── */}
      <section id="features" className="py-24 md:py-32">
        <div className="section-container">
          <FadeInSection className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Intelligence at Every <span className="gradient-text-brand">Step</span>
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Six powerful AI modules that transform how you research, evaluate, and buy cars.
            </p>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <FadeInSection key={f.title} delay={i * 0.08}>
                <div className="glass-hover p-6 h-full group">
                  <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
                  <h3 className="text-lg font-semibold mb-2 text-white">{f.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Car Preview Cards ─────────────────────────── */}
      <section className="py-24 md:py-32 relative">
        <div className="absolute inset-0 gradient-radial-amber pointer-events-none" />
        <div className="section-container relative z-10">
          <FadeInSection className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Real Intelligence, <span className="gradient-text-brand">Real Cars</span>
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              See how the Oracle analyses cars from our live database.
            </p>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PREVIEW_CARS.map((car, i) => (
              <FadeInSection key={car.name} delay={i * 0.12}>
                <div className="glass-hover overflow-hidden group">
                  {/* Image placeholder gradient */}
                  <div className={`h-48 bg-gradient-to-br ${car.gradient} opacity-80 group-hover:opacity-100 transition-opacity relative`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${scoreBg(car.score)} ${scoreColor(car.score)}`}>
                        {car.badge}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-base font-semibold text-white">{car.name}</h3>
                        <p className="text-xs text-white/40 mt-0.5">{car.year} · {car.stat}</p>
                      </div>
                      <div className={`text-2xl font-black ${scoreColor(car.score)}`}>
                        {car.score}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                      <span className="text-lg font-bold text-white">{car.price}</span>
                      <button className="text-xs font-medium text-amber-500 hover:text-amber-400 transition-colors">
                        View Analysis →
                      </button>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Section ───────────────────────────── */}
      <section id="pricing" className="py-24 md:py-32">
        <div className="section-container">
          <FadeInSection className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Simple, Transparent <span className="gradient-text-brand">Pricing</span>
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Start free. Upgrade when you need more power.
            </p>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRICING_TIERS.map((tier, i) => (
              <FadeInSection key={tier.name} delay={i * 0.08}>
                <div
                  className={`relative rounded-2xl p-6 h-full flex flex-col ${
                    tier.highlighted
                      ? 'border-2 border-amber-500/50 bg-amber-500/[0.04] shadow-lg shadow-amber-500/10'
                      : 'glass'
                  }`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-zinc-950 text-xs font-bold uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-1">{tier.name}</h3>
                    <p className="text-xs text-white/40 mb-4">{tier.desc}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-white">{tier.price}</span>
                      <span className="text-sm text-white/40">{tier.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {tier.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-white/60">
                        <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      tier.highlighted
                        ? 'btn-brand'
                        : 'btn-ghost'
                    }`}
                  >
                    {tier.cta}
                  </button>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ───────────────────────────────── */}
      <section className="py-24 md:py-32 relative">
        <div className="absolute inset-0 gradient-radial-amber pointer-events-none" />
        <div className="section-container relative z-10">
          <FadeInSection className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Ready to find your <span className="gradient-text-brand">perfect car?</span>
            </h2>
            <p className="text-white/40 text-lg mb-10">
              Join thousands of smart buyers using AI to make better car decisions.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full sm:flex-1 bg-white/[0.05] border border-white/[0.1] rounded-xl px-5 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
              <button className="btn-brand px-6 py-3.5 whitespace-nowrap w-full sm:w-auto">
                Get Started Free
              </button>
            </div>

            <p className="text-xs text-white/20 mt-4">
              Free forever plan · No spam · Unsubscribe anytime
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-8">
        <div className="section-container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-white/30">
            <span>🏎️</span>
            <span>&copy; 2026 Car Finder Oracle</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">Terms</a>
            <a href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
