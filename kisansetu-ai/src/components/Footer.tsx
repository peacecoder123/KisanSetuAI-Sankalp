import React from 'react'
import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import { Satellite } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-surface-container-high border-t border-outline-variant/40 pt-16 pb-12 text-on-surface">
      <div className="w-full max-w-[1600px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-outline-variant/30">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Logo width={160} />
            <p className="text-body-md text-on-surface-variant max-w-sm leading-relaxed">
              Climate risk intelligence and digital underwriting passport bridging
              140 million smallholder farm households with India's formal banking apparatus.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-label-sm font-semibold text-primary border border-outline-variant/40">
                <span className="h-2 w-2 rounded-full bg-secondary animate-pulse-dot"></span>
                Sentinel-2 &amp; IMD Active Telemetry
              </span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <div className="text-label-lg font-bold text-primary">Platform</div>
            <ul className="space-y-2 text-body-sm text-on-surface-variant">
              {[
                ['Satellite Telemetry', '/assess'],
                ['Credit Risk Index', '/results'],
                ['Underwriting Ledger', '/passport'],
                ['Weather Models', '/advisory'],
                ['Agri-Credit Passport', '/passport'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions Links */}
          <div className="space-y-3">
            <div className="text-label-lg font-bold text-primary">Solutions</div>
            <ul className="space-y-2 text-body-sm text-on-surface-variant">
              {[
                ['Commercial & RRB Banks', '/lender'],
                ['NABARD & PSL Desks', '/lender'],
                ['Parametric Crop Insurers', '/lender'],
                ['Farmer Producer Orgs', '/advisory'],
                ['State Agriculture Depts', '/about'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Governance Links */}
          <div className="space-y-3">
            <div className="text-label-lg font-bold text-primary">Governance</div>
            <ul className="space-y-2 text-body-sm text-on-surface-variant">
              {[
                'RBI PSL Framework Parity',
                'DPDP Act (2023) Compliance',
                'Geospatial Data Guidelines',
                'Algorithmic Audit Dossier',
                'Security Whitepaper',
              ].map(label => (
                <li key={label}>
                  <a href="#" className="hover:text-primary transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-body-sm text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span>© 2025 KisanSetu AI Technologies Pvt Ltd. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Underwriting</a>
            <a href="#" className="hover:text-primary transition-colors">Responsible AI Charter</a>
            <span className="flex items-center gap-1.5 text-secondary font-semibold">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse"></span>
              System Health: 99.98%
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
