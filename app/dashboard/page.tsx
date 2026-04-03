'use client'

import { useState } from 'react'

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
    <main className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white flex justify-between items-center px-8 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐴</span>
          <span className="font-bold text-lg">Adopt a Pony</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/campagne" className="text-sm bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800">
            + Nouvel investissement
          </a>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold">O</div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Bonjour Olivia 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Voici un résumé de vos investissements</p>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6">
            <p className="text-sm text-gray-400 mb-1">Total investi</p>
            <p className="text-2xl font-bold">{totalInvesti.toLocaleString('fr-FR')} €</p>
          </div>
          <div className="bg-white rounded-2xl p-6">
            <p className="text-sm text-gray-400 mb-1">Revenus mensuels</p>
            <p className="text-2xl font-bold text-green-600">+{totalMensuel.toFixed(2).replace('.', ',')} €</p>
          </div>
          <div className="bg-white rounded-2xl p-6">
            <p className="text-sm text-gray-400 mb-1">Total remboursé à terme</p>
            <p className="text-2xl font-bold">{totalRembourse.toLocaleString('fr-FR', {maximumFractionDigits: 0})} €</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          {['portfolio', 'paiements'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium capitalize ${activeTab === tab ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black'}`}
            >
              {tab === 'portfolio' ? 'Mon portfolio' : 'Calendrier des paiements'}
            </button>
          ))}
        </div>

        {/* Portfolio tab */}
        {activeTab === 'portfolio' && (
          <div className="space-y-4">
            {investments.map(inv => (
              <div key={inv.id} className="bg-white rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${inv.statut === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {inv.statut === 'Actif' ? '🟢' : '🟡'} {inv.statut}
                      </span>
                      <span className="text-xs text-gray-400">{inv.id}</span>
                    </div>
                    <h3 className="font-bold">{inv.campagne}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{inv.montant.toLocaleString('fr-FR')} €</p>
                    <p className="text-xs text-gray-400">investi</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Taux</p>
                    <p className="font-bold">{(inv.taux * 100).toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Durée</p>
                    <p className="font-bold">{inv.duree} mois</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Mensualité</p>
                    <p className="font-bold text-green-600">+{inv.mensualite.toFixed(2).replace('.', ',')} €</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Total remboursé</p>
                    <p className="font-bold">{(inv.montant + inv.montant * inv.taux * (inv.duree / 12)).toLocaleString('fr-FR')} €</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Début: {inv.dateDebut}</span>
                    <span>{inv.duree} mois restants</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-black h-1.5 rounded-full" style={{width: inv.statut === 'Actif' ? '4%' : '0%'}}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paiements tab */}
        {activeTab === 'paiements' && (
          <div className="bg-white rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Date</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Campagne</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Type</th>
                  <th className="text-right px-6 py-4 text-gray-400 font-medium">Montant</th>
                  <th className="text-right px-6 py-4 text-gray-400 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date: '01/05/2026', campagne: 'Flotte Printemps 2026', type: 'Intérêts', montant: 29.17, statut: 'À venir' },
                  { date: '01/06/2026', campagne: 'Flotte Printemps 2026', type: 'Intérêts', montant: 29.17, statut: 'À venir' },
                  { date: '01/06/2026', campagne: 'Flotte Été 2026', type: 'Intérêts', montant: 13.33, statut: 'À venir' },
                  { date: '01/07/2026', campagne: 'Flotte Printemps 2026', type: 'Intérêts', montant: 29.17, statut: 'À venir' },
                  { date: '01/04/2028', campagne: 'Flotte Printemps 2026', type: 'Remboursement capital', montant: 5000, statut: 'À venir' },
                ].map((p, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4">{p.date}</td>
                    <td className="px-6 py-4 text-gray-600">{p.campagne}</td>
                    <td className="px-6 py-4 text-gray-600">{p.type}</td>
                    <td className="px-6 py-4 text-right font-bold text-green-600">+{p.montant.toFixed(2).replace('.', ',')} €</td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{p.statut}</span>
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
