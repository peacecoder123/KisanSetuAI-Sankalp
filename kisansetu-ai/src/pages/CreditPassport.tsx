import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import QRCode from 'react-qr-code'
import { Download, Share2, QrCode, ChevronDown, CheckCircle, Info } from 'lucide-react'
import { getCreditPassport, getRepaymentPlan } from '../data/services'

// Initials avatar
function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('')
  return (
    <div className="w-16 h-16 rounded-2xl bg-primary-container flex items-center justify-center text-primary-fixed text-headline-md font-display font-bold shadow-md">
      {initials}
    </div>
  )
}

export default function CreditPassportPage() {
  const passport = getCreditPassport()
  const [planType, setPlanType] = useState<'fixed' | 'climate-adaptive'>('fixed')
  const [showQR, setShowQR] = useState(false)
  const plan = getRepaymentPlan(planType)

  const totalPositive = passport.explainabilityFactors
    .filter(f => f.direction === 'positive')
    .reduce((s, f) => s + f.contribution, 0)
  const totalNegative = passport.explainabilityFactors
    .filter(f => f.direction === 'negative')
    .reduce((s, f) => s + Math.abs(f.contribution), 0)

  const handleDownload = () => {
    // In a real implementation this would use html2canvas
    alert('Download as PDF: In production, this exports the passport card as a signed PDF with QR code embedded.')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'KisanSetu Agri-Credit Passport', url: passport.qrData })
    } else {
      navigator.clipboard.writeText(passport.qrData)
      alert('Passport URL copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <span className="section-label">
            <QrCode className="w-3.5 h-3.5" />
            Agri-Credit Passport
          </span>
          <h1 className="text-headline-xl text-primary font-display font-bold">
            Digital Credit Identity
          </h1>
          <p className="text-body-lg text-on-surface-variant">
            Cryptographically verifiable, non-repudiable credit passport for formal underwriting.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── PASSPORT CARD ── */}
          <div className="lg:col-span-1 space-y-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-primary-container rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden"
              id="passport-card"
            >
              {/* Background decoration */}
              <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full border border-white/10" />
              <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full border border-white/5" />

              {/* Header row */}
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <Avatar name={passport.farmerName} />
                  <div>
                    <p className="text-headline-md font-display font-bold text-white leading-tight">{passport.farmerName}</p>
                    <p className="text-label-md text-primary-fixed/80">{passport.village}, {passport.state}</p>
                  </div>
                </div>
                {/* Verified badge */}
                <div className="flex flex-col items-end gap-1">
                  <CheckCircle className="w-6 h-6 text-secondary-fixed" />
                  <span className="text-label-sm text-primary-fixed/70">Verified</span>
                </div>
              </div>

              {/* Score display */}
              <div className="relative z-10 mt-6 flex items-center gap-5">
                <div>
                  <p className="text-label-sm text-primary-fixed/70 uppercase tracking-wider">Resilience Score</p>
                  <p className="text-[56px] leading-none font-display font-extrabold text-white">{passport.resilienceScore}</p>
                  <span className="inline-block bg-secondary-fixed text-on-secondary-fixed text-label-lg font-bold px-3 py-1 rounded-full mt-1">
                    Tier {passport.tier}
                  </span>
                </div>
                <div className="flex-1 space-y-2 pl-4 border-l border-white/20">
                  <div>
                    <p className="text-label-sm text-primary-fixed/60">Credit Limit</p>
                    <p className="text-headline-md font-bold text-secondary-fixed font-mono">
                      ₹{(passport.creditLimit / 100000).toFixed(1)}L
                    </p>
                  </div>
                  <div>
                    <p className="text-label-sm text-primary-fixed/60">Interest Rate</p>
                    <p className="text-headline-md font-bold text-white font-mono">{passport.interestRate}% p.a.</p>
                  </div>
                </div>
              </div>

              {/* Details grid */}
              <div className="relative z-10 mt-5 grid grid-cols-2 gap-3 text-label-sm">
                {[
                  { label: 'Parcel ID', value: passport.parcelId },
                  { label: 'Area', value: `${passport.areaHa} ha` },
                  { label: 'Crop', value: passport.crop },
                  { label: 'Soil', value: passport.soilType.split(' ')[0] },
                  { label: 'Issued', value: passport.issuedDate },
                  { label: 'Expires', value: passport.expiryDate },
                ].map(f => (
                  <div key={f.label}>
                    <p className="text-primary-fixed/60">{f.label}</p>
                    <p className="text-primary-fixed font-semibold">{f.value}</p>
                  </div>
                ))}
              </div>

              {/* Hash */}
              <p className="relative z-10 mt-4 text-[10px] text-primary-fixed/40 font-mono break-all">
                {passport.passportHash}
              </p>
            </motion.div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowQR(s => !s)}
                className="flex-1 btn-secondary gap-2"
              >
                <QrCode className="w-4 h-4" />
                {showQR ? 'Hide QR' : 'Show QR'}
              </button>
              <button onClick={handleDownload} className="btn-icon" title="Download passport">
                <Download className="w-5 h-5" />
              </button>
              <button onClick={handleShare} className="btn-icon" title="Share passport">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* QR Code */}
            {showQR && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card p-6 flex flex-col items-center gap-3"
              >
                <div className="qr-container">
                  <QRCode value={passport.qrData} size={160} level="M" />
                </div>
                <p className="text-label-sm text-on-surface-variant text-center">
                  Scan to verify passport on KisanSetu AI
                </p>
                <p className="text-label-sm text-secondary font-mono break-all text-center">
                  {passport.qrData}
                </p>
              </motion.div>
            )}

            {/* Farmer details */}
            <div className="card p-5 space-y-3">
              <h3 className="text-label-lg font-bold text-primary">Identity Details</h3>
              {[
                { label: 'Aadhaar', value: passport.aadhaarMasked },
                { label: 'Mobile', value: passport.mobileNumber },
                { label: 'Bank', value: passport.bankAccount },
                { label: 'KCC Card', value: passport.kccCardNumber },
              ].map(d => (
                <div key={d.label} className="flex justify-between text-body-sm">
                  <span className="text-on-surface-variant">{d.label}</span>
                  <span className="font-mono font-semibold text-primary">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── EXPLAINABILITY + REPAYMENT ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Explainability */}
            <div className="card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-headline-md text-primary font-display font-semibold">Score Explainability</h2>
                <Info className="w-4 h-4 text-on-surface-variant" />
              </div>
              <p className="text-body-sm text-on-surface-variant">
                XGBoost feature contributions — positive factors add, negative factors subtract from baseline.
              </p>

              {/* Chart */}
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  layout="vertical"
                  data={passport.explainabilityFactors.map(f => ({
                    ...f,
                    contribution: f.direction === 'negative' ? -Math.abs(f.contribution) : f.contribution,
                  }))}
                  margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid stroke="#e6f0e9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} domain={[-20, 30]} />
                  <YAxis dataKey="factor" type="category" width={180} tick={{ fontSize: 11, fill: '#414944' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none' }}
                    formatter={(v: any) => [`${v > 0 ? '+' : ''}${v} pts`, 'Contribution']}
                  />
                  <Bar dataKey="contribution" radius={4}>
                    {passport.explainabilityFactors.map((f, i) => (
                      <Cell key={i} fill={f.direction === 'positive' ? '#7CD959' : '#ba1a1a'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Repayment Planner */}
            <div className="card p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-headline-md text-primary font-display font-semibold">Repayment Planner</h2>
                <div className="flex gap-2 bg-surface-container-low p-1.5 rounded-xl">
                  {(['fixed', 'climate-adaptive'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setPlanType(t)}
                      className={`px-4 py-2 rounded-lg text-label-md font-semibold capitalize transition-all ${
                        planType === t
                          ? 'bg-primary-container text-primary-fixed shadow-sm'
                          : 'text-on-surface-variant hover:text-primary'
                      }`}
                    >
                      {t === 'fixed' ? '📅 Fixed EMI' : '🌿 Climate-Adaptive'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Loan', value: `₹${(plan.totalLoan / 100000).toFixed(1)}L` },
                  { label: 'Interest Rate', value: `${plan.interestRate}% p.a.` },
                  { label: planType === 'fixed' ? 'Monthly EMI' : 'Avg. Monthly', value: planType === 'fixed' ? `₹${plan.emi?.toLocaleString('en-IN')}` : `₹${Math.round(plan.totalPayable / plan.tenureMonths).toLocaleString('en-IN')}` },
                  { label: 'Total Payable', value: `₹${plan.totalPayable.toLocaleString('en-IN')}` },
                ].map(m => (
                  <div key={m.label} className="bg-surface-container-low rounded-xl p-3">
                    <p className="text-label-sm text-on-surface-variant">{m.label}</p>
                    <p className="text-headline-md font-display font-bold text-primary font-mono">{m.value}</p>
                  </div>
                ))}
              </div>

              {planType === 'climate-adaptive' && (
                <div className="bg-secondary-fixed/10 border border-secondary-fixed/30 rounded-xl p-3 flex items-start gap-2">
                  <span className="text-lg">🌿</span>
                  <p className="text-body-sm text-on-surface-variant">
                    Climate-adaptive schedule reduces sowing-month instalments by up to 60% and triggers large balloon payments aligned with harvest income — reducing default risk by an estimated 22%.
                  </p>
                </div>
              )}

              {/* Schedule table */}
              <div className="overflow-x-auto rounded-xl border border-outline-variant/30">
                <table className="w-full text-body-sm">
                  <thead className="bg-surface-container-low">
                    <tr>
                      {['Month', 'Principal', 'Interest', 'Balance', 'Type'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-label-md font-bold text-on-surface-variant">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {plan.schedule.slice(0, 8).map((row, i) => (
                      <tr key={i} className={`${row.status === 'harvest' ? 'bg-secondary-fixed/10' : 'hover:bg-surface-container-low'} transition-colors`}>
                        <td className="px-4 py-2.5 font-semibold text-primary">{row.month}</td>
                        <td className="px-4 py-2.5 font-mono">₹{row.principal.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-2.5 font-mono text-on-surface-variant">₹{row.interest.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-2.5 font-mono text-on-surface-variant">₹{row.balance.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-2.5">
                          {row.status === 'harvest' ? (
                            <span className="badge bg-secondary-fixed/20 text-secondary text-label-sm">🌾 Harvest</span>
                          ) : row.climateNote ? (
                            <span className="badge bg-primary-container/20 text-primary-fixed text-label-sm">🌿 Reduced</span>
                          ) : (
                            <span className="text-on-surface-variant">EMI</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="px-4 py-2 text-label-sm text-on-surface-variant text-center">
                  Showing 8 of {plan.schedule.length} instalments
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
