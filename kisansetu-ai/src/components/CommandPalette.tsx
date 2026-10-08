import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Satellite, ChartBar, CreditCard, MessageSquare, LayoutDashboard, Code, Smartphone, Info, Home } from 'lucide-react'
import { useApp } from '../context/AppContext'

const COMMANDS = [
  { id: 'home', label: 'Go to Landing Page', icon: Home, route: '/', group: 'Navigation' },
  { id: 'assess', label: 'Assess a Farm', icon: Satellite, route: '/assess', group: 'Navigation' },
  { id: 'results', label: 'Climate Risk Results', icon: ChartBar, route: '/results', group: 'Navigation' },
  { id: 'passport', label: 'Agri-Credit Passport', icon: CreditCard, route: '/passport', group: 'Navigation' },
  { id: 'advisory', label: 'Advisory & Alerts', icon: MessageSquare, route: '/advisory', group: 'Navigation' },
  { id: 'lender', label: 'Lender Dashboard', icon: LayoutDashboard, route: '/lender', group: 'Navigation' },
  { id: 'api', label: 'API Playground', icon: Code, route: '/api', group: 'Navigation' },
  { id: 'mobile', label: 'Farmer Mobile App', icon: Smartphone, route: '/mobile', group: 'Navigation' },
  { id: 'about', label: 'About KisanSetu AI', icon: Info, route: '/about', group: 'Navigation' },
]

export function CommandPalette() {
  const { isCommandPaletteOpen, setIsCommandPaletteOpen } = useApp()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const filtered = query
    ? COMMANDS.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : COMMANDS

  const execute = useCallback((cmd: typeof COMMANDS[0]) => {
    navigate(cmd.route)
    setIsCommandPaletteOpen(false)
    setQuery('')
  }, [navigate, setIsCommandPaletteOpen])

  // Keyboard: Ctrl/Cmd+K to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsCommandPaletteOpen(!isCommandPaletteOpen)
        setQuery('')
        setSelectedIndex(0)
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen])

  // Arrow navigation inside palette
  useEffect(() => {
    if (!isCommandPaletteOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, filtered.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
      }
      if (e.key === 'Enter' && filtered[selectedIndex]) {
        execute(filtered[selectedIndex])
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isCommandPaletteOpen, filtered, selectedIndex, execute])

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isCommandPaletteOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => setIsCommandPaletteOpen(false)}
          />

          {/* Palette Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.15 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl bg-surface rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-outline-variant/20">
              <Search className="w-5 h-5 text-on-surface-variant flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search screens, features..."
                className="flex-1 bg-transparent text-body-lg text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none"
              />
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded text-label-sm bg-surface-container text-on-surface-variant font-mono">Esc</kbd>
              </div>
            </div>

            {/* Commands List */}
            <div className="py-2 max-h-80 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="px-4 py-6 text-center text-body-md text-on-surface-variant">No results found</p>
              ) : (
                <>
                  <p className="px-4 py-1 text-label-sm text-on-surface-variant/60 uppercase tracking-wider">
                    Navigation
                  </p>
                  {filtered.map((cmd, i) => {
                    const Icon = cmd.icon
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => execute(cmd)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          i === selectedIndex
                            ? 'bg-surface-container text-primary'
                            : 'text-on-surface hover:bg-surface-container-low'
                        }`}
                      >
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          i === selectedIndex ? 'bg-primary-container text-primary-fixed' : 'bg-surface-container text-on-surface-variant'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="text-body-md font-medium">{cmd.label}</span>
                        {i === selectedIndex && (
                          <kbd className="ml-auto px-1.5 py-0.5 rounded text-label-sm bg-surface-container text-on-surface-variant font-mono">↵</kbd>
                        )}
                      </button>
                    )
                  })}
                </>
              )}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2.5 border-t border-outline-variant/20 flex items-center gap-4 text-label-sm text-on-surface-variant">
              <span>↑↓ Navigate</span>
              <span>↵ Open</span>
              <span className="ml-auto flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-surface-container font-mono">⌘K</kbd>
                to toggle
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
