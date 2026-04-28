'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Campaign = {
  id: string
  name: string
  target_amount: number
  raised_amount: number
  rate: number
  duration: number
  status: string
  start_date: string
}

type Investor = {
  id: string
  prenom: string
  nom: string
  email: string
  telephone: string
  date_naissance: string
  lieu_naissance: string
  nationalite: string
  residence_fiscale: string
  adresse: string
  profession: string
  revenus: string
  pep: string
  document_type: string
  document_numero: string
  iban: string
  kyc_status: string
  created_at: string
  investments?: { montant: number, campaigns?: { name: string } }[]
}

type Payment = {
  id: string
  type: string
  montant: number
  date_prevue: string
  statut: string
  investments?: { investors?: { prenom: string, nom: string }, campaigns?: { name: string } }
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState('campaigns')
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [investors, setInvestors] = useState<Investor[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewCampaign, setShowNewCampaign] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    name: '', target: '', rate: '', duration: '', startDate: ''
  })

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    setLoading(true)
    const { data: camps } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false })
    const { data: invs } = await supabase.from('investors').select('*, investments(montant, campaigns(name))').order('created_at', { ascending: false })
    const { data: pays } = await supabase.from('payments').select('*, investments(investors(prenom, nom), campaigns(name))').order('date_prevue', { ascending: true })
    if (camps) setCampaigns(camps)
    if (invs) setInvestors(invs)
    if (pays) setPayments(pays)
    setLoading(false)
  }

  async function createCampaign() {
    const { error } = await supabase.from('campaigns').insert({
      name: newCampaign.name,
      target_amount: Number(newCampaign.target),
      rate: Number(newCampaign.rate),
      duration: Number(newCampaign.duration),
      start_date: newCampaign.startDate,
      status: 'À venir',
      raised_amount: 0,
    })
    if (!error) {
      setShowNewCampaign(false)
      setNewCampaign({ name: '', target: '', rate: '', duration: '', startDate: '' })
      fetchAll()
    }
  }

  async function closeCampaign(id: string) {
    await supabase.from('campaigns').update({ status: 'Clôturée' }).eq('id', id)
    fetchAll()
  }

  async function updateKyc(id: string, status: string) {
    await supabase.from('investors').update({ kyc_status: status }).eq('id', id)
    fetchAll()
  }

  async function markPaymentSent(id: string) {
    await supabase.from('payments').update({ statut: 'Envoyé' }).eq('id', id)
    fetchAll()
  }

  const totalCollecte = campaigns.reduce((sum, c) => sum + c.raised_amount, 0)
  const kycEnAttente = investors.filter(i => i.kyc_status === 'En attente').length

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#13102B'}}>
      <p style={{color: '#00E5CC'}}>Loading...</p>
    </main>
  )

  return (
    <main className="min-h-screen font-sans" style={{backgroundColor: '#13102B', color: 'white'}}>

      <header className="flex justify-between items-center px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-4">
          <img src="/Logo.png" alt="Pony" style={{height: '25px', width: 'auto'}} />
          <span className="text-xs px-2 py-1 rounded-full font-medium"
            style={{backgroundColor: 'rgba(255,200,0,0.15)', color: '#FFC800'}}>
            Admin
          </span>
        </div>
        <Link href="/" className="text-sm hover:opacity-70" style={{color: 'rgba(255,255,255,0.5)'}}>
          ← Back to site
        </Link>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-10">

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Admin Panel</h1>
          <p className="text-sm" style={{color: 'rgba(255,255,255,0.4)'}}>Manage campaigns, investors and payments</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Active campaigns', value: campaigns.filter(c => c.status === 'Ouverte').length.toString() },
            { label: 'Total investors', value: investors.length.toString() },
            { label: 'KYC pending', value: kycEnAttente.toString(), warn: kycEnAttente > 0 },
            { label: 'Total raised', value: `€${totalCollecte.toLocaleString('en-GB')}` },
          ].map((kpi, i) => (
            <div key={i} className="rounded-2xl p-5" style={{backgroundColor: '#1E1B4B'}}>
              <p className="text-xs mb-2" style={{color: 'rgba(255,255,255,0.4)'}}>{kpi.label}</p>
              <p className="text-2xl font-bold" style={{color: kpi.warn ? '#FFC800' : '#00E5CC'}}>{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b border-white/10">
          {['campaigns', 'investors', 'payments'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="pb-3 text-sm font-medium capitalize transition-colors"
              style={{
                color: activeTab === tab ? '#00E5CC' : 'rgba(255,255,255,0.4)',
                borderBottom: activeTab === tab ? '2px solid #00E5CC' : '2px solid transparent',
              }}>
              {tab === 'campaigns' ? 'Campaigns' : tab === 'investors' ? 'Investors' : 'Payments'}
            </button>
          ))}
        </div>

        {/* CAMPAIGNS */}
        {activeTab === 'campaigns' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Campaigns</h2>
              <button onClick={() => setShowNewCampaign(!showNewCampaign)}
                className="text-sm px-4 py-2 rounded-xl font-bold"
                style={{backgroundColor: '#00E5CC', color: '#13102B'}}>
                + New campaign
              </button>
            </div>

            {showNewCampaign && (
              <div className="rounded-2xl p-6 mb-6" style={{backgroundColor: '#1E1B4B', border: '1px solid rgba(0,229,204,0.3)'}}>
                <h3 className="font-bold mb-4" style={{color: '#00E5CC'}}>New campaign</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Name', key: 'name', placeholder: 'Autumn 2026 Fleet' },
                    { label: 'Target (€)', key: 'target', placeholder: '500000' },
                    { label: 'Rate (%)', key: 'rate', placeholder: '7' },
                    { label: 'Duration (months)', key: 'duration', placeholder: '24' },
                    { label: 'Start date', key: 'startDate', placeholder: '2026-09-01' },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>{field.label}</label>
                      <input type="text" placeholder={field.placeholder}
                        value={newCampaign[field.key as keyof typeof newCampaign]}
                        onChange={e => setNewCampaign(prev => ({...prev, [field.key]: e.target.value}))}
                        className="w-full rounded-xl px-4 py-3 text-sm text-white"
                        style={{backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'}} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={createCampaign}
                    className="px-6 py-2 rounded-xl text-sm font-bold"
                    style={{backgroundColor: '#00E5CC', color: '#13102B'}}>
                    Create campaign
                  </button>
                  <button onClick={() => setShowNewCampaign(false)}
                    className="px-6 py-2 rounded-xl text-sm"
                    style={{backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)'}}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {campaigns.map(c => (
                <div key={c.id} className="rounded-2xl p-6" style={{backgroundColor: '#1E1B4B'}}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: c.status === 'Ouverte' ? 'rgba(0,229,204,0.15)' : 'rgba(255,255,255,0.1)',
                            color: c.status === 'Ouverte' ? '#00E5CC' : 'rgba(255,255,255,0.5)',
                          }}>
                          {c.status === 'Ouverte' ? 'Open' : c.status === 'Clôturée' ? 'Closed' : 'Upcoming'}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg">{c.name}</h3>
                    </div>
                    {c.status === 'Ouverte' && (
                      <button onClick={() => closeCampaign(c.id)}
                        className="text-sm px-4 py-2 rounded-xl"
                        style={{backgroundColor: 'rgba(255,100,100,0.15)', color: '#FF6464'}}>
                        Close
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm mb-4">
                    {[
                      { label: 'Rate', value: `${c.rate}%` },
                      { label: 'Duration', value: `${c.duration} months` },
                      { label: 'Target', value: `€${c.target_amount.toLocaleString('en-GB')}` },
                      { label: 'Raised', value: `€${c.raised_amount.toLocaleString('en-GB')}` },
                    ].map((stat, i) => (
                      <div key={i}>
                        <p className="text-xs mb-1" style={{color: 'rgba(255,255,255,0.4)'}}>{stat.label}</p>
                        <p className="font-bold">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="w-full rounded-full h-1.5" style={{backgroundColor: 'rgba(255,255,255,0.1)'}}>
                    <div className="h-1.5 rounded-full" style={{
                      width: `${Math.min((c.raised_amount / c.target_amount) * 100, 100)}%`,
                      backgroundColor: '#00E5CC'
                    }}></div>
                  </div>
                  <p className="text-xs mt-1" style={{color: 'rgba(255,255,255,0.3)'}}>
                    {((c.raised_amount / c.target_amount) * 100).toFixed(0)}% funded
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INVESTORS */}
        {activeTab === 'investors' && (
          <div>
            <h2 className="text-xl font-bold mb-6">Investors ({investors.length})</h2>
            <div className="space-y-4">
              {investors.map(inv => (
                <div key={inv.id} className="rounded-2xl p-6" style={{backgroundColor: '#1E1B4B'}}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: inv.kyc_status === 'Validé' ? 'rgba(0,229,204,0.15)' :
                              inv.kyc_status === 'Rejeté' ? 'rgba(255,100,100,0.15)' : 'rgba(255,200,0,0.15)',
                            color: inv.kyc_status === 'Validé' ? '#00E5CC' :
                              inv.kyc_status === 'Rejeté' ? '#FF6464' : '#FFC800',
                          }}>
                          KYC: {inv.kyc_status === 'Validé' ? 'Approved' : inv.kyc_status === 'Rejeté' ? 'Rejected' : 'Pending'}
                        </span>
                        <span className="text-xs" style={{color: 'rgba(255,255,255,0.3)'}}>
                          {new Date(inv.created_at).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg">{inv.prenom} {inv.nom}</h3>
                      <p className="text-sm" style={{color: 'rgba(255,255,255,0.4)'}}>{inv.email} · {inv.telephone}</p>
                    </div>
                    <div className="text-right">
                      {inv.investments && inv.investments.length > 0 && (
                        <>
                          <p className="text-xl font-bold">€{inv.investments[0].montant?.toLocaleString('en-GB')}</p>
                          <p className="text-xs" style={{color: 'rgba(255,255,255,0.4)'}}>
                            {inv.investments[0].campaigns?.name}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-sm mb-4 p-4 rounded-xl"
                    style={{backgroundColor: 'rgba(255,255,255,0.03)'}}>
                    {[
                      { label: 'Date of birth', value: inv.date_naissance },
                      { label: 'Place of birth', value: inv.lieu_naissance },
                      { label: 'Nationality', value: inv.nationalite },
                      { label: 'Tax residence', value: inv.residence_fiscale },
                      { label: 'Address', value: inv.adresse },
                      { label: 'Occupation', value: inv.profession },
                      { label: 'Monthly income', value: inv.revenus },
                      { label: 'PEP', value: inv.pep },
                      { label: 'Document', value: `${inv.document_type} — ${inv.document_numero}` },
                      { label: 'IBAN', value: inv.iban },
                    ].map((field, i) => (
                      <div key={i}>
                        <p className="text-xs mb-0.5" style={{color: 'rgba(255,255,255,0.3)'}}>{field.label}</p>
                        <p style={{color: 'rgba(255,255,255,0.8)'}}>{field.value}</p>
                      </div>
                    ))}
                  </div>

                  {inv.kyc_status === 'En attente' && (
                    <div className="flex gap-3">
                      <button onClick={() => updateKyc(inv.id, 'Validé')}
                        className="px-5 py-2 rounded-xl text-sm font-bold"
                        style={{backgroundColor: 'rgba(0,229,204,0.15)', color: '#00E5CC'}}>
                        ✓ Approve KYC
                      </button>
                      <button onClick={() => updateKyc(inv.id, 'Rejeté')}
                        className="px-5 py-2 rounded-xl text-sm font-bold"
                        style={{backgroundColor: 'rgba(255,100,100,0.15)', color: '#FF6464'}}>
                        ✗ Reject
                      </button>
                    </div>
                  )}
                  {inv.kyc_status === 'Validé' && (
                    <p className="text-sm font-medium" style={{color: '#00E5CC'}}>✓ KYC approved</p>
                  )}
                  {inv.kyc_status === 'Rejeté' && (
                    <p className="text-sm font-medium" style={{color: '#FF6464'}}>✗ KYC rejected</p>
                  )}
                </div>
              ))}

              {investors.length === 0 && (
                <div className="text-center py-16" style={{color: 'rgba(255,255,255,0.3)'}}>
                  No investors yet
                </div>
              )}
            </div>
          </div>
        )}

        {/* PAYMENTS */}
        {activeTab === 'payments' && (
          <div>
            <h2 className="text-xl font-bold mb-6">Payments</h2>
            {payments.length === 0 ? (
              <div className="text-center py-16" style={{color: 'rgba(255,255,255,0.3)'}}>
                No payments yet
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden" style={{backgroundColor: '#1E1B4B'}}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                      {['Date', 'Investor', 'Campaign', 'Type', 'Amount', 'Status', 'Action'].map((h, i) => (
                        <th key={i} className={`px-6 py-4 text-xs font-medium ${i >= 4 ? 'text-right' : 'text-left'}`}
                          style={{color: 'rgba(255,255,255,0.4)'}}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(p => (
                      <tr key={p.id} style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                        <td className="px-6 py-4">{p.date_prevue ? new Date(p.date_prevue).toLocaleDateString('en-GB') : '—'}</td>
                        <td className="px-6 py-4" style={{color: 'rgba(255,255,255,0.7)'}}>
                          {p.investments?.investors?.prenom} {p.investments?.investors?.nom}
                        </td>
                        <td className="px-6 py-4" style={{color: 'rgba(255,255,255,0.5)'}}>
                          {p.investments?.campaigns?.name}
                        </td>
                        <td className="px-6 py-4" style={{color: 'rgba(255,255,255,0.5)'}}>{p.type}</td>
                        <td className="px-6 py-4 text-right font-bold" style={{color: '#00E5CC'}}>
                          +€{p.montant.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-xs px-2 py-1 rounded-full"
                            style={{
                              backgroundColor: p.statut === 'Envoyé' ? 'rgba(0,229,204,0.15)' : 'rgba(255,200,0,0.15)',
                              color: p.statut === 'Envoyé' ? '#00E5CC' : '#FFC800',
                            }}>
                            {p.statut === 'Envoyé' ? 'Sent' : 'To send'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {p.statut === 'À envoyer' && (
                            <button onClick={() => markPaymentSent(p.id)}
                              className="text-xs px-3 py-1 rounded-xl font-medium"
                              style={{backgroundColor: 'rgba(0,229,204,0.15)', color: '#00E5CC'}}>
                              Mark as sent
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}