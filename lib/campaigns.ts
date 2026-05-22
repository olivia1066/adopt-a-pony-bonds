import { supabase } from './supabase'

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type CampaignStatus = 'coming_soon' | 'ongoing' | 'sold_out'

export type Campaign = {
  id: string
  name: string  // legacy field, kept for backward compatibility
  name_fr: string
  name_en: string
  description_fr: string
  description_en: string
  status: CampaignStatus
  target_amount: number
  raised_amount: number
  rate: number
  duration: number
  start_date: string
  created_at?: string
}

// ─────────────────────────────────────────────
// Helper: get the right name/description based on locale
// ─────────────────────────────────────────────

export function getCampaignName(campaign: Campaign | null, locale: string): string {
  if (!campaign) return ''
  return locale === 'en' ? campaign.name_en : campaign.name_fr
}

export function getCampaignDescription(campaign: Campaign | null, locale: string): string {
  if (!campaign) return ''
  return locale === 'en' ? campaign.description_en : campaign.description_fr
}

// ─────────────────────────────────────────────
// getActiveCampaign — récupère la campagne actuelle
// Pour l'instant : la plus récente (1 seule campagne en base)
// ─────────────────────────────────────────────

export async function getActiveCampaign(): Promise<Campaign | null> {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error('[getActiveCampaign] Error:', error.message)
    return null
  }

  return data as Campaign
}

// ─────────────────────────────────────────────
// Helpers d'affichage
// ─────────────────────────────────────────────

/**
 * Indique si les CTAs d'investissement doivent être actifs
 * (= seulement quand la campagne est ongoing).
 * Dans les autres cas, on affiche un bouton "Join waitlist" qui ouvre la modale.
 */
export function isInvestmentOpen(status: CampaignStatus | undefined): boolean {
  return status === 'ongoing'
}

/**
 * Indique si la progress bar doit être affichée
 * (= ongoing ou sold_out, pas coming_soon).
 */
export function showProgressBar(status: CampaignStatus | undefined): boolean {
  return status === 'ongoing' || status === 'sold_out'
}