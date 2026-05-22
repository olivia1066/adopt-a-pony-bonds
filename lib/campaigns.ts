import { supabase } from './supabase'

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type CampaignStatus = 'coming_soon' | 'ongoing' | 'sold_out'

export type Campaign = {
  id: string
  name: string
  status: CampaignStatus
  target_amount: number
  raised_amount: number
  rate: number
  duration: number
  start_date: string
  created_at?: string
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