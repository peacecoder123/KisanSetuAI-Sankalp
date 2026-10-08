/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // ─── KisanSetu AI Design Tokens ───────────────────────────────────────
      colors: {
        // Material You Green seed palette (light theme)
        primary: '#00261a',
        'on-primary': '#ffffff',
        'primary-container': '#0f3d2e',
        'on-primary-container': '#7ba894',
        'primary-fixed': '#beedd7',
        'primary-fixed-dim': '#a2d1bb',
        'on-primary-fixed': '#002116',
        'on-primary-fixed-variant': '#234f3f',
        'inverse-primary': '#a2d1bb',

        secondary: '#1f6d00',
        'on-secondary': '#ffffff',
        'secondary-container': '#9afa75',
        'on-secondary-container': '#227400',
        'secondary-fixed': '#9afa75',
        'secondary-fixed-dim': '#7fdc5c',
        'on-secondary-fixed': '#052100',
        'on-secondary-fixed-variant': '#165200',

        tertiary: '#2d1e00',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#493200',
        'on-tertiary-container': '#cd9517',
        'tertiary-fixed': '#ffdea8',
        'tertiary-fixed-dim': '#fabc41',
        'on-tertiary-fixed': '#271900',
        'on-tertiary-fixed-variant': '#5e4200',

        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',

        background: '#f2fcf4',
        'on-background': '#141d19',
        surface: '#f2fcf4',
        'on-surface': '#141d19',
        'surface-variant': '#dbe5de',
        'on-surface-variant': '#414944',
        'surface-bright': '#f2fcf4',
        'surface-dim': '#d2ddd5',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#ecf6ef',
        'surface-container': '#e6f0e9',
        'surface-container-high': '#e0ebe3',
        'surface-container-highest': '#dbe5de',
        'inverse-surface': '#29322e',
        'inverse-on-surface': '#e9f3ec',

        outline: '#717974',
        'outline-variant': '#c0c8c3',
        'surface-tint': '#3b6756',

        // Dark theme overrides  
        'dark-primary': '#a2d1bb',
        'dark-on-primary': '#00382a',
        'dark-primary-container': '#004f3e',
        'dark-on-primary-container': '#beedd7',
        'dark-background': '#0b1410',
        'dark-surface': '#0b1410',
        'dark-on-surface': '#dbe5de',
        'dark-surface-container': '#161f1b',
        'dark-surface-container-high': '#1d2723',
        'dark-secondary': '#7fdc5c',
        'dark-tertiary': '#fabc41',
      },

      // ─── Border Radius ─────────────────────────────────────────────────────
      borderRadius: {
        DEFAULT: '0.25rem',
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },

      // ─── Spacing Scale ─────────────────────────────────────────────────────
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        'gutter': '1.5rem',
        'gutter-mobile': '1rem',
        'margin': '2rem',
        'margin-mobile': '1rem',
      },

      // ─── Typography ────────────────────────────────────────────────────────
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        heading: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        sora: ['Sora', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },

      fontSize: {
        'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg-mobile': ['36px', { lineHeight: '44px', letterSpacing: '-0.01em', fontWeight: '700' }],
        'headline-xl': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-xl-mobile': ['26px', { lineHeight: '34px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-lg': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'headline-md': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-xl': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-sm': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'label-lg': ['14px', { lineHeight: '20px', letterSpacing: '0.01em', fontWeight: '600' }],
        'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '600' }],
        'label-sm': ['11px', { lineHeight: '14px', letterSpacing: '0.04em', fontWeight: '600' }],
        'data-mono': ['14px', { lineHeight: '20px', fontWeight: '500' }],
      },

      // ─── Box Shadows ───────────────────────────────────────────────────────
      boxShadow: {
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        sm: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.04)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.15)',
        green: '0 0 0 3px rgb(159 250 117 / 0.4)',
      },

      // ─── Keyframe Animations ───────────────────────────────────────────────
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'radar-sweep': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '20%': { opacity: '0.8' },
          '80%': { opacity: '0.8' },
          '100%': { transform: 'translateY(320px)', opacity: '0' },
        },
        'float-chip': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        'gauge-fill': {
          from: { 'stroke-dashoffset': '251' },
          to: { 'stroke-dashoffset': '70' },
        },
        'typing': {
          from: { width: '0' },
          to: { width: '100%' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'counter-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'waveform': {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.4s ease-out forwards',
        'scale-in': 'scale-in 0.3s ease-out forwards',
        'radar': 'radar-sweep 4.5s ease-in-out infinite',
        'float-slow': 'float-chip 5s ease-in-out infinite',
        'float-delayed': 'float-chip 6s ease-in-out 1.5s infinite',
        'float-fast': 'float-chip 4.5s ease-in-out 0.8s infinite',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'gauge-fill': 'gauge-fill 1.5s ease-out forwards',
        'blink': 'blink 1s step-end infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'counter-up': 'counter-up 0.6s ease-out forwards',
        'waveform': 'waveform 0.6s ease-in-out infinite',
      },

      // ─── Background Images ─────────────────────────────────────────────────
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
}
