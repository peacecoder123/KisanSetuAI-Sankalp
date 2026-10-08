import React, { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipForward, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { DEMO_CONFIG } from '../demo.config'

export function GuidedDemo() {
  const { isDemoRunning, setIsDemoRunning, demoStep, setDemoStep } = useApp()
  const navigate = useNavigate()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startTimeRef = useRef<number>(0)
  const [isPaused, setIsPaused] = React.useState(false)
  const pausedAtRef = useRef<number>(0)

  const steps = DEMO_CONFIG.demoSteps
  const currentStep = steps[demoStep] ?? steps[0]

  const goToStep = useCallback((index: number) => {
    if (index >= steps.length) {
      // Demo finished
      setIsDemoRunning(false)
      setDemoStep(0)
      navigate('/')
      return
    }
    setDemoStep(index)
    navigate(steps[index].route)
  }, [steps, setIsDemoRunning, setDemoStep, navigate])

  // Auto-advance timer
  useEffect(() => {
    if (!isDemoRunning || isPaused) return
    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => {
      goToStep(demoStep + 1)
    }, currentStep.durationMs)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isDemoRunning, isPaused, demoStep, currentStep.durationMs, goToStep])

  // Press D to start demo
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') {
        if (!isDemoRunning && document.activeElement?.tagName !== 'INPUT') {
          startDemo()
        }
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isDemoRunning])

  const startDemo = () => {
    setDemoStep(0)
    setIsDemoRunning(true)
    setIsPaused(false)
    navigate(steps[0].route)
  }

  const togglePause = () => setIsPaused(p => !p)

  const skip = () => goToStep(demoStep + 1)

  const exit = () => {
    setIsDemoRunning(false)
    setDemoStep(0)
    setIsPaused(false)
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  if (!isDemoRunning) return null

  const progress = ((demoStep + 1) / steps.length) * 100

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.3 }}
        className="demo-caption-bar"
        role="status"
        aria-live="polite"
      >
        {/* Step indicator dots */}
        <div className="hidden sm:flex items-center gap-1">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => goToStep(i)}
              className={`rounded-full transition-all duration-300 ${
                i === demoStep
                  ? 'w-6 h-2 bg-secondary-fixed'
                  : i < demoStep
                  ? 'w-2 h-2 bg-secondary-fixed/60'
                  : 'w-2 h-2 bg-white/20'
              }`}
              title={steps[i].label}
            />
          ))}
        </div>

        {/* Caption text */}
        <div className="flex-1 min-w-0">
          <p className="text-label-sm text-primary-fixed/70 font-semibold uppercase tracking-wider truncate">
            Step {demoStep + 1}/{steps.length} · {currentStep.label}
          </p>
          <p className="text-body-sm text-white/90 line-clamp-2 mt-0.5">
            {currentStep.caption}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={togglePause}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <button
            onClick={skip}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            title="Skip step"
          >
            <SkipForward className="w-4 h-4" />
          </button>
          <button
            onClick={exit}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            title="Exit demo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-2xl overflow-hidden">
          <motion.div
            className="h-full bg-secondary-fixed"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Exported helper to trigger demo from any page
export function useDemoStarter() {
  const { setIsDemoRunning, setDemoStep } = useApp()
  const navigate = useNavigate()
  const steps = DEMO_CONFIG.demoSteps

  return () => {
    setDemoStep(0)
    setIsDemoRunning(true)
    navigate(steps[0].route)
  }
}
