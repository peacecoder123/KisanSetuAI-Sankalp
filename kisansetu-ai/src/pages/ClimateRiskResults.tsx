import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line
} from 'recharts'
import { Info, ChevronRight, AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react'
import { getClimateScore, getScenario } from '../data/services'
import { useApp } from '../context/AppContext'
import CropSwitchTab from './tabs/CropSwitchTab'
import TimeLapseTab from './tabs/TimeLapseTab'

const TABS = ['Risk', 'Scenarios', 'Crop Switch', 'Time-Lapse'] as const
type Tab = typeof TABS[number]

const YEARS = [2025, 2030, 2040, 2050] as const

// Animated gauge
function ResilienceGauge({ score }: { score: number }) {
  const [displayed, setDisplayed] = useState(0)
  useEffect(() => {
    let frame = 0
    const total = 60
    const interval = setInterval(() => {
      frame++
      setDisplayed(Math.round((score * frame) / total))
      if (frame >= total) clearInterval(interval)
    }, 20)
    return () => clearInterval(interval)
  }, [score])

  const radius = 80
  const circumference = Math.PI * radius // half-circle
  const offset = circumference - (displayed / 100) * circumference
  const tier = score >= 75 ? 'A-1' : score >= 60 ? 'B-1' : score >= 45 ? 'C-1' : 'D-1'
  const color = score >= 75 ? '#7CD959' : score >= 60 ? '#fabc41' : score >= 45 ? '#F5B83D' : '#ba1a1a'

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={200} height={110} viewBox="-10 0 220 110">
        {/* Background arc */}
        <path
          d="M 10 100 A 90 90 0 0 1 190 100"
          fill="none" stroke="#e6f0e9" strokeWidth="16" strokeLinecap="round"
        />
        {/* Animated score arc */}
        <path
          d="M 10 100 A 90 90 0 0 1 190 100"
          fill="none"
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.05s linear' }}
        />
        {/* Score text */}
        <text x="100" y="82" textAnchor="middle" fontSize="36" fontWeight="800" fontFamily="Sora" fill="#00261a">
          {displayed}
        </text>
        <text x="100" y="100" textAnchor="middle" fontSize="13" fontFamily="Inter" fill="#414944">
          Resilience Score
        </text>
      </svg>
      <span className={`badge text-sm px-4 py-1.5 rounded-full font-bold ${
        score >= 75 ? 'bg-secondary-fixed/30 text-secondary' :
        score >= 60 ? 'bg-tertiary-fixed/50 text-tertiary' : 'bg-error-container text-error'
      }`}>
        Tier {tier}
      </span>
    </div>
  )
}

export default function ClimateRiskResultsPage() {
  const { farmData } = useApp()
  const [activeTab, setActiveTab] = useState<Tab>('Risk')
  const [scenarioYear, setScenarioYear] = useState<2025|2030|2040|2050>(2025)
  const [emission, setEmission] = useState<'moderate' | 'high'>('moderate')

  const baseScore = getClimateScore()
  const scenario = getScenario(scenarioYear, emission)
  const displayData = activeTab === 'Scenarios' ? scenario : baseScore

  const riskColor = (level: string) =>
    level === 'Low' ? 'text-secondary' : level === 'Medium' ? 'text-tertiary' : 'text-error'
  const riskBg = (level: string) =>
    level === 'Low' ? 'bg-secondary-fixed/20' : level === 'Medium' ? 'bg-tertiary-fixed/30' : 'bg-error-container/40'

  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* ── Header bar ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="section-label">Parcel #MH-WSM-4029 · {farmData.village}</span>
            <h1 className="text-headline-xl text-primary font-display font-bold">Climate Risk Results</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="badge bg-secondary-fixed/20 text-secondary text-label-md">
              🛰️ Sentinel-2 Pass: {baseScore.sentinel2Pass}
            </span>
            <span className="badge bg-surface-container text-on-surface-variant text-label-md">
              Last updated: Oct 8, 2025
            </span>
          </div>
        </div>

        {/* ── Tab Bar ── */}
        <div className="flex items-center gap-1 bg-surface-container-low p-1.5 rounded-2xl w-fit">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-xl text-label-lg font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-primary-container text-primary-fixed shadow-sm'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ══ RISK TAB ══════════════════════════════════════════════ */}
          {activeTab === 'Risk' && (
            <motion.div
              key="risk"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Gauge + tier cards */}
              <div className="space-y-6">
                <div className="card p-6 flex flex-col items-center gap-4">
                  <h2 className="text-headline-md text-primary font-display font-semibold self-start">Overall Score</h2>
                  <ResilienceGauge score={baseScore.overallScore} />
                  <div className="w-full grid grid-cols-2 gap-3 pt-2">
                    {[
                      { label: 'NDVI', value: `${baseScore.ndvi}`, unit: 'Optimal' },
                      { label: 'Soil Moisture', value: `${(baseScore.soilMoisture * 100).toFixed(0)}%`, unit: '' },
                      { label: 'Rainfall Δ', value: `${baseScore.rainfallDeficit}%`, unit: 'Deficit' },
                      { label: 'Pass', value: '09:42', unit: 'IST Today' },
                    ].map(m => (
                      <div key={m.label} className="bg-surface-container-low rounded-xl p-3">
                        <p className="text-label-sm text-on-surface-variant">{m.label}</p>
                        <p className="text-headline-md font-display font-bold text-primary font-mono">{m.value}</p>
                        {m.unit && <p className="text-label-sm text-secondary">{m.unit}</p>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk level badges */}
                <div className="card p-5 space-y-3">
                  <h3 className="text-label-lg font-bold text-primary">Risk Flags</h3>
                  {([
                    { label: 'Drought', value: baseScore.droughtRisk },
                    { label: 'Flood', value: baseScore.floodRisk },
                    { label: 'Heat Stress', value: baseScore.heatStress },
                    { label: 'Pest Risk', value: baseScore.pestRisk },
                  ] as const).map(r => (
                    <div key={r.label} className="flex items-center justify-between">
                      <span className="text-body-md text-on-surface-variant">{r.label}</span>
                      <span className={`badge capitalize text-label-sm ${riskBg(r.value === 'low' ? 'Low' : r.value === 'moderate' ? 'Medium' : 'High')} ${riskColor(r.value === 'low' ? 'Low' : r.value === 'moderate' ? 'Medium' : 'High')}`}>
                        {r.value === 'low' ? '✓ Low' : r.value === 'moderate' ? '⚠ Moderate' : '⛔ High'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Radar chart */}
              <div className="card p-6">
                <h2 className="text-headline-md text-primary font-display font-semibold mb-4">Risk Radar</h2>
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart data={baseScore.radarData}>
                    <PolarGrid stroke="#c0c8c3" />
                    <PolarAngleAxis dataKey="axis" tick={{ fontSize: 12, fill: '#414944', fontFamily: 'Inter' }} />
                    <Radar
                      dataKey="value"
                      stroke="#7CD959"
                      fill="#7CD959"
                      fillOpacity={0.25}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
                <p className="text-label-sm text-on-surface-variant text-center mt-2">
                  Higher = more resilient on each axis
                </p>
              </div>

              {/* Risk bars + AI commentary */}
              <div className="space-y-6">
                <div className="card p-6 space-y-4">
                  <h2 className="text-headline-md text-primary font-display font-semibold">Risk Breakdown</h2>
                  {baseScore.riskBars.map(bar => (
                    <div key={bar.label} className="space-y-1.5">
                      <div className="flex items-center justify-between text-label-md">
                        <span className="text-on-surface-variant">{bar.label}</span>
                        <span className="font-semibold" style={{ color: bar.color }}>{bar.level} ({bar.value}%)</span>
                      </div>
                      <div className="progress-bar">
                        <motion.div
                          className="progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${bar.value}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          style={{ background: bar.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Commentary */}
                <div className="card p-6 bg-surface-container-low space-y-3 border-l-4 border-secondary-fixed">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-primary-container flex items-center justify-center text-sm">🤖</span>
                    <h3 className="text-label-lg font-bold text-primary">AI Commentary</h3>
                  </div>
                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    {baseScore.aiCommentary}
                  </p>
                  <div className="flex items-center gap-2 text-label-sm text-secondary font-semibold">
                    <Info className="w-3.5 h-3.5" />
                    Copernicus Sentinel-2 · IMD · ICAR XGBoost
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══ SCENARIOS TAB ════════════════════════════════════════════ */}
          {activeTab === 'Scenarios' && (
            <motion.div
              key="scenarios"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Controls */}
              <div className="card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="space-y-2">
                  <label className="text-label-md font-bold text-on-surface-variant">Climate Year</label>
                  <div className="flex gap-2">
                    {YEARS.map(y => (
                      <button
                        key={y}
                        onClick={() => setScenarioYear(y)}
                        className={`px-4 py-2 rounded-xl text-label-lg font-semibold transition-all ${
                          scenarioYear === y
                            ? 'bg-primary-container text-primary-fixed shadow-sm'
                            : 'bg-surface-container text-on-surface-variant hover:text-primary'
                        }`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-label-md font-bold text-on-surface-variant">Emission Pathway</label>
                  <div className="flex gap-2">
                    {(['moderate', 'high'] as const).map(e => (
                      <button
                        key={e}
                        onClick={() => setEmission(e)}
                        className={`px-4 py-2 rounded-xl text-label-lg font-semibold capitalize transition-all ${
                          emission === e
                            ? e === 'moderate' ? 'bg-tertiary-fixed/50 text-tertiary' : 'bg-error-container text-error'
                            : 'bg-surface-container text-on-surface-variant hover:text-primary'
                        }`}
                      >
                        {e === 'moderate' ? '⚡ SSP2-4.5 Moderate' : '🔥 SSP5-8.5 High'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Scenario gauge */}
                <div className="card p-6 flex flex-col items-center gap-4">
                  <h2 className="text-headline-md text-primary font-display font-semibold self-start">
                    {scenarioYear} Projection
                  </h2>
                  <ResilienceGauge score={scenario.score} />
                  <div className="w-full space-y-2">
                    <div className="flex items-center justify-between text-body-sm">
                      <span className="text-on-surface-variant">vs. Current (2025)</span>
                      <span className={scenario.score < 78 ? 'text-error font-bold' : 'text-secondary font-bold'}>
                        {scenario.score < 78 ? `▼ ${78 - scenario.score} pts` : '= Same'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-body-sm">
                      <span className="text-on-surface-variant">Credit Tier</span>
                      <span className="font-bold text-primary">{scenario.tier}</span>
                    </div>
                  </div>
                </div>

                {/* Scenario radar */}
                <div className="card p-6">
                  <h2 className="text-headline-md text-primary font-display font-semibold mb-4">Risk Radar · {scenarioYear}</h2>
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={scenario.radarData}>
                      <PolarGrid stroke="#c0c8c3" />
                      <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: '#414944' }} />
                      <Radar dataKey="value" stroke={emission === 'high' ? '#ba1a1a' : '#fabc41'} fill={emission === 'high' ? '#ba1a1a' : '#fabc41'} fillOpacity={0.2} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Risk bars + Commentary */}
                <div className="space-y-5">
                  <div className="card p-5 space-y-3">
                    {scenario.riskBars.map(bar => (
                      <div key={bar.label} className="space-y-1">
                        <div className="flex justify-between text-label-md">
                          <span className="text-on-surface-variant">{bar.label}</span>
                          <span style={{ color: bar.color }}>{bar.level} ({bar.value}%)</span>
                        </div>
                        <div className="progress-bar">
                          <motion.div
                            className="h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${bar.value}%` }}
                            transition={{ duration: 0.6 }}
                            style={{ background: bar.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="card p-5 bg-surface-container-low border-l-4 border-tertiary-fixed-dim space-y-2">
                    <p className="text-label-lg font-bold text-primary">AI Scenario Commentary</p>
                    <p className="text-body-sm text-on-surface-variant leading-relaxed">{scenario.aiCommentary}</p>
                  </div>
                </div>
              </div>

              {/* Timeline chart */}
              <div className="card p-6">
                <h2 className="text-headline-md text-primary font-display font-semibold mb-4">Score Trajectory</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={[
                    { year: '2025', score: 78 },
                    { year: '2030', score: getScenario(2030, emission).score },
                    { year: '2040', score: getScenario(2040, emission).score },
                    { year: '2050', score: getScenario(2050, emission).score },
                  ]}>
                    <CartesianGrid stroke="#e6f0e9" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis domain={[20, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke={emission === 'high' ? '#ba1a1a' : '#fabc41'}
                      strokeWidth={3}
                      dot={{ fill: emission === 'high' ? '#ba1a1a' : '#fabc41', r: 5 }}
                      name="Resilience Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-label-sm text-on-surface-variant text-center mt-2">
                  Modelled projection under {emission} emission pathway · CMIP6 MRI-ESM2.0 Downscaled
                </p>
              </div>
            </motion.div>
          )}

          {/* ══ CROP SWITCH TAB ══════════════════════════════════════════ */}
          {activeTab === 'Crop Switch' && (
            <motion.div key="crop" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <CropSwitchTab year={scenarioYear} />
            </motion.div>
          )}

          {/* ══ TIME-LAPSE TAB ════════════════════════════════════════════ */}
          {activeTab === 'Time-Lapse' && (
            <motion.div key="timelapse" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <TimeLapseTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
