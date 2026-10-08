import React, { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Satellite, Play, Radar, Fingerprint, MessageSquare, BarChart3, Zap, Globe, TrendingUp, Building2, ArrowRight } from 'lucide-react'
import { useDemoStarter } from '../components/GuidedDemo'

// Animated counter hook
function useCounter(target: number, duration = 1500) {
  const [count, setCount] = React.useState(0)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)
    ref.current = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); if (ref.current) clearInterval(ref.current) }
      else setCount(Math.floor(start))
    }, 16)
    return () => { if (ref.current) clearInterval(ref.current) }
  }, [target, duration])
  return count
}

const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const stagger: any = {
  show: { transition: { staggerChildren: 0.1 } },
}

export default function LandingPage() {
  const navigate = useNavigate()
  const startDemo = useDemoStarter()

  return (
    <div className="bg-background text-on-surface">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative pt-12 md:pt-20 pb-16 md:pb-24 overflow-hidden border-b border-outline-variant/20">
        {/* Ambient glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-secondary-fixed/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-primary-fixed/25 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-[1600px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left narrative */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="lg:col-span-7 space-y-6 md:space-y-8 z-10"
          >
            {/* Live badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/50 text-primary">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-fixed opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
              </span>
              <span className="text-label-md font-semibold uppercase tracking-wider text-on-surface-variant">
                Copernicus Sentinel-2 &amp; XGBoost Engine Live
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="font-display text-display-lg-mobile md:text-display-lg text-primary font-extrabold max-w-2xl leading-[1.12] tracking-tight"
            >
              Bridging farmers and lenders with climate intelligence
            </motion.h1>

            {/* Subhead */}
            <motion.p variants={fadeUp} className="text-body-lg md:text-body-xl text-on-surface-variant max-w-2xl leading-relaxed">
              Empowering Indian agriculture with Sentinel-2 satellite data, AI-driven climate credit scoring, and multilingual agronomic advisory.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link to="/assess" className="btn-primary text-base px-7 py-3.5 rounded-xl">
                <Radar className="w-5 h-5" />
                Assess a farm
              </Link>
              <button
                onClick={startDemo}
                className="btn-secondary text-base px-6 py-3.5 rounded-xl"
                id="start-guided-demo"
              >
                <Play className="w-5 h-5" />
                Start guided demo
              </button>
            </motion.div>

            {/* Demo keyboard hint */}
            <motion.p variants={fadeUp} className="text-label-sm text-on-surface-variant/60">
              Press <kbd className="px-1.5 py-0.5 rounded bg-surface-container font-mono text-xs">D</kbd> anytime to start the guided demo
              &nbsp;·&nbsp;
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container font-mono text-xs">⌘K</kbd> for command palette
            </motion.p>

            {/* Proof metrics */}
            <motion.div variants={fadeUp} className="pt-6 grid grid-cols-3 gap-4 border-t border-outline-variant/30 max-w-xl">
              {[
                { value: '140M+', label: 'Parcels Mapped' },
                { value: '10m', label: 'Spectral Resolution' },
                { value: '9 Langs', label: 'Voice Advisory' },
              ].map(m => (
                <div key={m.label}>
                  <div className="font-display text-headline-md font-bold text-primary">{m.value}</div>
                  <div className="text-label-sm text-on-surface-variant">{m.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: stylized satellite farm visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative flex justify-center"
          >
            <div className="relative w-full max-w-[520px] aspect-square rounded-3xl p-4 bg-surface-container-low border border-outline-variant/40 shadow-xl overflow-hidden">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-primary-container border border-outline/30">
                {/* NDVI SVG Mosaic */}
                <img src="/images/satellite_farm.jpg" alt="Satellite Farm" className="w-full h-full object-cover absolute inset-0" />

                {/* Radar scan line */}
                <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-secondary-fixed/30 to-transparent animate-radar pointer-events-none" />

                {/* Floating chip 1: NDVI */}
                <div className="absolute top-12 right-4 animate-float-slow bg-surface-bright/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white shadow-lg flex items-center gap-2.5">
                  <span className="h-3 w-3 rounded-full bg-[#3A9E48] ring-4 ring-[#7CD959]/30" />
                  <div>
                    <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Vegetation Index</div>
                    <div className="font-display text-headline-md font-bold text-primary flex items-baseline gap-1 font-mono">
                      NDVI 0.71
                      <span className="text-xs text-secondary font-semibold">Optimal</span>
                    </div>
                  </div>
                </div>

                {/* Floating chip 2: Rainfall */}
                <div className="absolute bottom-28 left-4 animate-float-delayed bg-surface-bright/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white shadow-lg flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-tertiary-fixed/40 flex items-center justify-center text-tertiary">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15v-4H8l4-8v4h2l-4 8z"/></svg>
                  </div>
                  <div>
                    <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Monsoon Deficit</div>
                    <div className="font-display text-headline-md font-bold text-tertiary flex items-baseline gap-1.5">
                      Rainfall -18%
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-tertiary-fixed font-semibold text-on-tertiary-fixed">Amber Alert</span>
                    </div>
                  </div>
                </div>

                {/* Floating chip 3: Resilience */}
                <div className="absolute bottom-6 right-4 animate-float-fast bg-primary-container text-white px-4 py-3 rounded-2xl border border-primary-fixed/30 shadow-2xl flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-secondary-fixed/20 border border-secondary-fixed/40 flex items-center justify-center">
                    <svg className="w-5 h-5 text-secondary-fixed" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  </div>
                  <div>
                    <div className="text-[10px] text-primary-fixed uppercase tracking-wider font-semibold">XGBoost Credit Trust</div>
                    <div className="font-display text-headline-md font-bold text-white flex items-baseline gap-2">
                      Resilience 78
                      <span className="text-xs bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded-full font-bold">Tier A-1</span>
                    </div>
                  </div>
                </div>

                {/* Satellite meta chip */}
                <div className="absolute top-4 left-4 bg-primary/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-primary-fixed/20 flex items-center gap-2">
                  <Satellite className="w-4 h-4 text-primary-fixed" />
                  <span className="text-label-sm text-primary-fixed font-mono">Pass: 09:42 IST • Clear Sky</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── QUOTE BLOCK ──────────────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-surface-container-low border-b border-outline-variant/30">
        <div className="w-full max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative bg-surface p-8 md:p-12 rounded-2xl border border-outline-variant/30 border-l-[6px] border-l-secondary-fixed-dim shadow-sm"
          >
            <span className="absolute top-6 right-6 text-5xl md:text-6xl text-primary/10 select-none font-serif">"</span>
            <div className="relative z-10 space-y-4">
              <p className="text-headline-md md:text-headline-lg text-primary font-semibold leading-relaxed tracking-tight">
                "Smallholder farmers (86% of Indian farm households) lack access to affordable credit and climate-resilient advisory because lenders can't assess their climate risk and creditworthiness. Climate shocks then drive defaults, pushing farmers into debt cycles and lenders away from agriculture."
              </p>
              <div className="pt-2 flex items-center gap-3 text-on-surface-variant text-label-md">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                <span>Contextualized from NSSO 77th Round Agricultural Household Survey &amp; NABARD Smallholder Inclusion Mandate</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-surface" id="how-it-works">
        <div className="w-full max-w-[1600px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16 space-y-3"
          >
            <span className="section-label">Operational Blueprint</span>
            <h2 className="text-headline-xl-mobile md:text-headline-xl text-primary font-display font-bold">How KisanSetu AI Works</h2>
            <p className="text-body-lg text-on-surface-variant">
              From Copernicus orbital telemetry to bank branch disbursement — a transparent, non-repudiable credit pipeline.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { num: '01', icon: Satellite, title: 'Climate risk scoring', body: 'Sentinel-2 satellite observation, hyper-local soil moisture, and IMD weather hazard indices synthesized into dynamic parcel-level stress telemetry.', tag: 'Multi-spectral bands B2, B4, B8' },
              { num: '02', icon: Fingerprint, title: 'Agri-Credit Passport', body: 'Cryptographically verifiable digital score & dynamic risk tiering for transparent underwriting, removing informal middlemen collaterals.', tag: 'Non-repudiable ledger tokens' },
              { num: '03', icon: MessageSquare, title: 'Multilingual advisory', body: 'AI-powered localized crop advice in 9 Indian languages delivered through voice, SMS, and WhatsApp directly to marginal farmer phones.', tag: 'Hindi, Marathi, Telugu + 6 more' },
              { num: '04', icon: BarChart3, title: 'Lender dashboard', body: 'Portfolio-level climate stress testing, automated parametric loan pricing, and early warning default mitigation for institutional banks.', tag: 'KCC & PSL automated parity' },
            ].map(card => {
              const Icon = card.icon
              return (
                <motion.div
                  key={card.num}
                  variants={fadeUp}
                  className="card-hover p-6 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-headline-md font-display font-bold text-primary">
                        {card.num}
                      </span>
                      <Icon className="w-6 h-6 text-secondary group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-headline-md text-primary font-display font-semibold">{card.title}</h3>
                    <p className="text-body-md text-on-surface-variant leading-relaxed">{card.body}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-outline-variant/20 flex items-center gap-2 text-label-sm text-secondary font-semibold">
                    <span>{card.tag}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ── STRATEGIC PILLARS ─────────────────────────────────────────── */}
      <section className="py-16 bg-surface-container-low border-y border-outline-variant/30" id="strategic-pillars">
        <div className="w-full max-w-[1600px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-label-sm text-secondary font-bold uppercase tracking-wider">Architecture Benchmarks</span>
              <h2 className="text-headline-lg text-primary font-display font-bold mt-1">Five Strategic Pillars</h2>
            </div>
            <p className="text-body-md text-on-surface-variant max-w-md">
              Built strictly for the socio-geographic reality of Indian agro-climatic zones and financial inclusion mandates.
            </p>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            {[
              { icon: '🧠', label: 'Innovation', body: 'Edge ML on Sentinel-2 earth observation & XGBoost credit risk fusion.', tag: 'Hyperspectral AI' },
              { icon: '⚡', label: 'Feasibility', body: 'Instant onboarding with zero hardware cost via land survey numbers.', tag: 'Zero IoT Capex' },
              { icon: '🌍', label: 'Scalability', body: 'Pan-India multi-crop coverage across 140M+ smallholder parcels.', tag: 'Pan-India Grid' },
              { icon: '📈', label: 'Impact', body: '24% reduction in climate-driven defaults and 3.2x higher formal credit access (illustrative).', tag: '3.2x Credit Uplift' },
              { icon: '🏛️', label: 'Sponsor fit', body: 'Aligned with RBI Priority Sector Lending (PSL) & Agri-Infra initiatives.', tag: 'RBI PSL Compliant' },
            ].map(p => (
              <motion.div
                key={p.label}
                variants={fadeUp}
                className="bg-surface rounded-2xl p-5 border border-outline-variant/40 hover:border-outline transition-all duration-150 flex flex-col justify-between shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{p.icon}</span>
                    <span className="text-label-lg font-bold text-primary">{p.label}</span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant">{p.body}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/20 text-label-sm text-primary font-mono font-semibold">
                  {p.tag}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-surface" id="assess-farm">
        <div className="w-full max-w-[1600px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary-container text-white rounded-3xl p-8 md:p-14 relative overflow-hidden shadow-2xl"
          >
            <div className="relative z-10 max-w-2xl space-y-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed/20 text-secondary-fixed text-label-sm font-bold tracking-wide">
                <Globe className="w-4 h-4" />
                Interactive Soil &amp; Credit Ledger
              </span>
              <h2 className="text-headline-xl-mobile md:text-headline-xl font-display font-bold text-white tracking-tight">
                Ready to evaluate risk for your agricultural portfolio?
              </h2>
              <p className="text-body-lg text-primary-fixed leading-relaxed">
                Connect a survey number, Khasra reference, or coordinate bounding box to generate an instant Agri-Credit Passport with historical drought and flood telemetry.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link to="/assess" className="btn-primary px-7 py-3.5 text-base rounded-xl">
                  <Satellite className="w-5 h-5" />
                  Connect Land Parcel
                </Link>
                <Link to="/lender" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold text-label-lg px-6 py-3.5 rounded-xl border border-white/20 transition-all">
                  <BarChart3 className="w-5 h-5" />
                  View Sample Underwriting Ledger
                </Link>
              </div>
            </div>
            {/* Decorative radar rings */}
            <div className="absolute -right-20 -bottom-20 w-96 h-96 border border-white/10 rounded-full pointer-events-none" />
            <div className="absolute -right-40 -bottom-40 w-[540px] h-[540px] border border-white/5 rounded-full pointer-events-none" />
            <div className="absolute right-12 top-12 opacity-10 pointer-events-none hidden md:block text-[160px] text-white">
              <Radar className="w-40 h-40" />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
