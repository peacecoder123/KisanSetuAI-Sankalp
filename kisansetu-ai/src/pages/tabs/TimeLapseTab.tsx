import { useState, useRef, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Play, Pause, SkipBack } from 'lucide-react'

const SEASONS = [
  {
    label: 'Bare / Sowing',
    month: 'Jun 2023',
    ndvi: 0.18,
    description: 'Pre-sowing bare soil. Fields ploughed, awaiting first monsoon rains.',
    gradient: 'from-[#8B6914] via-[#A07B22] to-[#6B4F10]',
    svgFill: '#8B6914',
  },
  {
    label: 'Mid-Season Growth',
    month: 'Aug 2023',
    ndvi: 0.71,
    description: 'Peak soybean growth. Deep green canopy with optimal NDVI 0.71.',
    gradient: 'from-[#1a5c28] via-[#2d8040] to-[#0f3d2e]',
    svgFill: '#227400',
  },
  {
    label: 'Harvest / Senescence',
    month: 'Oct 2023',
    ndvi: 0.38,
    description: 'Crop matured and partially harvested. Yellowing foliage visible.',
    gradient: 'from-[#8B7722] via-[#B8962E] to-[#6B5A18]',
    svgFill: '#F5B83D',
  },
]

const NDVI_TREND = [
  { month: 'May', ndvi: 0.12 },
  { month: 'Jun', ndvi: 0.18 },
  { month: 'Jul', ndvi: 0.52 },
  { month: 'Aug', ndvi: 0.71 },
  { month: 'Sep', ndvi: 0.64 },
  { month: 'Oct', ndvi: 0.38 },
  { month: 'Nov', ndvi: 0.21 },
]

export default function TimeLapseTab() {
  const [currentSeason, setCurrentSeason] = useState(0)
  const [sliderPos, setSliderPos] = useState(50)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Auto-play logic
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSeason(prev => {
          const next = (prev + 1) % SEASONS.length
          if (next === 0) setIsPlaying(false)
          return next
        })
      }, 2000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isPlaying])

  const beforeSeason = SEASONS[0]
  const afterSeason = SEASONS[currentSeason]

  return (
    <div className="space-y-6">
      {/* Season selector */}
      <div className="card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="flex gap-2">
          {SEASONS.map((s, i) => (
            <button
              key={s.label}
              onClick={() => { setCurrentSeason(i); setIsPlaying(false) }}
              className={`px-4 py-2 rounded-xl text-label-md font-semibold transition-all ${
                currentSeason === i
                  ? 'bg-primary-container text-primary-fixed shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:text-primary'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={() => { setCurrentSeason(0); setIsPlaying(false) }}
            className="btn-icon"
            title="Reset"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setCurrentSeason(0); setIsPlaying(true) }}
            className="btn-primary px-5 py-2.5 text-label-md"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Play Season Sequence'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Before/After image slider */}
        <div className="card overflow-hidden">
          <div
            className="relative h-80 cursor-col-resize overflow-hidden select-none"
            onMouseMove={e => {
              const rect = e.currentTarget.getBoundingClientRect()
              setSliderPos(((e.clientX - rect.left) / rect.width) * 100)
            }}
          >
            {/* "Before" panel — bare soil */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${beforeSeason.gradient} flex items-center justify-center`}
            >
              <img src="/images/satellite_bare_soil.jpg" alt="Bare Soil" className="w-full h-full absolute object-cover" />
              <div className="relative z-10 text-center">
                <p className="text-white font-display font-bold text-xl drop-shadow">{beforeSeason.label}</p>
                <p className="text-white/80 text-sm mt-1">{beforeSeason.month} · NDVI {beforeSeason.ndvi}</p>
              </div>
            </div>

            {/* "After" panel — current season */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${afterSeason.gradient} flex items-center justify-center`}
              style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
            >
              <img src="/images/satellite_crop_grown.jpg" alt="Crop Grown" className="w-full h-full absolute object-cover" />
              <div className="relative z-10 text-center">
                <p className="text-white font-display font-bold text-xl drop-shadow">{afterSeason.label}</p>
                <p className="text-white/80 text-sm mt-1">{afterSeason.month} · NDVI {afterSeason.ndvi}</p>
              </div>
            </div>

            {/* Slider handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-xl cursor-col-resize"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center">
                <span className="text-xs font-bold text-primary">↔</span>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-label-sm">
              Before · {beforeSeason.month}
            </div>
            <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-label-sm">
              After · {afterSeason.month}
            </div>
          </div>
          <div className="p-4 bg-surface-container-low">
            <p className="text-body-sm text-on-surface-variant">{afterSeason.description}</p>
          </div>
        </div>

        {/* NDVI chart */}
        <div className="card p-6">
          <h3 className="text-headline-md text-primary font-display font-semibold mb-2">NDVI Seasonal Trend</h3>
          <p className="text-body-sm text-on-surface-variant mb-4">
            Parcel MH-WSM-4029 · Kharif 2023 · Sentinel-2 composites
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={NDVI_TREND}>
              <defs>
                <linearGradient id="ndviGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7CD959" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7CD959" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e6f0e9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#414944' }} />
              <YAxis domain={[0, 1]} tick={{ fontSize: 12, fill: '#414944' }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}
                formatter={(v: any) => [v.toFixed(2), 'NDVI']}
              />
              <Area
                type="monotone"
                dataKey="ndvi"
                stroke="#7CD959"
                strokeWidth={3}
                fill="url(#ndviGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Season markers */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {SEASONS.map((s, i) => (
              <div
                key={s.label}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  currentSeason === i ? 'border-secondary-fixed bg-secondary-fixed/10' : 'border-outline-variant/30'
                }`}
                onClick={() => setCurrentSeason(i)}
              >
                <p className="text-label-sm font-bold text-primary">{s.month}</p>
                <p className="text-data-mono font-mono text-secondary">{s.ndvi}</p>
                <p className="text-label-sm text-on-surface-variant mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
