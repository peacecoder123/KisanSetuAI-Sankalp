import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { PersonaType, ThemeType } from '../data/types'

// ─── App Context ─────────────────────────────────────────────────────────────

interface AppContextValue {
  theme: ThemeType
  toggleTheme: () => void
  persona: PersonaType
  setPersona: (p: PersonaType) => void
  isDemoRunning: boolean
  setIsDemoRunning: (v: boolean) => void
  demoStep: number
  setDemoStep: (v: number) => void
  isCommandPaletteOpen: boolean
  setIsCommandPaletteOpen: (v: boolean) => void
  farmData: FarmData
  setFarmData: (d: FarmData) => void
  assessmentDone: boolean
  setAssessmentDone: (v: boolean) => void
}

export interface FarmData {
  parcelId: string
  lat: number
  lng: number
  crop: string
  areaHa: number
  surveyNumber: string
  village: string
  soilType: string
  farmerName: string
}

const DEFAULT_FARM: FarmData = {
  parcelId: 'MH-WSM-4029',
  lat: 20.1134,
  lng: 77.1319,
  crop: 'Soybean',
  areaHa: 2.4,
  surveyNumber: '42/B',
  village: 'Washim, Maharashtra',
  soilType: 'Black Cotton (Vertisol)',
  farmerName: 'Ramesh Dattatray Patil',
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>('light')
  const [persona, setPersona] = useState<PersonaType>('farmer')
  const [isDemoRunning, setIsDemoRunning] = useState(false)
  const [demoStep, setDemoStep] = useState(0)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [farmData, setFarmData] = useState<FarmData>(DEFAULT_FARM)
  const [assessmentDone, setAssessmentDone] = useState(false)

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light'
      // Apply dark class to document
      if (next === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return next
    })
  }, [])

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      persona, setPersona,
      isDemoRunning, setIsDemoRunning,
      demoStep, setDemoStep,
      isCommandPaletteOpen, setIsCommandPaletteOpen,
      farmData, setFarmData,
      assessmentDone, setAssessmentDone,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
