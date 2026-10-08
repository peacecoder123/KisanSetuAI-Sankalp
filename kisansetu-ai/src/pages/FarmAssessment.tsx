import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Satellite, MapPin, Check, Loader2, ChevronDown, Search } from 'lucide-react'
import { useApp } from '../context/AppContext'

const ANALYSIS_STEPS = [
  { id: 1, label: 'Locating parcel from survey number', icon: '🗺️', durationMs: 900 },
  { id: 2, label: 'Fetching Sentinel-2 overpass imagery', icon: '🛰️', durationMs: 1100 },
  { id: 3, label: 'Computing NDVI & soil moisture index', icon: '🌿', durationMs: 900 },
  { id: 4, label: 'Correlating IMD rainfall telemetry', icon: '🌧️', durationMs: 800 },
  { id: 5, label: 'Running XGBoost climate risk model', icon: '🤖', durationMs: 1000 },
  { id: 6, label: 'Generating Agri-Credit Passport', icon: '📋', durationMs: 700 },
]

const CROPS = ['Soybean', 'Cotton (Bt)', 'Wheat', 'Tur Dal (Pigeon Pea)', 'Jowar (Sorghum)', 'Groundnut', 'Maize', 'Rice', 'Sugarcane']
const SOIL_TYPES = ['Black Cotton (Vertisol)', 'Red Laterite', 'Alluvial', 'Sandy Loam', 'Clayey Loam', 'Medium Black']

export default function FarmAssessmentPage() {
  const navigate = useNavigate()
  const { farmData, setFarmData, setAssessmentDone } = useApp()

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [done, setDone] = useState(false)

  // Local form state
  const [form, setForm] = useState({
    farmerName: farmData.farmerName,
    surveyNumber: farmData.surveyNumber,
    village: farmData.village,
    crop: farmData.crop,
    areaHa: farmData.areaHa.toString(),
    soilType: farmData.soilType,
    lat: farmData.lat.toString(),
    lng: farmData.lng.toString(),
  })

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const startAnalysis = () => {
    // Save form data to context
    setFarmData({
      ...farmData,
      farmerName: form.farmerName,
      surveyNumber: form.surveyNumber,
      village: form.village,
      crop: form.crop,
      areaHa: parseFloat(form.areaHa) || 2.4,
      soilType: form.soilType,
      lat: parseFloat(form.lat) || 20.1134,
      lng: parseFloat(form.lng) || 77.1319,
    })

    setIsAnalyzing(true)
    setCompletedSteps([])
    setCurrentStep(0)
    setDone(false)

    // Run steps sequentially
    let elapsed = 0
    ANALYSIS_STEPS.forEach((step, idx) => {
      setTimeout(() => {
        setCurrentStep(idx)
      }, elapsed)
      elapsed += step.durationMs * 0.4 // show label
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, step.id])
        if (idx === ANALYSIS_STEPS.length - 1) {
          setTimeout(() => {
            setDone(true)
            setAssessmentDone(true)
            setTimeout(() => navigate('/results'), 1200)
          }, 500)
        }
      }, elapsed)
      elapsed += step.durationMs * 0.6
    })
  }

  return (
    <div className="min-h-screen bg-background py-10 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Page header */}
        <div className="mb-10 space-y-2">
          <span className="section-label">
            <Satellite className="w-3.5 h-3.5" />
            Farm Parcel Risk Assessment
          </span>
          <h1 className="text-display-lg-mobile md:text-headline-xl text-primary font-display font-bold">
            Connect a Land Parcel
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl">
            Enter your farm survey number or coordinates to generate an instant Agri-Credit Passport backed by Sentinel-2 satellite imagery.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LEFT: Input Form ── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6 md:p-8 space-y-6">
              <h2 className="text-headline-md text-primary font-display font-semibold">Farm Details</h2>

              {/* Two-column grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Farmer name */}
                <div className="space-y-1.5">
                  <label className="text-label-md font-semibold text-on-surface-variant">Farmer Name</label>
                  <input
                    type="text"
                    value={form.farmerName}
                    onChange={e => handleChange('farmerName', e.target.value)}
                    placeholder="Full name"
                    className="input-field"
                  />
                </div>

                {/* Survey number */}
                <div className="space-y-1.5">
                  <label className="text-label-md font-semibold text-on-surface-variant">Survey / Khasra Number</label>
                  <input
                    type="text"
                    value={form.surveyNumber}
                    onChange={e => handleChange('surveyNumber', e.target.value)}
                    placeholder="e.g. 42/B"
                    className="input-field"
                  />
                </div>

                {/* Village */}
                <div className="space-y-1.5">
                  <label className="text-label-md font-semibold text-on-surface-variant">Village / District</label>
                  <input
                    type="text"
                    value={form.village}
                    onChange={e => handleChange('village', e.target.value)}
                    placeholder="e.g. Washim, Maharashtra"
                    className="input-field"
                  />
                </div>

                {/* Area */}
                <div className="space-y-1.5">
                  <label className="text-label-md font-semibold text-on-surface-variant">Area (Hectares)</label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={form.areaHa}
                    onChange={e => handleChange('areaHa', e.target.value)}
                    className="input-field"
                  />
                </div>

                {/* Crop */}
                <div className="space-y-1.5">
                  <label className="text-label-md font-semibold text-on-surface-variant">Primary Crop</label>
                  <select
                    value={form.crop}
                    onChange={e => handleChange('crop', e.target.value)}
                    className="input-field appearance-none"
                  >
                    {CROPS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                {/* Soil */}
                <div className="space-y-1.5">
                  <label className="text-label-md font-semibold text-on-surface-variant">Soil Type</label>
                  <select
                    value={form.soilType}
                    onChange={e => handleChange('soilType', e.target.value)}
                    className="input-field appearance-none"
                  >
                    {SOIL_TYPES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                {/* Lat */}
                <div className="space-y-1.5">
                  <label className="text-label-md font-semibold text-on-surface-variant">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={form.lat}
                    onChange={e => handleChange('lat', e.target.value)}
                    placeholder="e.g. 20.1134"
                    className="input-field font-mono"
                  />
                </div>

                {/* Lng */}
                <div className="space-y-1.5">
                  <label className="text-label-md font-semibold text-on-surface-variant">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={form.lng}
                    onChange={e => handleChange('lng', e.target.value)}
                    placeholder="e.g. 77.1319"
                    className="input-field font-mono"
                  />
                </div>
              </div>

              {/* Pre-fill demo button */}
              <div className="pt-2 flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => setForm({
                    farmerName: 'Ramesh Dattatray Patil',
                    surveyNumber: '42/B',
                    village: 'Washim, Maharashtra',
                    crop: 'Soybean',
                    areaHa: '2.4',
                    soilType: 'Black Cotton (Vertisol)',
                    lat: '20.1134',
                    lng: '77.1319',
                  })}
                  className="btn-ghost text-label-md px-4 py-2"
                >
                  <MapPin className="w-4 h-4" />
                  Pre-fill demo (Washim, MH)
                </button>
                <span className="text-label-sm text-on-surface-variant">Parcel #MH-WSM-4029 · Soybean · 2.4 ha</span>
              </div>

              {/* CTA */}
              <div className="pt-4">
                <button
                  onClick={startAnalysis}
                  disabled={isAnalyzing}
                  className="btn-primary w-full md:w-auto px-8 py-4 text-base rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
                  id="assess-farm-btn"
                >
                  {isAnalyzing ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Analysing…</>
                  ) : (
                    <><Satellite className="w-5 h-5" /> Assess my farm</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Analysis stepper & Map ── */}
          <div className="space-y-6">
            {/* Analysis stepper */}
            <div className="card p-6 space-y-4">
              <h3 className="text-headline-md text-primary font-display font-semibold">Analysis Pipeline</h3>
              <div className="space-y-3">
                {ANALYSIS_STEPS.map((step, idx) => {
                  const isCompleted = completedSteps.includes(step.id)
                  const isActive = isAnalyzing && currentStep === idx && !isCompleted
                  return (
                    <div key={step.id} className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isActive ? 'bg-surface-container-low' : ''
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 transition-all duration-300 ${
                        isCompleted
                          ? 'bg-secondary-fixed text-on-secondary-fixed'
                          : isActive
                          ? 'bg-primary-container text-primary-fixed'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}>
                        {isCompleted ? (
                          <Check className="w-4 h-4" />
                        ) : isActive ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <span>{step.icon}</span>
                        )}
                      </div>
                      <span className={`text-body-sm transition-colors ${
                        isCompleted ? 'text-on-surface' : isActive ? 'text-primary font-medium' : 'text-on-surface-variant'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Done message */}
              <AnimatePresence>
                {done && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-secondary-fixed/20 border border-secondary-fixed rounded-xl p-4 text-center"
                  >
                    <div className="text-2xl mb-1">✅</div>
                    <p className="text-label-lg font-bold text-primary">Assessment complete!</p>
                    <p className="text-body-sm text-on-surface-variant">Redirecting to results…</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Map placeholder */}
            <div className="card p-0 overflow-hidden">
              <div className="relative w-full h-64 bg-primary-container flex items-center justify-center">
                <img src="/images/satellite_farm.jpg" alt="Satellite Farm" className="w-full h-full absolute inset-0 object-cover" />
                {isAnalyzing && (
                  <div className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-secondary-fixed/30 to-transparent animate-radar pointer-events-none" />
                )}
                <div className="absolute top-3 left-3 bg-primary/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-label-sm text-primary-fixed font-mono flex items-center gap-1.5">
                  <Satellite className="w-3 h-3" />
                  {form.lat}, {form.lng}
                </div>
                <div className="relative z-10 text-center">
                  <MapPin className="w-8 h-8 text-secondary-fixed mx-auto" />
                  <p className="text-label-sm text-primary-fixed mt-1 font-semibold">{form.village || 'Enter village to pin'}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-label-sm text-on-surface-variant text-center">
                  Sentinel-2 · Band B4/B8 NDVI Composite
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
