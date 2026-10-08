import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sun, Moon, Menu, X, Satellite, ChevronDown,
  User, Building2, Shield
} from 'lucide-react'
import { Logo } from './Logo'
import { useApp } from '../context/AppContext'
import type { PersonaType } from '../data/types'

const NAV_LINKS = [
  { label: 'Platform', href: '/#platform' },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Lenders', href: '/lender' },
  { label: 'About', href: '/about' },
]

const PERSONAS: { id: PersonaType; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'farmer', label: 'Farmer', icon: User },
  { id: 'lender', label: 'Lender', icon: Building2 },
  { id: 'insurer', label: 'Insurer', icon: Shield },
]

export function Navbar() {
  const { theme, toggleTheme, persona, setPersona } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (href: string) => location.pathname === href

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-surface/90 backdrop-blur-md shadow-sm border-b border-outline-variant/30 transition-all duration-200">
        <div className="w-full max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-secondary-fixed rounded-lg"
            >
              <Logo width={180} />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={e => {
                    if (link.href.startsWith('/') && !link.href.startsWith('/#')) {
                      e.preventDefault()
                      navigate(link.href)
                    }
                  }}
                  className={`px-3 py-2 rounded-lg text-label-lg font-semibold transition-colors duration-150 ${
                    isActive(link.href)
                      ? 'text-primary bg-surface-container-low'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Persona Switcher */}
            <div
              role="group"
              aria-label="Persona switcher"
              className="hidden md:flex bg-surface-container border border-outline-variant/40 p-1 rounded-full items-center gap-1 text-label-sm shadow-inner"
            >
              {PERSONAS.map(p => {
                const Icon = p.icon
                return (
                  <button
                    key={p.id}
                    id={`persona-${p.id}`}
                    onClick={() => setPersona(p.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-sm font-semibold transition-all duration-200 ${
                      persona === p.id
                        ? 'bg-primary-container text-primary-fixed shadow-sm'
                        : 'text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {p.label}
                  </button>
                )
              })}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="btn-icon"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Primary CTA */}
            <Link
              to="/assess"
              className="hidden sm:inline-flex btn-primary gap-2 text-sm"
            >
              <Satellite className="w-4 h-4" />
              <span>Assess a farm</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="btn-icon lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden bg-surface border-t border-outline-variant/20 overflow-hidden"
            >
              <nav className="px-6 py-4 flex flex-col gap-2">
                {NAV_LINKS.map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2.5 rounded-xl text-label-lg font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                {/* Mobile Persona Switcher */}
                <div className="pt-3 border-t border-outline-variant/20">
                  <p className="text-label-sm text-on-surface-variant mb-2 px-1">Viewing as:</p>
                  <div className="flex gap-2">
                    {PERSONAS.map(p => (
                      <button
                        key={p.id}
                        onClick={() => { setPersona(p.id); setMobileOpen(false) }}
                        className={`flex-1 py-2 rounded-xl text-label-sm font-semibold transition-all ${
                          persona === p.id
                            ? 'bg-primary-container text-primary-fixed'
                            : 'bg-surface-container-low text-on-surface-variant'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                <Link
                  to="/assess"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary mt-2 text-center justify-center"
                >
                  <Satellite className="w-4 h-4" />
                  Assess a farm
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
