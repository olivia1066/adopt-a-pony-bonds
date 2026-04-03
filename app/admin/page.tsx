'use client'

import { useState } from 'react'
import Link from 'next/link'

const BG = '#09091F'
const CARD = '#1A1545'
const CYAN = '#00E5CC'

const investors = [
  { id: '1', name: 'Olivia Bally', email: 'olivia@example.com', kyc: 'approved', montantTotal: 7000, investissements: 2, date: '2026-04-01' },
  { id: '2', name: 'Thomas Durand', email: 'thomas@example.com', kyc: 'pending', montantTotal: 5000, investissements: 1, date: '2026-04-02' },
  { id: '3', name: 'Marie Martin', email: 'marie@example.com', kyc: 'pending', montantTotal: 10000, investissements: 1, date: '2026-04-03' },
  { id: '4', name: 'Lucas Bernard', email: 'lucas@example.com', kyc: 'rejected', montantTotal: 0, investissements: 0, date: '2026-03-28' },
  { id: '5', name: 'Sophie Petit', email: 'sophie@example.com', kyc: 'approved', montantTotal: 3000, investissements: 1, date: '2026-03-25' },
]

const investissements = [
  { ref: 'PONY-2026-001', investor: 'Olivia Bally', campagne: 'Flotte Printemps 2026', montant: 5000, taux: '7%', duree: '24 mois', statut: 'Actif', date: '2026-04-01' },
  { ref: 'PONY-2026-002', investor: 'Olivia Bally', campagne: 'Flotte Été 2026', montant: 2000, taux: '8%', duree: '36 mois', statut: 'En attente', date: '2026-04-01' },
  { ref: 'PONY-2026-003', investor: 'Thomas Durand', campagne: 'Flotte Printemps 2026', montant: 5000, taux: '7%', duree: '24 mois', statut: 'En attente', date: '2026-04-02' },
  { ref: 'PONY-2026-004', investor: 'Sophie Petit', campagne: 'Flotte Printemps 2026', montant: 3000, taux: '7%', duree: '24 mois', statut: 'Actif', date: '2026-03-25' },
  { ref: 'PONY-2026-005', investor: 'Marie Martin', campagne: 'Flotte Printemps 2026', montant: 10000, taux: '7%', duree: '24 mois', statut: 'En attente', date: '2026-04-03' },
]

type Tab = 'overview' | 'investors' | 'investments' | 'campaign'

const kycColor = (k: string) => {
  if (k === 'approved') return { bg: 'rgba(0,229,204,0.12)', border: 'rgba(0,229,204,0.3)', color: CYAN }
  if (k === 'rejected') return { bg: 'rgba(255,80,80,0.12)', border: 'rgba(255,80,80,0.3)', color: '#FF5050' }
  return { bg: 'rgba(255,200,0,0.12)', border: 'rgba(255,200,0,0.3)', color: '#FFD700' }
}

const kycLabel = (k: string) => k === 'approved' ? 'Approuvé' : k === 'rejected' ? 'Rejeté' : 'En attente'

const statutColor = (s: string) => s === 'Actif'
  ? { bg: 'rgba(0,229,204,0.12)', border: 'rgba(0,229,204,0.3)', color: CYAN }
  : { bg: 'rgba(255,200,0,0.12)', border: 'rgba(255,200,0,0.3)', color: '#FFD700' }

export default function Admin() {
  const [tab, setTab] = useState<Tab>('overview')

  const totalCollecte = investissements.reduce((s, i) => s + i.montant, 0)
  const kycPending = investors.filter(i => i.kyc === 'pending').length

  return (
    <main style={{ backgroundColor: BG, color: 'white', fontFamily: 'var(--font-poppins)', minHeight: '100vh' }}>

      {/* Nav */}
      <header className="flex justify-between items-center px-10 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-lg" style={{ color: CYAN }}>pony</Link>
          <span className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ backgroundColor: 'rgba(255,100,100,0.15)', border: '1px solid rgba(255,100,100,0.3)', color: '#FF6464' }}>
            ADMIN
          </span>
        </div>
        <Link href="/dashboard" className="text-sm transition-colors hover:text-white"
          style={{ color: 'rgba(255,255,255,0.4)' }}>
          Vue investisseur →
        </Link>
      </header>

      <div className="flex h-[calc(100vh-57px)]">

        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0 p-6 space-y-1"
          style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          {([
            { key: 'overview', label: 'Vue d\'ensemble', icon: '📊' },
            { key: 'investors', label: 'Investisseurs', icon: '👥', badge: kycPending > 0 ? kycPending : undefined },
            { key: 'investments', label: 'Investissements', icon: '💼' },
            { key: 'campaign', label: 'Campagne', icon: '📢' },
          ] as Array<{ key: Tab; label: string; icon: string; badge?: number }>).map(item => (
            <button key={item.key} onClick={() => setTab(item.key)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-left transition-all"
              style={tab === item.key
                ? { backgroundColor: 'rgba(0,229,204,0.1)', color: CYAN, border: '1px solid rgba(0,229,204,0.2)' }
                : { color: 'rgba(255,255,255,0.4)', border: '1px solid transparent' }}>
              <span className="flex items-center gap-2">
                <span>{item.icon}</span>
                {item.label}
              </span>
              {item.badge !== undefined && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: '#FFD700', color: BG }}>{item.badge}</span>
              )}
            </button>
          ))}
        </aside>

        {/* Main */}
        <div className="flex-1 overflow-auto p-8">

          {/* Overview */}
          {tab === 'overview' && (
            <div>
              <h1 className="text-2xl font-extrabold mb-8">Vue d'ensemble</h1>
              <div className="grid grid-cols-4 gap-4 mb-10">
                {[
                  { label: 'Total collecté', value: `${totalCollecte.toLocaleString('fr-FR')} €`, cyan: true },
                  { label: 'Investisseurs', value: investors.length.toString() },
                  { label: 'KYC en attente', value: kycPending.toString(), warn: kycPending > 0 },
                  { label: 'Taux remplissage', value: `${Math.round((totalCollecte / 500000) * 100)} %` },
                ].map((kpi, i) => (
                  <div key={i} className="rounded-2xl p-5"
                    style={{ backgroundColor: CARD, border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-2"
                      style={{ color: kpi.cyan ? CYAN : kpi.warn ? '#FFD700' : 'rgba(255,255,255,0.35)' }}>{kpi.label}</p>
                    <p className="text-3xl font-extrabold"
                      style={kpi.cyan ? { color: CYAN } : kpi.warn ? { color: '#FFD700' } : undefined}>{kpi.value}</p>
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div className="rounded-2xl p-6 mb-6"
                style={{ backgroundColor: CARD, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold">Flotte Printemps 2026</h2>
                  <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: CYAN, color: BG }}>EN COURS</span>
                </div>
                <div className="w-full rounded-full h-2 mb-3" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-2 rounded-full" style={{ width: `${Math.round((totalCollecte / 500000) * 100)}%`, backgroundColor: CYAN }} />
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>{totalCollecte.toLocaleString('fr-FR')} € collectés</span>
                  <span style={{ color: CYAN }}>{Math.round((totalCollecte / 500000) * 100)} %</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>objectif 500 000 €</span>
                </div>
              </div>

              {/* KYC queue */}
              {kycPending > 0 && (
                <div className="rounded-2xl p-6"
                  style={{ backgroundColor: CARD, border: '1px solid rgba(255,200,0,0.2)' }}>
                  <h2 className="font-bold mb-4">KYC en attente de validation</h2>
                  <div className="space-y-3">
                    {investors.filter(i => i.kyc === 'pending').map(inv => (
                      <div key={inv.id} className="flex items-center justify-between p-4 rounded-xl"
                        style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div>
                          <p className="font-semibold text-sm">{inv.name}</p>
                          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{inv.email} · {inv.date}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-xs px-4 py-2 rounded-full font-bold transition-all hover:opacity-90"
                            style={{ backgroundColor: CYAN, color: BG }}>Approuver</button>
                          <button className="text-xs px-4 py-2 rounded-full font-bold transition-all"
                            style={{ border: '1px solid rgba(255,80,80,0.4)', color: '#FF5050' }}>Rejeter</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Investors */}
          {tab === 'investors' && (
            <div>
              <h1 className="text-2xl font-extrabold mb-8">Investisseurs</h1>
              <div className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <table className="w-full text-sm">
                  <thead style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                    <tr>
                      {['Nom', 'Email', 'KYC', 'Montant total', 'Investissements', 'Date', 'Actions'].map((h, i) => (
                        <th key={h} className={`px-5 py-4 font-semibold text-xs uppercase tracking-wide ${i >= 3 ? 'text-right' : 'text-left'}`}
                          style={{ color: 'rgba(255,255,255,0.35)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {investors.map((inv, i) => {
                      const kc = kycColor(inv.kyc)
                      return (
                        <tr key={inv.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td className="px-5 py-4 font-semibold">{inv.name}</td>
                          <td className="px-5 py-4 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{inv.email}</td>
                          <td className="px-5 py-4">
                            <span className="text-xs font-bold px-3 py-1 rounded-full"
                              style={{ backgroundColor: kc.bg, border: `1px solid ${kc.border}`, color: kc.color }}>
                              {kycLabel(inv.kyc)}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right font-bold"
                            style={{ color: inv.montantTotal > 0 ? CYAN : 'rgba(255,255,255,0.3)' }}>
                            {inv.montantTotal > 0 ? `${inv.montantTotal.toLocaleString('fr-FR')} €` : '—'}
                          </td>
                          <td className="px-5 py-4 text-right" style={{ color: 'rgba(255,255,255,0.5)' }}>
                            {inv.investissements}
                          </td>
                          <td className="px-5 py-4 text-right font-mono text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            {inv.date}
                          </td>
                          <td className="px-5 py-4 text-right">
                            {inv.kyc === 'pending' && (
                              <div className="flex gap-2 justify-end">
                                <button className="text-xs px-3 py-1.5 rounded-full font-bold"
                                  style={{ backgroundColor: CYAN, color: BG }}>✓</button>
                                <button className="text-xs px-3 py-1.5 rounded-full font-bold"
                                  style={{ border: '1px solid rgba(255,80,80,0.4)', color: '#FF5050' }}>✕</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Investments */}
          {tab === 'investments' && (
            <div>
              <h1 className="text-2xl font-extrabold mb-8">Investissements</h1>
              <div className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <table className="w-full text-sm">
                  <thead style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                    <tr>
                      {['Référence', 'Investisseur', 'Campagne', 'Montant', 'Taux', 'Durée', 'Statut', 'Date'].map((h, i) => (
                        <th key={h} className={`px-4 py-4 font-semibold text-xs uppercase tracking-wide ${i >= 3 ? 'text-right' : 'text-left'}`}
                          style={{ color: 'rgba(255,255,255,0.35)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {investissements.map((inv, i) => {
                      const sc = statutColor(inv.statut)
                      return (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td className="px-4 py-4 font-mono text-xs" style={{ color: CYAN }}>{inv.ref}</td>
                          <td className="px-4 py-4 font-semibold">{inv.investor}</td>
                          <td className="px-4 py-4 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{inv.campagne}</td>
                          <td className="px-4 py-4 text-right font-bold" style={{ color: CYAN }}>
                            {inv.montant.toLocaleString('fr-FR')} €
                          </td>
                          <td className="px-4 py-4 text-right font-semibold">{inv.taux}</td>
                          <td className="px-4 py-4 text-right" style={{ color: 'rgba(255,255,255,0.5)' }}>{inv.duree}</td>
                          <td className="px-4 py-4 text-right">
                            <span className="text-xs font-bold px-3 py-1 rounded-full"
                              style={{ backgroundColor: sc.bg, border: `1px solid ${sc.border}`, color: sc.color }}>
                              {inv.statut}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right font-mono text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            {inv.date}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Campaign */}
          {tab === 'campaign' && (
            <div>
              <h1 className="text-2xl font-extrabold mb-8">Gestion de la campagne</h1>
              <div className="grid grid-cols-2 gap-6">
                <div className="rounded-2xl p-6 col-span-2"
                  style={{ backgroundColor: CARD, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-bold">Flotte Printemps 2026</h2>
                    <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: CYAN, color: BG }}>EN COURS</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: 'Objectif', value: '500 000 €' },
                      { label: 'Collecté', value: `${totalCollecte.toLocaleString('fr-FR')} €`, cyan: true },
                      { label: 'Restant', value: `${(500000 - totalCollecte).toLocaleString('fr-FR')} €` },
                      { label: 'Souscripteurs', value: investors.filter(i => i.investissements > 0).length.toString() },
                    ].map((stat, i) => (
                      <div key={i} className="rounded-xl p-4"
                        style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                        <p className="text-xs font-bold uppercase tracking-wide mb-1"
                          style={{ color: stat.cyan ? CYAN : 'rgba(255,255,255,0.35)' }}>{stat.label}</p>
                        <p className="text-xl font-extrabold" style={stat.cyan ? { color: CYAN } : undefined}>{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <div className="w-full rounded-full h-2 mb-2" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-2 rounded-full" style={{ width: `${Math.round((totalCollecte / 500000) * 100)}%`, backgroundColor: CYAN }} />
                    </div>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      {Math.round((totalCollecte / 500000) * 100)} % de l'objectif atteint
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl p-6"
                  style={{ backgroundColor: CARD, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <h2 className="font-bold mb-5">Paramètres</h2>
                  <div className="space-y-4 text-sm">
                    {[
                      { label: 'Taux 12 mois', value: '6 %' },
                      { label: 'Taux 24 mois', value: '7 %' },
                      { label: 'Taux 36 mois', value: '8 %' },
                      { label: 'Taux 48 mois', value: '9 %' },
                      { label: 'Min. investissement', value: '500 €' },
                      { label: 'Max. investissement', value: '50 000 €' },
                    ].map(row => (
                      <div key={row.label} className="flex justify-between py-3"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>{row.label}</span>
                        <span className="font-bold" style={{ color: CYAN }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl p-6"
                  style={{ backgroundColor: CARD, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <h2 className="font-bold mb-5">Actions</h2>
                  <div className="space-y-3">
                    {[
                      { label: 'Clôturer la campagne', color: '#FF5050', bg: 'rgba(255,80,80,0.1)', border: 'rgba(255,80,80,0.3)' },
                      { label: 'Exporter les souscriptions (CSV)', color: CYAN, bg: 'rgba(0,229,204,0.1)', border: 'rgba(0,229,204,0.3)' },
                      { label: 'Envoyer email aux investisseurs', color: 'rgba(255,255,255,0.7)', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.12)' },
                    ].map(action => (
                      <button key={action.label}
                        className="w-full py-3 px-5 rounded-xl text-sm font-semibold text-left transition-all hover:opacity-80"
                        style={{ backgroundColor: action.bg, border: `1px solid ${action.border}`, color: action.color }}>
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}
