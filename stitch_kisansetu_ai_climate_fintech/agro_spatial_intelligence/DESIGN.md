---
name: Agro-Spatial Intelligence
colors:
  surface: '#f2fcf4'
  surface-dim: '#d2ddd5'
  surface-bright: '#f2fcf4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#ecf6ef'
  surface-container: '#e6f0e9'
  surface-container-high: '#e0ebe3'
  surface-container-highest: '#dbe5de'
  on-surface: '#141d19'
  on-surface-variant: '#414944'
  inverse-surface: '#29322e'
  inverse-on-surface: '#e9f3ec'
  outline: '#717974'
  outline-variant: '#c0c8c3'
  surface-tint: '#3b6756'
  primary: '#00261a'
  on-primary: '#ffffff'
  primary-container: '#0f3d2e'
  on-primary-container: '#7ba894'
  inverse-primary: '#a2d1bb'
  secondary: '#1f6d00'
  on-secondary: '#ffffff'
  secondary-container: '#9afa75'
  on-secondary-container: '#227400'
  tertiary: '#2d1e00'
  on-tertiary: '#ffffff'
  tertiary-container: '#493200'
  on-tertiary-container: '#cd9517'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#beedd7'
  primary-fixed-dim: '#a2d1bb'
  on-primary-fixed: '#002116'
  on-primary-fixed-variant: '#234f3f'
  secondary-fixed: '#9afa75'
  secondary-fixed-dim: '#7fdc5c'
  on-secondary-fixed: '#052100'
  on-secondary-fixed-variant: '#165200'
  tertiary-fixed: '#ffdea8'
  tertiary-fixed-dim: '#fabc41'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5e4200'
  background: '#f2fcf4'
  on-background: '#141d19'
  surface-variant: '#dbe5de'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Sora
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-xl:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-xl-mobile:
    fontFamily: Sora
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Sora
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-xl:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  data-mono:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes an authoritative yet deeply approachable bridge between geospatial Earth-observation technology and grassroots agrarian finance. The visual personality fuses high-precision climate intelligence with field-level clarity. It balances two primary personas: institutional lenders demanding dense, analytical rigor and smallholder farmers requiring intuitive, high-contrast, stress-free decision tools.

The aesthetic philosophy is **Earth-Observation Fintech**:
- **Field-tested Utility:** Uncluttered interfaces optimized for outdoor visibility, high ambient sunlight, and intermittent low-tier device usage.
- **Topographic Tactility:** Subtle elevation transitions, ultra-fine frosted glass surfaces, and restrained organic roundness that soften complex algorithmic indexes into human insights.
- **Biophilic Precision:** Deep forest undertones paired with hyper-accurate spectral accents mimicking multispectral vegetation indexing (NDVI), soil hydrology, and radar precipitation metrics.

## Colors

The palette directly models crop vitality, terrestrial soil strata, and institutional stability. It is optimized to support high-contrast light surfaces for mobile daylight use alongside an immersive low-light terminal for institutional underwriters.

### Color Tokens & Semantics
- **Deep Forest Green (`#0F3D2E`):** Represents institutional permanence, stability, and dense vegetative health. Applied as the primary interactive element in light mode and deep surface backing in high-tier summaries.
- **Fresh Leaf Lime (`#7CD959`):** Represents high photosynthetic vigor, positive credit scoring, active irrigation status, and high-priority primary actions within dark contexts.
- **Warm Sun Amber (`#F5B83D`):** Functional warning state, moderate drought stress, pending escrow actions, and dry-spell threshold triggers.
- **Clay Red (`#D9534F`):** Functional critical state, active crop pest alerts, extreme drought or unmitigated credit default risk.
- **Calm Sky Blue (`#4DA3E0`):** Specialized hydrology state, water table measurements, reservoir levels, and radar-detected flash flood threats.
- **Soft Off-White Ground (`#F6F8F4`):** Base canvas background for light mode; reduces outdoor glare compared to harsh pure white.
- **Near-Black Ink (`#0B1410`):** Core deep surface backing for lender telemetry screens and primary high-contrast typography in light view.

### Dual-Role Color Application
- **Farmer Interfaces (Light Mode):** Background canvas strictly `#F6F8F4`. Text rendered in `#0B1410` for maximum legibility. Primary actions set in `#0F3D2E` with `#7CD959` highlights.
- **Lender Terminals (Dark Mode):** Background set to `#0B1410` with surface elevation layers using muted `#0F3D2E` tints. Data visualizations and actionable CTAs utilize `#7CD959` and `#4DA3E0` for luminous legibility.

## Typography

Typography balances scientific structure with geometric modernity:
- **Headlines (Sora):** Selected for its geometric stance, wide counters, and subtle technical curves. It introduces distinctive optimism and mechanical confidence across land assessment scores, section headings, and financial yield summaries.
- **Body & Tabular Reading (Inter):** Deployed for maximum neutrality, dense parameter presentation, multi-language rendering capability, and unambiguous optical recognition across screen scales.
- **Tabular Numerics:** All loan yields, soil moisture ratios, hectare bounds, and currency values mandate `font-feature-settings: "tnum" 1, "cv05" 1` to prevent misalignment in tabular matrices and continuous telemetry readouts.

## Layout & Spacing

The layout operates on a strict 8px spatial grid, scaling downward to 4px increments for tightly clustered telemetry metrics and parameter tags.

### Grid Framework
- **Desktop / Underwriter Console (12 Columns):** Fluid layout bound by a maximum width of 1600px. Gutters set to `1.5rem` (`24px`), outer canvas margins set to `2rem` (`32px`). Accommodates persistent map tiles, multi-hectare satellite views, and side-by-side risk assessment ledgers.
- **Tablet / Field Agent Slate (8 Columns):** Fluid columns with `1.25rem` (`20px`) gutters and `1.5rem` (`24px`) margins. Split panes allow simultaneous land boundary verification and identity documentation.
- **Mobile / Farmer Handheld (4 Columns):** Single primary stack with `1rem` (`16px`) gutters and `1rem` (`16px`) margins. Compact vertical flows ensure one clear action per viewport frame.

### Spatial Rhythm
- `space-xs` (4px): Micro clearances within clustered chips, icon-to-label gaps, and inline indicators.
- `space-sm` (8px): Internal paddings for inputs, chips, and small table cells.
- `space-md` (16px): Default distance between form elements, card internal padding, and grid row intervals.
- `space-lg` (24px): Structural clearance between distinct card tiers, widget headers, and related modules.
- `space-xl` (32px): Primary section divisions and top-level block separators.

## Elevation & Depth

Depth mimics high-altitude topography, employing progressive atmospheric layering, subtle tactile drops, and semi-translucent composite overlays.

### Elevation Tiers
1. **Base Ground (Level 0):** Pure surface (`#F6F8F4` in light mode, `#0B1410` in dark mode). Serves as the continuous canvas for background map projections and raw layout framing.
2. **Surface Layer 1 (Card & Module Deck):** Solid background with ultra-subtle tinted shadows.
   - *Light Mode:* Shadow configuration `0 2px 8px -2px rgba(11, 20, 16, 0.04), 0 8px 24px -4px rgba(15, 61, 46, 0.06)`. Border: 1px solid `rgba(15, 61, 46, 0.08)`.
   - *Dark Mode:* Background `#11211A`. Shadow `0 4px 20px 0 rgba(0, 0, 0, 0.45)`. Border: 1px solid `rgba(124, 217, 89, 0.12)`.
3. **Glassmorphic Data Floating Tier (Level 2):** Overlay heads-up panels, satellite layer pickers, and live yield indices.
   - *Light Mode:* Background `rgba(246, 248, 244, 0.85)` with `backdrop-filter: blur(12px)` and 1px border `rgba(255, 255, 255, 0.80)`.
   - *Dark Mode:* Background `rgba(11, 20, 16, 0.75)` with `backdrop-filter: blur(16px)` and 1px border `rgba(124, 217, 89, 0.20)`.
4. **Modal & Critical Alert Tier (Level 3):** High-prominence overlays. Elevated by a `0 16px 40px -8px rgba(11, 20, 16, 0.25)` drop shadow and enclosed by an active semantic border.

## Shapes

The design system maintains a modern, rounded curvature profile that feels balanced and accessible without sacrificing structural discipline:
- **Base Components (Inputs, Buttons, Pills):** 8px (`0.5rem`) for compact utilities; 12px for prominent CTAs.
- **Containers & Surface Panels (`rounded-lg`):** 16px (`1rem`) corner radius across primary insight cards, credit profiles, and sensor modules.
- **Top-Level Overlays & Hero Clusters (`rounded-xl`):** 24px (`1.5rem`) corner radius across modal dialogues, active map frames, and floating drawers.
- **Indicator Nodes & Status Badges:** Fully circular (`9999px`) to immediately communicate telemetry data and profile states.

## Components

### Buttons
- **Primary Action (Farmer):** Solid Deep Forest Green (`#0F3D2E`) fill, crisp white text, 12px border radius, min-height 48px to accommodate outdoor thumb clicks. Hover/Focus: slight darkening with an offset ring of Leaf Lime (`#7CD959`).
- **Primary Action (Lender Dark):** Solid Leaf Lime (`#7CD959`) fill with Near-Black Ink (`#0B1410`) bold text.
- **Secondary / Outlined:** Transparent background, 1.5px border in Deep Forest Green (light) or 20% Leaf Lime (dark).
- **Destructive:** Solid Clay Red (`#D9534F`) with white text; low-emphasis version uses a transparent fill with a Clay Red outline.

### Chips & Badges
- **NDVI / Soil Index Chip:** Height 28px, rounded 9999px. Monospaced numeric score paired with an organic dot indicator. Background tinted at 10% semantic status color (Lime, Amber, Sky Blue, or Clay Red) with matching 100% solid foreground text.
- **Filter Tags:** Light off-white base with 1px border. When active: transitions to `#0F3D2E` background with `#F6F8F4` text.

### Cards
- **Hectare Parcel & Land Health Card:** Features a 16px border-radius, hairline borders, and divided compartments. The header exposes geographic bounding coordinates; the mid-section displays multispectral or climatic radar readouts; the base houses actionable credit terms.
- **Risk Score Indicator Card:** Compact visual module utilizing nested tonal borders, prominent 32px Sora numeric headlines, and color-coded status badges.

### Input Fields
- **Text & Numeric Field:** Min-height 48px, background `#FFFFFF` (light) or `#0B1410` (dark). Inactive border is 1px solid `rgba(15, 61, 46, 0.20)`. Focus shifts border to 2px solid Deep Forest Green with a 4px soft ring of `#7CD959` at 25% opacity.
- **Dropdown / Geolocation Selector:** Displays a leading coordinate or localized map pin icon, body text in Inter 14px, and a high-contrast chevron indicator.

### Checkboxes & Radios
- Size 20x20px, 6px border-radius for checkboxes, 50% circular for radio buttons.
- Inactive: 1.5px stroke in muted forest green.
- Active: Filled with Leaf Lime (`#7CD959`) containing Deep Forest Green checkmarks, maintaining sharp contrast across both color schemes.

### Specialized Agritech Components
- **Weather / Flood Risk Horizon Strip:** Horizontal segmented timeline with variable height bars displaying precipitation probabilities in `#4DA3E0`, drought conditions in `#F5B83D`, and peak solar irradiance.
- **Credit Trust Metric Bar:** Segmented progress track visualizing collateralized risk ratings with animated step markers and localized risk flags.