import { useState, useMemo } from 'react'
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell
} from 'recharts'
import {
  ArrowUp, ArrowDown, ArrowUpDown, Search,
  Sliders
} from 'lucide-react'
import { getPortfolio, getBorrowers } from '../data/services'
import { LogoWhite } from '../components/Logo'
import type { Borrower } from '../data/types'

type SortKey = 'name' | 'score' | 'loanAmt' | 'status'

const statusStyle = (s: string) =>
  s === 'current' ? 'bg-green-900/40 text-green-400' :
  s === 'watchlist' ? 'bg-yellow-900/40 text-yellow-400' :
  'bg-red-900/40 text-red-400'

const tierColor = (score: number) =>
  score >= 75 ? '#7CD959' : score >= 60 ? '#fabc41' : score >= 45 ? '#F5B83D' : '#ba1a1a'

// District heatmap as a simple table + SVG-based India outline
function DistrictHeatmap({ data }: { data: ReturnType<typeof getPortfolio>['districtHeatmap'] }) {
  const [hovered, setHovered] = useState<string | null>(null)
  const maxExposure = Math.max(...data.map(d => d.exposure))

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {data.map(d => {
          const fill = d.score >= 75 ? '#7CD959' : d.score >= 60 ? '#fabc41' : d.score >= 45 ? '#F5B83D' : '#ba1a1a'
          const opacity = 0.3 + (d.exposure / maxExposure) * 0.7
          return (
            <div
              key={d.district}
              className="rounded-xl p-3 border border-white/10 cursor-pointer transition-all hover:scale-105"
              style={{ background: `${fill}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`, borderColor: `${fill}40` }}
              onMouseEnter={() => setHovered(d.district)}
              onMouseLeave={() => setHovered(null)}
            >
              <p className="text-white font-bold text-label-md">{d.district}</p>
              <p className="text-white/80 font-mono text-data-mono font-semibold">{d.score}</p>
              <p className="text-white/60 text-label-sm">₹{d.exposure}Cr · {d.borrowers} farmers</p>
              {hovered === d.district && (
                <p className="text-white text-label-sm mt-1">
                  Risk: {d.score >= 75 ? '✓ Low' : d.score >= 60 ? '⚠ Moderate' : '⛔ High'}
                </p>
              )}
            </div>
          )
        })}
      </div>
      {/* Legend */}
      <div className="flex items-center gap-4 text-label-sm text-[#a2d1bb]">
        {[['#7CD959', 'Low (≥75)'], ['#fabc41', 'Moderate (60–74)'], ['#ba1a1a', 'High (<60)']].map(([c, l]) => (
          <span key={l} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ background: c }} />
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function LenderDashboardPage() {
  const portfolio = getPortfolio()
  const allBorrowers = getBorrowers()
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('score')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [loanRateAdjust, setLoanRateAdjust] = useState(0)
  const [insuranceTrigger, setInsuranceTrigger] = useState(20)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10

  const filtered = useMemo(() => {
    let result = allBorrowers
    if (search) result = result.filter(b => b.name.toLowerCase().includes(search.toLowerCase()) || b.village.toLowerCase().includes(search.toLowerCase()) || b.id.includes(search))
    if (filterStatus !== 'all') result = result.filter(b => b.status === filterStatus)
    result = [...result].sort((a, b) => {
      let av = a[sortKey] as string | number
      let bv = b[sortKey] as string | number
      if (typeof av === 'string') av = av.toLowerCase()
      if (typeof bv === 'string') bv = bv.toLowerCase()
      return sortDir === 'asc' ? (av < bv ? -1 : 1) : (av > bv ? -1 : 1)
    })
    return result
  }, [allBorrowers, search, filterStatus, sortKey, sortDir])

  const pages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
    setPage(1)
  }

  const effectiveRate = (7.0 + loanRateAdjust).toFixed(1)
  const insurancePremium = ((insuranceTrigger / 100) * 1.8).toFixed(2)

  return (
    <div className="min-h-screen bg-[#0b1410] text-[#dbe5de] py-6 px-4 md:px-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <LogoWhite width={140} />
              <span className="px-2.5 py-1 rounded-full bg-secondary-fixed/20 text-secondary-fixed text-label-sm font-bold">
                Lender Dashboard
              </span>
            </div>
            <h1 className="text-headline-xl text-[#dbe5de] font-display font-bold">Portfolio Climate Intelligence</h1>
          </div>
          <div className="flex items-center gap-3 text-label-sm text-[#a2d1bb]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse" />
              Live · Last sync 09:42 IST
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white/10">RBI PSL Compliant</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total Borrowers', value: portfolio.totalBorrowers.toLocaleString('en-IN'), sub: 'Active accounts' },
            { label: 'Total Exposure', value: `₹${portfolio.totalExposureCr}Cr`, sub: 'Outstanding portfolio' },
            { label: 'Avg. Climate Score', value: portfolio.averageScore, sub: 'Portfolio weighted avg' },
            { label: 'At-Risk Accounts', value: `${portfolio.atRiskPct}%`, sub: 'Climate-stressed', highlight: 'red' },
            { label: 'NPA Rate', value: `${portfolio.defaultRatePct}%`, sub: 'Standard measure' },
            { label: 'Climate-Adj. NPL', value: `${portfolio.climateAdjustedNPL}%`, sub: 'Forward-looking', highlight: 'amber' },
          ].map(k => (
            <div key={k.label} className={`rounded-2xl p-4 border ${
              k.highlight === 'red' ? 'bg-red-900/20 border-red-500/20' :
              k.highlight === 'amber' ? 'bg-yellow-900/20 border-yellow-500/20' :
              'bg-white/5 border-white/10'
            }`}>
              <p className="text-label-sm text-[#a2d1bb]">{k.label}</p>
              <p className="text-headline-md font-display font-bold text-white font-mono mt-1">{k.value}</p>
              <p className="text-label-sm text-[#717974] mt-0.5">{k.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tier Breakdown pie-ish */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <h2 className="text-headline-md font-display font-semibold text-white">Tier Distribution</h2>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={portfolio.tierBreakdown} dataKey="count" nameKey="tier" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                  {portfolio.tierBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#161f1b', border: 'none', borderRadius: '12px', color: '#dbe5de' }}
                  formatter={(v: any, name: any) => [v, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {portfolio.tierBreakdown.map(t => (
                <div key={t.tier} className="flex items-center justify-between text-body-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
                    <span className="text-[#a2d1bb]">{t.tier}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-mono">{t.count}</span>
                    <span className="text-[#717974]">₹{t.exposure}Cr</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* District heatmap */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <h2 className="text-headline-md font-display font-semibold text-white">District Risk Heatmap</h2>
            <DistrictHeatmap data={portfolio.districtHeatmap} />
          </div>
        </div>

        {/* Loan Pricing + Insurance sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-secondary-fixed" />
              <h2 className="text-headline-md font-display font-semibold text-white">Climate-Adjusted Loan Pricing</h2>
            </div>
            <p className="text-body-sm text-[#a2d1bb]">
              Adjust the climate risk premium on top of base KCC rate (7.0% p.a.)
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#a2d1bb] text-body-md">Risk Premium</span>
                <span className="text-headline-md font-bold text-secondary-fixed font-mono">+{loanRateAdjust.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min={0} max={3} step={0.25}
                value={loanRateAdjust}
                onChange={e => setLoanRateAdjust(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-label-sm text-[#717974]">
                <span>Base: 7.0%</span>
                <span>Max: 10.0%</span>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-label-sm text-[#a2d1bb]">Effective Rate for D-Tier borrowers</p>
              <p className="text-headline-lg font-bold text-white font-mono">{effectiveRate}% p.a.</p>
              <p className="text-label-sm text-[#717974] mt-1">
                Estimated revenue uplift: ₹{(portfolio.totalExposureCr * loanRateAdjust / 100).toFixed(1)}Cr p.a.
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-tertiary-fixed" />
              <h2 className="text-headline-md font-display font-semibold text-white">Parametric Insurance Designer</h2>
            </div>
            <p className="text-body-sm text-[#a2d1bb]">
              Trigger threshold for automatic payout (% of expected NDVI drop)
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#a2d1bb] text-body-md">NDVI Trigger Threshold</span>
                <span className="text-headline-md font-bold text-tertiary-fixed font-mono">-{insuranceTrigger}%</span>
              </div>
              <input
                type="range"
                min={10} max={40} step={5}
                value={insuranceTrigger}
                onChange={e => setInsuranceTrigger(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-label-sm text-[#717974]">
                <span>Sensitive: -10%</span>
                <span>Conservative: -40%</span>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-body-sm">
                <span className="text-[#a2d1bb]">Premium per farmer</span>
                <span className="font-mono text-white">₹{insurancePremium}K/season</span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-[#a2d1bb]">Parcels currently at trigger</span>
                <span className="font-mono text-tertiary-fixed">{Math.round(portfolio.totalBorrowers * insuranceTrigger / 100)} farmers</span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-[#a2d1bb]">Total premium pool</span>
                <span className="font-mono text-white">₹{(parseFloat(insurancePremium) * portfolio.totalBorrowers / 1000).toFixed(1)}Cr</span>
              </div>
            </div>
          </div>
        </div>

        {/* NPA Trend chart */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
          <h2 className="text-headline-md font-display font-semibold text-white">NPA vs Climate-Adjusted NPL Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={portfolio.trendData}>
              <CartesianGrid stroke="#1d2723" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#717974' }} />
              <YAxis tick={{ fontSize: 12, fill: '#717974' }} />
              <Tooltip contentStyle={{ background: '#161f1b', border: 'none', borderRadius: '12px', color: '#dbe5de' }} />
              <Legend wrapperStyle={{ color: '#a2d1bb' }} />
              <Line type="monotone" dataKey="npl" stroke="#7CD959" strokeWidth={2} dot={false} name="Standard NPA %" />
              <Line type="monotone" dataKey="climateNpl" stroke="#fabc41" strokeWidth={2} dot={false} name="Climate-Adj. NPL %" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Borrower Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-white/10">
            <h2 className="text-headline-md font-display font-semibold text-white">Borrower Portfolio</h2>
            <div className="flex flex-wrap items-center gap-3 ml-auto">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717974]" />
                <input
                  type="text"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1) }}
                  placeholder="Search borrower…"
                  className="bg-white/10 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-body-sm text-[#dbe5de] placeholder:text-[#717974] focus:outline-none focus:ring-2 focus:ring-secondary-fixed/50 w-48"
                />
              </div>
              {/* Status filter */}
              <select
                value={filterStatus}
                onChange={e => { setFilterStatus(e.target.value); setPage(1) }}
                className="bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-body-sm text-[#dbe5de] focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="current">Current</option>
                <option value="watchlist">Watchlist</option>
                <option value="npa">NPA</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-body-sm">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  {[
                    { key: 'name' as SortKey, label: 'Farmer' },
                    { key: null, label: 'Village' },
                    { key: null, label: 'Crop' },
                    { key: 'score' as SortKey, label: 'Score' },
                    { key: 'loanAmt' as SortKey, label: 'Loan' },
                    { key: 'status' as SortKey, label: 'Status' },
                  ].map(col => (
                    <th
                      key={col.label}
                      onClick={() => col.key && toggleSort(col.key)}
                      className={`px-4 py-3 text-left text-label-md font-bold text-[#a2d1bb] ${col.key ? 'cursor-pointer hover:text-white' : ''}`}
                    >
                      <span className="flex items-center gap-1">
                        {col.label}
                        {col.key && sortKey === col.key && (
                          sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                        )}
                        {col.key && sortKey !== col.key && <ArrowUpDown className="w-3 h-3 opacity-40" />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginated.map(b => (
                  <tr key={b.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary-container flex items-center justify-center text-primary-fixed text-label-sm font-bold">
                          {b.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{b.name}</p>
                          <p className="text-[#717974] text-label-sm">{b.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#a2d1bb]">{b.village}</td>
                    <td className="px-4 py-3 text-[#a2d1bb]">{b.crop}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono" style={{ color: tierColor(b.score) }}>{b.score}</span>
                        <span className="text-label-sm text-[#717974]">{b.tier}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-white">₹{b.loanAmt.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`badge text-label-sm capitalize ${statusStyle(b.status)}`}>
                        {b.status === 'npa' ? '⛔ NPA' : b.status === 'watchlist' ? '⚠ Watchlist' : '✓ Current'}
                        {b.daysOverdue > 0 && ` · ${b.daysOverdue}d`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-white/10 flex items-center justify-between text-body-sm text-[#717974]">
            <span>Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} borrowers</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg bg-white/10 text-[#a2d1bb] disabled:opacity-40 hover:bg-white/20 transition-colors"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="px-3 py-1.5 rounded-lg bg-white/10 text-[#a2d1bb] disabled:opacity-40 hover:bg-white/20 transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
