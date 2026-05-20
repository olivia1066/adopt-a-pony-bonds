'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Investment = {
  id: string
  montant: number
  statut: string
  created_at: string
  campaigns: {
    id: string
    name: string
    rate: number
    duration: number
    start_date: string
  }
}

type Investor = {
  id: string
  prenom: string
  nom: string
  email: string
  kyc_status: string
  investments: Investment[]
}

export default function Dashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('portfolio')
  const [investor, setInvestor] = useState<Investor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      const { data } = await supabase
        .from('investors')
        .select('*, investments(*, campaigns(*))')
        .eq('email', session.user.email)
        .single()
      if (data) setInvestor(data)
      setLoading(false)
    }
    getSession()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const totalInvesti = investor?.investments?.reduce((sum, i) => sum + i.montant, 0) || 0
  const totalMensuel = investor?.investments?.reduce((sum, i) => {
    const rate = i.campaigns?.rate / 100
    return sum + (i.montant * rate) / 12
  }, 0) || 0
  const totalRembourse = investor?.investments?.reduce((sum, i) => {
    const rate = i.campaigns?.rate / 100
    const duration = i.campaigns?.duration
    return sum + i.montant + i.montant * rate * (duration / 12)
  }, 0) || 0

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#13102B'}}>
      <p style={{color: '#00FFFF'}}>Loading...</p>
    </main>
  )

  return (
    <main className="min-h-screen font-sans" style={{backgroundColor: '#13102B', color: 'white'}}>

      {/* Header */}
      <header className="flex justify-between items-center px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <img src="/Logo.png" alt="Pony" style={{height: '25px', width: 'auto'}} />
        </div>
        <div className="flex items-center gap-4">
          <Link href="/campagne"
            className="text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
            style={{backgroundColor: '#00FFFF', color: '#13102B'}}>
            + New investment
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm px-4 py-2 rounded-xl"
            style={{backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)'}}>
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-8 py-12">

        <div className="mb-10 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              Hello {investor?.prenom} 👋
            </h1>
            <p className="text-sm" style={{color: 'rgba(255,255,255,0.5)'}}>
              Here is a summary of your investments
            </p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full font-medium"
            style={{
              backgroundColor: investor?.kyc_status === 'Validé' ? 'rgba(0,229,204,0.15)' :
                investor?.kyc_status === 'Rejeté' ? 'rgba(255,100,100,0.15)' : 'rgba(255,200,0,0.15)',
              color: investor?.kyc_status === 'Validé' ? '#00FFFF' :
                investor?.kyc_status === 'Rejeté' ? '#FF6464' : '#FFC800',
            }}>
            KYC: {investor?.kyc_status === 'Validé' ? 'Approved' : investor?.kyc_status === 'Rejeté' ? 'Rejected' : 'Pending'}
          </span>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total invested', value: `€${totalInvesti.toLocaleString('en-GB')}`, color: 'white' },
            { label: 'Monthly income', value: `+€${totalMensuel.toFixed(2)}`, color: '#00FFFF' },
            { label: 'Total repaid at maturity', value: `€${totalRembourse.toLocaleString('en-GB', {maximumFractionDigits: 0})}`, color: 'white' },
          ].map((kpi, i) => (
            <div key={i} className="rounded-2xl p-6" style={{backgroundColor: '#1E1B4B'}}>
              <p className="text-xs mb-2" style={{color: 'rgba(255,255,255,0.5)'}}>{kpi.label}</p>
              <p className="text-2xl font-bold" style={{color: kpi.color}}>{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b border-white/10">
          {['portfolio', 'payments'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="pb-3 text-sm font-medium transition-colors"
              style={{
                color: activeTab === tab ? '#00FFFF' : 'rgba(255,255,255,0.4)',
                borderBottom: activeTab === tab ? '2px solid #00FFFF' : '2px solid transparent',
              }}>
              {tab === 'portfolio' ? 'My portfolio' : 'Payment schedule'}
            </button>
          ))}
        </div>

        {/* Portfolio */}
        {activeTab === 'portfolio' && (
          <div className="space-y-4">
            {investor?.investments?.length === 0 && (
              <div className="text-center py-16 space-y-4">
                <p style={{color: 'rgba(255,255,255,0.3)'}}>No investments yet</p>
                <Link href="/campagne"
                  className="inline-block px-6 py-3 rounded-xl text-sm font-bold"
                  style={{backgroundColor: '#00FFFF', color: '#13102B'}}>
                  See the campaign →
                </Link>
              </div>
            )}
            {investor?.investments?.map(inv => {
              const rate = inv.campaigns?.rate / 100
              const duration = inv.campaigns?.duration
              const mensualite = (inv.montant * rate) / 12
              const totalRemb = inv.montant + inv.montant * rate * (duration / 12)

              return (
                <div key={inv.id} className="rounded-2xl p-6" style={{backgroundColor: '#1E1B4B'}}>
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: inv.statut === 'Actif' ? 'rgba(0,229,204,0.15)' : 'rgba(255,200,0,0.15)',
                            color: inv.statut === 'Actif' ? '#00FFFF' : '#FFC800',
                          }}>
                          ● {inv.statut === 'Actif' ? 'Active' : 'Pending'}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg">{inv.campaigns?.name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">€{inv.montant.toLocaleString('en-GB')}</p>
                      <p className="text-xs" style={{color: 'rgba(255,255,255,0.4)'}}>invested</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-sm mb-5">
                    {[
                      { label: 'Rate', value: `${inv.campaigns?.rate}%` },
                      { label: 'Duration', value: `${duration} months` },
                      { label: 'Monthly', value: `+€${mensualite.toFixed(2)}`, green: true },
                      { label: 'Total repaid', value: `€${totalRemb.toLocaleString('en-GB', {maximumFractionDigits: 0})}` },
                    ].map((stat, i) => (
                      <div key={i}>
                        <p className="text-xs mb-1" style={{color: 'rgba(255,255,255,0.4)'}}>{stat.label}</p>
                        <p className="font-bold" style={{color: stat.green ? '#00FFFF' : 'white'}}>{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1" style={{color: 'rgba(255,255,255,0.4)'}}>
                      <span>Start: {inv.campaigns?.start_date}</span>
                      <span>{duration} months</span>
                    </div>
                    <div className="w-full rounded-full h-1" style={{backgroundColor: 'rgba(255,255,255,0.1)'}}>
                      <div className="h-1 rounded-full" style={{width: '4%', backgroundColor: '#00FFFF'}}></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Payments */}
        {activeTab === 'payments' && (
          <div className="rounded-2xl p-8 text-center" style={{backgroundColor: '#1E1B4B'}}>
            <p style={{color: 'rgba(255,255,255,0.4)'}}>
              The payment schedule will be available once your KYC is approved.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}