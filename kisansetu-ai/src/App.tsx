import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { CommandPalette } from './components/CommandPalette'
import { GuidedDemo } from './components/GuidedDemo'

// Lazy-load all route-level pages
const LandingPage = lazy(() => import('./pages/Landing'))
const FarmAssessmentPage = lazy(() => import('./pages/FarmAssessment'))
const ClimateRiskResultsPage = lazy(() => import('./pages/ClimateRiskResults'))
const CreditPassportPage = lazy(() => import('./pages/CreditPassport'))
const AdvisoryAlertsPage = lazy(() => import('./pages/AdvisoryAlerts'))
const LenderDashboardPage = lazy(() => import('./pages/LenderDashboard'))
const ApiPlaygroundPage = lazy(() => import('./pages/ApiPlayground'))
const MobileAppPage = lazy(() => import('./pages/MobileApp'))
const AboutPage = lazy(() => import('./pages/About'))

// Loading spinner
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-secondary-fixed border-t-transparent animate-spin" />
        <p className="text-body-md text-on-surface-variant">Loading...</p>
      </div>
    </div>
  )
}

// Layout wrapper for most pages
function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

// Lender Dashboard has its own dark layout
function DarkLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b1410]">
      <Navbar />
      <main className="flex-grow">{children}</main>
    </div>
  )
}

// Mobile App page has no nav/footer (it's a phone frame demo)
function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-container-low">
      <Navbar />
      <main className="flex-grow">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <CommandPalette />
        <GuidedDemo />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={
              <MainLayout><LandingPage /></MainLayout>
            } />
            <Route path="/assess" element={
              <MainLayout><FarmAssessmentPage /></MainLayout>
            } />
            <Route path="/results" element={
              <MainLayout><ClimateRiskResultsPage /></MainLayout>
            } />
            <Route path="/passport" element={
              <MainLayout><CreditPassportPage /></MainLayout>
            } />
            <Route path="/advisory" element={
              <MainLayout><AdvisoryAlertsPage /></MainLayout>
            } />
            <Route path="/lender" element={
              <DarkLayout><LenderDashboardPage /></DarkLayout>
            } />
            <Route path="/api" element={
              <DarkLayout><ApiPlaygroundPage /></DarkLayout>
            } />
            <Route path="/mobile" element={
              <MobileLayout><MobileAppPage /></MobileLayout>
            } />
            <Route path="/about" element={
              <MainLayout><AboutPage /></MainLayout>
            } />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppProvider>
  )
}
