// ─── Mock Data Layer ─────────────────────────────────────────────────────────
// All functions return deterministic data. Comments mark real API integration points.
// Real endpoints: Copernicus STAC API, IMD API, OpenWeatherMap, internal XGBoost model

import type {
  ClimateScore,
  Scenario,
  CropAlternative,
  CreditPassport,
  RepaymentPlan,
  AdvisoryMessage,
  Portfolio,
  Alert,
  ApiResponse,
  ImpactStats,
  Borrower,
} from './types'

// ─── Farm Assessment ─────────────────────────────────────────────────────────

export interface FarmInput {
  parcelId: string
  lat: number
  lng: number
  crop: string
  areaHa: number
  surveyNumber: string
  village: string
  soilType: string
}

const DEFAULT_FARM: FarmInput = {
  parcelId: 'MH-WSM-4029',
  lat: 20.1134,
  lng: 77.1319,
  crop: 'Soybean',
  areaHa: 2.4,
  surveyNumber: '42/B',
  village: 'Washim, Maharashtra',
  soilType: 'Black Cotton (Vertisol)',
}

export function getDefaultFarm(): FarmInput {
  return { ...DEFAULT_FARM }
}

// ─── Climate Score ────────────────────────────────────────────────────────────
// Real: POST /api/v1/climate-score with {parcel_id, lat, lng, year}
// Returns: XGBoost-derived resilience score from Sentinel-2 + IMD + soil moisture

export function getClimateScore(farm?: Partial<FarmInput>): ClimateScore {
  return {
    parcelId: farm?.parcelId ?? 'MH-WSM-4029',
    overallScore: 78,
    tier: 'A-1',
    ndvi: 0.71,
    soilMoisture: 0.42,
    rainfallDeficit: -18,
    droughtRisk: 'moderate',
    floodRisk: 'low',
    heatStress: 'low',
    pestRisk: 'moderate',
    radarData: [
      { axis: 'Drought', value: 72 },
      { axis: 'Flood', value: 85 },
      { axis: 'Heat Stress', value: 80 },
      { axis: 'Soil Health', value: 75 },
      { axis: 'Yield Stability', value: 70 },
      { axis: 'Pest Risk', value: 68 },
    ],
    riskBars: [
      { label: 'Drought Stress', value: 28, color: '#fabc41', level: 'Medium' },
      { label: 'Flood Probability', value: 15, color: '#7CD959', level: 'Low' },
      { label: 'Heat Wave Days', value: 22, color: '#fabc41', level: 'Medium' },
      { label: 'Pest Outbreak Risk', value: 32, color: '#fabc41', level: 'Medium' },
      { label: 'Soil Carbon Loss', value: 18, color: '#7CD959', level: 'Low' },
    ],
    aiCommentary: 'This parcel shows moderate drought vulnerability driven by a rainfall deficit of −18% over the 2023 kharif season. NDVI at 0.71 indicates healthy current vegetation, but soil moisture reserves are depleted. The portfolio risk is manageable under current climate conditions but will require enhanced credit structuring for 2030 onwards under moderate emission pathways.',
    lastUpdated: '2025-10-08T09:42:00+05:30',
    sentinel2Pass: '09:42 IST • Clear Sky • Band B4/B8',
  }
}

// ─── Scenarios ────────────────────────────────────────────────────────────────
// Real: GET /api/v1/scenarios?parcel_id=&year=&emission=

export function getScenario(year: number, emission: 'moderate' | 'high'): Scenario {
  const baseline = { score: 78, drought: 28, flood: 15, heat: 22, pest: 32 }

  const adjustments: Record<string, Record<string, number>> = {
    '2025': { score: 0, drought: 0, flood: 0, heat: 0, pest: 0 },
    '2030-moderate': { score: -6, drought: 8, flood: 4, heat: 6, pest: 5 },
    '2030-high': { score: -10, drought: 14, flood: 7, heat: 10, pest: 8 },
    '2040-moderate': { score: -16, drought: 20, flood: 8, heat: 15, pest: 12 },
    '2040-high': { score: -24, drought: 32, flood: 14, heat: 22, pest: 18 },
    '2050-moderate': { score: -22, drought: 28, flood: 10, heat: 20, pest: 16 },
    '2050-high': { score: -35, drought: 45, flood: 20, heat: 32, pest: 26 },
  }

  const key = year === 2025 ? '2025' : `${year}-${emission}`
  const adj = adjustments[key] ?? adjustments['2025']
  const score = Math.max(20, baseline.score + adj.score)

  const commentary: Record<string, string> = {
    '2025': 'Current conditions are manageable. This parcel is creditworthy at standard KCC rates.',
    '2030-moderate': 'Under moderate warming, drought frequency increases. Climate-adaptive EMI recommended.',
    '2030-high': 'High emissions by 2030 significantly raise drought risk. Crop diversification advised.',
    '2040-moderate': 'By 2040, rainfall patterns shift materially. Tur dal and drought-tolerant varieties recommended.',
    '2040-high': 'High-emission 2040 scenario is critical. Score drops to 62 — consider crop switch urgently.',
    '2050-moderate': 'Even moderate warming by 2050 requires deep agricultural adaptation.',
    '2050-high': 'Extreme scenario: 43 resilience score by 2050. Dryland farming and insurance mandatory.',
  }

  return {
    year,
    emission,
    score,
    tier: score >= 75 ? 'A-1' : score >= 60 ? 'B-1' : score >= 45 ? 'C-1' : 'D-1',
    riskBars: [
      { label: 'Drought Stress', value: Math.min(100, baseline.drought + adj.drought), color: adj.drought > 20 ? '#ba1a1a' : '#fabc41', level: adj.drought > 20 ? 'High' : 'Medium' },
      { label: 'Flood Probability', value: Math.min(100, baseline.flood + adj.flood), color: '#7CD959', level: 'Low' },
      { label: 'Heat Wave Days', value: Math.min(100, baseline.heat + adj.heat), color: adj.heat > 20 ? '#ba1a1a' : '#fabc41', level: adj.heat > 20 ? 'High' : 'Medium' },
      { label: 'Pest Outbreak Risk', value: Math.min(100, baseline.pest + adj.pest), color: '#fabc41', level: 'Medium' },
      { label: 'Soil Carbon Loss', value: Math.min(100, 18 + (adj.drought * 0.3)), color: '#7CD959', level: 'Low' },
    ],
    radarData: [
      { axis: 'Drought', value: Math.max(20, 72 - adj.drought) },
      { axis: 'Flood', value: Math.max(20, 85 - adj.flood) },
      { axis: 'Heat Stress', value: Math.max(20, 80 - adj.heat) },
      { axis: 'Soil Health', value: Math.max(20, 75 - adj.drought * 0.4) },
      { axis: 'Yield Stability', value: Math.max(20, 70 - adj.drought * 0.5) },
      { axis: 'Pest Risk', value: Math.max(20, 68 - adj.pest * 0.4) },
    ],
    aiCommentary: commentary[key] ?? commentary['2025'],
  }
}

// ─── Crop Alternatives ────────────────────────────────────────────────────────
// Real: GET /api/v1/crop-alternatives?parcel_id=&year=

export function getCropAlternatives(year: number = 2025): CropAlternative[] {
  const yearMultiplier = year === 2030 ? 1.08 : year === 2040 ? 1.16 : year === 2050 ? 1.22 : 1.0

  return [
    {
      crop: 'Tur Dal (Pigeon Pea)',
      emoji: '🌿',
      currentCrop: false,
      resilienceScore: Math.round(89 * yearMultiplier > 100 ? 95 : 89 * (2 - yearMultiplier + 0.5)),
      scoreChange: +11,
      waterRequirement: 'Low',
      yieldPotential: 'High',
      marketPrice: '₹6,800/qt',
      climateTag: 'Drought Tolerant',
      tagColor: 'green',
      description: 'Best alternative for Vidarbha region under rainfall deficit conditions. Deep-rooted legume with high MSP.',
      mspSupport: true,
      insuranceCoverage: true,
    },
    {
      crop: 'Soybean (Current)',
      emoji: '🫘',
      currentCrop: true,
      resilienceScore: 78,
      scoreChange: 0,
      waterRequirement: 'Medium',
      yieldPotential: 'Medium',
      marketPrice: '₹4,300/qt',
      climateTag: 'Current Crop',
      tagColor: 'blue',
      description: 'Current crop. Adequate under today\'s climate but vulnerable to 2030+ drought intensification.',
      mspSupport: true,
      insuranceCoverage: true,
    },
    {
      crop: 'Cotton (Bt)',
      emoji: '🌸',
      currentCrop: false,
      resilienceScore: Math.round(74 * (2 - yearMultiplier + 0.5) > 20 ? 74 * (2 - yearMultiplier + 0.5) : 20),
      scoreChange: -4,
      waterRequirement: 'High',
      yieldPotential: 'High',
      marketPrice: '₹6,100/qt',
      climateTag: 'Water Intensive',
      tagColor: 'amber',
      description: 'High market value but requires 20% more water than current crop — risky under deficit rainfall.',
      mspSupport: true,
      insuranceCoverage: true,
    },
    {
      crop: 'Wheat (Rabi)',
      emoji: '🌾',
      currentCrop: false,
      resilienceScore: 82,
      scoreChange: +4,
      waterRequirement: 'Medium',
      yieldPotential: 'High',
      marketPrice: '₹2,275/qt',
      climateTag: 'Rabi Season',
      tagColor: 'green',
      description: 'Rabi rotation crop. Black cotton soil works well. Government MSP strong.',
      mspSupport: true,
      insuranceCoverage: true,
    },
    {
      crop: 'Jowar (Sorghum)',
      emoji: '🌽',
      currentCrop: false,
      resilienceScore: 91,
      scoreChange: +13,
      waterRequirement: 'Very Low',
      yieldPotential: 'Medium',
      marketPrice: '₹3,180/qt',
      climateTag: 'Drought Champion',
      tagColor: 'green',
      description: 'Most climate-resilient option. Traditional Vidarbha crop with excellent drought tolerance.',
      mspSupport: true,
      insuranceCoverage: false,
    },
    {
      crop: 'Groundnut',
      emoji: '🥜',
      currentCrop: false,
      resilienceScore: 76,
      scoreChange: -2,
      waterRequirement: 'Medium',
      yieldPotential: 'Medium',
      marketPrice: '₹5,550/qt',
      climateTag: 'Oil Seed',
      tagColor: 'amber',
      description: 'Good option with existing soil preparation. Moderate drought tolerance.',
      mspSupport: true,
      insuranceCoverage: true,
    },
    {
      crop: 'Maize',
      emoji: '🌽',
      currentCrop: false,
      resilienceScore: 71,
      scoreChange: -7,
      waterRequirement: 'High',
      yieldPotential: 'Very High',
      marketPrice: '₹2,090/qt',
      climateTag: 'Water Sensitive',
      tagColor: 'red',
      description: 'High yield potential but demands irrigation. Not recommended under rainfall deficit.',
      mspSupport: true,
      insuranceCoverage: true,
    },
    {
      crop: 'Sugarcane',
      emoji: '🎋',
      currentCrop: false,
      resilienceScore: 55,
      scoreChange: -23,
      waterRequirement: 'Very High',
      yieldPotential: 'Very High',
      marketPrice: '₹315/qt',
      climateTag: 'Water Intensive',
      tagColor: 'red',
      description: 'Very high water demand — not suitable for this parcel under current and future climate stress.',
      mspSupport: false,
      insuranceCoverage: true,
    },
  ]
}

// ─── Credit Passport ─────────────────────────────────────────────────────────
// Real: GET /api/v1/passport?parcel_id=&farmer_id=

export function getCreditPassport(): CreditPassport {
  return {
    farmerId: 'KSU-2025-MH-018742',
    farmerName: 'Ramesh Dattatray Patil',
    village: 'Washim',
    district: 'Washim',
    state: 'Maharashtra',
    parcelId: 'MH-WSM-4029',
    surveyNumber: '42/B',
    areaHa: 2.4,
    crop: 'Soybean',
    soilType: 'Black Cotton (Vertisol)',
    resilienceScore: 78,
    tier: 'A-1',
    creditLimit: 180000, // ₹
    interestRate: 7.0, // % p.a.
    loanEligible: true,
    issuedDate: '2025-10-08',
    expiryDate: '2026-10-07',
    passportHash: 'SHA256:7a4f9c2e8d1b3f0a6e5c4d2b1a0f9e8d7c6b5a4',
    qrData: 'https://kisansetu.ai/verify/KSU-2025-MH-018742',
    explainabilityFactors: [
      { factor: 'Sentinel-2 NDVI Trend', contribution: 28, direction: 'positive', tooltip: 'Vegetation index indicates healthy crop stand, positively impacting score.' },
      { factor: 'Historical Rainfall Pattern', contribution: 22, direction: 'positive', tooltip: 'Long-term rainfall data from IMD shows adequate kharif precipitation.' },
      { factor: 'Soil Organic Carbon', contribution: 18, direction: 'positive', tooltip: 'Vertisol soil type retains moisture; SOC levels within acceptable range.' },
      { factor: 'Drought Frequency (5yr)', contribution: -15, direction: 'negative', tooltip: 'Three moderate drought years in last 5 seasons reduces score slightly.' },
      { factor: 'Crop Diversification', contribution: -8, direction: 'negative', tooltip: 'Single crop reduces income stability. Diversification recommended.' },
      { factor: 'Irrigation Access', contribution: -5, direction: 'negative', tooltip: 'Rainfed parcel without supplemental irrigation is a risk factor.' },
      { factor: 'Loan Repayment History', contribution: 12, direction: 'positive', tooltip: 'Clean 4-year repayment record from NABARD KCC data.' },
      { factor: 'Market Price Volatility', contribution: -7, direction: 'negative', tooltip: 'Soybean MSP gap risk adds moderate credit uncertainty.' },
      { factor: 'Social Capital (SHG)', contribution: 10, direction: 'positive', tooltip: 'Member of active SHG — improves repayment probability.' },
      { factor: 'Parcel Legal Status', contribution: 23, direction: 'positive', tooltip: 'Clear 7/12 land record — no encumbrances detected.' },
    ],
    avatar: null, // Will use initials-based avatar
    mobileNumber: '+91 98232 45678',
    aadhaarMasked: 'XXXX-XXXX-7842',
    bankAccount: 'SBI Washim Branch — A/c XXXX4521',
    kccCardNumber: 'KCC/MH/2023/087234',
  }
}

// ─── Repayment Plan ───────────────────────────────────────────────────────────
// Real: POST /api/v1/repayment-plan with {passport_id, loan_amount, schedule_type}

export function getRepaymentPlan(type: 'fixed' | 'climate-adaptive'): RepaymentPlan {
  if (type === 'fixed') {
    return {
      type: 'fixed',
      totalLoan: 180000,
      interestRate: 8.5,
      tenureMonths: 18,
      emi: 10800,
      totalPayable: 194400,
      schedule: [
        { month: 'Nov 2025', principal: 8400, interest: 1275, balance: 171600, status: 'upcoming' },
        { month: 'Dec 2025', principal: 8400, interest: 1215, balance: 163200, status: 'upcoming' },
        { month: 'Jan 2026', principal: 8400, interest: 1156, balance: 154800, status: 'upcoming' },
        { month: 'Feb 2026', principal: 8400, interest: 1097, balance: 146400, status: 'upcoming' },
        { month: 'Mar 2026', principal: 8400, interest: 1037, balance: 138000, status: 'upcoming' },
        { month: 'Apr 2026', principal: 8400, interest: 978, balance: 129600, status: 'upcoming' },
        { month: 'May 2026', principal: 8400, interest: 918, balance: 121200, status: 'upcoming' },
        { month: 'Jun 2026 (Harvest)', principal: 36000, interest: 858, balance: 85200, status: 'harvest' },
        { month: 'Jul 2026', principal: 8400, interest: 603, balance: 76800, status: 'upcoming' },
        { month: 'Aug 2026', principal: 8400, interest: 544, balance: 68400, status: 'upcoming' },
        { month: 'Sep 2026', principal: 8400, interest: 484, balance: 60000, status: 'upcoming' },
        { month: 'Oct 2026', principal: 8400, interest: 425, balance: 51600, status: 'upcoming' },
        { month: 'Nov 2026', principal: 51600, interest: 365, balance: 0, status: 'upcoming' },
      ],
    }
  }

  // Climate-adaptive: lower payments in stress months, higher at harvest
  return {
    type: 'climate-adaptive',
    totalLoan: 180000,
    interestRate: 7.0, // preferential for climate-adaptive
    tenureMonths: 18,
    emi: null, // variable
    totalPayable: 189400,
    schedule: [
      { month: 'Nov 2025', principal: 5000, interest: 1050, balance: 175000, status: 'upcoming', climateNote: 'Sowing phase — reduced instalment' },
      { month: 'Dec 2025', principal: 5000, interest: 1020, balance: 170000, status: 'upcoming', climateNote: 'Growth phase — reduced instalment' },
      { month: 'Jan 2026', principal: 5000, interest: 990, balance: 165000, status: 'upcoming' },
      { month: 'Feb 2026', principal: 5000, interest: 961, balance: 160000, status: 'upcoming' },
      { month: 'Mar 2026', principal: 8000, interest: 933, balance: 152000, status: 'upcoming' },
      { month: 'Apr 2026', principal: 8000, interest: 887, balance: 144000, status: 'upcoming' },
      { month: 'May 2026', principal: 8000, interest: 840, balance: 136000, status: 'upcoming' },
      { month: 'Jun 2026 (Harvest)', principal: 80000, interest: 793, balance: 56000, status: 'harvest', climateNote: 'Harvest month — large balloon payment enabled by NDVI trigger' },
      { month: 'Jul 2026', principal: 5000, interest: 327, balance: 51000, status: 'upcoming' },
      { month: 'Aug 2026', principal: 5000, interest: 297, balance: 46000, status: 'upcoming' },
      { month: 'Sep 2026', principal: 6000, interest: 268, balance: 40000, status: 'upcoming' },
      { month: 'Oct 2026 (Rabi Kharif)', principal: 20000, interest: 233, balance: 20000, status: 'upcoming', climateNote: 'Rabi income trigger activates' },
      { month: 'Nov 2026', principal: 20000, interest: 117, balance: 0, status: 'upcoming' },
    ],
  }
}

// ─── Advisory Messages ────────────────────────────────────────────────────────
// Real: POST /api/v1/advisory with {question, language, parcel_id}

export type Language = 'english' | 'hindi' | 'marathi' | 'telugu' | 'tamil' | 'kannada' | 'punjabi' | 'bengali' | 'gujarati'

export const LANGUAGE_LABELS: Record<Language, string> = {
  english: 'English',
  hindi: 'हिंदी',
  marathi: 'मराठी',
  telugu: 'తెలుగు',
  tamil: 'தமிழ்',
  kannada: 'ಕನ್ನಡ',
  punjabi: 'ਪੰਜਾਬੀ',
  bengali: 'বাংলা',
  gujarati: 'ગુજરાતી',
}

export const QA_PAIRS: Record<Language, Array<{ q: string; a: string; sources: string[] }>> = {
  marathi: [
    {
      q: 'माझ्या सोयाबीनला कोणते खत द्यावे?',
      a: 'तुमच्या काळ्या मातीत सोयाबीनसाठी हेक्टरी 20 किलो नायट्रोजन, 80 किलो फॉस्फरस आणि 40 किलो पोटॅश द्यावे. रायझोबियम बीज प्रक्रिया केल्यास नायट्रोजन खर्च वाचतो. माती परीक्षण अहवालानुसार सूक्ष्म अन्नद्रव्ये द्यावीत.',
      sources: ['ICAR Agronomy Guide 2024', 'VNMKV Akola Extension'],
    },
    {
      q: 'या वर्षी पाऊस कमी असेल का?',
      a: 'IMD च्या हंगामी अंदाजानुसार, वाशीम जिल्ह्यात यंदा जून-सप्टेंबर सरासरीपेक्षा 15-20% कमी पाऊस अपेक्षित आहे. Sentinel-2 डेटा दर्शवतो की माती ओलावा 42% वर आहे — सध्यातरी व्यवस्थापन करण्यासारखे आहे.',
      sources: ['IMD Seasonal Forecast Q3 2025', 'Copernicus ERA5 Reanalysis'],
    },
    {
      q: 'कर्जाचा व्याजदर काय असेल?',
      a: 'तुमच्या A-1 Resilience Tier नुसार, किसान क्रेडिट कार्ड (KCC) वर 7% व्याजदर लागू होतो. वेळेवर परतफेड केल्यास 3% सूट मिळून प्रभावी दर 4% होतो. क्लायमेट-अ‍ॅडाप्टिव्ह EMI निवडल्यास अतिरिक्त 0.5% सूट मिळू शकते.',
      sources: ['RBI KCC Scheme Circular 2024', 'NABARD Interest Subvention'],
    },
    {
      q: 'कीड नियंत्रणासाठी काय करावे?',
      a: 'सध्या तुमच्या परसेलवर खोड माशी (Stem Fly) आणि शेंगा पोखरणाऱ्या किड्यांचा (Pod Borer) धोका मध्यम आहे. NMDI डेटा दर्शवतो की पानातील रंग बदल सुरू आहे. IMiDACLOPRID 70 WS + Beauveria bassiana जैविक उपाय वापरा.',
      sources: ['ICAR-NCIPM Pest Bulletin', 'PDKV Akola IPM Guide'],
    },
    {
      q: 'पीक विमा कसा काढावा?',
      a: 'PMFBY (प्रधानमंत्री फसल बीमा योजना) अंतर्गत खरीप 2025 नोंदणी सुरू आहे. हेक्टरी ₹500-1,500 हप्ता भरून ₹45,000 पर्यंत भरपाई मिळते. तुमचा Agri-Credit Passport वापरून बँकेत 10 मिनिटांत नोंदणी होऊ शकते.',
      sources: ['PMFBY Official Portal', 'Agriculture Insurance Company of India'],
    },
  ],
  hindi: [
    {
      q: 'मेरी फसल को कौन सा खाद डालना चाहिए?',
      a: 'आपकी काली मिट्टी में सोयाबीन के लिए प्रति हेक्टेयर 20 किलो नाइट्रोजन, 80 किलो फॉस्फोरस और 40 किलो पोटाश डालें। राइजोबियम बीज उपचार से नाइट्रोजन की बचत होती है। मिट्टी परीक्षण के अनुसार सूक्ष्म पोषक तत्व भी दें।',
      sources: ['ICAR Agronomy Guide 2024', 'Krishi Vigyan Kendra Washim'],
    },
    {
      q: 'क्लाइमेट स्कोर क्या है और यह कैसे काम करता है?',
      a: 'आपका Resilience Score 78 है जो A-1 Tier में है। यह Sentinel-2 उपग्रह डेटा, IMD वर्षा इतिहास, मिट्टी की नमी और 10 अन्य कारकों से XGBoost मॉडल द्वारा गणना किया गया है। यह स्कोर बैंकों को आपको उचित ब्याज दर पर ऋण देने में मदद करता है।',
      sources: ['KisanSetu AI Methodology Paper', 'ESA Sentinel-2 Documentation'],
    },
    {
      q: 'अगले साल कौन सी फसल बोनी चाहिए?',
      a: '2025 में तूर दाल (अरहर) सबसे अच्छा विकल्प है। यह सूखा सहनशील है, MSP ₹6,800/क्विंटल है, और आपकी मिट्टी के लिए बिल्कुल उपयुक्त है। सोयाबीन से स्विच करने पर Resilience Score 11 अंक बढ़ेगा।',
      sources: ['ICAR Crop Calendar Vidarbha', 'NABARD Crop Advisory 2025'],
    },
  ],
  english: [
    {
      q: 'What is my climate resilience score?',
      a: 'Your farm (Parcel MH-WSM-4029) has a Resilience Score of 78, placing it in Tier A-1. This score is computed from Copernicus Sentinel-2 NDVI data (0.71), IMD rainfall records (−18% deficit), soil moisture analysis, and your 5-year crop history. Under current conditions, you are eligible for KCC credit at 7% p.a.',
      sources: ['Copernicus Sentinel-2 Pass 09:42 IST', 'IMD District Forecast', 'ICAR Soil Survey'],
    },
    {
      q: 'How can I improve my score?',
      a: 'Three actions can improve your score within one season: (1) Adopt drip irrigation — raises soil moisture stability by ~12%. (2) Switch to pigeon pea or jowar rotation — adds drought tolerance buffer (+11 pts). (3) Join a Farmer Producer Organization (FPO) — social capital factor adds ~10 pts. KisanSetu AI will reassess your score automatically every 16 days when Sentinel-2 passes.',
      sources: ['ICAR Agronomy Division', 'NABARD FPO Programme', 'ESA Repeat Cycle Documentation'],
    },
    {
      q: 'What crops should I plant next season?',
      a: 'For Kharif 2026 under moderate climate projections, pigeon pea (tur dal) ranks highest with a projected resilience score of 89. Jowar (sorghum) is the most drought-resilient option at 91 but has lower market value. I recommend pigeon pea as your primary crop and jowar as an intercrop for maximum climate-financial benefit.',
      sources: ['ICAR Crop Suitability Model', 'VNMKV Akola Advisory', 'CACP MSP Data 2025'],
    },
    {
      q: 'When will it rain next?',
      a: 'According to IMD district-level forecasts, Washim district expects 8–12mm rainfall in the next 5 days (80% probability). The southwest monsoon withdrawal is expected by October 15. I recommend applying post-monsoon soil amendment by October 20 to retain moisture for rabi crop sowing.',
      sources: ['IMD District Forecast Washim', 'Skymet Agricultural Weather'],
    },
    {
      q: 'How do I get a farm loan?',
      a: 'Your Agri-Credit Passport (Score 78, Tier A-1) qualifies you for a Kisan Credit Card up to ₹1.8 Lakh at 7% p.a. The passport can be presented digitally to any participating bank branch. You can also share a QR code with your loan officer for instant verification. Climate-adaptive EMI reduces your monthly burden during sowing months.',
      sources: ['RBI KCC Scheme', 'NABARD Smallholder Credit Guidelines 2024'],
    },
  ],
  telugu: [
    {
      q: 'నా పంటకు ఏ ఎరువు వేయాలి?',
      a: 'నల్లరేగడి మట్టిలో సోయాబీన్‌కు హెక్టారుకు 20 కిలో నత్రజని, 80 కిలో భాస్వరం, 40 కిలో పొటాష్ అవసరం. రైజోబియం విత్తన శుద్ధి చేస్తే నత్రజని ఖర్చు తగ్గుతుంది.',
      sources: ['ICAR Hyderabad Research Station', 'ANGRAU Extension Bulletin'],
    },
  ],
  tamil: [
    {
      q: 'என் பயிருக்கு என்ன உரம் போட வேண்டும்?',
      a: 'உங்கள் கரிசல் மண்ணில் சோயாபீன்க்கு ஹெக்டேருக்கு 20 கிலோ நைட்ரஜன், 80 கிலோ பாஸ்பரஸ், 40 கிலோ பொட்டாஷ் தேவை. ரைசோபியம் விதை நேர்த்தி மூலம் நைட்ரஜன் செலவு குறைக்கலாம்.',
      sources: ['ICAR Coimbatore Research Station', 'TNAU Extension Guide'],
    },
  ],
  kannada: [
    {
      q: 'ನನ್ನ ಬೆಳೆಗೆ ಯಾವ ಗೊಬ್ಬರ ಹಾಕಬೇಕು?',
      a: 'ಕಪ್ಪು ಮಣ್ಣಿನಲ್ಲಿ ಸೋಯಾಬೀನ್‌ಗೆ ಹೆಕ್ಟೇರ್‌ಗೆ 20 ಕಿಲೋ ನೈಟ್ರೋಜನ್, 80 ಕಿಲೋ ಫಾಸ್ಫರಸ್, 40 ಕಿಲೋ ಪೊಟ್ಯಾಶ್ ಅಗತ್ಯ. ರೈಝೋಬಿಯಮ್ ಬೀಜ ಸಂಸ್ಕರಣೆ ನೈಟ್ರೋಜನ್ ಖರ್ಚು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.',
      sources: ['UAS Dharwad Extension', 'ICAR Bangalore'],
    },
  ],
  punjabi: [
    {
      q: 'ਮੇਰੀ ਫ਼ਸਲ ਲਈ ਕਿਹੜੀ ਖਾਦ ਪਾਉਣੀ ਚਾਹੀਦੀ ਹੈ?',
      a: 'ਕਾਲੀ ਮਿੱਟੀ ਵਿੱਚ ਸੋਇਆਬੀਨ ਲਈ ਪ੍ਰਤੀ ਹੈਕਟੇਅਰ 20 ਕਿਲੋ ਨਾਈਟ੍ਰੋਜਨ, 80 ਕਿਲੋ ਫਾਸਫੋਰਸ ਅਤੇ 40 ਕਿਲੋ ਪੋਟਾਸ਼ ਦੀ ਲੋੜ ਹੈ। ਰਾਈਜ਼ੋਬੀਅਮ ਬੀਜ ਇਲਾਜ ਨਾਲ ਨਾਈਟ੍ਰੋਜਨ ਦੀ ਬਚਤ ਹੁੰਦੀ ਹੈ।',
      sources: ['PAU Ludhiana Extension', 'ICAR Punjab Regional Station'],
    },
  ],
  bengali: [
    {
      q: 'আমার ফসলে কোন সার দেওয়া উচিত?',
      a: 'কালো মাটিতে সয়াবিনের জন্য হেক্টর প্রতি ২০ কেজি নাইট্রোজেন, ৮০ কেজি ফসফরাস এবং ৪০ কেজি পটাশ প্রয়োজন। রাইজোবিয়াম বীজ শোধন করলে নাইট্রোজেন খরচ কমে।',
      sources: ['BCKV West Bengal Extension', 'ICAR Kalyani Regional Station'],
    },
  ],
  gujarati: [
    {
      q: 'મારા પાકને કઈ ખાતર આપવી જોઈએ?',
      a: 'કાળી માટીમાં સોયાબીન માટે હેક્ટર દીઠ 20 કિলો નાઈટ્રોજન, 80 કિલો ફોસ્ફોરસ અને 40 કિલો પોટાશ જરૂરી છે. રાઈઝોબિયમ બીજ ઉપચારથી નાઈટ્રોજન ખર્ચ ઘટે છે.',
      sources: ['AAU Anand Extension', 'ICAR Gujarat Regional Station'],
    },
  ],
}

export function askAdvisory(question: string, language: Language): AdvisoryMessage {
  const pairs = QA_PAIRS[language] ?? QA_PAIRS.english
  const match = pairs.find(p =>
    p.q.toLowerCase().includes(question.toLowerCase().slice(0, 10)) ||
    question.toLowerCase().includes(p.q.toLowerCase().slice(0, 10))
  ) ?? pairs[0]

  return {
    id: Date.now().toString(),
    role: 'assistant',
    content: match.a,
    language,
    sources: match.sources,
    timestamp: new Date().toISOString(),
  }
}

// ─── Portfolio / Lender Dashboard ─────────────────────────────────────────────
// Real: GET /api/v1/portfolio?lender_id=&district=

export function getPortfolio(): Portfolio {
  return {
    totalBorrowers: 2847,
    totalExposureCr: 412.6,
    averageScore: 71,
    atRiskPct: 18.4,
    defaultRatePct: 4.2,
    climateAdjustedNPL: 6.8,
    tierBreakdown: [
      { tier: 'A-1 (76–100)', count: 892, exposure: 168.4, color: '#7CD959' },
      { tier: 'B-1 (61–75)', count: 1024, exposure: 142.8, color: '#fabc41' },
      { tier: 'C-1 (46–60)', count: 614, exposure: 72.6, color: '#F5B83D' },
      { tier: 'D-1 (<46)', count: 317, exposure: 28.8, color: '#ba1a1a' },
    ],
    districtHeatmap: [
      { district: 'Washim', score: 72, exposure: 42.6, borrowers: 312 },
      { district: 'Yavatmal', score: 58, exposure: 38.2, borrowers: 287 },
      { district: 'Amravati', score: 65, exposure: 51.4, borrowers: 389 },
      { district: 'Buldhana', score: 76, exposure: 28.9, borrowers: 218 },
      { district: 'Akola', score: 61, exposure: 35.6, borrowers: 268 },
      { district: 'Nagpur', score: 79, exposure: 62.4, borrowers: 478 },
      { district: 'Wardha', score: 55, exposure: 29.8, borrowers: 224 },
      { district: 'Chandrapur', score: 48, exposure: 22.6, borrowers: 172 },
    ],
    trendData: [
      { month: 'Jan', npl: 4.8, climateNpl: 6.2, disbursements: 28.4 },
      { month: 'Feb', npl: 4.6, climateNpl: 6.0, disbursements: 31.2 },
      { month: 'Mar', npl: 4.4, climateNpl: 5.8, disbursements: 42.8 },
      { month: 'Apr', npl: 4.3, climateNpl: 5.6, disbursements: 38.6 },
      { month: 'May', npl: 4.2, climateNpl: 5.4, disbursements: 35.2 },
      { month: 'Jun', npl: 4.5, climateNpl: 6.2, disbursements: 48.6 },
      { month: 'Jul', npl: 4.8, climateNpl: 7.1, disbursements: 52.4 },
      { month: 'Aug', npl: 4.6, climateNpl: 6.8, disbursements: 44.8 },
      { month: 'Sep', npl: 4.2, climateNpl: 6.5, disbursements: 38.6 },
      { month: 'Oct', npl: 4.2, climateNpl: 6.8, disbursements: 22.4 },
    ],
  }
}

// ─── Borrowers Table ──────────────────────────────────────────────────────────

export function getBorrowers(): Borrower[] {
  return [
    { id: 'KSU-018742', name: 'Ramesh Patil', village: 'Washim', crop: 'Soybean', score: 78, tier: 'A-1', loanAmt: 180000, status: 'current', daysOverdue: 0 },
    { id: 'KSU-018743', name: 'Sunita Bhosale', village: 'Mangrulpir', crop: 'Cotton', score: 65, tier: 'B-1', loanAmt: 240000, status: 'current', daysOverdue: 0 },
    { id: 'KSU-018744', name: 'Vijay Deshmukh', village: 'Karanja', crop: 'Tur Dal', score: 82, tier: 'A-1', loanAmt: 120000, status: 'current', daysOverdue: 0 },
    { id: 'KSU-018745', name: 'Lata Khedkar', village: 'Risod', crop: 'Soybean', score: 54, tier: 'C-1', loanAmt: 95000, status: 'watchlist', daysOverdue: 15 },
    { id: 'KSU-018746', name: 'Ashok Mane', village: 'Malegaon', crop: 'Cotton', score: 41, tier: 'D-1', loanAmt: 185000, status: 'npa', daysOverdue: 92 },
    { id: 'KSU-018747', name: 'Priya Jadhav', village: 'Pusad', crop: 'Wheat', score: 88, tier: 'A-1', loanAmt: 95000, status: 'current', daysOverdue: 0 },
    { id: 'KSU-018748', name: 'Raju Wankhede', village: 'Darwha', crop: 'Jowar', score: 71, tier: 'B-1', loanAmt: 75000, status: 'current', daysOverdue: 0 },
    { id: 'KSU-018749', name: 'Meena Gavhane', village: 'Hingoli', crop: 'Soybean', score: 59, tier: 'C-1', loanAmt: 140000, status: 'watchlist', daysOverdue: 8 },
    { id: 'KSU-018750', name: 'Suresh Thakre', village: 'Nandura', crop: 'Cotton', score: 77, tier: 'A-1', loanAmt: 320000, status: 'current', daysOverdue: 0 },
    { id: 'KSU-018751', name: 'Kavita Bondre', village: 'Akola', crop: 'Groundnut', score: 68, tier: 'B-1', loanAmt: 105000, status: 'current', daysOverdue: 0 },
    { id: 'KSU-018752', name: 'Ganesh Kulkarni', village: 'Wardha', crop: 'Soybean', score: 45, tier: 'D-1', loanAmt: 165000, status: 'npa', daysOverdue: 120 },
    { id: 'KSU-018753', name: 'Shobha Raut', village: 'Yavatmal', crop: 'Cotton', score: 73, tier: 'B-1', loanAmt: 280000, status: 'current', daysOverdue: 0 },
    { id: 'KSU-018754', name: 'Pratap Nimkar', village: 'Amravati', crop: 'Tur Dal', score: 85, tier: 'A-1', loanAmt: 150000, status: 'current', daysOverdue: 0 },
    { id: 'KSU-018755', name: 'Vandana Patkar', village: 'Chandrapur', crop: 'Rice', score: 52, tier: 'C-1', loanAmt: 88000, status: 'watchlist', daysOverdue: 22 },
    { id: 'KSU-018756', name: 'Balaji Shinde', village: 'Nagpur', crop: 'Maize', score: 79, tier: 'A-1', loanAmt: 195000, status: 'current', daysOverdue: 0 },
    { id: 'KSU-018757', name: 'Nirmala Ghuge', village: 'Buldhana', crop: 'Soybean', score: 66, tier: 'B-1', loanAmt: 115000, status: 'current', daysOverdue: 0 },
    { id: 'KSU-018758', name: 'Deepak Chavan', village: 'Washim', crop: 'Cotton', score: 38, tier: 'D-1', loanAmt: 225000, status: 'npa', daysOverdue: 180 },
    { id: 'KSU-018759', name: 'Saraswati Pande', village: 'Lonar', crop: 'Jowar', score: 91, tier: 'A-1', loanAmt: 62000, status: 'current', daysOverdue: 0 },
    { id: 'KSU-018760', name: 'Ramkrishna Ingle', village: 'Daryapur', crop: 'Wheat', score: 74, tier: 'B-1', loanAmt: 135000, status: 'current', daysOverdue: 0 },
    { id: 'KSU-018761', name: 'Pushpa Zodpe', village: 'Basim', crop: 'Soybean', score: 61, tier: 'B-1', loanAmt: 92000, status: 'current', daysOverdue: 0 },
    { id: 'KSU-018762', name: 'Govind Tayade', village: 'Malkapur', crop: 'Tur Dal', score: 83, tier: 'A-1', loanAmt: 168000, status: 'current', daysOverdue: 0 },
    { id: 'KSU-018763', name: 'Smita Mahajan', village: 'Khamgaon', crop: 'Cotton', score: 56, tier: 'C-1', loanAmt: 195000, status: 'watchlist', daysOverdue: 5 },
    { id: 'KSU-018764', name: 'Anil Gavande', village: 'Motala', crop: 'Groundnut', score: 76, tier: 'A-1', loanAmt: 82000, status: 'current', daysOverdue: 0 },
    { id: 'KSU-018765', name: 'Rekha Dhore', village: 'Nagpur', crop: 'Maize', score: 69, tier: 'B-1', loanAmt: 145000, status: 'current', daysOverdue: 0 },
    { id: 'KSU-018766', name: 'Namdev Borgaonkar', village: 'Amravati', crop: 'Soybean', score: 44, tier: 'D-1', loanAmt: 175000, status: 'npa', daysOverdue: 95 },
    { id: 'KSU-018767', name: 'Usha Badhe', village: 'Patur', crop: 'Wheat', score: 86, tier: 'A-1', loanAmt: 105000, status: 'current', daysOverdue: 0 },
    { id: 'KSU-018768', name: 'Santosh Kamble', village: 'Manora', crop: 'Cotton', score: 62, tier: 'B-1', loanAmt: 242000, status: 'current', daysOverdue: 0 },
    { id: 'KSU-018769', name: 'Padma Sapkal', village: 'Yavatmal', crop: 'Tur Dal', score: 80, tier: 'A-1', loanAmt: 130000, status: 'current', daysOverdue: 0 },
    { id: 'KSU-018770', name: 'Bharat Surpam', village: 'Chandrapur', crop: 'Rice', score: 48, tier: 'D-1', loanAmt: 112000, status: 'watchlist', daysOverdue: 42 },
    { id: 'KSU-018771', name: 'Anita Rathod', village: 'Hingoli', crop: 'Soybean', score: 72, tier: 'B-1', loanAmt: 158000, status: 'current', daysOverdue: 0 },
    { id: 'KSU-018772', name: 'Pramod Gawai', village: 'Wardha', crop: 'Cotton', score: 57, tier: 'C-1', loanAmt: 215000, status: 'watchlist', daysOverdue: 18 },
    { id: 'KSU-018773', name: 'Geeta Kadu', village: 'Akola', crop: 'Jowar', score: 88, tier: 'A-1', loanAmt: 68000, status: 'current', daysOverdue: 0 },
    { id: 'KSU-018774', name: 'Ramji Tathod', village: 'Buldhana', crop: 'Soybean', score: 63, tier: 'B-1', loanAmt: 124000, status: 'current', daysOverdue: 0 },
    { id: 'KSU-018775', name: 'Sarita Nandanwar', village: 'Nagpur', crop: 'Wheat', score: 90, tier: 'A-1', loanAmt: 185000, status: 'current', daysOverdue: 0 },
    { id: 'KSU-018776', name: 'Kishor Bharad', village: 'Washim', crop: 'Cotton', score: 43, tier: 'D-1', loanAmt: 298000, status: 'npa', daysOverdue: 145 },
    { id: 'KSU-018777', name: 'Indu Lad', village: 'Risod', crop: 'Groundnut', score: 71, tier: 'B-1', loanAmt: 88000, status: 'current', daysOverdue: 0 },
    { id: 'KSU-018778', name: 'Mohan Gathe', village: 'Darwha', crop: 'Maize', score: 58, tier: 'C-1', loanAmt: 165000, status: 'watchlist', daysOverdue: 32 },
    { id: 'KSU-018779', name: 'Sharda Ruke', village: 'Pusad', crop: 'Soybean', score: 84, tier: 'A-1', loanAmt: 142000, status: 'current', daysOverdue: 0 },
    { id: 'KSU-018780', name: 'Dilip Kshire', village: 'Mangrulpir', crop: 'Cotton', score: 65, tier: 'B-1', loanAmt: 188000, status: 'current', daysOverdue: 0 },
    { id: 'KSU-018781', name: 'Jamuna Ghorpade', village: 'Amravati', crop: 'Tur Dal', score: 77, tier: 'A-1', loanAmt: 122000, status: 'current', daysOverdue: 0 },
  ]
}

// ─── Alerts ───────────────────────────────────────────────────────────────────
// Real: GET /api/v1/alerts?parcel_id=&language=

export function getAlerts(): Alert[] {
  return [
    {
      id: 'ALT-001',
      type: 'weather',
      severity: 'amber',
      title: 'पाऊस तूट सतर्कता',
      titleEn: 'Rainfall Deficit Alert',
      message: 'वाशीम जिल्ह्यात गेल्या 14 दिवसांत सरासरीपेक्षा 23% कमी पाऊस झाला. माती ओलावा कमी होत आहे. आठवड्याभरात सिंचन उपलब्ध नसल्यास पीक ताण (crop stress) शक्य आहे.',
      messageEn: 'Washim district has received 23% below-average rainfall over the last 14 days. Soil moisture declining. Crop stress possible if irrigation unavailable within 7 days.',
      timestamp: '2025-10-08T06:00:00+05:30',
      parcelId: 'MH-WSM-4029',
      language: 'marathi',
      source: 'IMD Washim + Sentinel-2',
      actionable: 'Apply supplemental irrigation within 7 days — 25mm recommended',
      imageKey: 'drought-cracks',
    },
    {
      id: 'ALT-002',
      type: 'pest',
      severity: 'amber',
      title: 'खोड माशी धोका',
      titleEn: 'Stem Fly Pest Alert',
      message: 'NDMI (Normalized Difference Moisture Index) विश्लेषणातून खोड माशीचे प्रारंभिक चिन्ह दिसत आहेत. ताबडतोब IMiDACLOPRID 70 WS लावण्याचा सल्ला.',
      messageEn: 'NDMI analysis shows early signs of Stem Fly (Melanagromyza sojae) infestation. Immediate application of IMiDACLOPRID 70 WS advised.',
      timestamp: '2025-10-07T14:30:00+05:30',
      parcelId: 'MH-WSM-4029',
      language: 'marathi',
      source: 'Sentinel-2 B11/B12 NDMI Analysis',
      actionable: 'Spray IMiDACLOPRID 70WS @ 5ml/10L in early morning',
      imageKey: 'pest-leaf',
    },
    {
      id: 'ALT-003',
      type: 'weather',
      severity: 'green',
      title: 'पाऊस अंदाज — पुढील ५ दिवस',
      titleEn: '5-Day Rainfall Forecast',
      message: 'IMD अंदाजानुसार 10-14 ऑक्टोबर दरम्यान 8-12mm पाऊस अपेक्षित (80% संभाव्यता). या काळात खत वापर टाळा — पावसाळी धुलाईचा धोका.',
      messageEn: 'IMD forecasts 8–12mm rainfall between Oct 10–14 (80% probability). Avoid fertilizer application during this window — risk of nutrient washout.',
      timestamp: '2025-10-08T07:00:00+05:30',
      parcelId: 'MH-WSM-4029',
      language: 'marathi',
      source: 'IMD District Forecast + Skymet',
      actionable: 'Delay top-dressing by 5 days — wait for soil absorption post-rain',
      imageKey: 'monsoon-clouds',
    },
    {
      id: 'ALT-004',
      type: 'finance',
      severity: 'green',
      title: 'KCC नूतनीकरण स्मरणपत्र',
      titleEn: 'KCC Renewal Reminder',
      message: 'तुमचे किसान क्रेडिट कार्ड 31 मार्च 2026 रोजी संपणार आहे. SBI वाशीम शाखेत वेळेत नूतनीकरण केल्यास 3% व्याज सूट मिळेल.',
      messageEn: 'Your Kisan Credit Card expires March 31, 2026. Timely renewal at SBI Washim Branch will maintain 3% interest subvention benefit.',
      timestamp: '2025-10-06T09:00:00+05:30',
      parcelId: 'MH-WSM-4029',
      language: 'marathi',
      source: 'KisanSetu AI KCC Tracker',
      actionable: 'Visit SBI Washim branch with Agri-Credit Passport QR code',
      imageKey: null,
    },
  ]
}

// ─── API Playground ───────────────────────────────────────────────────────────

export function getApiResponse(endpoint: string): ApiResponse {
  const responses: Record<string, object> = {
    '/v1/climate-score': {
      status: 'success',
      latency_ms: 312,
      request_id: 'req_7f4c9a2e8b1d',
      parcel_id: 'MH-WSM-4029',
      timestamp: '2025-10-08T09:42:00+05:30',
      data: {
        resilience_score: 78,
        tier: 'A-1',
        sentinel_pass: '2025-10-08T04:12:00Z',
        ndvi: 0.71,
        soil_moisture_pct: 42.3,
        rainfall_deficit_pct: -18.2,
        drought_risk: 'moderate',
        flood_risk: 'low',
        heat_stress: 'low',
        pest_risk: 'moderate',
        confidence: 0.89,
        model_version: 'xgboost-v2.3-indic',
        data_sources: ['copernicus-sentinel-2-l2a', 'imd-gridded-rainfall', 'isric-soilgrid-250m'],
      },
    },
    '/v1/passport': {
      status: 'success',
      latency_ms: 89,
      request_id: 'req_2a8e4f1c7d3b',
      data: {
        passport_id: 'KSU-2025-MH-018742',
        farmer_name: 'Ramesh Dattatray Patil',
        parcel_id: 'MH-WSM-4029',
        resilience_score: 78,
        tier: 'A-1',
        credit_limit_inr: 180000,
        interest_rate_pct: 7.0,
        issued: '2025-10-08',
        expires: '2026-10-07',
        blockchain_hash: 'SHA256:7a4f9c2e8d1b3f0a6e5c4d2b1a0f9e8d7c6b5a4',
        verification_url: 'https://kisansetu.ai/verify/KSU-2025-MH-018742',
      },
    },
    '/v1/scenarios': {
      status: 'success',
      latency_ms: 528,
      request_id: 'req_5c7b3a9f2e1d',
      data: {
        parcel_id: 'MH-WSM-4029',
        scenarios: [
          { year: 2025, emission: 'baseline', score: 78, drought_risk: 0.28 },
          { year: 2030, emission: 'moderate', score: 72, drought_risk: 0.36 },
          { year: 2030, emission: 'high', score: 68, drought_risk: 0.42 },
          { year: 2040, emission: 'moderate', score: 62, drought_risk: 0.48 },
          { year: 2040, emission: 'high', score: 54, drought_risk: 0.60 },
          { year: 2050, emission: 'moderate', score: 56, drought_risk: 0.56 },
          { year: 2050, emission: 'high', score: 43, drought_risk: 0.73 },
        ],
        projection_model: 'cmip6-mri-esm2-0-india-downscaled',
        baseline_period: '1991-2020',
      },
    },
    '/v1/crop-alternatives': {
      status: 'success',
      latency_ms: 203,
      request_id: 'req_9d1a6e4f8c2b',
      data: {
        parcel_id: 'MH-WSM-4029',
        current_crop: 'soybean',
        current_score: 78,
        alternatives: [
          { crop: 'tur_dal', score_delta: +11, water_req: 'low', market_price_inr: 6800 },
          { crop: 'jowar', score_delta: +13, water_req: 'very_low', market_price_inr: 3180 },
          { crop: 'wheat_rabi', score_delta: +4, water_req: 'medium', market_price_inr: 2275 },
          { crop: 'cotton_bt', score_delta: -4, water_req: 'high', market_price_inr: 6100 },
        ],
        recommendation: 'tur_dal',
        rationale: 'Best climate-financial tradeoff for Vidarbha black cotton soil under moderate 2030 scenario',
      },
    },
  }

  return {
    endpoint,
    response: responses[endpoint] ?? responses['/v1/climate-score'],
    latencyMs: Math.floor(Math.random() * 400) + 80,
  }
}

// ─── Impact Calculator ────────────────────────────────────────────────────────

export function getImpactStats(farmersTarget: number): ImpactStats {
  const basePerFarmer = {
    creditUnlockLakh: 0.0042, // ₹4,200 average credit per farmer (in lakh)
    defaultReductionPct: 24,
    yieldImprovementPct: 18,
    co2AbatementTonne: 0.32,
  }

  return {
    farmersReached: farmersTarget,
    creditUnlockedCr: Math.round(farmersTarget * basePerFarmer.creditUnlockLakh) / 100,
    defaultReductionPct: basePerFarmer.defaultReductionPct,
    yieldImprovementPct: basePerFarmer.yieldImprovementPct,
    co2AbatementTonne: Math.round(farmersTarget * basePerFarmer.co2AbatementTonne),
    lenderNplReductionCr: Math.round(farmersTarget * 0.00018 * 100) / 100,
    note: 'All figures are modelled illustrations based on NABARD baseline data and extrapolated impact assumptions. Actual results will vary.',
  }
}
