'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'

/* ── Animation helper ─────────────────────────────────── */
function FadeIn({ children, className = '', delay = 0 }: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ── Pricing Data ─────────────────────────────────────── */
const TIERS = [
  {
    name: 'Free',
    price: '£0',
    period: 'forever',
    desc: 'Perfect for casual browsing and first-time buyers.',
    features: [
      '3 car searches per day',
      'Basic deal score (Good / Fair / Poor)',
      'Public MOT history lookup',
      'Community forum access',
      'Basic model fault summaries',
      'Email newsletter with market trends',
    ],
    notIncluded: [
      'Detailed 0-10 scoring',
      'Price history charts',
      'Fault intelligence reports',
      'Car Whisperer AI',
      'Price predictions',
      'Negotiation coaching',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Finder',
    price: '£14.99',
    period: '/mo',
    desc: 'For serious buyers who want to make an informed decision.',
    features: [
      'Unlimited car searches',
      'Full deal scoring (0-10 precision)',
      'Comprehensive fault intelligence',
      'Price history charts (2 years)',
      'Market position analysis',
      'Email alerts for price drops',
      'MOT deep-dive reports',
      '10 car watchlist',
      'Running cost calculator',
      'Standard email support',
    ],
    notIncluded: [
      'Car Whisperer AI search',
      'Price Predictor',
      'Negotiation Coach',
      'API access',
    ],
    cta: 'Start 14-Day Free Trial',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '£29.99',
    period: '/mo',
    desc: 'The complete toolkit for enthusiasts, traders, and professionals.',
    features: [
      'Everything in Finder, plus:',
      'Car Whisperer — natural language AI search',
      'Price Predictor — 1, 2, 3 year forecasts',
      'Negotiation Coach — leverage points & scripts',
      'Depreciation modelling & curves',
      'Unlimited watchlist',
      'Full price history (5+ years)',
      'Spec & extras valuation',
      'Dealer reputation scores',
      'API access (1,000 calls/mo)',
      'Priority email & chat support',
      'Custom alerts & notifications',
    ],
    notIncluded: [
      'Personal car-finding agent',
      'Pre-purchase inspection booking',
      'Dedicated account manager',
    ],
    cta: 'Start 14-Day Free Trial',
    highlighted: true,
  },
  {
    name: 'Concierge',
    price: '£49.99',
    period: '/mo',
    desc: 'White-glove service. We find and negotiate for you.',
    features: [
      'Everything in Pro, plus:',
      'Personal car-finding agent',
      'Pre-purchase inspection booking',
      'Dealer negotiation on your behalf',
      'Finance comparison & broker access',
      'Dedicated account manager',
      'Same-day response SLA',
      'Custom market reports on demand',
      'Private vehicle sourcing network',
      'Unlimited API access',
      'Phone support line',
      'Early access to new features',
      'Invitation to quarterly webinars',
    ],
    notIncluded: [],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

const FAQ = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes — all plans are monthly with no lock-in. Cancel from your dashboard any time and you keep access until the end of your billing period.',
  },
  {
    q: 'What happens when my free trial ends?',
    a: 'You\'ll be moved to the Free plan automatically. No charges unless you actively choose to subscribe.',
  },
  {
    q: 'Do you offer annual billing?',
    a: 'Coming soon. Annual plans will offer a 20% discount across all paid tiers.',
  },
  {
    q: 'How accurate is the AI scoring?',
    a: 'Our deal scores are based on live market data, historical pricing, MOT records, and model-specific fault databases. Accuracy improves as we gather more data — currently benchmarked at 92% alignment with expert valuations.',
  },
]

/* ══════════════════════════════════════════════════════════
   PRICING PAGE
   ══════════════════════════════════════════════════════════ */
export default function PricingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">

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
            <Link href="/#features" className="text-sm text-white/60 hover:text-white transition-colors">Features</Link>
            <Link href="/pricing" className="text-sm text-amber-500 font-medium">Pricing</Link>
            <Link href="/car/m4-comp" className="text-sm text-white/60 hover:text-white transition-colors">Search</Link>
          </div>

          <div className="flex items-center gap-3">
            <button className="btn-ghost text-sm px-4 py-2">Log In</button>
            <button className="btn-brand text-sm px-4 py-2">Sign Up Free</button>
          </div>
        </div>
      </nav>

      {/* ── Header ────────────────────────────────────── */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] gradient-radial-amber pointer-events-none" />
        <div className="section-container relative z-10 text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-black tracking-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Choose Your <span className="gradient-text-brand">Plan</span>
          </motion.h1>
          <motion.p
            className="text-lg text-white/40 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            Every plan includes our core AI engine. Upgrade for deeper intelligence, predictions, and personal service.
          </motion.p>
        </div>
      </section>

      {/* ── Pricing Grid ──────────────────────────────── */}
      <section className="pb-24 md:pb-32">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {TIERS.map((tier, i) => (
              <FadeIn key={tier.name} delay={i * 0.08}>
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

                  {/* Tier header */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
                    <p className="text-xs text-white/40 mb-5 min-h-[32px]">{tier.desc}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black text-white">{tier.price}</span>
                      <span className="text-sm text-white/40">{tier.period}</span>
                    </div>
                  </div>

                  {/* Included features */}
                  <div className="mb-4">
                    <p className="text-[10px] uppercase tracking-wider text-white/30 font-semibold mb-3">Included</p>
                    <ul className="space-y-2.5">
                      {tier.features.map(f => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-white/70">
                          <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Not included */}
                  {tier.notIncluded.length > 0 && (
                    <div className="mb-6">
                      <p className="text-[10px] uppercase tracking-wider text-white/20 font-semibold mb-3">Not included</p>
                      <ul className="space-y-2">
                        {tier.notIncluded.map(f => (
                          <li key={f} className="flex items-start gap-2.5 text-sm text-white/25">
                            <svg className="w-4 h-4 text-white/15 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="mt-auto pt-4">
                    <button
                      className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        tier.highlighted
                          ? 'btn-brand'
                          : 'btn-ghost'
                      }`}
                    >
                      {tier.cta}
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section ───────────────────────────────── */}
      <section className="pb-24 md:pb-32">
        <div className="section-container max-w-3xl">
          <FadeIn className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-3">
              Frequently Asked <span className="gradient-text-brand">Questions</span>
            </h2>
          </FadeIn>

          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="glass p-6">
                  <h3 className="text-base font-semibold text-white mb-2">{item.q}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{item.a}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────── */}
      <section className="pb-24 md:pb-32 relative">
        <div className="absolute inset-0 gradient-radial-amber pointer-events-none" />
        <div className="section-container relative z-10 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Still not sure? <span className="gradient-text-brand">Start free.</span>
            </h2>
            <p className="text-white/40 text-lg mb-8 max-w-lg mx-auto">
              No credit card needed. Explore the platform and upgrade when you&apos;re ready.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button className="btn-brand text-base px-8 py-4">
                Create Free Account
              </button>
              <Link href="/" className="btn-ghost text-base px-8 py-4">
                Back to Home
              </Link>
            </div>
          </FadeIn>
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
