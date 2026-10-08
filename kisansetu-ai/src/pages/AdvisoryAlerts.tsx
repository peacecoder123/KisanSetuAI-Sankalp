import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Mic, Phone, MessageSquare, AlertTriangle,
  CheckCircle, Info, ChevronRight, Volume2, X
} from 'lucide-react'
import { getAlerts, askAdvisory, QA_PAIRS, LANGUAGE_LABELS, type Language } from '../data/services'
import type { AdvisoryMessage } from '../data/types'

const LANGS = Object.entries(LANGUAGE_LABELS) as [Language, string][]

// Simulated typing effect
function useTypingEffect(text: string, speed = 18) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    setDisplayed('')
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(interval)
    }, speed)
    return () => clearInterval(interval)
  }, [text])
  return displayed
}

function TypingMessage({ content }: { content: string }) {
  const text = useTypingEffect(content)
  return <span>{text}<span className="animate-blink">|</span></span>
}

// SMS/WhatsApp mockup modal
function PhoneMockup({ message, language, onClose }: { message: string; language: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="w-72 bg-[#1a1a2e] rounded-[2.5rem] border-8 border-gray-800 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Phone top notch */}
        <div className="bg-gray-900 h-7 flex items-center justify-center">
          <div className="w-20 h-4 bg-gray-800 rounded-full" />
        </div>
        {/* Status bar */}
        <div className="bg-[#075E54] px-4 py-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">KS</div>
          <div className="flex-1">
            <p className="text-white text-sm font-bold">KisanSetu AI</p>
            <p className="text-white/70 text-xs">Agricultural Advisory • {language}</p>
          </div>
          <Phone className="w-4 h-4 text-white/60" />
        </div>
        {/* Chat area */}
        <div className="bg-[#0d1117] min-h-48 p-3 flex flex-col gap-3">
          <div className="self-end max-w-[80%] bg-[#005C4B] rounded-xl rounded-tr-none px-3 py-2 text-white text-sm">
            नमस्कार, माझ्या शेतीबद्दल माहिती हवी आहे
          </div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="self-start max-w-[90%] bg-[#1e2a22] rounded-xl rounded-tl-none px-3 py-2 text-white/90 text-sm leading-relaxed"
          >
            {message}
          </motion.div>
        </div>
        {/* Input area */}
        <div className="bg-[#1a1a2e] px-3 py-2 flex items-center gap-2 border-t border-gray-800">
          <div className="flex-1 bg-[#2a2a3e] rounded-full px-3 py-1.5 text-gray-400 text-xs">
            Type a message...
          </div>
          <div className="w-8 h-8 rounded-full bg-[#005C4B] flex items-center justify-center">
            <Mic className="w-4 h-4 text-white" />
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>
  )
}

export default function AdvisoryAlertsPage() {
  const alerts = getAlerts()
  const [language, setLanguage] = useState<Language>('marathi')
  const [messages, setMessages] = useState<AdvisoryMessage[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isVoice, setIsVoice] = useState(false)
  const [showPhone, setShowPhone] = useState<string | null>(null)
  const [lastMsg, setLastMsg] = useState<string>('')
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initial greeting message
    const pairs = QA_PAIRS[language] ?? QA_PAIRS.english
    if (pairs.length > 0) {
      setMessages([{
        id: '0',
        role: 'assistant',
        content: `${LANGUAGE_LABELS[language]} · KisanSetu AI Advisory ready. Ask me anything about your farm, crops, weather, or credit. (${pairs.length} pre-loaded answers available)`,
        language,
        timestamp: new Date().toISOString(),
      }])
    }
  }, [language])

  const sendMessage = (text?: string) => {
    const q = text || input.trim()
    if (!q) return

    const userMsg: AdvisoryMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: q,
      language,
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const response = askAdvisory(q, language)
      setMessages(prev => [...prev, response])
      setLastMsg(response.content)
      setIsTyping(false)
      setTimeout(() => chatRef.current?.scrollTo({ top: 99999, behavior: 'smooth' }), 100)
    }, 1200)
  }

  const severityStyle = (s: string) =>
    s === 'red' ? 'bg-error-container border-error/30' :
    s === 'amber' ? 'bg-tertiary-fixed/20 border-tertiary-fixed/50' :
    'bg-secondary-fixed/10 border-secondary-fixed/30'

  const severityIcon = (s: string) =>
    s === 'red' ? <AlertTriangle className="w-5 h-5 text-error" /> :
    s === 'amber' ? <AlertTriangle className="w-5 h-5 text-tertiary" /> :
    <CheckCircle className="w-5 h-5 text-secondary" />

  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-8">
      {/* Phone mockup modal */}
      <AnimatePresence>
        {showPhone && (
          <PhoneMockup
            message={showPhone}
            language={LANGUAGE_LABELS[language]}
            onClose={() => setShowPhone(null)}
          />
        )}
      </AnimatePresence>

      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="section-label"><MessageSquare className="w-3.5 h-3.5" /> Advisory &amp; Alerts</span>
            <h1 className="text-headline-xl text-primary font-display font-bold">Multilingual Agronomic Advisory</h1>
          </div>
          {/* Language selector */}
          <div className="flex flex-wrap gap-2">
            {LANGS.map(([id, label]) => (
              <button
                key={id}
                onClick={() => setLanguage(id)}
                className={`px-3 py-1.5 rounded-full text-label-md font-semibold transition-all ${
                  language === id
                    ? 'bg-primary-container text-primary-fixed shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:text-primary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ── CHAT ── */}
          <div className="lg:col-span-3 card flex flex-col" style={{ height: '70vh' }}>
            <div className="p-4 border-b border-outline-variant/20 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-sm">🤖</div>
              <div>
                <p className="text-label-lg font-bold text-primary">KisanSetu AI Advisor</p>
                <p className="text-label-sm text-on-surface-variant">Parcel MH-WSM-4029 · {LANGUAGE_LABELS[language]}</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                <span className="text-label-sm text-secondary font-semibold">Live</span>
              </div>
            </div>

            {/* Messages */}
            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-primary-container flex items-center justify-center text-sm flex-shrink-0 mt-1">🤖</div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-primary-container text-white rounded-tr-none'
                      : 'bg-surface-container-low text-on-surface rounded-tl-none'
                  }`}>
                    <p className="text-body-md leading-relaxed">
                      {msg.role === 'assistant' && i === messages.length - 1 && !isTyping
                        ? <TypingMessage content={msg.content} />
                        : msg.content
                      }
                    </p>
                    {msg.sources && (
                      <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-outline-variant/20">
                        {msg.sources.map(s => (
                          <span key={s} className="badge bg-surface-container text-on-surface-variant text-[10px] px-2 py-0.5">
                            📄 {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex gap-2 items-center">
                  <div className="w-8 h-8 rounded-xl bg-primary-container flex items-center justify-center text-sm">🤖</div>
                  <div className="bg-surface-container-low rounded-2xl rounded-tl-none px-4 py-3 flex gap-1">
                    {[0, 1, 2].map(d => (
                      <span key={d} className="w-2 h-2 rounded-full bg-on-surface-variant/40 animate-pulse" style={{ animationDelay: `${d * 150}ms` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick questions */}
            <div className="px-4 py-2 border-t border-outline-variant/10 flex gap-2 overflow-x-auto no-scrollbar">
              {(QA_PAIRS[language] ?? QA_PAIRS.english).slice(0, 3).map(pair => (
                <button
                  key={pair.q}
                  onClick={() => sendMessage(pair.q)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full bg-surface-container text-label-sm font-medium text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors whitespace-nowrap"
                >
                  {pair.q.slice(0, 40)}…
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-outline-variant/20 flex items-center gap-3">
              {/* Simulated voice waveform */}
              {isVoice && (
                <div className="flex items-center gap-0.5 h-6">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="wave-bar"
                      style={{ height: `${Math.random() * 20 + 6}px`, animationDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>
              )}
              {!isVoice && (
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder={`Ask in ${LANGUAGE_LABELS[language]}…`}
                  className="flex-1 bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-2.5 text-body-md focus:outline-none focus:ring-2 focus:ring-secondary-fixed/50 focus:border-secondary-fixed"
                />
              )}
              <button
                onClick={() => setIsVoice(v => !v)}
                className={`btn-icon flex-shrink-0 ${isVoice ? 'bg-error-container text-error' : ''}`}
                title="Voice input"
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() && !isVoice}
                className="btn-primary px-4 py-2.5 disabled:opacity-40 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── ALERTS ── */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-headline-md text-primary font-display font-semibold">Real-Time Alerts</h2>
            <p className="text-body-sm text-on-surface-variant">Parcel MH-WSM-4029 · Automated by Sentinel-2 + IMD</p>

            {alerts.map(alert => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                className={`card p-4 space-y-3 border ${severityStyle(alert.severity)}`}
              >
                <div className="flex items-start gap-3">
                  {severityIcon(alert.severity)}
                  <div className="flex-1">
                    <p className="text-label-lg font-bold text-primary">{alert.title}</p>
                    <p className="text-label-sm text-on-surface-variant">{alert.titleEn}</p>
                  </div>
                  <span className="text-label-sm text-on-surface-variant whitespace-nowrap">
                    {new Date(alert.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">{alert.message}</p>
                {alert.actionable && (
                  <div className="bg-surface/50 rounded-lg p-2.5">
                    <p className="text-label-sm font-semibold text-primary">Action: {alert.actionable}</p>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-label-sm text-on-surface-variant/60">{alert.source}</span>
                  <button
                    onClick={() => setShowPhone(alert.message)}
                    className="flex items-center gap-1.5 text-label-sm font-semibold text-secondary hover:text-primary transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Send SMS/WhatsApp
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
