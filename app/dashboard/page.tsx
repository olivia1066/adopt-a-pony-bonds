'use client'

import { useState } from 'react'
import Link from 'next/link'

const investments = [
  {
    id: 'PONY-2026-001',
    campagne: 'Flotte Printemps 2026',
    montant: 5000,
    taux: 0.07,
    duree: 24,
    dateDebut: '2026-04-01',
    statut: 'Actif',
    mensualite: 29.17,
  },
  {
    id: 'PONY-2026-002',
    campagne: 'Flotte Été 2026',
    montant: 2000,
    taux: 0.08,
    duree: 36,
    dateDebut: '2026-06-01',
    statut: 'En attente',
    mensualite: 13.33,
  },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('portfolio')

  const totalInvesti = investments.reduce((sum, i) => sum + i.montant, 0)
  const totalMensuel = investments.reduce((sum, i) => sum + i.mensualite, 0)
  const totalRembourse = investments.reduce((sum, i) => sum + i.montant + i.montant * i.taux * (i.duree / 12), 0)

  return (
    <main className="min-h-screen font-sans" style={{backgroundColor: '#0D0D2B', color: 'white'}}>

      {/* Header */}
      <header className="flex justify-between items-center px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xl">🐴</span>
          <span className="font-bold" style={{color: '#00E5CC'}}>pony</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/campagne"
            className="text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
            style={{backgroundColor: '#00E5CC', color: '#0D0D2B'}}>
            + Nouvel investissement
          </Link>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
            style={{backgroundColor: '#1E1B4B', color: '#00E5CC'}}>
            O
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-8 py-12">

        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-1">Bonjour Olivia 👋</h1>
          <p className="text-sm" style={{color: 'rgba(255,255,255,0.5)'}}>Voici un résumé de vos investissements</p>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total investi', value: `${totalInvesti.toLocaleString('fr-FR')} €`, color: 'white' },
            { label: 'Revenus mensuels', value: `+${totalMensuel.toFixed(2).replace('.', ',')} €`, color: '#00E5CC' },
            { label: 'Total remboursé à terme', value: `${totalRembourse.toLocaleString('fr-FR', {maximumFractionDigits: 0})} €`, color: 'white' },
          ].map((kpi, i) => (
            <div key={i} className="rounded-2xl p-6" style={{backgroundColor: '#1E1B4B'}}>
              <p className="text-xs mb-2" style={{color: 'rgba(255,255,255,0.5)'}}>{kpi.label}</p>
              <p className="text-2xl font-bold" style={{color: kpi.color}}>{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b border-white/10">
          {['portfolio', 'paiements'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="pb-3 text-sm font-medium transition-colors"
              style={{
                color: activeTab === tab ? '#00E5CC' : 'rgba(255,255,255,0.4)',
                borderBottom: activeTab === tab ? '2px solid #00E5CC' : '2px solid transparent',
              }}
            >
              {tab === 'portfolio' ? 'Mon portfolio' : 'Calendrier des paiements'}
            </button>
          ))}
        </div>

        {/* Portfolio tab */}
        {activeTab === 'portfolio' && (
          <div className="space-y-4">
            {investments.map(inv => (
              <div key={inv.id} className="rounded-2xl p-6" style={{backgroundColor: '#1E1B4B'}}>
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{
                          backgroundColor: inv.statut === 'Actif' ? 'rgba(0,229,204,0.15)' : 'rgba(255,200,0,0.15)',
                          color: inv.statut === 'Actif' ? '#00E5CC' : '#FFC800'
                        }}>
                        {inv.statut === 'Actif' ? '● Actif' : '● En attente'}
                      </span>
                      <span className="text-xs" style={{color: 'rgba(255,255,255,0.3)'}}>{inv.id}</span>
                    </div>
                    <h3 className="font-bold text-lg">{inv.campagne}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{inv.montant.toLocaleString('fr-FR')} €</p>
                    <p className="text-xs" style={{color: 'rgba(255,255,255,0.4)'}}>investi</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-sm mb-5">
                  {[
                    { label: 'Taux', value: `${(inv.taux * 100).toFixed(0)}%` },
                    { label: 'Durée', value: `${inv.duree} mois` },
                    { label: 'Mensualité', value: `+${inv.mensualite.toFixed(2).replace('.', ',')} €`, green: true },
                    { label: 'Total remboursé', value: `${(inv.montant + inv.montant * inv.taux * (inv.duree / 12)).toLocaleString('fr-FR')} €` },
                  ].map((stat, i) => (
                    <div key={i}>
                      <p className="text-xs mb-1" style={{color: 'rgba(255,255,255,0.4)'}}>{stat.label}</p>
                      <p className="font-bold" style={{color: stat.green ? '#00E5CC' : 'white'}}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1" style={{color: 'rgba(255,255,255,0.4)'}}>
                    <span>Début: {inv.dateDebut}</span>
                    <span>{inv.duree} mois restants</span>
                  </div>
                  <div className="w-full rounded-full h-1" style={{backgroundColor: 'rgba(255,255,255,0.1)'}}>
                    <div className="h-1 rounded-full" style={{width: inv.statut === 'Actif' ? '4%' : '0%', backgroundColor: '#00E5CC'}}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paiements tab */}
        {activeTab === 'paiements' && (
          <div className="rounded-2xl overflow-hidden" style={{backgroundColor: '#1E1B4B'}}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                  {['Date', 'Campagne', 'Type', 'Montant', 'Statut'].map((h, i) => (
                    <th key={i} className={`px-6 py-4 text-xs font-medium ${i >= 3 ? 'text-right' : 'text-left'}`}
                      style={{color: 'rgba(255,255,255,0.4)'}}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { date: '01/05/2026', campagne: 'Flotte Printemps 2026', type: 'Intérêts', montant: 29.17 },
                  { date: '01/06/2026', campagne: 'Flotte Printemps 2026', type: 'Intérêts', montant: 29.17 },
                  { date: '01/06/2026', campagne: 'Flotte Été 2026', type: 'Intérêts', montant: 13.33 },
                  { date: '01/07/2026', campagne: 'Flotte Printemps 2026', type: 'Intérêts', montant: 29.17 },
                  { date: '01/04/2028', campagne: 'Flotte Printemps 2026', type: 'Remboursement capital', montant: 5000 },
                ].map((p, i) => (
                  <tr key={i} style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                    <td className="px-6 py-4">{p.date}</td>
                    <td className="px-6 py-4" style={{color: 'rgba(255,255,255,0.6)'}}>{p.campagne}</td>
                    <td className="px-6 py-4" style={{color: 'rgba(255,255,255,0.6)'}}>{p.type}</td>
                    <td className="px-6 py-4 text-right font-bold" style={{color: '#00E5CC'}}>
                      +{p.montant.toFixed(2).replace('.', ',')} €
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs px-2 py-1 rounded-full"
                        style={{backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)'}}>
                        À venir
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}