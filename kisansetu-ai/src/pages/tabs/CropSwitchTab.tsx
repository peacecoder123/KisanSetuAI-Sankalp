import { motion } from 'framer-motion'
import { getCropAlternatives } from '../../data/services'
import { TrendingUp, TrendingDown, Minus, Droplets } from 'lucide-react'

interface Props { year: number }

const tagColors: Record<string, string> = {
  green: 'bg-secondary-fixed/30 text-secondary border-secondary-fixed/40',
  amber: 'bg-tertiary-fixed/40 text-tertiary border-tertiary-fixed/60',
  red: 'bg-error-container text-error border-error/20',
  blue: 'bg-primary-container/30 text-primary-fixed border-primary-fixed/20',
}

const waterDots: Record<string, number> = {
  'Very Low': 1, 'Low': 2, 'Medium': 3, 'High': 4, 'Very High': 5,
}

export default function CropSwitchTab({ year }: Props) {
  const crops = getCropAlternatives(year)

  return (
    <div className="space-y-6">
      <div className="card p-5 bg-primary-container/10 border-l-4 border-secondary-fixed space-y-1">
        <p className="text-label-lg font-bold text-primary">🌾 Crop Switch Recommendation</p>
        <p className="text-body-md text-on-surface-variant">
          Based on Sentinel-2 soil analysis and {year} climate projections, switching from{' '}
          <strong>Soybean → Tur Dal</strong> improves your resilience score by{' '}
          <strong className="text-secondary">+11 points</strong> and maintains high MSP support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {crops.map((crop, i) => (
          <motion.div
            key={crop.crop}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`card p-5 flex flex-col gap-4 relative ${
              crop.currentCrop ? 'ring-2 ring-secondary-fixed ring-offset-2' : ''
            } ${!crop.currentCrop && crop.scoreChange > 5 ? 'border-secondary-fixed/50' : ''}`}
          >
            {/* Current badge */}
            {crop.currentCrop && (
              <span className="absolute -top-2.5 left-4 bg-secondary-fixed text-on-secondary-fixed text-label-sm font-bold px-2.5 py-0.5 rounded-full">
                Current
              </span>
            )}

            {/* Header */}
            <div className="flex items-start justify-between mt-1">
              <div>
                <span className="text-2xl">{crop.emoji}</span>
                <p className="text-label-lg font-bold text-primary mt-1">{crop.crop}</p>
              </div>
              <span className={`badge text-label-sm border ${tagColors[crop.tagColor]}`}>
                {crop.climateTag}
              </span>
            </div>

            {/* Score change */}
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                crop.scoreChange > 0 ? 'bg-secondary-fixed/20' :
                crop.scoreChange < 0 ? 'bg-error-container' : 'bg-surface-container'
              }`}>
                {crop.scoreChange > 0 ? (
                  <TrendingUp className="w-5 h-5 text-secondary" />
                ) : crop.scoreChange < 0 ? (
                  <TrendingDown className="w-5 h-5 text-error" />
                ) : (
                  <Minus className="w-5 h-5 text-on-surface-variant" />
                )}
              </div>
              <div>
                <p className="text-headline-md font-display font-bold text-primary font-mono">{crop.resilienceScore}</p>
                <p className={`text-label-sm font-semibold ${crop.scoreChange > 0 ? 'text-secondary' : crop.scoreChange < 0 ? 'text-error' : 'text-on-surface-variant'}`}>
                  {crop.scoreChange > 0 ? `+${crop.scoreChange}` : crop.scoreChange} pts
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-label-sm text-on-surface-variant">MSP</p>
                <p className="text-body-sm font-semibold text-primary">{crop.marketPrice}</p>
              </div>
            </div>

            {/* Water requirement dots */}
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-on-surface-variant/60" />
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(d => (
                  <div
                    key={d}
                    className={`w-2.5 h-2.5 rounded-full ${
                      d <= (waterDots[crop.waterRequirement] || 0)
                        ? 'bg-primary-container'
                        : 'bg-surface-container'
                    }`}
                  />
                ))}
              </div>
              <span className="text-label-sm text-on-surface-variant">{crop.waterRequirement}</span>
            </div>

            {/* Description */}
            <p className="text-body-sm text-on-surface-variant line-clamp-3">{crop.description}</p>

            {/* Footer badges */}
            <div className="flex items-center gap-2 mt-auto flex-wrap">
              {crop.mspSupport && (
                <span className="badge bg-secondary-fixed/15 text-secondary text-label-sm">MSP</span>
              )}
              {crop.insuranceCoverage && (
                <span className="badge bg-primary-container/15 text-primary-fixed text-label-sm">PMFBY</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-label-sm text-on-surface-variant text-center">
        * Illustrative projections based on ICAR crop suitability models for Vidarbha agro-climatic zone. MSP data from CACP 2025.
      </p>
    </div>
  )
}
