import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Play, Check, Clock, ChevronDown, BarChart3, TrendingUp } from 'lucide-react'
import { getApiResponse, getImpactStats } from '../data/services'
import { LogoWhite } from '../components/Logo'

const ENDPOINTS = [
  { id: '/v1/climate-score', label: 'Climate Score', method: 'POST', latency: 312 },
  { id: '/v1/passport', label: 'Agri-Credit Passport', method: 'GET', latency: 89 },
  { id: '/v1/scenarios', label: 'Climate Scenarios', method: 'GET', latency: 528 },
  { id: '/v1/crop-alternatives', label: 'Crop Alternatives', method: 'GET', latency: 203 },
]

const REQUEST_TEMPLATE = `{
  "parcel_id": "MH-WSM-4029",
  "lat": 20.1134,
  "lng": 77.1319,
  "crop": "soybean",
  "area_ha": 2.4,
  "soil_type": "vertisol",
  "include_scenarios": true,
  "language": "mr"
}`

// Syntax highlight JSON
function JsonView({ data }: { data: object }) {
  const json = JSON.stringify(data, null, 2)
  const highlighted = json
    .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
    .replace(/: "([^"]*)"/g, ': <span class="json-string">"$1"</span>')
    .replace(/: (\d+\.?\d*)/g, ': <span class="json-number">$1</span>')
    .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>')
    .replace(/: (null)/g, ': <span class="json-null">$1</span>')

  return (
    <pre
      className="text-xs font-mono leading-relaxed overflow-auto max-h-80"
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  )
}

// Animated counter
function AnimatedNumber({ target, prefix = '', suffix = '', decimals = 0 }: { target: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let frame = 0
    const total = 80
    const timer = setInterval(() => {
      frame++
      const progress = frame / total
      const eased = 1 - Math.pow(1 - progress, 3)
      setVal(target * eased)
      if (frame >= total) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [target])

  return <>{prefix}{val.toFixed(decimals)}{suffix}</>
}

export default function ApiPlaygroundPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(ENDPOINTS[0])
  const [requestBody, setRequestBody] = useState(REQUEST_TEMPLATE)
  const [response, setResponse] = useState<object | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [latency, setLatency] = useState(0)
  const [copied, setCopied] = useState(false)
  const [farmersTarget, setFarmersTarget] = useState(3000000)

  const impactStats = getImpactStats(farmersTarget)

  const runRequest = () => {
    setIsRunning(true)
    setResponse(null)
    const start = Date.now()
    const apiResp = getApiResponse(selectedEndpoint.id)
    setTimeout(() => {
      setLatency(Date.now() - start + apiResp.latencyMs)
      setResponse(apiResp.response)
      setIsRunning(false)
    }, selectedEndpoint.latency)
  }

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b1410] text-[#dbe5de] py-6 px-4 md:px-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <LogoWhite width={140} />
              <span className="px-2.5 py-1 rounded-full bg-[#7CD959]/20 text-[#7CD959] text-label-sm font-bold">Dev API</span>
            </div>
            <h1 className="text-headline-xl text-[#dbe5de] font-display font-bold">API Playground &amp; Impact Calculator</h1>
          </div>
          <div className="text-label-sm text-[#a2d1bb]">
            Base URL: <code className="font-mono text-[#7CD959]">api.kisansetu.ai</code>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── REQUEST PANEL ── */}
          <div className="bg-[#161f1b] rounded-2xl border border-white/10 overflow-hidden">
            <div className="px-5 py-3 border-b border-white/10 flex items-center gap-3">
              <span className="text-[#a2d1bb] text-label-md font-bold">REQUEST</span>
              {/* Endpoint selector */}
              <div className="flex gap-2 flex-wrap ml-auto">
                {ENDPOINTS.map(ep => (
                  <button
                    key={ep.id}
                    onClick={() => setSelectedEndpoint(ep)}
                    className={`px-3 py-1 rounded-lg text-label-sm font-mono transition-all ${
                      selectedEndpoint.id === ep.id
                        ? 'bg-[#7CD959]/20 text-[#7CD959] border border-[#7CD959]/30'
                        : 'text-[#717974] hover:text-[#a2d1bb]'
                    }`}
                  >
                    {ep.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Method + URL bar */}
            <div className="px-5 py-3 border-b border-white/5 flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-[#7CD959]/20 text-[#7CD959] font-mono font-bold text-label-sm">
                {selectedEndpoint.method}
              </span>
              <code className="text-[#a2d1bb] font-mono text-body-sm flex-1">
                api.kisansetu.ai{selectedEndpoint.id}
              </code>
              <div className="flex items-center gap-1.5 text-label-sm text-[#717974]">
                <Clock className="w-3.5 h-3.5" />
                ~{selectedEndpoint.latency}ms
              </div>
            </div>

            {/* Request body */}
            <div className="px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-label-sm text-[#717974] uppercase tracking-wider">Request Body</span>
                <span className="text-label-sm text-[#717974]">application/json</span>
              </div>
              <textarea
                value={requestBody}
                onChange={e => setRequestBody(e.target.value)}
                className="w-full h-56 bg-[#0b1410] rounded-xl border border-white/10 p-4 font-mono text-xs text-[#a2d1bb] focus:outline-none focus:border-[#7CD959]/50 resize-none"
              />
            </div>

            {/* Run button */}
            <div className="px-5 pb-5">
              <button
                onClick={runRequest}
                disabled={isRunning}
                className="w-full flex items-center justify-center gap-2.5 bg-[#7CD959] hover:bg-[#9afa75] text-[#052100] font-bold text-label-lg py-3.5 rounded-xl transition-all disabled:opacity-60 active:scale-[0.98]"
              >
                {isRunning ? (
                  <><div className="w-4 h-4 border-2 border-[#052100]/30 border-t-[#052100] rounded-full animate-spin" /> Running…</>
                ) : (
                  <><Play className="w-4 h-4" /> Send Request</>
                )}
              </button>
            </div>
          </div>

          {/* ── RESPONSE PANEL ── */}
          <div className="bg-[#161f1b] rounded-2xl border border-white/10 overflow-hidden">
            <div className="px-5 py-3 border-b border-white/10 flex items-center gap-3">
              <span className="text-[#a2d1bb] text-label-md font-bold">RESPONSE</span>
              <AnimatePresence>
                {response && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 ml-auto"
                  >
                    <span className="flex items-center gap-1.5 text-label-sm text-[#7CD959]">
                      <Check className="w-4 h-4" />
                      200 OK
                    </span>
                    <span className="flex items-center gap-1 text-label-sm text-[#fabc41]">
                      <Clock className="w-3.5 h-3.5" />
                      {latency}ms
                    </span>
                    <button
                      onClick={copyResponse}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-label-sm text-[#a2d1bb] transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-[#7CD959]" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              {isRunning && (
                <span className="ml-auto text-label-sm text-[#fabc41] flex items-center gap-1.5">
                  <div className="w-3 h-3 border-2 border-[#fabc41]/30 border-t-[#fabc41] rounded-full animate-spin" />
                  Fetching…
                </span>
              )}
            </div>

            <div className="p-5 min-h-72 flex flex-col">
              {!response && !isRunning && (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-[#717974] text-body-md text-center">
                    Click <strong className="text-[#7CD959]">Send Request</strong> to see the response
                  </p>
                </div>
              )}
              {isRunning && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-3 border-[#7CD959]/30 border-t-[#7CD959] rounded-full animate-spin" />
                    <p className="text-[#a2d1bb] text-body-sm">Querying XGBoost model…</p>
                  </div>
                </div>
              )}
              <AnimatePresence>
                {response && !isRunning && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1"
                  >
                    <JsonView data={response} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── IMPACT CALCULATOR ── */}
        <div className="bg-[#161f1b] rounded-2xl border border-white/10 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-[#7CD959]" />
            <h2 className="text-headline-md font-display font-semibold text-white">Climate Impact Calculator</h2>
            <span className="ml-auto px-3 py-1 rounded-full bg-[#fabc41]/20 text-[#fabc41] text-label-sm font-semibold">
              Modelled Illustrations
            </span>
          </div>

          {/* Target slider */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between">
              <span className="text-[#a2d1bb] text-body-md">Farmers reached</span>
              <span className="text-headline-md font-bold text-white font-mono">
                {(farmersTarget / 1000000).toFixed(1)}M farmers
              </span>
            </div>
            <input
              type="range"
              min={100000}
              max={10000000}
              step={100000}
              value={farmersTarget}
              onChange={e => setFarmersTarget(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-label-sm text-[#717974]">
              <span>0.1M</span>
              <span>10M farmers</span>
            </div>
          </div>

          {/* Impact cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Farmers Reached', value: (farmersTarget / 1000000).toFixed(1), suffix: 'M', color: '#7CD959', icon: '👨‍🌾' },
              { label: 'Credit Unlocked', value: impactStats.creditUnlockedCr.toFixed(0), suffix: 'Cr', prefix: '₹', color: '#7CD959', icon: '💰' },
              { label: 'Default Reduction', value: impactStats.defaultReductionPct, suffix: '%', color: '#fabc41', icon: '📉' },
              { label: 'Yield Improvement', value: impactStats.yieldImprovementPct, suffix: '%', color: '#fabc41', icon: '🌾' },
              { label: 'CO₂ Abatement', value: Math.round(impactStats.co2AbatementTonne / 1000), suffix: 'K tonnes', color: '#a2d1bb', icon: '🌍' },
              { label: 'Lender NPL Reduction', value: impactStats.lenderNplReductionCr.toFixed(1), suffix: 'Cr', prefix: '₹', color: '#a2d1bb', icon: '🏦' },
            ].map(m => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center"
              >
                <div className="text-2xl mb-2">{m.icon}</div>
                <p className="text-[#717974] text-label-sm mb-1">{m.label}</p>
                <p className="font-display font-bold text-headline-md font-mono" style={{ color: m.color }}>
                  <AnimatedNumber
                    target={typeof m.value === 'string' ? parseFloat(m.value) : m.value}
                    prefix={m.prefix ?? ''}
                    suffix={` ${m.suffix}`}
                    decimals={m.value.toString().includes('.') ? 1 : 0}
                    key={farmersTarget}
                  />
                </p>
              </motion.div>
            ))}
          </div>

          <p className="mt-6 text-label-sm text-[#717974] text-center max-w-3xl mx-auto">
            ⚠️ {impactStats.note}
          </p>
        </div>
      </div>
    </div>
  )
}
