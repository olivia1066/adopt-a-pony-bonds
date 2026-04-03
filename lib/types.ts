export type KycStatus = 'pending' | 'approved' | 'rejected'
export type InvestmentStatus = 'pending' | 'active' | 'completed' | 'cancelled'
export type CampaignStatus = 'draft' | 'active' | 'funded' | 'closed'
export type PaymentType = 'interest' | 'capital'
export type PaymentStatus = 'upcoming' | 'paid' | 'late'

export interface Investor {
  id: string
  user_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  address?: string
  profession?: string
  iban?: string
  nationality?: string
  birth_date?: string
  birth_place?: string
  document_type?: string
  document_number?: string
  pep: boolean
  income_level?: string
  fiscal_residence: string
  kyc_status: KycStatus
  created_at: string
}

export interface Campaign {
  id: string
  name: string
  description: string
  target_amount: number
  collected_amount: number
  rate_12m: number
  rate_24m: number
  rate_36m: number
  rate_48m: number
  min_investment: number
  status: CampaignStatus
  start_date: string
  end_date?: string
  created_at: string
}

export interface Investment {
  id: string
  reference: string
  investor_id: string
  campaign_id: string
  amount: number
  rate: number
  duration_months: number
  start_date: string
  status: InvestmentStatus
  created_at: string
  investor?: Investor
  campaign?: Campaign
}

export interface Payment {
  id: string
  investment_id: string
  due_date: string
  amount: number
  type: PaymentType
  status: PaymentStatus
  paid_at?: string
}
