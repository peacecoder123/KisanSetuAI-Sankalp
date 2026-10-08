// ─── Type Definitions ─────────────────────────────────────────────────────────

export interface ClimateScore {
  parcelId: string
  overallScore: number
  tier: string
  ndvi: number
  soilMoisture: number
  rainfallDeficit: number
  droughtRisk: 'low' | 'moderate' | 'high' | 'critical'
  floodRisk: 'low' | 'moderate' | 'high' | 'critical'
  heatStress: 'low' | 'moderate' | 'high' | 'critical'
  pestRisk: 'low' | 'moderate' | 'high' | 'critical'
  radarData: { axis: string; value: number }[]
  riskBars: { label: string; value: number; color: string; level: string }[]
  aiCommentary: string
  lastUpdated: string
  sentinel2Pass: string
}

export interface Scenario {
  year: number
  emission: 'moderate' | 'high'
  score: number
  tier: string
  riskBars: { label: string; value: number; color: string; level: string }[]
  radarData: { axis: string; value: number }[]
  aiCommentary: string
}

export interface CropAlternative {
  crop: string
  emoji: string
  currentCrop: boolean
  resilienceScore: number
  scoreChange: number
  waterRequirement: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High'
  yieldPotential: 'Low' | 'Medium' | 'High' | 'Very High'
  marketPrice: string
  climateTag: string
  tagColor: 'green' | 'amber' | 'red' | 'blue'
  description: string
  mspSupport: boolean
  insuranceCoverage: boolean
}

export interface ExplainabilityFactor {
  factor: string
  contribution: number
  direction: 'positive' | 'negative'
  tooltip: string
}

export interface CreditPassport {
  farmerId: string
  farmerName: string
  village: string
  district: string
  state: string
  parcelId: string
  surveyNumber: string
  areaHa: number
  crop: string
  soilType: string
  resilienceScore: number
  tier: string
  creditLimit: number
  interestRate: number
  loanEligible: boolean
  issuedDate: string
  expiryDate: string
  passportHash: string
  qrData: string
  explainabilityFactors: ExplainabilityFactor[]
  avatar: string | null
  mobileNumber: string
  aadhaarMasked: string
  bankAccount: string
  kccCardNumber: string
}

export interface RepaymentScheduleItem {
  month: string
  principal: number
  interest: number
  balance: number
  status: 'paid' | 'upcoming' | 'harvest'
  climateNote?: string
}

export interface RepaymentPlan {
  type: 'fixed' | 'climate-adaptive'
  totalLoan: number
  interestRate: number
  tenureMonths: number
  emi: number | null
  totalPayable: number
  schedule: RepaymentScheduleItem[]
}

export interface AdvisoryMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  language: string
  sources?: string[]
  timestamp: string
}

export interface Portfolio {
  totalBorrowers: number
  totalExposureCr: number
  averageScore: number
  atRiskPct: number
  defaultRatePct: number
  climateAdjustedNPL: number
  tierBreakdown: { tier: string; count: number; exposure: number; color: string }[]
  districtHeatmap: { district: string; score: number; exposure: number; borrowers: number }[]
  trendData: { month: string; npl: number; climateNpl: number; disbursements: number }[]
}

export interface Borrower {
  id: string
  name: string
  village: string
  crop: string
  score: number
  tier: string
  loanAmt: number
  status: 'current' | 'watchlist' | 'npa'
  daysOverdue: number
}

export interface Alert {
  id: string
  type: 'weather' | 'pest' | 'finance' | 'market'
  severity: 'green' | 'amber' | 'red'
  title: string
  titleEn: string
  message: string
  messageEn: string
  timestamp: string
  parcelId: string
  language: string
  source: string
  actionable: string
  imageKey: string | null
}

export interface ApiResponse {
  endpoint: string
  response: object
  latencyMs: number
}

export interface ImpactStats {
  farmersReached: number
  creditUnlockedCr: number
  defaultReductionPct: number
  yieldImprovementPct: number
  co2AbatementTonne: number
  lenderNplReductionCr: number
  note: string
}

export type PersonaType = 'farmer' | 'lender' | 'insurer'
export type ThemeType = 'light' | 'dark'
