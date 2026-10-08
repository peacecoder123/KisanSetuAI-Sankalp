import React from 'react'

// KisanSetu AI Logo SVG component — extracted from brand_logo/code.html
interface LogoProps {
  className?: string
  width?: number
}

export function Logo({ className = '', width = 200 }: LogoProps) {
  const height = (width / 280) * 72
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 280 72"
      fill="none"
      width={width}
      height={height}
      className={className}
      aria-label="KisanSetu AI"
    >
      <g transform="translate(10, 8)">
        {/* Bridge Lower Arc */}
        <path d="M4 46 C 18 26, 36 26, 50 46" stroke="#0F3D2E" strokeWidth="5" strokeLinecap="round" fill="none"/>
        {/* Bridge Upper Accent Arc */}
        <path d="M10 38 C 21 16, 33 16, 44 38" stroke="#7CD959" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
        {/* Leaf at Bridge Apex */}
        <path d="M27 6 C 35 12, 36 22, 27 28 C 18 22, 19 12, 27 6 Z" fill="#7CD959"/>
        <path d="M27 10 L 27 24" stroke="#0F3D2E" strokeWidth="1.8" strokeLinecap="round"/>
        {/* Tech Dot / Satellite Beam */}
        <circle cx="27" cy="4" r="2.5" fill="#F5B83D"/>
      </g>
      {/* Wordmark */}
      <text x="76" y="38" fontFamily="'Sora', sans-serif" fontWeight="800" fontSize="24" fill="#0B1410" letterSpacing="-0.5">KisanSetu</text>
      <rect x="194" y="21" width="36" height="20" rx="6" fill="#0F3D2E"/>
      <text x="212" y="35" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="11" fill="#7CD959" textAnchor="middle" letterSpacing="0.5">AI</text>
      <text x="77" y="52" fontFamily="'Inter', sans-serif" fontWeight="500" fontSize="10.5" fill="#4B6354" letterSpacing="0.2">Climate &amp; Credit Intelligence</text>
    </svg>
  )
}

// White version for dark backgrounds
export function LogoWhite({ className = '', width = 200 }: LogoProps) {
  const height = (width / 280) * 72
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 280 72"
      fill="none"
      width={width}
      height={height}
      className={className}
      aria-label="KisanSetu AI"
    >
      <g transform="translate(10, 8)">
        <path d="M4 46 C 18 26, 36 26, 50 46" stroke="#beedd7" strokeWidth="5" strokeLinecap="round" fill="none"/>
        <path d="M10 38 C 21 16, 33 16, 44 38" stroke="#7CD959" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
        <path d="M27 6 C 35 12, 36 22, 27 28 C 18 22, 19 12, 27 6 Z" fill="#7CD959"/>
        <path d="M27 10 L 27 24" stroke="#beedd7" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="27" cy="4" r="2.5" fill="#F5B83D"/>
      </g>
      <text x="76" y="38" fontFamily="'Sora', sans-serif" fontWeight="800" fontSize="24" fill="#e9f3ec" letterSpacing="-0.5">KisanSetu</text>
      <rect x="194" y="21" width="36" height="20" rx="6" fill="#7CD959"/>
      <text x="212" y="35" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="11" fill="#052100" textAnchor="middle" letterSpacing="0.5">AI</text>
      <text x="77" y="52" fontFamily="'Inter', sans-serif" fontWeight="500" fontSize="10.5" fill="#a2d1bb" letterSpacing="0.2">Climate &amp; Credit Intelligence</text>
    </svg>
  )
}

// Favicon SVG for the browser tab
export function FaviconSvg() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <rect width="32" height="32" rx="8" fill="#0F3D2E"/>
      <path d="M8 22 C 12 12, 20 12, 24 22" stroke="#7CD959" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M10 18 C 13 8, 19 8, 22 18" stroke="#beedd7" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M16 4 C 19 7, 20 12, 16 15 C 12 12, 13 7, 16 4 Z" fill="#7CD959"/>
      <circle cx="16" cy="3" r="1.5" fill="#F5B83D"/>
    </svg>
  )
}
