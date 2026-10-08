import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Satellite, Globe, TrendingUp, Shield, Users, Building2, ArrowRight } from 'lucide-react'
import { useDemoStarter } from '../components/GuidedDemo'

const TEAM = [
  { initials: 'TP', name: 'Team SankalpPS', role: 'Full Stack & ML Engineering' },
]

export default function AboutPage() {
  const startDemo = useDemoStarter()

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-surface-container-low border-b border-outline-variant/20">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-label">About KisanSetu AI</span>
            <h1 className="text-display-lg-mobile md:text-display-lg text-primary font-display font-extrabold mt-4 tracking-tight">
              Bridging the Climate-Credit Gap in Indian Agriculture
            </h1>
            <p className="text-body-xl text-on-surface-variant mt-4 leading-relaxed max-w-2xl mx-auto">
              KisanSetu AI is a Climate Risk and Credit Intelligence Platform connecting 140 million smallholder Indian farmers with formal banking through verifiable, satellite-backed credit passports.
            </p>
          </motion.div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/assess" className="btn-primary px-8 py-4 text-base rounded-xl">
              <Satellite className="w-5 h-5" />
              Try the Platform
            </Link>
            <button onClick={startDemo} className="btn-secondary px-6 py-4 text-base rounded-xl">
              Watch Guided Demo
            </button>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <span className="section-label">The Problem</span>
            <h2 className="text-headline-xl text-primary font-display font-bold">
              86% of Indian farmers locked out of formal credit
            </h2>
            <p className="text-body-lg text-on-surface-variant leading-relaxed">
              Smallholder farmers (86% of Indian farm households per NSSO 77th Round) lack access to affordable formal credit because lenders cannot assess their climate risk. Climate shocks drive defaults, pushing farmers into informal debt cycles and discouraging lenders from agricultural lending.
            </p>
            <ul className="space-y-3 pt-2">
              {[
                'No verifiable credit history or collateral',
                'Climate risk invisible to traditional underwriting',
                'Language barriers prevent financial advisory access',
                'Informal moneylenders charge 24–60% interest',
              ].map(p => (
                <li key={p} className="flex items-start gap-3 text-body-md text-on-surface-variant">
                  <span className="mt-1 w-5 h-5 rounded-full bg-error-container flex items-center justify-center text-error text-xs flex-shrink-0">✕</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <span className="section-label">Our Solution</span>
            <h2 className="text-headline-xl text-primary font-display font-bold">
              Satellite-backed climate credit intelligence
            </h2>
            <p className="text-body-lg text-on-surface-variant leading-relaxed">
              KisanSetu AI uses Copernicus Sentinel-2 satellite imagery, IMD weather data, and XGBoost machine learning to generate a verifiable Agri-Credit Passport for every smallholder farm — making climate risk visible to lenders and affordable credit accessible to farmers.
            </p>
            <ul className="space-y-3 pt-2">
              {[
                'Sentinel-2 NDVI analysis every 5 days, 10m resolution',
                'XGBoost climate risk scoring with full explainability',
                'Agri-Credit Passport verifiable by any bank in seconds',
                'Multilingual advisory in 9 Indian languages',
              ].map(p => (
                <li key={p} className="flex items-start gap-3 text-body-md text-on-surface-variant">
                  <span className="mt-1 w-5 h-5 rounded-full bg-secondary-fixed/20 flex items-center justify-center text-secondary text-xs flex-shrink-0">✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Impact numbers */}
      <section className="py-16 bg-surface-container-low border-y border-outline-variant/20">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-headline-xl text-primary font-display font-bold text-center mb-12">
            Modelled Impact Potential
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { metric: '3.2x', label: 'Increase in formal credit access', color: 'text-secondary' },
              { metric: '24%', label: 'Reduction in climate-driven defaults', color: 'text-primary' },
              { metric: '9 langs', label: 'Advisory languages supported', color: 'text-secondary' },
              { metric: '₹12,400Cr', label: 'Credit potentially unlocked at 3M scale', color: 'text-primary' },
            ].map(m => (
              <div key={m.label} className="text-center space-y-2">
                <p className={`text-display-lg-mobile font-display font-extrabold ${m.color}`}>{m.metric}</p>
                <p className="text-body-md text-on-surface-variant">{m.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-label-sm text-on-surface-variant mt-8">
            All metrics are modelled projections based on NABARD baseline data and extrapolated assumptions. Actual outcomes will vary.
          </p>
        </div>
      </section>

      {/* Technology stack */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-6 space-y-10">
          <h2 className="text-headline-xl text-primary font-display font-bold text-center">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Satellite, title: 'Earth Observation',
                items: ['Copernicus Sentinel-2 L2A', 'NASA MODIS (backup)', 'ESA STAC API', 'Band composites B2/B4/B8'],
              },
              {
                icon: TrendingUp, title: 'AI & ML Models',
                items: ['XGBoost credit risk scoring', 'CMIP6 climate projections', 'NDVI + NDMI extraction', 'Random Forest crop suitability'],
              },
              {
                icon: Globe, title: 'Data Sources',
                items: ['IMD gridded rainfall', 'ISRIC SoilGrids 250m', 'CACP MSP database', 'NABARD KCC ledger'],
              },
            ].map(s => {
              const Icon = s.icon
              return (
                <div key={s.title} className="card p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center">
                      <Icon className="w-5 h-5 text-secondary" />
                    </div>
                    <h3 className="text-headline-md text-primary font-display font-semibold">{s.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {s.items.map(item => (
                      <li key={item} className="flex items-center gap-2 text-body-md text-on-surface-variant">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-surface-container-low border-y border-outline-variant/20">
        <div className="max-w-[800px] mx-auto px-6 text-center space-y-8">
          <h2 className="text-headline-xl text-primary font-display font-bold">Built at SankalpPS 2026</h2>
          <p className="text-body-lg text-on-surface-variant leading-relaxed">
            KisanSetu AI was designed and built as a hackathon project for SankalpPS 2026, addressing the intersection of climate resilience and financial inclusion for India's smallholder farmers.
          </p>
          <div className="flex justify-center">
            <div className="card p-6 flex items-center gap-4 max-w-sm">
              <div className="w-16 h-16 rounded-2xl bg-primary-container flex items-center justify-center text-primary-fixed text-headline-md font-display font-bold">TP</div>
              <div className="text-left">
                <p className="text-headline-md font-display font-semibold text-primary">Team SankalpPS</p>
                <p className="text-body-md text-on-surface-variant">Full Stack · ML · Product Design</p>
                <p className="text-label-sm text-secondary font-semibold mt-1">SankalpPS 2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-headline-xl text-primary font-display font-bold">Ready to explore?</h2>
          <p className="text-body-lg text-on-surface-variant">
            Start with the guided demo, assess a farm, or explore the lender dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={startDemo} className="btn-primary px-8 py-4 text-base rounded-xl">
              Watch Guided Demo
            </button>
            <Link to="/assess" className="btn-secondary px-6 py-4 text-base rounded-xl">
              Assess a Farm
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
